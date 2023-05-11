const apiKey = '09c01fcfdc1455eb256c02738f078cc5';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

const locationInput = document.querySelector('#location-input');
const unitSelect = document.querySelector('#unit-select');
const weatherDisplay = document.querySelector('#weather-display');
const submitButton = document.querySelector('#submit-btn');
 
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 
 // Initialize Firebase
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
 import { getAnalytics,logEvent } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
   apiKey: "AIzaSyATIQ7UkbFFrLrA23EDwDTYS-hXCj6OTDo",
   authDomain: "springwood-71eba.firebaseapp.com",
   projectId: "springwood-71eba",
   storageBucket: "springwood-71eba.appspot.com",
   messagingSenderId: "104937990910",
   appId: "1:104937990910:web:6525be07372a94d05713af",
   measurementId: "G-YHTTWLWKJ6"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const analytics = getAnalytics(app);
 //log event
 

 
function fetchWeatherData() {
  const location = locationInput.value;
  const units = unitSelect.value;
  const url = `${apiUrl}?q=${location}&units=${units}&appid=${apiKey}`;
  console.log(url)
  
  logEvent(analytics, 'search', {
    search_term: location
  });
  logEvent(analytics, 'search', {
    search_term: units
  });
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

