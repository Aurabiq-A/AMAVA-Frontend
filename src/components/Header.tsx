// filepath: /workspaces/AMAVA-Frontend/src/components/Header.tsx
import React from "react";
import { SunIcon, MoonIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header
      className={`w-full px-4 py-3 flex items-center justify-between shadow-md fixed top-0 left-0 z-30
        ${darkMode ? "bg-gray-900 border-b border-gray-800 text-white" : "bg-white border-b border-gray-200 text-gray-900"}`}
    >
      <h1 className="text-2xl font-bold tracking-wide max-sm:text-lg">
        AMAVA
      </h1>
      <div className="flex items-center space-x-4">
        <button
          aria-label="Toggle Dark Mode"
          onClick={toggleDarkMode}
          className={`p-2 rounded-full transition
            ${darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>
        <button
          aria-label="User Profile"
          className={`p-2 rounded-full transition
            ${darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
        >
          <UserCircleIcon className="h-7 w-7" />
        </button>
      </div>
    </header>
  );
};

export default Header;