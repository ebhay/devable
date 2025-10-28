import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Camera, Save, ArrowLeft } from "lucide-react";

function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", profilePic: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          profilePic: parsedUser.profilePic || "https://github.com/shadcn.png",
        });
      } catch (err) {
        console.error("Error parsing user data:", err);
        navigate("/auth/signin");
      }
    } else {
      navigate("/auth/signin");
    }
  }, [navigate]);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      // TODO: Call backend API to update user profile
      // For now, just update localStorage
      const updatedUser = { ...user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser({ ...user, profilePic: e.target.result });
      };
      reader.readAsDataURL(file);
    }
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

        if (response.ok) {
          // Clear local storage
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("user");
          
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Profile Settings
          </h1>
        </div>

        {/* Settings Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Profile Picture Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover mx-auto"
              />
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Click the camera icon to change your profile picture
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.includes("successfully") 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              }`}>
                {message}
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Danger Zone
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;