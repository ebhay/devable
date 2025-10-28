import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AuthPage = ({ type }) => {
  const navigate = useNavigate();
  const isSignIn = type === "signin";

  const [role, setRole] = useState("user"); // 'admin' or 'user'
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // ------------------------
  // Google Login Callback
  // ------------------------
  const handleGoogleCallback = useCallback(async (response) => {
    setLoading(true);
    try {
      const endpoint = `${API_URL}/${role}/google-login`;
      const res = await axios.post(endpoint, { token: response.credential });
      
      // Store token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(res.data[role]));
      
      // Debug: Log what we're storing
      console.log("AuthPage Google - Storing token:", res.data.token);
      console.log("AuthPage Google - Storing role:", role);
      console.log("AuthPage Google - Storing user:", res.data[role]);
      
      // Redirect based on role
      const redirectPath = role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      navigate(redirectPath);
    } catch (err) {
      console.error("Google login failed:", err);
      
      // Provide helpful error messages
      if (err.code === "ERR_NETWORK" || err.message.includes("ERR_CONNECTION_REFUSED")) {
        alert("Cannot connect to server. Make sure the backend is running on port 5000.");
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Google authentication failed. Please check your Google OAuth setup in Google Cloud Console.");
      } else {
        alert(err.response?.data?.message || "Google login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [role, navigate, API_URL]);

  // ------------------------
  // Initialize Google OAuth
  // ------------------------
  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });
      
      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: "outline",
          size: "large",
          text: "signin_with",
        }
      );
    }
  }, [role, handleGoogleCallback, GOOGLE_CLIENT_ID]);

  // ------------------------
  // Handle Form Submission
  // ------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint =
        role === "admin"
          ? `${API_URL}/admin/${isSignIn ? "login" : "register"}`
          : `${API_URL}/user/${isSignIn ? "login" : "register"}`;

      const payload = isSignIn
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const res = await axios.post(endpoint, payload);
      
      // Store token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(res.data[role]));
      
      // Debug: Log what we're storing
      console.log("AuthPage Form - Storing token:", res.data.token);
      console.log("AuthPage Form - Storing role:", role);
      console.log("AuthPage Form - Storing user:", res.data[role]);
      
      // Redirect based on role
      const redirectPath = role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      navigate(redirectPath);
    } catch (err) {
      if (err.code === "ERR_NETWORK" || err.message.includes("ERR_CONNECTION_REFUSED")) {
        alert("Cannot connect to server. Make sure the backend is running on port 5000.");
      } else if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[95%] max-w-md rounded-2xl bg-gray-900/80 p-8 shadow-2xl backdrop-blur-md border border-gray-700"
      >
        <h2 className="mb-2 text-center text-3xl font-bold">
          {isSignIn ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>
        <p className="mb-6 text-center text-gray-400">
          {isSignIn ? "Sign in to continue" : "Join and start learning today"}
        </p>

        {/* Role Toggle */}
        <div className="mb-6 flex justify-center gap-3">
          {["user", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                role === r
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignIn && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold transition-all duration-300 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-center">
          <div className="h-px w-1/4 bg-gray-700" />
          <span className="px-2 text-sm text-gray-400">or continue with</span>
          <div className="h-px w-1/4 bg-gray-700" />
        </div>

        {/* Google Login */}
        <div className="w-full flex justify-center">
          <div ref={googleButtonRef} className="w-full"></div>
        </div>

        {/* Toggle Signin/Signup */}
        <p className="mt-6 text-center text-sm text-gray-400">
          {isSignIn ? (
            <>
              Don’t have an account?{" "}
              <Link to="/auth/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link to="/auth/signin" className="text-blue-500 hover:underline">
                Sign In
              </Link>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
