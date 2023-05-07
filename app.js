const apiKey = '09c01fcfdc1455eb256c02738f078cc5';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

const locationInput = document.querySelector('#location-input');
const unitSelect = document.querySelector('#unit-select');
const weatherDisplay = document.querySelector('#weather-display');
const submitButton = document.querySelector('#submit-btn');

function fetchWeatherData() {
  const location = locationInput.value;
  const units = unitSelect.value;
  const url = `${apiUrl}?q=${location}&units=${units}&appid=${apiKey}`;
  console.log(url)
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const temperature = data.main.temp;
      const conditions = data.weather[0].description;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      
      weatherDisplay.innerHTML = `
        <h2>Current Weather Conditions</h2>
        <p><strong>Temperature:</strong> ${temperature} &deg;${units === 'metric' ? 'C' : 'F'}</p>
        <p><strong>Conditions:</strong> ${conditions}</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Wind Speed:</strong> ${windSpeed} ${units === 'metric' ? 'm/s' : 'mph'}</p>
      `;
      
      return data.coord;
    })
    .then(coord => {
      const lat = coord.lat;
      const lon = coord.lon;
      const forecastUrl = `${apiForecastUrl}?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
      
      return fetch(forecastUrl);
    })
    .then(response => response.json())
    .then(data => {
      const forecasts = data.list.filter((item, index) => index % 8 === 0);
      
      let forecastHtml = '<h2>5 Day Forecast</h2>';
      forecastHtml += '<table>';
      forecastHtml += '<tr><th>Date</th><th>Conditions</th><th>High</th><th>Low</th></tr>';
      
      forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const conditions = forecast.weather[0].description;
        const high = forecast.main.temp_max;
        const low = forecast.main.temp_min;
        
        forecastHtml += `
          <tr>
            <td>${date.toLocaleDateString()}</td>
            <td>${conditions}</td>
            <td>${high} &deg;${units === 'metric' ? 'C' : 'F'}</td>
            <td>${low} &deg;${units === 'metric' ? 'C' : 'F'}</td>
          </tr>
        `;
      });
      
      forecastHtml += '</table>';
      weatherDisplay.innerHTML += forecastHtml;
    })
    .catch(error => {
      console.error(error);
      weatherDisplay.innerHTML = '<p>Failed to retrieve weather data. Please try again later.</p>';
    });
}

submitButton.addEventListener('click', event => {
  event.preventDefault();
  weatherDisplay.innerHTML = '<p>Loading weather data...</p>';
  fetchWeatherData();
});
