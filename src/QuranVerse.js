import React, { useEffect, useState, darkMode } from "react";
import { motion } from "framer-motion";

const QuranVerse = () => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuranVerse = async () => {
      try {
        const response = await fetch("https://api.alquran.cloud/v1/ayah/random");
        if (!response.ok) throw new Error("Failed to fetch Quran verse");
        const data = await response.json();
        setVerse(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuranVerse();
  }, []);

  if (loading) return <p className="text-center">Loading Quran verse...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`max-w-md mx-auto shadow-lg rounded-lg overflow-hidden p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
    >
      <h2 className="text-xl font-bold text-center mb-4">Daily Quran Verse</h2>
      <p className="text-center text-gray-700 text-lg">{verse.text}</p>
      <p className="text-center text-gray-600 mt-2">
        - Surah {verse.surah.name}, Ayah {verse.numberInSurah}
      </p>
    </motion.div>
  );
};

export default QuranVerse;