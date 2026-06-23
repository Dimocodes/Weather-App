// =====================
// DOM ELEMENTS
// =====================

const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const weatherIcon = document.getElementById("weatherIcon");

const forecastContainer = document.getElementById("forecastContainer");

const errorMessage = document.getElementById("errorMessage");

const loadingMessage = document.getElementById("loadingMessage");

// =====================
// WEATHER ICONS
// =====================

function getWeatherIcon(code) {
  if (code === 0) {
    return "☀️";
  }

  if (code >= 1 && code <= 3) {
    return "⛅";
  }

  if (code >= 45 && code <= 48) {
    return "☁️";
  }

  if (code >= 51 && code <= 67) {
    return "🌧️";
  }

  if (code >= 71 && code <= 77) {
    return "❄️";
  }

  return "⛈️";
}

// =====================
// GET WEATHER DATA
// =====================

async function getWeather(city) {
  try {
    errorMessage.textContent = "";
    loadingMessage.textContent = "Fetching latest weather...";

    // =====================
    // GET LOCATION
    // =====================

    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`,
    );

    const geoData = await geoResponse.json();

    if (!geoData.results) {
      loadingMessage.textContent = "";

      errorMessage.textContent = "City not found. Please try again.";

      return;
    }

    const latitude = geoData.results[0].latitude;

    const longitude = geoData.results[0].longitude;

    // =====================
    // GET WEATHER
    // =====================

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code`,
    );

    const weatherData = await weatherResponse.json();

    // =====================
    // CURRENT WEATHER
    // =====================

    cityName.textContent = geoData.results[0].name;

    temperature.textContent = `${Math.round(
      weatherData.current.temperature_2m,
    )}°C`;

    humidity.textContent = `${weatherData.current.relative_humidity_2m}%`;

    windSpeed.textContent = `${weatherData.current.wind_speed_10m} km/h`;

    weatherDescription.textContent = "Current Weather";

    weatherIcon.textContent = getWeatherIcon(weatherData.current.weather_code);

    // =====================
    // FORECAST
    // =====================

    forecastContainer.innerHTML = "";

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    for (let i = 0; i < 5; i++) {
      let dayName;

      if (i === 0) {
        dayName = "Today";
      } else {
        const date = new Date(weatherData.daily.time[i]);
        dayName = daysOfWeek[date.getDay()];
      }

      const maxTemp = weatherData.daily.temperature_2m_max[i];

      const minTemp = weatherData.daily.temperature_2m_min[i];

      const weatherCode = weatherData.daily.weather_code[i];

      const icon = getWeatherIcon(weatherCode);

      const forecastItem = document.createElement("div");

      forecastItem.classList.add("forecast-item");

      forecastItem.innerHTML = `
    <span class="day">${dayName}</span>

    <span class="forecast-icon">${icon}</span>

    <div class="temperature-range">
      <strong>${Math.round(maxTemp)}°</strong>
      <small>${Math.round(minTemp)}°</small>
    </div>
  `;

      forecastContainer.appendChild(forecastItem);
    }

    loadingMessage.textContent = "";

    cityInput.value = "";
  } catch (error) {
    loadingMessage.textContent = "";

    errorMessage.textContent = "Something went wrong. Please try again.";

    console.error(error);
  }
}

// =====================
// FORM SUBMISSION
// =====================

weatherForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (city === "") {
    alert("Please enter a city name.");

    return;
  }

  getWeather(city);
});

// =====================
// DEFAULT CITY
// =====================

getWeather("Lagos");
