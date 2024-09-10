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

export default function drawAstroData(horoscope, element) {
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
  let description = `<div class="body-info">${bodies[planet.key]}<br>`;
  description += `Sign: ${planet.Sign.label}<br>`;
  description += `House: ${houses[planet.House.label]}<br>`;
  description += `Degree 360°: ${planet.ChartPosition.Ecliptic.ArcDegreesFormatted}<br>`;
  description += `Degree 30°: ${planet.ChartPosition.Ecliptic.ArcDegreesFormatted30}</div>`;

  return description;
}
