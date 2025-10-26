import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-3 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/20 dark:border-gray-700/20 shadow-sm">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-1">
        <img src={logo} alt="Logo" className="h-6 w-6" />
        <span className="font-semibold text-3xl text-gray-800 dark:text-gray-100">
          Devable
        </span>
      </Link>

      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        >
          Home
        </Link>

        <Link
          to="/courses"
          className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        >
          Courses
        </Link>

        <Link
          to="/compiler"
          className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        >
          Compiler
        </Link>

        <Link
          to="/about"
          className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        >
          About
        </Link>

        <Link
          to="/support"
          className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        >
          Support
        </Link>

        <Link to="/auth/signup">
          <InteractiveHoverButton>Get Started</InteractiveHoverButton>
        </Link>
        
        <AnimatedThemeToggler className="w-6 h-6 ml-2" />
        
      </div>
 
    </nav>
  );
}

export default Navbar;
