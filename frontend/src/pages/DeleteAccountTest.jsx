import React, { useState } from "react";

function DeleteAccountTest() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testDeleteAccount = async () => {
    setLoading(true);
    setResult("Testing...");
    
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      console.log("Test - Token:", token);
      console.log("Test - Role:", role);
      
      if (!token) {
        setResult("No token found in localStorage");
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const endpoint = `${API_URL}/${role}/delete-account`;
      
      console.log("Test - Endpoint:", endpoint);
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Test - Response status:", response.status);
      console.log("Test - Response:", response);

      const responseText = await response.text();
      console.log("Test - Response text:", responseText);

      if (response.ok) {
        setResult(`Success: ${responseText}`);
      } else {
        setResult(`Error ${response.status}: ${responseText}`);
      }
    } catch (err) {
      console.error("Test error:", err);
      setResult(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Delete Account Test</h1>
      
      <div className="mb-4">
        <p><strong>Token:</strong> {localStorage.getItem("token") ? "Present" : "Missing"}</p>
        <p><strong>Role:</strong> {localStorage.getItem("role") || "Missing"}</p>
        <p><strong>User:</strong> {localStorage.getItem("user") ? "Present" : "Missing"}</p>
      </div>

      <button
        onClick={testDeleteAccount}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Delete Account"}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
}

export default DeleteAccountTest;
