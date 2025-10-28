import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ name: "", email: "", profilePic: "" });

  useEffect(() => {
    // Get admin data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedAdmin = JSON.parse(userData);
        setAdmin({
          name: parsedAdmin.name || "Admin",
          email: parsedAdmin.email || "No email found",
          profilePic: parsedAdmin.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        });
      } catch (err) {
        console.error("Error parsing admin data:", err);
        navigate("/auth/signin");
      }
    } else {
      // No admin data found, redirect to login
      navigate("/auth/signin");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <img
          src={admin.profilePic}
          alt="Admin Avatar"
          className="w-24 h-24 mx-auto rounded-full mb-4 border-4 border-indigo-500 object-cover"
        />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Welcome, {admin.name}
        </h1>
        <p className="text-gray-600 mb-4">{admin.email}</p>
        <p className="text-indigo-600 font-medium">
          You are logged in as <span className="font-semibold">Admin</span>
        </p>
      </div>
    </div>
  );
}

export default Admin;
