import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";


const Home: React.FC = () => {
  const { darkMode } = useTheme();

  const [categoryUrl, setCategoryUrl] = useState("");
  const [pages, setPages] = useState("");
  const [mode, setMode] = useState("scratch");
  const [loading, setLoading] = useState(false);
  const [agentResponse, setAgentResponse] = useState<string | null>(null);
  const Navigate = useNavigate();

  function extractMainResponse(json: any): string {
    for (const entry of json) {
      const part = entry?.content?.parts?.[0];
      if (part?.text) {
        return part.text;
      }
    }
    return "No main response found.";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAgentResponse(null);

    // Example user/session IDs (replace with real logic if needed)
    const userId = "us";
    const sessionId = "st";
    const appName = "AMAVAGENT";

    // Step 1: Create session
    await fetch(
      `http://localhost:1483/apps/${appName}/users/${userId}/sessions/${sessionId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: { key1: "value1", key2: 42 } }),
      }
    );

    // Step 2: Run agent
    const promptText = `Hey scrape me this wholesale(888lots)'s website URL: ${categoryUrl} and Start from zero = ${mode === "scratch" ? "True" : "False"} and pages = ${pages} (I have reviewed everything jst start scraping)`;

    try {
      const response = await fetch("http://localhost:1483/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName,
          userId,
          sessionId,
          newMessage: {
            role: "user",
            parts: [{ text: promptText }],
          },
        }),
      });

      const text = await response.text();
      let main = "No main response found.";
      try {
        const json = JSON.parse(text);
        main = extractMainResponse(json);
      } catch {
        main = text;
      }
      setAgentResponse(main);
    } catch (err) {
      setAgentResponse("Error contacting agent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen px-4 pt-32
        ${darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <h2 className="text-2xl font-semibold text-center mb-8 tracking-tight">
        Product Search
      </h2>
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-3xl flex items-center shadow-md border rounded-full px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-500
          ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <MagnifyingGlassIcon
          className={`h-5 w-5 mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        />
        <input
          type="text"
          id="categoryUrl"
          value={categoryUrl}
          onChange={(e) => setCategoryUrl(e.target.value)}
          placeholder="Category Url"
          className={`flex-1 bg-transparent outline-none text-lg placeholder-gray-400
            ${darkMode ? "text-white" : "text-gray-700"}`}
          required
        />
        <input
          type="number"
          id="pages"
          min={1}
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          placeholder="Pages (How many pages)"
          className={`w-40 ml-3 rounded-md px-3 py-2 border outline-none transition placeholder-gray-400
            ${darkMode
              ? "bg-gray-900 border-gray-700 text-white"
              : "bg-gray-100 border-gray-300 text-gray-900"
            }`}
          required
        />
        <select
          id="mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className={`ml-3 rounded-md px-3 py-2 border outline-none transition
            ${darkMode
              ? "bg-gray-900 border-gray-700 text-white"
              : "bg-gray-100 border-gray-300 text-gray-900"
            }`}
        >
          <option value="scratch">Start from Scratch</option>
          <option value="resume">Resume From Last Session</option>
        </select>
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
      {agentResponse && (
        <div className={`w-full max-w-2xl mt-6 p-4 rounded-xl shadow border
          ${darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
          <div className="font-semibold mb-2">Agent Response:</div>
          <div className="whitespace-pre-wrap">{agentResponse}</div>
          <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mb-4'
            onClick={() => Navigate("/progress")}>See Progress</button>
        </div>
      )}
    </div>
  );
};

export default Home;