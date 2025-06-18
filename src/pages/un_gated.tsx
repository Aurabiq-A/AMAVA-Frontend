import React, { } from "react";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
// import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";
// import { useNavigate } from "react-router-dom";

const CheckOnAmz: React.FC = () => {
    const { darkMode } = useTheme();
    const CheckonAMAZON = async () => {
        // Send a request to the backend to start checking on Amazon
        try {
            const response = await fetch("http://localhost:51483/api/check_on_amazon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                throw new Error("Failed to start checking on Amazon");
            }
            const data = await response.json();
            console.log("Check on Amazon started:", data);
        } catch (error) {
            console.error("Error starting check on Amazon:", error);
            alert("Failed to start checking on Amazon. Please try again later.");
        }
    }
    return (
        <div className={`flex items-center justify-center h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Check on AMAZON</h1>
                <button
                    onClick={CheckonAMAZON}
                    className={`px-4 py-2 rounded ${darkMode ? "bg-blue-500 text-white" : "bg-blue-700 text-white"} hover:bg-blue-600`}
                >
                    Start Checking On Amazon 🔥
                </button>
            </div>
        </div>
    )
}
export default CheckOnAmz;