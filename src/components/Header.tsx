import React from "react";
import { SunIcon, MoonIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext"; // adjust path

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="absolue inset-0 z-30 w-full px-4 py-3 flex items-center justify-between bg-gray-300 dark:bg-gray-800 shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wide max-sm:text-lg">
        AMAVA
      </h1>
      <div className="flex items-center space-x-4">
        <button
          aria-label="Toggle Dark Mode"
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-800" />
          )}
        </button>
        <button
          aria-label="User Profile"
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          <UserCircleIcon className="h-7 w-7 text-gray-800 dark:text-white" />
        </button>
      </div>
    </header>
  );
};

export default Header;
