import { DAYS_OF_WEEK, MONTHS } from '../constants/weather'

/**
 * Formats the current date into a readable string format
 * @param {Date} date - The date object to format
 * @returns {string} Formatted date string (e.g., "Mon, 15 Jan")
 */
export const formatDate = (date = new Date()) => {
  const dayOfWeek = DAYS_OF_WEEK[date.getDay()]
  const month = MONTHS[date.getMonth()]
  const dayOfMonth = date.getDate()

  return `${dayOfWeek}, ${dayOfMonth} ${month}`
}

/**
 * Constructs the weather API URL with query parameters
 * @param {string} location - The location to fetch weather for
 * @param {string} apiKey - The API key for authentication
 * @param {string} units - The units for temperature (Metric, Imperial, etc.)
 * @returns {string} Complete API URL
 */
export const buildWeatherApiUrl = (location, apiKey, units = 'Metric') => {
  const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
  const params = new URLSearchParams({
    q: location,
    units: units,
    appid: apiKey,
  })

  return `${baseUrl}?${params.toString()}`
}

/**
 * Validates if a location string is valid for searching
 * @param {string} location - The location string to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidLocation = (location) => {
  return typeof location === 'string' && location.trim().length > 0
}

/**
 * Reverses gradient direction from 'to right' to 'to top'
 * @param {string} gradient - The gradient string to transform
 * @returns {string} Transformed gradient string
 */
export const reverseGradientDirection = (gradient) => {
  if (!gradient || typeof gradient !== 'string') return gradient
  return gradient.replace('to right', 'to top')
}

/**
 * Formats temperature with degree symbol
 * @param {number} temp - The temperature value
 * @returns {string} Formatted temperature string
 */
export const formatTemperature = (temp) => {
  return `${Math.floor(temp)}°`
}
