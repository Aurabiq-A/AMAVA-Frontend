import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext"; // adjust path as needed

const Home: React.FC = () => {
  const { darkMode } = useTheme();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Replace with actual backend call
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen px-4 pt-32
        ${darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <h2 className="text-2xl font-semibold text-center mb-4 tracking-tight">
        Let Her Find Winning Products For You🔥
      </h2>
      {/*<p
        className={`text-center mb-10 text-lg max-w-xl ${
          darkMode ? "text-gray-300" : "text-gray-500"
        }`}
      >
        Search for trending Amazon products and connect with top suppliers instantly.
      </p>*/}

      <form
        onSubmit={handleSearch}
        className={`w-full max-w-2xl flex items-center shadow-md border rounded-full px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-500
          ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <MagnifyingGlassIcon
          className={`h-5 w-5 mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        />
        <input
          type="text"
          placeholder="Search best sellers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`flex-1 bg-transparent outline-none text-lg placeholder-gray-400
            ${darkMode ? "text-white" : "text-gray-700"}`}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className={`ml-3 font-semibold rounded-full px-5 py-2 text-sm transition-colors
            ${
              loading || !query.trim()
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

      <div className="mt-10 w-full max-w-2xl">
        {results.length > 0 && (
          <ul className="space-y-4">
            {results.map((item: any) => (
              <li
                key={item.id}
                className={`border p-5 rounded-xl shadow-sm transition hover:shadow-md
                  ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
              >
                <div className="text-lg font-medium">{item.name}</div>
                <div className="text-emerald-600 mt-1">Supplier: {item.supplier}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
