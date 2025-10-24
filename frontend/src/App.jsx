import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./pages/landing";
import Navbar from "./components/navbar";
import Compiler from "./pages/compiler";
import Courses from "./pages/courses";

function App() {
  const [lang, setlang] = useState("python3");

  return (
    <div className="flex flex-col">
      <BrowserRouter>
        <div className="flex-1">
          <Navbar />
        </div>
        <div>
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex-1">
                  <Landing />
                  <Landing />
                  <Landing />
                </div>
              }
            />
            <Route path="/home" element={<h1>Home Page</h1>} />
            <Route path="/about" element={<h1>About Page</h1>} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/compiler" element={<Compiler />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
