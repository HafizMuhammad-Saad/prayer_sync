import React, { useState, useEffect, useCallback } from "react";

const ProgressTracker = () => {
  const initialPrayers = {
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  };

  const [prayers, setPrayers] = useState(
    JSON.parse(localStorage.getItem("prayers")) || initialPrayers
  );
  const [streak, setStreak] = useState(Number(localStorage.getItem("streak")) || 0);
  const [lastUpdated, setLastUpdated] = useState(localStorage.getItem("lastUpdated") || "");

  useEffect(() => {
    localStorage.setItem("prayers", JSON.stringify(prayers));
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastUpdated", lastUpdated);
  }, [prayers, streak, lastUpdated]);

  const togglePrayer = (prayerName) => {
    setPrayers((prevPrayers) => ({
      ...prevPrayers,
      [prayerName]: !prevPrayers[prayerName],
    }));
  };

  const resetProgress = () => {
    setPrayers(initialPrayers);
    setStreak(0);
    setLastUpdated("");
  };

  const checkStreak = useCallback(() => {
    const today = new Date().toDateString();
    if (lastUpdated === today) return; // Already updated today

    const allPrayersCompleted = Object.values(prayers).every((completed) => completed);
    if (allPrayersCompleted) {
      setStreak((prevStreak) => prevStreak + 1);
    } else {
      setStreak(0);
    }
    setLastUpdated(today);
  }, [prayers, lastUpdated]);

  useEffect(() => {
    checkStreak();
  }, [checkStreak]); 


  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Prayer Progress</h2>
      <p className="text-lg mb-4">Streak: {streak} day(s)</p>
      <ul className="space-y-2">
        {Object.entries(prayers).map(([prayer, completed]) => (
          <li key={prayer} className="flex justify-between items-center py-2">
            <span className="font-medium">{prayer}</span>
            <button
              onClick={() => togglePrayer(prayer)}
              className={`px-4 py-2 rounded ${
                completed ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
              } text-white transition duration-300`}
            >
              {completed ? "✅ Completed" : "Mark Done"}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={resetProgress}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
      >
        Reset Progress
      </button>
    </div>
  );
};

export default ProgressTracker;