import { ref, reactive } from "vue";
import moment from "moment";

const isDay = ref(true);
const days = ref([]);
const weather = reactive({
  locationName: "",
  temperature: "",
  description: "",
  visibility: "",
  wind: "",
  feelsLike: "",
  humidity: ""
});
const animations = reactive({
  stormy: false,
  cloudy: false,
  cloudyNight: false,
  clearSky: false,
  clearNight: false,
  snowy: false
});
const showSearchBox = ref(false);
const searchKeyword = ref("");
const locations = ref([]);
const loading = ref(false);
const refresh = ref(false);
const forecastStorage = ref(JSON.parse(localStorage.getItem("forecast")));
const locationStorage = ref(JSON.parse(localStorage.getItem("location")));

const setSearchData = (data, boolean) => {
  loading.value = boolean;
  setTimeout(() => {
    locations.value = data.features;
    loading.value = !boolean;
  }, 1000);
};

const setRefreshIcon = boolean => {
  refresh.value = boolean;
  setTimeout(() => {
    refresh.value = !boolean;
  }, 1000);
};

// save data to local storage
const saveLocalStorage = (forecast, location) => {
  localStorage.setItem("forecast", JSON.stringify(forecast));
  localStorage.setItem("location", JSON.stringify(location));
};

const setLocalStorage = () => {
  forecastStorage.value = JSON.parse(localStorage.getItem("forecast"));
  locationStorage.value = JSON.parse(localStorage.getItem("location"));
};

// set value for weather app
const setWeatherData = (forecast, location) => {
  // set current weather data
  weather.locationName = location.features[0].place_name;
  weather.temperature = Math.round(forecast.current.temp);
  weather.description = forecast.current.weather[0].description;
  weather.visibility = (forecast.current.visibility / 1000).toFixed(1);
  weather.wind = forecast.current.wind_speed;
  weather.feelsLike = Math.round(forecast.current.feels_like);
  weather.humidity = Math.round(forecast.current.humidity);

  // set Daily weather data
  days.value = forecast.daily;
  days.value.forEach(day => {
    day.icon = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    day.date = moment(day.dt * 1000).format("ddd, DD MMM");
    day.description = day.weather[0].description;
    day.rain = Math.round(day.pop * 100);
    day.temp_max = Math.round(day.temp.max);
    day.temp_min = Math.round(day.temp.min);
  });

  // Check the time of day
  const timeOfDay = forecast.current.weather[0].icon;
  if (timeOfDay.includes("n")) {
    isDay.value = false;
  } else {
    isDay.value = true;
  }

  // Check animations
  const mainWeather = forecast.current.weather[0].main;
  if (mainWeather.includes("Clouds") && isDay.value) {
    animations.stormy = false;
    animations.cloudy = true;
    animations.cloudyNight = false;
    animations.clearSky = false;
    animations.clearNight = false;
    animations.snowy = false;
  } else if (mainWeather.includes("Clouds") && !isDay.value) {
    animations.stormy = false;
    animations.cloudy = false;
    animations.cloudyNight = true;
    animations.clearSky = false;
    animations.clearNight = false;
    animations.snowy = false;
  } else if (mainWeather.includes("Thunderstorm") || mainWeather.includes("Rain")) {
    animations.stormy = true;
    animations.cloudy = false;
    animations.cloudyNight = false;
    animations.clearSky = false;
    animations.clearNight = false;
    animations.snowy = false;
  } else if (mainWeather.includes("Clear") && isDay.value) {
    animations.stormy = false;
    animations.cloudy = false;
    animations.cloudyNight = false;
    animations.clearSky = true;
    animations.clearNight = false;
    animations.snowy = false;
  } else if (mainWeather.includes("Clear") && !isDay.value) {
    animations.stormy = false;
    animations.cloudy = false;
    animations.cloudyNight = false;
    animations.clearSky = false;
    animations.clearNight = true;
    animations.snowy = false;
  } else {
    animations.stormy = false;
    animations.cloudy = false;
    animations.cloudyNight = false;
    animations.clearSky = false;
    animations.clearNight = false;
    animations.snowy = true;
  }
};

export {
  isDay,
  weather,
  animations,
  showSearchBox,
  searchKeyword,
  locations,
  loading,
  days,
  refresh,
  forecastStorage,
  locationStorage,
  setWeatherData,
  setSearchData,
  saveLocalStorage,
  setLocalStorage,
  setRefreshIcon
};