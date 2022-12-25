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
  return `${day} ${hours}:${minutes}`;
}

// Display Weather
function showWeather(response) {
  //console.log(response.data);
  //console.log(response.data.sys.country);
  let city = response.data.name;
  let country = response.data.sys.country;
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  document.querySelector("#city-name").innerHTML = `${city}, ${country}`;
  document.querySelector("#forecast-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#forecast-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = `${Math.round(
    response.data.main.humidity
  )}%`;
  document.querySelector("#wind").innerHTML = `${Math.round(
    response.data.wind.speed
  )} km/h`;
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
}

// Default City
function search(city) {
  let apiKey = "c819171fe0abdc14039af4ef5dda283b";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

// Search City
function searchCity(event) {
  event.preventDefault();
  //let searchInput = document.querySelector("#search-input");
  //let city = searchInput.value;
  let city = document.querySelector("#search-input").value;
  search(city);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

// Current Location
function retrievePosition(position) {
  //console.log(position);
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiKey = "c819171fe0abdc14039af4ef5dda283b";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(showWeather);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", getCurrentPosition);

search("New York");
