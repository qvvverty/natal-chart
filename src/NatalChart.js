import AstroChart from '@astrodraw/astrochart';
import { Origin, Horoscope } from 'circular-natal-horoscope-js';

export const makeHoroscope = (params) => {
  const origin = new Origin({
    year: params.year,
    month: params.month - 1, // 0 = January, 11 = December!
    date: params.day,
    hour: params.hour,
    minute: params.minute,
    latitude: params.latitude,
    longitude: params.longitude,
  });

  const horoscope = new Horoscope({
    origin: origin,
    houseSystem: "whole-sign",
    zodiac: "tropical",
    aspectPoints: ['bodies', 'points', 'angles'],
    aspectWithPoints: ['bodies', 'points', 'angles'],
    aspectTypes: ["major", "minor"],
    customOrbs: {},
    language: 'en'
  });

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
  horoscope.ZodiacCusps.map(cusp => {
    cusps.push(cusp.ChartPosition.Ecliptic.DecimalDegrees);
  });

  return { planets, cusps };
}

export const drawChart = (horoscopeData, options) => {
  const chart = new AstroChart('chart-container', options.size, options.size);
  const radix = chart.radix(horoscopeData);
  if (options.showAspects) {
    radix.aspects();
  }
}
