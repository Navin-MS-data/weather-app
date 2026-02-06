import { useState, useEffect, useCallback } from 'react'
import { buildWeatherApiUrl, isValidLocation } from '../utils/helpers'
import { DEFAULT_LOCATION } from '../constants/weather'

/**
 * Custom hook for managing weather data and API calls
 * @param {string} apiKey - The OpenWeatherMap API key
 * @returns {Object} Weather data, loading state, error state, and search function
 */
export const useWeather = (apiKey) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetches weather data for a given location
   * @param {string} location - The location to fetch weather for
   */
  const fetchWeather = useCallback(
    async (location) => {
      if (!isValidLocation(location)) {
        setError('Please enter a valid location')
        return
      }

      if (!apiKey) {
        setError('API key is missing. Please add VITE_WEATHER_API_KEY to your .env file')
        return
      }

      setLoading(true)
      setError(null)

      try {
        const url = buildWeatherApiUrl(location, apiKey)
        const response = await fetch(url)
        const weatherData = await response.json()

        if (weatherData.cod === 200) {
          setData(weatherData)
          setError(null)
        } else if (weatherData.cod === '404') {
          setError(`Location "${location}" not found. Please try another location.`)
          setData({ notFound: true })
        } else if (weatherData.cod === 401) {
          setError('Invalid API key. Please check your configuration.')
        } else {
          setError(weatherData.message || 'Failed to fetch weather data')
        }
      } catch (err) {
        setError('Network error. Please check your internet connection.')
        console.error('Weather fetch error:', err)
      } finally {
        setLoading(false)
      }
    },
    [apiKey]
  )

  // Fetch default location weather on mount
  useEffect(() => {
    fetchWeather(DEFAULT_LOCATION)
  }, [fetchWeather])

  return {
    data,
    loading,
    error,
    fetchWeather,
  }
}
