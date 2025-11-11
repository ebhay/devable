import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./pages/landing";
import Navbar from "./components/navbar";
import Compiler from "./pages/compiler";
import Courses from "./pages/courses";
import Footer from "./components/footer";

function App() {
  const [lang, setlang] = useState("python3");

  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Compiler />} />
              
            <Route path="*" element={<h1 className="flex h-100 flex-col justify-center items-center">More Feature Under Build</h1>} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
