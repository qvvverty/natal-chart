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

export function drawAstroData(horoscope, element) {
  const descriptions = [];

  horoscope.CelestialBodies.all.map(planet => {
    if (planet.label !== 'Sirius' && planet.label !== 'Chiron') {
      descriptions.push(describeBody(planet));
    }
  });

  horoscope.CelestialPoints.all.map(point => {
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

export const aspectsConstructor = (aspectTypes, horoscope) => {
  const aspectsToDisplay = [];

  for (const aspectType of aspectTypes) {
    // Skip if no aspects of this type
    if (!horoscope._aspects.types[aspectType]) continue;

    let n = 1;

    for (const aspect of horoscope._aspects.types[aspectType]) {
      const aspectToDraw = {
        point: {
          name: aspect.point1Label,
          position:
            horoscope._celestialBodies?.[aspect.point1Key]?.ChartPosition?.Ecliptic?.DecimalDegrees
            || horoscope._celestialPoints?.[aspect.point1Key]?.ChartPosition?.Ecliptic?.DecimalDegrees
        },
        toPoint: {
          name: aspect.point2Label,
          position:
            horoscope._celestialBodies?.[aspect.point2Key]?.ChartPosition?.Ecliptic?.DecimalDegrees
            || horoscope._celestialPoints?.[aspect.point2Key]?.ChartPosition?.Ecliptic?.DecimalDegrees
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

export const drawConjunctions = (radix, horoscope, options) => {
  const conjunctions = [];

  if (horoscope._aspects.types.conjunction.length) {
    for (const conjunction of horoscope._aspects.types.conjunction) {
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

  const conjunctionRadius = options.size / 25;
  conjunctions.forEach(conjunction => {
    drawConjunction(radix.paper.DOMElement, conjunction[0], conjunction[1], conjunctionRadius);
  });
}