import React from "react";
import { FaGithub } from "react-icons/fa"; // ✅ add this package if not installed
import logo from "../assets/logo.svg";

function Footer() {
  return (
    <footer className="flex flex-wrap justify-between items-center p-4 border-t   backdrop-blur-md mt-auto text-sm ">
      {/* Left side */}
      <div className="flex items-center gap-2 flex-wrap">
        <p>&copy; {new Date().getFullYear()}</p>
        <img src={logo} alt="Logo" className="h-5" />
        <span className="font-semibold ">Devable</span>
        <p>| All rights reserved.</p>
      </div>

      {/* Right side */}
      <a
        href="https://github.com/ebhay/devable" // 🔗 Replace with your actual GitHub repo URL
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
      >
        <FaGithub className="text-lg" />
        Contribute on GitHub
      </a>
    </footer>
  );
}

export default Footer;
