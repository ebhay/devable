import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function User() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", profilePic: "" });

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          name: parsedUser.name || "User",
          email: parsedUser.email || "No email found",
          profilePic: parsedUser.profilePic || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
        });
      } catch (err) {
        console.error("Error parsing user data:", err);
        navigate("/auth/signin");
      }
    } else {
      // No user data found, redirect to login
      navigate("/auth/signin");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <img
          src={user.profilePic}
          alt="User Avatar"
          className="w-24 h-24 mx-auto rounded-full mb-4 border-4 border-blue-500 object-cover"
        />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600 mb-4">{user.email}</p>
        <p className="text-blue-600 font-medium">
          You are logged in as <span className="font-semibold">User</span>
        </p>
      </div>
    </div>
  );
}

export default User;
