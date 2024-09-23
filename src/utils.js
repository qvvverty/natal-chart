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
  conjunction: '#000000',
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
  element.innerHTML = '';
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
  description += `House: ${houses[planet.House.label]}<br>`;
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
  
  // Debug
  // console.log(aspectsToDisplay);

  return aspectsToDisplay;
}

export const drawAspectsData = (aspectsToDisplay, element) => {
  element.innerHTML = '';

  for (const aspect of aspectsToDisplay) {
    let aspectDescription = `<div class="aspect-info"><span class="aspect-info__header">${aspect.aspect.name}</span><br>`;
    aspectDescription += `Point 1: ${aspect.point.name}<br>`;
    aspectDescription += `Point 2: ${aspect.toPoint.name}<br>`;
    aspectDescription += `<div class="aspect-color" style="background-color: ${aspect.aspect.color};"></div>`;
    aspectDescription += `</div>`;

    element.innerHTML += aspectDescription;
  }
}
