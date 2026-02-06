import sunny from "../assets/images/sunny.png";
import cloudy from "../assets/images/cloudy.png";
import rainy from "../assets/images/rainy.png";
import snowy from "../assets/images/snowy.png";

export const WEATHER_IMAGES = {
  Clear: sunny,
  Clouds: cloudy,
  Rain: rainy,
  Snow: snowy,
  Haze: cloudy,
  Mist: cloudy,
  Drizzle: rainy,
  Thunderstorm: rainy,
  Fog: cloudy,
};

export const BACKGROUND_GRADIENTS = {
  Clear: "linear-gradient(to right, #f3b07c, #fcd283)",
  Clouds: "linear-gradient(to right, #57d6d4, #71eeec)",
  Rain: "linear-gradient(to right, #5bc8fb, #80eaff)",
  Snow: "linear-gradient(to right, #aff2ff, #fff)",
  Haze: "linear-gradient(to right, #57d6d4, #71eeec)",
  Mist: "linear-gradient(to right, #57d6d4, #71eeec)",
  Drizzle: "linear-gradient(to right, #5bc8fb, #80eaff)",
  Thunderstorm: "linear-gradient(to right, #4a5568, #718096)",
  Fog: "linear-gradient(to right, #57d6d4, #71eeec)",
};

export const DEFAULT_LOCATION = "Tbilisi";
export const DEFAULT_GRADIENT = "linear-gradient(to right, #f3b07c, #fcd283)";

export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const API_CONFIG = {
  BASE_URL: "https://api.openweathermap.org/data/2.5/weather",
  GEOCODING_URL: "https://api.openweathermap.org/geo/1.0/direct",
  UNITS: "Metric",
  AUTOCOMPLETE_LIMIT: 5,
  AUTOCOMPLETE_MIN_CHARS: 2,
};
