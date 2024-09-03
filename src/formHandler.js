import { makeHoroscope, drawChart } from "./natalChart";

const errorEl = document.querySelector('p.error-text');
const chartEl = document.querySelector('#chart-container');

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

  // Sanitize FormData, convert to numbers
  const horoscopeData = {
    year: Number(formData.get('year')),
    month: Number(formData.get('month')) - 1, // Это нужно проверить
    day: Number(formData.get('day')),
    hour: Number(formData.get('hour')),
    minute: Number(formData.get('minute')),
    latitude: parseFloat(formData.get('latitude').replace(',', '.')),
    longitude: parseFloat(formData.get('longitude').replace(',', '.')),
  };

  // Validate form data
  if (
    isNaN(horoscopeData.year) ||
    isNaN(horoscopeData.month) ||
    isNaN(horoscopeData.day) ||
    isNaN(horoscopeData.hour) ||
    isNaN(horoscopeData.minute) ||
    isNaN(horoscopeData.latitude) ||
    isNaN(horoscopeData.longitude) ||
    horoscopeData.day > 31 ||
    horoscopeData.month > 12 ||
    horoscopeData.year < 1000 ||
    horoscopeData.year > 9999 ||
    horoscopeData.hour > 24 ||
    horoscopeData.minute > 59
  ) {
    // Handle invalid form data
    formError(true);
    return;
  }

  // Generate horoscope data
  const horoscope = makeHoroscope(horoscopeData);

  const viewOptions = {
    size: formData.get('size'),
    showAspects: formData.get('showAspects'),
  };

  // Draw the chart
  drawChart(horoscope, viewOptions);

  // Reset error message
  formError(false);
}

// Add event listener to the form
document.addEventListener('submit', handleFormSubmit);