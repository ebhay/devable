import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AutoRedirect = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If user is logged in and on auth pages, redirect to dashboard
    if (token && (location.pathname === "/auth/signin" || location.pathname === "/auth/signup")) {
      try {
        // Check if token is still valid
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (!isExpired) {
          // Redirect based on role
          const redirectPath = role === "admin" ? "/admin/dashboard" : "/user/dashboard";
          navigate(redirectPath, { replace: true });
        } else {
          // Token expired, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("user");
        }
      } catch (err) {
        // Invalid token, clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
      }
    }
  }, [navigate, location.pathname]);

  return children;
};

export default AutoRedirect;
