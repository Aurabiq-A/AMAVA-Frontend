import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
const Home: React.FC = () => {
    const { darkMode } = useTheme();

    const [categoryUrl, setCategoryUrl] = useState("");
    const [pages, setPages] = useState("");
    const [mode, setMode] = useState("scratch");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate async action, replace with your logic
        await new Promise((res) => setTimeout(res, 1200));
        setLoading(false);
        // Example: console.log({ categoryUrl, pages, mode });
    };
    return (
        <div
            className={`flex flex-col items-center justify-center min-h-screen px-4 pt-32
        ${darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"}`}
        >
            <h2 className="text-2xl font-semibold text-center mb-8 tracking-tight">
                Find 100K+ Winning Products For You🔥
            </h2>
            <form
                onSubmit={handleSubmit}
                className={`w-full max-w-md flex flex-col gap-6 shadow-md border rounded-xl px-6 py-8
          ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
                <div className="flex flex-col gap-2">
                    <label htmlFor="categoryUrl" className="font-medium">
                        Category Url
                    </label>
                    <input
                        id="categoryUrl"
                        type="text"
                        value={categoryUrl}
                        onChange={(e) => setCategoryUrl(e.target.value)}
                        placeholder="Enter category URL"
                        className={`rounded-md px-3 py-2 border outline-none transition
              ${darkMode
                                ? "bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                                : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400"
                            }`}
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="pages" className="font-medium">
                        Pages (How many pages)
                    </label>
                    <input
                        id="pages"
                        type="number"
                        min={1}
                        value={pages}
                        onChange={(e) => setPages(e.target.value)}
                        placeholder="Enter number of pages"
                        className={`rounded-md px-3 py-2 border outline-none transition
              ${darkMode
                                ? "bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                                : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400"
                            }`}
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="mode" className="font-medium">
                        Mode
                    </label>
                    <select
                        id="mode"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className={`rounded-md px-3 py-2 border outline-none transition
              ${darkMode
                                ? "bg-gray-900 border-gray-700 text-white"
                                : "bg-gray-100 border-gray-300 text-gray-900"
                            }`}
                    >
                        <option value="scratch">Start from Scratch</option>
                        <option value="resume">Resume From Last Session</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading || !categoryUrl.trim() || !pages.trim()}
                    className={`ml-3 font-semibold rounded-full px-5 py-2 text-sm transition-colors
            ${loading || !categoryUrl.trim() || !pages.trim()
                            ? "bg-emerald-400 cursor-not-allowed text-white"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                >
                    {loading ? (
                        <ArrowPathIcon className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                        "Search"
                    )}
                </button>
            </form>
        </div>
    );
};

export default Home;