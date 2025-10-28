import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";

import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Landing from "./pages/landing";
import Courses from "./pages/courses";
import Compiler from "./pages/compiler";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AutoRedirect from "./components/AutoRedirect";
import Admin from "./pages/admin";
import User from "./pages/user";
import Settings from "./pages/settings";
import DeleteAccountTest from "./pages/DeleteAccountTest";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AutoRedirect>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <div className="pt-16 flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<h1>Home Page</h1>} />
                <Route path="/about" element={<h1>About Page</h1>} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/compiler" element={<Compiler />} />

                {/* Auth Routes */}
                <Route path="/auth/signin" element={<AuthPage type="signin" />} />
                <Route path="/auth/signup" element={<AuthPage type="signup" />} />

                {/* Protected Dashboards */}
                <Route
                  path="/user/dashboard"
                  element={
                    <ProtectedRoute>
                      <User />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />

                {/* Settings */}
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                {/* Test Route */}
                <Route
                  path="/test-delete"
                  element={
                    <ProtectedRoute>
                      <DeleteAccountTest />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Fallback */}
                <Route
                  path="*"
                  element={
                    <h1 className="flex h-100 flex-col justify-center items-center text-2xl font-semibold">
                      🚧 More Features Under Build
                    </h1>
                  }
                />
              </Routes>
            </div>

            <Footer />
          </div>
        </AutoRedirect>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
