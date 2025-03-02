import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import "./AuthModal.css";

const Auth = ({darkMode}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const { user, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      console.log(user);
      alert("Check your email for the confirmation link!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const { user, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      console.log(user);
      
      alert("Signed in successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      alert("Signed out successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const savePreferences = async (userId, city, country, darkMode) => {
    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: userId, city, country, dark_mode: darkMode });
  
    if (error) throw error;
    return data;
  };
  savePreferences()

  return (
    <div className={`max-w-md mx-auto p-6 shadow-lg rounded-lg transition-all ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}>
      <h2 className="text-xl font-bold text-center mb-4">Authentication</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={handleSignUp}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          {loading ? "Loading..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
};

export default Auth;