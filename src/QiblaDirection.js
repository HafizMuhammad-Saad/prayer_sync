import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const QiblaDirection = ({darkMode}) => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQiblaDirection = async () => {
      try {
        // Get user's location
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        // Fetch Qibla direction
        const response = await fetch(
          `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`
        );
        if (!response.ok) throw new Error("Failed to fetch Qibla direction");
        const data = await response.json();
        setQiblaDirection(data.data.direction);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQiblaDirection();
  }, []);

  if (loading) return <p className="text-center">Loading Qibla direction...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`max-w-md mx-auto shadow-lg rounded-lg overflow-hidden p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
    >
      <h2 className="text-xl font-bold text-center mb-4">Qibla Direction</h2>
      <div className="flex justify-center">
        <div className="relative w-40 h-40">
          {/* Compass Circle */}
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full"></div>
          {/* Compass Needle */}
          <motion.div
            style={{
              transform: `rotate(${qiblaDirection}deg)`,
              transformOrigin: "center",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-1 h-20 bg-red-600 rounded-full"></div>
          </motion.div>
          {/* North Marker */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-blue-600">
            N
          </div>
        </div>
      </div>
      <p className="text-center mt-4">
        The Qibla is at <span className="font-bold">{qiblaDirection}°</span> from North.
      </p>
    </motion.div>
  );
};

export default QiblaDirection;