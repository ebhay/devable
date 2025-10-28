import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();
  
  // Get role from localStorage
  const role = localStorage.getItem("role");

  // No token → redirect to login
  if (!token) {
    return <Navigate to="/auth/signin" />;
  }

  try {
    // Decode and check token expiry
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      return <Navigate to="/auth/signin" />;
    }

    // Check if user is trying to access the correct dashboard based on their role
    const pathname = location.pathname;
    if (pathname.startsWith("/admin") && role !== "admin") {
      return <Navigate to="/user/dashboard" replace />;
    }
    if (pathname.startsWith("/user") && role !== "user") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    return <Navigate to="/auth/signin" />;
  }
}
