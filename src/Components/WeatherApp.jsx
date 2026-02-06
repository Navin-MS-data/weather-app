import { useState, useRef, useEffect } from "react";
import { useWeather } from "../hooks/useWeather";
import { useCityAutocomplete } from "../hooks/useCityAutocomplete";
import {
  WEATHER_IMAGES,
  BACKGROUND_GRADIENTS,
  DEFAULT_GRADIENT,
} from "../constants/weather";
import {
  formatDate,
  reverseGradientDirection,
  formatTemperature,
} from "../utils/helpers";
import loadingGif from "../assets/images/loading.gif";

const WeatherApp = () => {
  const [location, setLocation] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const apiKey =
    import.meta.env.VITE_WEATHER_API_KEY || "0857bdfbf9822bcb5f4d0f481d5e160a";

  const { data, loading, error, fetchWeather } = useWeather(apiKey);
  const {
    suggestions,
    loading: suggestionsLoading,
    updateSearchTerm,
    clearSuggestions,
  } = useCityAutocomplete(apiKey);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    updateSearchTerm(value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleSearch = (cityName) => {
    const searchLocation = cityName || location;
    if (searchLocation.trim() !== "") {
      fetchWeather(searchLocation);
      setLocation("");
      setShowSuggestions(false);
      clearSuggestions();
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion.name);
    handleSearch(suggestion.name);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  // Get weather-specific images and backgrounds
  const weatherCondition = data.weather?.[0]?.main;
  const weatherImage = weatherCondition
    ? WEATHER_IMAGES[weatherCondition]
    : null;
  const backgroundImage = weatherCondition
    ? BACKGROUND_GRADIENTS[weatherCondition]
    : DEFAULT_GRADIENT;

  const formattedDate = formatDate();

  return (
    <div className="container" style={{ backgroundImage }}>
      <div
        className="weather-app"
        style={{
          backgroundImage: reverseGradientDirection(backgroundImage),
        }}
      >
        {/* Search Section */}
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
            <div className="location" aria-live="polite">
              {data.name || "Search for a location"}
            </div>
          </div>
          <div className="search-bar">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => location.length >= 2 && setShowSuggestions(true)}
              aria-label="Search location"
              aria-autocomplete="list"
              aria-controls="suggestions-list"
              aria-expanded={showSuggestions && suggestions.length > 0}
              disabled={loading}
              autoComplete="off"
            />
            <i
              className="fa-solid fa-magnifying-glass"
              onClick={() => handleSearch()}
              role="button"
              tabIndex={0}
              aria-label="Search"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            ></i>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="suggestions-dropdown"
                id="suggestions-list"
                role="listbox"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                    className={`suggestion-item ${
                      index === selectedIndex ? "selected" : ""
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    role="option"
                    aria-selected={index === selectedIndex}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <i className="fa-solid fa-location-dot suggestion-icon"></i>
                    <div className="suggestion-text">
                      <div className="suggestion-name">{suggestion.name}</div>
                      <div className="suggestion-details">
                        {[suggestion.state, suggestion.country]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
                {suggestionsLoading && (
                  <div className="suggestion-loading">
                    <i className="fa-solid fa-spinner fa-spin"></i> Searching...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <img className="loader" src={loadingGif} alt="Loading weather data" />
        ) : data.notFound ? (
          <div className="not-found" role="alert">
            Location not found 😒
          </div>
        ) : data.weather ? (
          <>
            {/* Weather Display */}
            <div className="weather">
              <img src={weatherImage} alt={`${weatherCondition} weather`} />
              <div className="weather-type" aria-label="Weather condition">
                {weatherCondition}
              </div>
              <div className="temp" aria-label="Temperature">
                {formatTemperature(data.main?.temp)}
              </div>
            </div>

            {/* Date Display */}
            <div className="weather-date">
              <p>{formattedDate}</p>
            </div>

            {/* Weather Data Details */}
            <div className="weather-data">
              <div className="humidity">
                <div className="data-name">Humidity</div>
                <i className="fa-solid fa-droplet" aria-hidden="true"></i>
                <div
                  className="data"
                  aria-label={`Humidity ${data.main?.humidity} percent`}
                >
                  {data.main?.humidity}%
                </div>
              </div>
              <div className="wind">
                <div className="data-name">Wind</div>
                <i className="fa-solid fa-wind" aria-hidden="true"></i>
                <div
                  className="data"
                  aria-label={`Wind speed ${data.wind?.speed} kilometers per hour`}
                >
                  {data.wind?.speed} km/h
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default WeatherApp;
