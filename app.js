// Date & Time
function formatDate(timestamp) {
  let date = new Date(timestamp);

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  //return `${day} ${hours}:${minutes}`;
  let formattedDate = `${day} ${hours}:${minutes}`;
  return formattedDate;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];

  return day;
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2">
      <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
      <img
        src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png"
        id="image-forecast"
        alt=""
        width="40"
      />
      <div class="weather-forecast-temp">
        <span class="weather-forecast-temp-max">${Math.round(
          forecastDay.temp.max
        )}°</span>
        <span class="weather-forecast-temp-min">${Math.round(
          forecastDay.temp.min
        )}°</span>
      </div>
    </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getDailyForecast(coordinates) {
  //console.log(coordinates);
  let apiKey = "e0a5a97de9a0b7a951e9d154a8f9bad8";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  //console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

// Display Weather
function showWeather(response) {
  //console.log(response.data);
  //console.log(response.data.sys.country);
  let city = response.data.name;
  let country = response.data.sys.country;
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsuisTemperature = response.data.main.temp;

  document.querySelector("#city-name").innerHTML = `${city}, ${country}`;
  document.querySelector("#forecast-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#forecast-temp").innerHTML =
    Math.round(celsuisTemperature);
  document.querySelector("#humidity").innerHTML = `${Math.round(
    response.data.main.humidity
  )}%`;
  document.querySelector("#wind").innerHTML = `${Math.round(
    response.data.wind.speed
  )} mp/h`;
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getDailyForecast(response.data.coord);
}

// Default City
function search(city) {
  let apiKey = "c819171fe0abdc14039af4ef5dda283b";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

// Search City
function searchCity(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  search(city);
}

// Current Location
function retrievePosition(position) {
  //console.log(position);
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "imperial";
  let apiKey = "c819171fe0abdc14039af4ef5dda283b";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(showWeather);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", getCurrentPosition);

search("New York");
