import React, { useState, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const Home: React.FC = () => {
  const { darkMode } = useTheme();

  const [categoryUrl, setCategoryUrl] = useState("");
  const [pages, setPages] = useState("");
  const [mode, setMode] = useState("scratch");
  const [loading, setLoading] = useState(false);
  const [agentResponse, setAgentResponse] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const Navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const userId = "us";
    const sessionId = "st";
    const appName = "AMAVAGENT";

    // Step 1: Create session (proxy to 51483)
    await fetch(
      `https://electric-mistakenly-rat.ngrok-free.app/apps/${appName}/users/${userId}/sessions/${sessionId}`,
      {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "true","Content-Type": "application/json" },
        body: JSON.stringify({ state: { key1: "value1", key2: 42 } }),
      }
    );

    // Step 2: Run agent (proxy to 51483)
    const promptText = `Hey scrape me this wholesale/distributor's website URL: ${categoryUrl} and Start from zero = ${mode === "scratch" ? "True" : "False"} and pages = ${pages} (I have reviewed everything jst start scraping)`;

    try {
      const response = await fetch("https://electric-mistakenly-rat.ngrok-free.app/run", {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "true","Content-Type": "application/json" },
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

  // Handle Excel Upload
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      setExcelData(json);
      setShowExcelModal(true);
    };
    reader.readAsBinaryString(file);
  };

  // Handle user selection and upload to backend
  const handleExcelSubmit = async () => {
    if (!selectedKey) return;
    setUploading(true);

    // Change the key name for search/check on amazon
    const updatedData = excelData.map((row) => ({
      ...row,
      search_key: row[selectedKey], // Add a new key 'search_key' with the selected value
    }));

    try {
      await fetch("https://electric-mistakenly-rat.ngrok-free.app/api/scraped_dataresults", {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "true","Content-Type": "application/json" },
        body: JSON.stringify({ data: updatedData }),
      });
      setShowExcelModal(false);
      setExcelData([]);
      setSelectedKey("");
      alert("Excel data uploaded and sent for checking on Amazon!");
    } catch (err) {
      alert("Failed to upload Excel data.");
    } finally {
      setUploading(false);
    }
  };

  // Get all possible keys from the first row for selection
  const excelKeys = excelData.length > 0 ? Object.keys(excelData[0]) : [];

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
          <option value="resume">Resume From Last Session 💫</option>
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

      {/* Or and Upload Excel */}
      <div className="flex items-center my-6 w-full max-w-3xl">
        <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
        <span className="mx-4 text-lg font-semibold text-gray-500 dark:text-gray-400">Or</span>
        <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow mb-4"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload Excel File
      </button>
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        onChange={handleExcelUpload}
        className="hidden"
      />

      {/* Modal for selecting key */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-md w-full p-6`}>
            <h3 className="text-lg font-bold mb-4">Select Column for Amazon Check</h3>
            <div className="mb-4">
              <select
                value={selectedKey}
                onChange={e => setSelectedKey(e.target.value)}
                className="w-full px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">Select column...</option>
                {excelKeys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded shadow mr-2"
              disabled={!selectedKey || uploading}
              onClick={handleExcelSubmit}
            >
              {uploading ? "Uploading..." : "Submit"}
            </button>
            <button
              className="ml-2 px-6 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
              onClick={() => setShowExcelModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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