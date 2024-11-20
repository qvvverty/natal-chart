import AstroChart from '@astrodraw/astrochart';
import { Origin, Horoscope } from 'circular-natal-horoscope-js';
import { aspectsConstructor, drawConjunctions, makeHoroscopeData } from './utils';

const horoscopeOptions = {
  origin: null, // Origin instance
  houseSystem: 'koch', // - 'whole-sign'
  zodiac: "tropical",
  aspectPoints: ['bodies', 'points'], // - angles
  aspectWithPoints: ['bodies', 'points'], // - angles
  // aspectTypes: ["major", "minor"],
  aspectTypes: ['all'],
  customOrbs: {},
  language: 'en'
}

export const makeHoroscope = formData => {
  const horoscope = makeHoroscopeData(formData);
  if (!horoscope) {
    return;
  }

  const natalOrigin = new Origin(horoscope.natalData);

  horoscope.natalHoroscope = new Horoscope({
    ...horoscopeOptions,
    origin: natalOrigin,
  });

  // Debug
  // console.log(horoscope.natalHoroscope._houses);

  if (horoscope.transit) {
    const transitOrigin = new Origin(horoscope.transitData);
    horoscope.transitHoroscope = new Horoscope({
      ...horoscopeOptions,
      origin: transitOrigin
    });
  }

  return horoscope;
}

export const makeDrawData = (horoscope) => {
  const planets = {};
  horoscope.CelestialBodies.all.map(planet => {
    if (planet.label !== 'Sirius' && planet.label !== 'Chiron') {
      planets[planet.label] = [planet.ChartPosition.Ecliptic.DecimalDegrees];
    }
  });
  planets.NNode = [horoscope.CelestialPoints.northnode.ChartPosition.Ecliptic.DecimalDegrees];
  planets.SNode = [horoscope.CelestialPoints.southnode.ChartPosition.Ecliptic.DecimalDegrees];
  planets.Lilith = [horoscope.CelestialPoints.lilith.ChartPosition.Ecliptic.DecimalDegrees];

  const cusps = [];
  horoscope._houses.map(house => {
    cusps.push(house.ChartPosition.StartPosition.Ecliptic.DecimalDegrees);
  });

  return { planets, cusps };
}

export const drawChart = horoscope => {
  // To shift the west of the chart to the first house cusp
  // And to fix a bug with 0-cusp become NaN in ~±73+ latitude
  let shift = 180;
  if (!isNaN(horoscope.natalDrawData.cusps[0])) {
    shift = 180 - horoscope.natalDrawData.cusps[0];
  }

  const drawOptions = {
    // STROKE_ONLY: true,
    SHIFT_IN_DEGREES: shift,
    INDOOR_CIRCLE_RADIUS_RATIO: 1.5,
    COLORS_SIGNS: ['#FF5C5C', '#FFC77F', '#E0E7F1', '#7098DA', '#FF5C5C', '#FFC77F', '#E0E7F1', '#7098DA', '#FF5C5C', '#FFC77F', '#E0E7F1', '#7098DA'],
  }

  const chart = new AstroChart('chart-container', horoscope.viewOptions.size, horoscope.viewOptions.size, drawOptions);

  const radix = chart.radix(horoscope.natalDrawData);
  if (horoscope.transit) {
    radix.transit(horoscope.transitDrawData);
  }

  if (horoscope.viewOptions.aspects.includes('conjunction')) {
    drawConjunctions(radix, horoscope);
  }

  const aspectsToDisplay = aspectsConstructor(horoscope);

  if (aspectsToDisplay.length) {
    radix.aspects(aspectsToDisplay);
  }

  // For aspects descriptions visualization
  return aspectsToDisplay;
}
