import AstroChart from '@astrodraw/astrochart';
import { Origin, Horoscope } from 'circular-natal-horoscope-js';
import './formHandler.js';

const origin1 = new Origin({
  year: 1987,
  month: 2, // 0 = January, 11 = December!
  date: 18,
  hour: 9,
  minute: 20,
  latitude: 43.31,
  longitude: 45.69,
});

const origin2 = new Origin({
  year: 1964,
  month: 7, // 0 = January, 11 = December!
  date: 23,
  hour: 12,
  minute: 30,
  latitude: 55.76,
  longitude: 37.63,
});

// const customOrbs = {
//   conjunction: 8,
//   opposition: 8,
//   trine: 8,
//   square: 7,
//   sextile: 6,
//   quincunx: 5,
//   quintile: 1,
//   septile: 1,
//   "semi-square": 1,
//   "semi-sextile": 1,
// };

const horoscope = new Horoscope({
  origin: origin2,
  houseSystem: "whole-sign",
  zodiac: "tropical",
  aspectPoints: ['bodies', 'points', 'angles'],
  aspectWithPoints: ['bodies', 'points', 'angles'],
  aspectTypes: ["major", "minor"],
  customOrbs: {},
  language: 'en'
});

// console.log(horoscope.CelestialBodies);
// console.log(horoscope.CelestialPoints);

// ===============================================================================================

// Test
// const planetsTest = {};
// horoscope.CelestialBodies.all.map(planet => {
//   planetsTest[planet.label] = [planet.ChartPosition.Ecliptic.ArcDegreesFormatted30];
// });
// console.log(planetsTest);

const planets = {};
horoscope.CelestialBodies.all.map(planet => {
  if (planet.label !== 'Sirius' && planet.label !== 'Chiron') {
    planets[planet.label] = [planet.ChartPosition.Ecliptic.DecimalDegrees];
  }
});
planets.NNode = [horoscope.CelestialPoints.northnode.ChartPosition.Ecliptic.DecimalDegrees];
planets.SNode = [horoscope.CelestialPoints.southnode.ChartPosition.Ecliptic.DecimalDegrees];
planets.Lilith = [horoscope.CelestialPoints.lilith.ChartPosition.Ecliptic.DecimalDegrees];
// console.log(planets);

const cusps = [];
horoscope.ZodiacCusps.map(cusp => {
  cusps.push(cusp.ChartPosition.Ecliptic.DecimalDegrees);
});
// console.log(cusps);

const chart = new AstroChart('#chart-container', 600, 600);

const data = {
  planets,
  // "planets": {
  //   "Pluto": [63],
  //   "Neptune": [110],
  //   "Uranus": [318],
  //   "Saturn": [201],
  //   "Jupiter": [192],
  //   "Mars": [210],
  //   "Moon": [268],
  //   "Sun": [281],
  //   "Mercury": [312],
  //   "Venus": [330],
  //   "Chiron": [0],
  //   "Sirius": [25], // Вот он и отображается красным кругом!
  //   "Lilith": [35]
  cusps
  // "cusps": [296, 350, 30, 56, 75, 94, 116, 170, 210, 236, 255, 274]
};


const radix = chart.radix(data);
// console.log(radix);

// const asc = horoscope.Ascendant.ChartPosition.Horizon.DecimalDegrees;
// const desc = (asc + 180) % 360;
// const mc = horoscope.Midheaven.ChartPosition.Horizon.DecimalDegrees;
// const ic =
//   (horoscope.Midheaven.ChartPosition.Horizon.DecimalDegrees + 180) % 360;

// const chartCusps = horoscope.Houses.map((cusp) => {
//   return cusp.ChartPosition.StartPosition.Ecliptic.DecimalDegrees;
// });
// radix.addPointsOfInterest({ As: [asc], Mc: [mc], Ds: [desc], Ic: [ic] });

// radix.aspects();

// ===============================================================================================
