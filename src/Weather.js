import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Weather = ({darkMode}) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Get user's location
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        // Fetch weather data
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=599355e7cdf1f45222cd3c11b3b107e6&units=metric`
        );
        // console.log(response);
        // console.log(latitude, longitude);

        
        if (!response.ok) throw new Error("Failed to fetch weather data");
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <p className="text-center">Loading weather...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`max-w-md mx-auto shadow-lg rounded-lg overflow-hidden p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
    >
      <h2 className="text-xl font-bold text-center mb-4">Current Weather</h2>
      <div className="flex items-center justify-center space-x-4">
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          className="w-16 h-16"
        />
        <div>
          <p className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</p>
          <p className="">{weather.weather[0].description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Weather;