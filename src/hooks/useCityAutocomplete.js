import { useState, useEffect } from 'react'
import { useDebounce } from './useDebounce'

/**
 * Custom hook for city autocomplete suggestions
 * @param {string} apiKey - The OpenWeatherMap API key
 * @returns {Object} Suggestions data and search function
 */
export const useCityAutocomplete = (apiKey) => {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Debounce the search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    const fetchSuggestions = async () => {
      // Don't search if term is too short or empty
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
        setSuggestions([])
        return
      }

      if (!apiKey) {
        return
      }

      setLoading(true)

      try {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          debouncedSearchTerm
        )}&limit=5&appid=${apiKey}`

        const response = await fetch(url)
        const data = await response.json()

        if (Array.isArray(data)) {
          // Format suggestions with city, state, and country
          const formattedSuggestions = data.map((item) => ({
            name: item.name,
            state: item.state || '',
            country: item.country,
            lat: item.lat,
            lon: item.lon,
            // Create display name
            displayName: [
              item.name,
              item.state,
              item.country,
            ]
              .filter(Boolean)
              .join(', '),
          }))

          setSuggestions(formattedSuggestions)
        } else {
          setSuggestions([])
        }
      } catch (error) {
        console.error('Error fetching city suggestions:', error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedSearchTerm, apiKey])

  /**
   * Updates the search term
   * @param {string} term - The search term
   */
  const updateSearchTerm = (term) => {
    setSearchTerm(term)
  }

  /**
   * Clears all suggestions
   */
  const clearSuggestions = () => {
    setSuggestions([])
    setSearchTerm('')
  }

  return {
    suggestions,
    loading,
    updateSearchTerm,
    clearSuggestions,
  }
}
