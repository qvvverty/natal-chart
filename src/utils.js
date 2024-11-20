const bodies = {
  sun: 'Sun ☉',
  moon: 'Moon ☽',
  mercury: 'Mercury ☿',
  venus: 'Venus ♀',
  mars: 'Mars ♂',
  jupiter: 'Jupiter ♃',
  saturn: 'Saturn ♄',
  uranus: 'Uranus ♅',
  neptune: 'Neptune ♆',
  pluto: 'Pluto ♇',
  northnode: 'North Node ☊',
  southnode: 'South Node ☋',
  lilith: 'Lilith ⚸',
  ascendant: 'Ascendant ⌖',
  descendant: 'Descendant ⌗',
  mc: 'Midheaven ⫶',
  ic: 'Imum Coeli ⫷'
}

const houses = {
  First: 'I',
  Second: 'II',
  Third: 'III',
  Fourth: 'IV',
  Fifth: 'V',
  Sixth: 'VI',
  Seventh: 'VII',
  Eighth: 'VIII',
  Ninth: 'IX',
  Tenth: 'X',
  Eleventh: 'XI',
  Twelfth: 'XII'
}

const aspectColors = {
  conjunction: '#008000',
  opposition: '#FF0000',
  square: '#990000',
  trine: '#00FF00',
  septile: '#00FF99',
  sextile: '#0000FF',
  quincunx: '#FF00FF',
  quintile: '#9900FF',
  biQuintile: '#0099FF',
  'semi-sextile': '#FF9900',
  'semi-square': '#FF9999'
}

const horoscopeParams = [
  'year',
  'month',
  'date',
  'hour',
  'minute',
  'latitude',
  'longitude'
]

const isHoroDataValid = (data) => {
  if (
    isNaN(data.year) ||
    isNaN(data.month) ||
    isNaN(data.date) ||
    isNaN(data.hour) ||
    isNaN(data.minute) ||
    isNaN(data.latitude) ||
    isNaN(data.longitude) ||
    data.day < 1 ||
    data.day > 31 ||
    data.month < 0 ||
    data.month > 11 ||
    data.year < 1000 ||
    data.year > 9999 ||
    data.hour < 0 ||
    data.hour > 24 ||
    data.minute < 0 ||
    data.minute > 59 ||
    data.latitude < -90 ||
    data.latitude > 90 ||
    data.longitude < -180 ||
    data.longitude > 180
  ) return true
  else return false
}

export const makeHoroscopeData = (formData) => {
  const horoscopeData = {
    natalData: {},
    transit: false,
    transitData: {}
  };

  horoscopeParams.forEach((param, index) => {
    if (index < 5) {
      horoscopeData.natalData[param] = Number(formData.get(param));
    } else {
      horoscopeData.natalData[param] = parseFloat(formData.get(param).replace(',', '.'));
    }
  });
  horoscopeData.natalData.month -= 1; // 0 = January, 11 = December!

  if (formData.get('transit') === 'on') {
    horoscopeData.transit = true;

    horoscopeParams.forEach((param, index) => {
      const transitParam = 'transit' + param.charAt(0).toUpperCase() + param.slice(1);
      if (index < 5) {
        horoscopeData.transitData[param] = Number(formData.get(transitParam));
      } else {
        horoscopeData.transitData[param] = parseFloat(formData.get(transitParam).replace(',', '.'));
      }
    });

    horoscopeData.transitData.month -= 1; // 0 = January, 11 = December!
  }

  // Validate data
  if (isHoroDataValid(horoscopeData.natalData)) {
    return;
  }

  if (horoscopeData.transit && isHoroDataValid(horoscopeData.transitData)) {
    return;
  }

  return horoscopeData;
}

export function drawAstroData(horoscope, element) {
  const descriptions = [];

  horoscope.natalHoroscope.CelestialBodies.all.map(planet => {
    if (planet.label !== 'Sirius' && planet.label !== 'Chiron') {
      descriptions.push(describeBody(planet));
    }
  });

  horoscope.natalHoroscope.CelestialPoints.all.map(point => {
    descriptions.push(describeBody(point));
  });

  element.innerHTML = descriptions.join('<br><br>');
}

const describeBody = (planet) => {
  let description = `<div class="body-info"><span class="body-info__header">${bodies[planet.key]}</span><br>`;
  description += `Sign: ${planet.Sign.label}<br>`;
  description += `House: ${houses[planet?.House?.label]}<br>`; // Sometimes House is undefined in whole-sign system
  description += `Degree 360°: ${planet.ChartPosition.Ecliptic.ArcDegreesFormatted}<br>`;
  description += `Degree 30°: ${planet.ChartPosition.Ecliptic.ArcDegreesFormatted30}</div>`;

  return description;
}

export const aspectsConstructor = (horoscope) => {
  const aspectsToDisplay = [];

  for (const aspectType of horoscope.viewOptions.aspects) {
    // Skip if no aspects of this type
    if (!horoscope.natalHoroscope._aspects.types[aspectType]) continue;

    let n = 1;

    for (const aspect of horoscope.natalHoroscope._aspects.types[aspectType]) {
      const aspectToDraw = {
        point: {
          name: aspect.point1Label,
          position:
            horoscope.natalHoroscope._celestialBodies?.[aspect.point1Key]?.ChartPosition?.Ecliptic?.DecimalDegrees
            || horoscope.natalHoroscope._celestialPoints?.[aspect.point1Key]?.ChartPosition?.Ecliptic?.DecimalDegrees
        },
        toPoint: {
          name: aspect.point2Label,
          position:
            horoscope.natalHoroscope._celestialBodies?.[aspect.point2Key]?.ChartPosition?.Ecliptic?.DecimalDegrees
            || horoscope.natalHoroscope._celestialPoints?.[aspect.point2Key]?.ChartPosition?.Ecliptic?.DecimalDegrees
        },
        aspect: {
          name: aspect.aspectLevelLabel + ' ' + aspectType + ' ' + n++,
          degree: 15,
          color: aspectColors[aspectType],
          orbit: 15 // Check in lib
        },
        precision: '0.5' // Check in lib
      }

      aspectsToDisplay.push(aspectToDraw);
    }
  }

  return aspectsToDisplay;
}

export const drawAspectsData = (aspectsToDisplay, element) => {
  for (const aspect of aspectsToDisplay) {
    let aspectDescription = `<div class="aspect-info"><span class="aspect-info__header">${aspect.aspect.name}</span><br>`;
    aspectDescription += `Point 1: ${aspect.point.name}<br>`;
    aspectDescription += `Point 2: ${aspect.toPoint.name}<br>`;
    aspectDescription += `<div class="aspect-color" style="background-color: ${aspect.aspect.color};"></div>`;
    aspectDescription += `</div>`;

    element.innerHTML += aspectDescription;
  }
}

const drawConjunction = (svgElement, centerX, centerY, radius) => {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', centerX);
  circle.setAttribute('cy', centerY);
  circle.setAttribute('r', radius);
  circle.setAttribute('stroke', 'green');
  circle.setAttribute('stroke-width', '2');
  circle.setAttribute('fill', 'none');
  svgElement.appendChild(circle);
};

export const drawConjunctions = (radix, horoscope) => {
  const conjunctions = [];

  if (horoscope.natalHoroscope._aspects.types.conjunction.length) {
    for (const conjunction of horoscope.natalHoroscope._aspects.types.conjunction) {
      const excludedLabels = ['Sirius', 'Chiron', 'North Node', 'South Node', 'Lilith'];
      if (excludedLabels.includes(conjunction.point1Label) || excludedLabels.includes(conjunction.point2Label)) {
        continue;
      }

      const conjunctionCoordinates = [];
      const point1Coordinates = [];
      const point2Coordinates = [];

      for (const point of radix.locatedPoints) {
        if (point.name === conjunction.point1Label) {
          point1Coordinates.push(point.x);
          point1Coordinates.push(point.y);
        }

        if (point.name === conjunction.point2Label) {
          point2Coordinates.push(point.x);
          point2Coordinates.push(point.y);
        }

        if (point1Coordinates.length === 2 && point2Coordinates.length === 2) {
          break;
        }
      }

      conjunctionCoordinates.push((point1Coordinates[0] + point2Coordinates[0]) / 2);
      conjunctionCoordinates.push((point1Coordinates[1] + point2Coordinates[1]) / 2);

      conjunctions.push(conjunctionCoordinates);
    }
  }

  const conjunctionRadius = horoscope.viewOptions.size / 25;
  conjunctions.forEach(conjunction => {
    drawConjunction(radix.paper.DOMElement, conjunction[0], conjunction[1], conjunctionRadius);
  });
}