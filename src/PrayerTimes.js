import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

const PrayerTimes = ({ cityName, countryName }) => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?country=${countryName}&city=${cityName}`
        );
        if (!response.ok) throw new Error("Failed to fetch prayer times");
        const data = await response.json();
        setPrayerTimes(data.data.timings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [cityName, countryName]);

  if (loading) return <p className="text-center">Loading prayer times...</p>;
  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Filter only the required prayer times
  const requiredPrayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto shadow-lg rounded-lg overflow-hidden p-6 bg-white text-gray-800"
    >
      <div className="bg-green-600 p-4">
        <h2 className="text-xl font-bold text-white">
          Prayer Times in {cityName}, {countryName}
        </h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {requiredPrayers.map((prayer) => (
          <motion.li
            key={prayer}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center p-4 hover:bg-gray-50"
          >
            <span className="font-medium text-gray-700">{prayer}</span>
            <span className="text-gray-600">{convertTo12HourFormat(prayerTimes[prayer])}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};
const convertTo12HourFormat = (time) => {
  if (!time) return "Invalid Time"; // Handle missing time values

  let timeParts = time.split(":").map(Number);
  let hours = timeParts[0]; // Extract hours
  let minutes = timeParts[1]; // Extract minutes (ignoring seconds if present)

  if (isNaN(hours) || isNaN(minutes)) return "Invalid Time"; // Prevent NaN issue

  let period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 to 12
  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export default PrayerTimes;