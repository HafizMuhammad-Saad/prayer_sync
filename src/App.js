import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import PrayerTimes from "./PrayerTimes";
import QiblaDirection from "./QiblaDirection";
import Weather from "./Weather";
import QuranVerse from "./QuranVerse";
import AuthModal from "./AuthModal";
import "./AuthModal.css"
import ProgressTracker from "./Progress";
import AIChat from "./AIChat";








function App() {
  const [city, setCity] =  useState(localStorage.getItem("city") || "Karachi");
  const [country, setCountry] = useState(localStorage.getItem("country") || "PK");
  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true" || false);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);


  useEffect(() => {
    localStorage.setItem("city", city);
  }, [city]);

  useEffect(() => {
    localStorage.setItem("country", country);
  }, [country]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);



  // ✅ Properly fetching session & handling auth state change
  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      // setUser(sessionData?.session?.user ?? null);
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      if (data?.session?.user) {
        setUser(data.session.user); // ✅ Correctly setting user
      }
    };
  
    fetchSession(); // ✅ Call fetchSession on mount
  
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
  
    return () => {
      authListener?.subscription?.unsubscribe(); // ✅ Properly unsubscribe
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${
      darkMode ? "from-teal-900 to-gray-800" : "from-teal-500 to-yellow-300"
    } text-white transition-all duration-500 ease-in-out`}>

       {/* Dark Mode Toggle */}
       <button
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
        className="fixed top-4 right-4 p-3 bg-white text-teal-600 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* Authentication Button */}
    <button
      onClick={() => setIsAuthModalOpen(true)}
      aria-label="Open authentication modal"
      className="fixed top-4 left-4 p-2 bg-white text-blue-600 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
    >
      {user ? "👤" : "🔑"}
    </button>

      <div className="py-20 flex flex-col items-center text-center">
      <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-lg">
        Welcome to <span className="text-yellow-300">PrayerSync</span>
      </h1>
      {user && (
  <div className="text-center">
    <p className="text-lg mb-4">Hello, {user.email}!</p>
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        alert("Signed out successfully!");
      }}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Sign Out
    </button>
  </div>
)}

      <p className="text-lg mt-4 max-w-lg text-gray-200">
        Your personalized prayer companion. Get accurate prayer times, Qibla
        direction, and more.
      </p>

      {/* 🌍 Location Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col md:flex-row bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl space-y-3 md:space-y-0 md:space-x-4"
      >
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="text"
          placeholder="Country Code (e.g., AE)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
        >
          Get Prayer Times
        </button>
      </form>
    </div>

    {/* 🔹 Content Cards Section */}
    <div className="container mx-auto px-6 py-10">
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {submitted && (
          <div className="md:col-span-2 lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
              <PrayerTimes cityName={city} countryName={country} />
            </div>
          </div>
        )}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
          <QiblaDirection darkMode={darkMode} />
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
          <Weather darkMode={darkMode} />
        </div>
        <div className="md:col-span-2 lg:col-span-3 bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
          <QuranVerse darkMode={darkMode} />
        </div>
      </div>
      <div className="md:col-span-2 lg:col-span-3 bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
  <ProgressTracker />
</div>
<div className="md:col-span-2 lg:col-span-3 bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
  <AIChat />
</div>
    </div>

     {/* 🔹 Authentication Modal - MOVE OUTSIDE */}
     {isAuthModalOpen && (
  <AuthModal
    isOpen={isAuthModalOpen}
    onRequestClose={() => setIsAuthModalOpen(false)}
    city={city} 
  country={country} 
  darkMode={darkMode} 
  />
)}
  </div>
  );
  
}

export default App;