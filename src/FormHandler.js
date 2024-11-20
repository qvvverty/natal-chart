import mapInit from "./YMap.js";
import { makeDrawData, drawChart, makeHoroscope } from "./NatalChart.js";
import { drawAstroData, drawAspectsData } from "./utils.js";

const errorEl = document.querySelector('p.error-text');
const chartEl = document.querySelector('#chart-container');
const astroDataEl = document.querySelector('.astrodata-container');
const aspectsDataEl = document.querySelector('.aspectsdata-container');
const latitudeInput = document.querySelector('input[name="latitude"]');
const longitudeInput = document.querySelector('input[name="longitude"]');

export const fillCoordinates = (longitude, latitude) => {
  latitudeInput.value = latitude;
  longitudeInput.value = longitude;
};

// Map initialization
ymaps.ready(mapInit);

const formError = (isError) => {
  if (isError) {
    errorEl.textContent = 'Invalid form data. Please check your input.';
    chartEl.innerHTML = '';
  } else {
    errorEl.textContent = '';
  }
};

export default function handleFormSubmit(event) {
  event.preventDefault();

  // Get form data
  const form = event.target;
  const formData = new FormData(form);

  // Generate horoscope
  const horoscope = makeHoroscope(formData);
  if (!horoscope) {
    formError(true);
    return;
  }

  // Generate draw data
  horoscope.natalDrawData = makeDrawData(horoscope.natalHoroscope);
  if (horoscope.transit) {
    horoscope.transitDrawData = makeDrawData(horoscope.transitHoroscope);
  }

  horoscope.viewOptions = {
    size: formData.get('size'),
    aspects: []
  };

  formData.forEach((value, key) => {
    if (key.endsWith('Aspect') && value === 'on') {
      horoscope.viewOptions.aspects.push(key.replace('Aspect', ''));
    }
  });

  // Reset error message
  formError(false);

  // Clear the result containers
  chartEl.innerHTML = '';
  astroDataEl.innerHTML = '';
  aspectsDataEl.innerHTML = '';

  // Draw the chart. Aspects are returned from this function
  const aspectsToDisplay = drawChart(horoscope);
  // Add aspectsToDisplay to horoscope object
  horoscope.aspectsToDisplay = aspectsToDisplay;

  // Draw astrological data
  drawAstroData(horoscope, astroDataEl);

  // Draw aspects data
  drawAspectsData(aspectsToDisplay, aspectsDataEl);
}

// Add event listener to the form
document.addEventListener('submit', handleFormSubmit);
