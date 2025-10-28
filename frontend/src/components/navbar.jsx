import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Trash2, ChevronDown } from "lucide-react";
import logo from "../assets/logo.svg";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", profilePic: "" });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        setIsLoggedIn(true);
        try {
          const parsedUser = JSON.parse(userData);
          setUser({
            name: parsedUser.name || "User",
            email: parsedUser.email || "",
            profilePic: parsedUser.profilePic || "https://github.com/shadcn.png",
          });
        } catch (err) {
          console.error("Error parsing user data:", err);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    // Check on mount
    checkLoginStatus();
    
    // Debug: Log current localStorage state
    console.log("Navbar - Token:", localStorage.getItem("token"));
    console.log("Navbar - Role:", localStorage.getItem("role"));
    console.log("Navbar - User:", localStorage.getItem("user"));

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        checkLoginStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
        if (!token) {
          alert("No authentication token found");
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const endpoint = `${API_URL}/${role}/delete-account`;
        
        console.log("Delete account - API URL:", API_URL);
        console.log("Delete account - Endpoint:", endpoint);
        console.log("Delete account - Role:", role);
        console.log("Delete account - Token:", token);
        
        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("Delete account response status:", response.status);
        console.log("Delete account response:", response);

        if (response.ok) {
          // Clear local storage
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("user");
          
          // Update UI
          setIsLoggedIn(false);
          setShowDropdown(false);
          
          // Navigate to home
          navigate("/");
          alert("Account deleted successfully");
        } else {
          const errorData = await response.json();
          console.error("Delete account error response:", errorData);
          alert(`Failed to delete account: ${errorData.message || response.statusText}`);
        }
      } catch (err) {
        console.error("Delete account error:", err);
        if (err.message.includes("Failed to fetch")) {
          alert("Cannot connect to server. Make sure the backend is running on port 3000.");
        } else {
          alert(`Failed to delete account: ${err.message}`);
        }
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-3 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/20 dark:border-gray-700/20 shadow-sm">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-1">
        <img src={logo} alt="Logo" className="h-6 w-6" />
        <span className="font-semibold text-3xl text-gray-800 dark:text-gray-100">
          Devable
        </span>
      </Link>

      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        >
          Home
        </Link>

        <Link
          to="/courses"
          className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        >
          Courses
        </Link>

        <Link
          to="/compiler"
          className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        >
          Compiler
        </Link>

        <Link
          to="/about"
          className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        >
          About
        </Link>

        <Link
          to="/support"
          className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        >
          Support
        </Link>

        {/* Conditional rendering based on login status */}
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <img
                src={user.profilePic}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover"
              />
              <span className="hidden sm:block text-gray-700 dark:text-gray-200 font-medium">
                {user.name}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>

                {/* Menu Items */}
                <Link
                  to={localStorage.getItem("role") === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>

                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth/signup">
            <InteractiveHoverButton>Get Started</InteractiveHoverButton>
          </Link>
        )}
        
        <AnimatedThemeToggler className="w-6 h-6 ml-2" />
        
      </div>
 
    </nav>
  );
}

export default Navbar;
