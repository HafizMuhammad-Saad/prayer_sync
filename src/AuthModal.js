import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import Modal from "react-modal";
import "./AuthModal.css"

Modal.setAppElement("#root"); // Set the root element for accessibility

const AuthModal = ({ isOpen, onRequestClose ,city, country, darkMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between sign-up and sign-in

  const savePreferences = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert([
          {
            userId: userId, 
            city: city,
            country: country,
            dark_mode: darkMode,
          }
        ], { onConflict: ['id'] });
  
      if (error) throw error;
      console.log("Preferences saved:", data);
      return data;
    } catch (err) {
      console.error("Error saving preferences:", err);
    }
  };

    // console.log("Saving preferences for userId:", userId);

    // savePreferences()

  const handleAuth = async () => {
    try {
      setLoading(true);
      let userId = null;
    let response = null;
    if (isSignUp) {
      response = await supabase.auth.signUp({ email, password });
    } else {
      response = await supabase.auth.signInWithPassword({ email, password });
    }

    if (response.error) throw response.error;

    alert(isSignUp ? "Check your email for the confirmation link!" : "Signed in successfully!");

    if (response.data?.user?.id) {
      userId = response.data.user.id;
      console.log("User authenticated with ID:", userId);
      await savePreferences(userId, city, country, darkMode); // ✅ Save preferences after auth
    }

    onRequestClose(); // ✅ Close modal after success
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="overlay"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold text-center mb-4">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
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
            onClick={handleAuth}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:underline"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;