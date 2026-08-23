// Weather fetching using Open-Meteo API (free, keyless)
// No data is invented; weather info is retrieved dynamically using fixed coordinates.

window.FootprintJH = window.FootprintJH || {};

window.FootprintJH.weather = (function () {
  // Mapping of WMO weather interpretation codes to descriptions and emojis
  const weatherCodes = {
    0: { desc: "Clear sky", icon: "☀️" },
    1: { desc: "Mainly clear", icon: "🌤️" },
    2: { desc: "Partly cloudy", icon: "⛅" },
    3: { desc: "Overcast", icon: "☁️" },
    45: { desc: "Fog", icon: "🌫️" },
    48: { desc: "Depositing rime fog", icon: "🌫️" },
    51: { desc: "Light drizzle", icon: "🌦️" },
    53: { desc: "Moderate drizzle", icon: "🌦️" },
    55: { desc: "Dense drizzle", icon: "🌦️" },
    56: { desc: "Light freezing drizzle", icon: "🌧️" },
    57: { desc: "Dense freezing drizzle", icon: "🌧️" },
    61: { desc: "Slight rain", icon: "🌧️" },
    63: { desc: "Moderate rain", icon: "🌧️" },
    65: { desc: "Heavy rain", icon: "🌧️" },
    66: { desc: "Light freezing rain", icon: "🌧️" },
    67: { desc: "Heavy freezing rain", icon: "🌧️" },
    71: { desc: "Slight snow fall", icon: "❄️" },
    73: { desc: "Moderate snow fall", icon: "❄️" },
    75: { desc: "Heavy snow fall", icon: "❄️" },
    77: { desc: "Snow grains", icon: "❄️" },
    80: { desc: "Slight rain showers", icon: "🌦️" },
    81: { desc: "Moderate rain showers", icon: "🌦️" },
    82: { desc: "Violent rain showers", icon: "🌧️" },
    85: { desc: "Slight snow showers", icon: "❄️" },
    86: { desc: "Heavy snow showers", icon: "❄️" },
    95: { desc: "Thunderstorm", icon: "⛈️" },
    96: { desc: "Thunderstorm with slight hail", icon: "⛈️" },
    99: { desc: "Thunderstorm with heavy hail", icon: "⛈️" }
  };

  /**
   * Fetch current weather for given latitude and longitude.
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {Promise<{temp: number, desc: string, icon: string, windspeed: number}>}
   */
  async function fetchCurrentWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const current = data.current_weather;
      
      if (!current) {
        throw new Error("No current weather data available");
      }

      const codeInfo = weatherCodes[current.weathercode] || { desc: "Unknown", icon: "🌡️" };

      return {
        temp: current.temperature,
        desc: codeInfo.desc,
        icon: codeInfo.icon,
        windspeed: current.windspeed
      };
    } catch (error) {
      console.error("Failed to fetch weather for coordinates:", latitude, longitude, error);
      throw error;
    }
  }

  return {
    fetchCurrentWeather
  };
})();
