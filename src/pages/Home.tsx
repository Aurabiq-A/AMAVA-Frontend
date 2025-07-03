import React, { useState, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import styles from "./Home.module.css";

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
      className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}
    >
      <h2 className={styles.heading}>Product Search</h2>
      <form
        onSubmit={handleSubmit}
        className={`${styles.form} ${darkMode ? styles.formDark : styles.formLight}`}
      >
        <MagnifyingGlassIcon
          className={`${styles.icon} ${darkMode ? styles.iconDark : styles.iconLight}`}
        />
        <input
          type="text"
          id="categoryUrl"
          value={categoryUrl}
          onChange={(e) => setCategoryUrl(e.target.value)}
          placeholder="Category Url"
          className={`${styles.input} ${darkMode ? styles.inputDark : styles.inputLight}`}
          required
        />
        <input
          type="number"
          id="pages"
          min={1}
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          placeholder="Pages (How many pages)"
          className={`${styles.pagesInput} ${darkMode ? styles.inputDark : styles.inputLight}`}
          required
        />
        <select
          id="mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className={`${styles.select} ${darkMode ? styles.inputDark : styles.inputLight}`}
        >
          <option value="scratch">Start from Scratch</option>
          <option value="resume">Resume From Last Session 💫</option>
        </select>
        <button
          type="submit"
          disabled={loading || !categoryUrl.trim() || !pages.trim()}
          className={`${styles.submitBtn} ${loading || !categoryUrl.trim() || !pages.trim()
            ? styles.submitBtnDisabled
            : styles.submitBtnActive
            }`}
        >
          {loading ? (
            <ArrowPathIcon className={styles.loadingIcon} />
          ) : (
            "Search"
          )}
        </button>
      </form>

      <div className={styles.orDivider}>
        <div className={styles.dividerLine}></div>
        <span className={styles.orText}>Or</span>
        <div className={styles.dividerLine}></div>
      </div>
      <button
        className={styles.uploadBtn}
        onClick={() => fileInputRef.current?.click()}
      >
        Upload Excel File
      </button>
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        onChange={handleExcelUpload}
        className={styles.hiddenInput}
      />

      {showExcelModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${darkMode ? styles.modalDark : styles.modalLight}`}>
            <h3 className={styles.modalTitle}>Select Column for Amazon Check</h3>
            <div className={styles.modalSelectWrap}>
              <select
                value={selectedKey}
                onChange={e => setSelectedKey(e.target.value)}
                className={styles.modalSelect}
              >
                <option value="">Select column...</option>
                {excelKeys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            <button
              className={styles.modalSubmit}
              disabled={!selectedKey || uploading}
              onClick={handleExcelSubmit}
            >
              {uploading ? "Uploading..." : "Submit"}
            </button>
            <button
              className={styles.modalCancel}
              onClick={() => setShowExcelModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {agentResponse && (
        <div className={`${styles.responseBox} ${darkMode ? styles.responseBoxDark : styles.responseBoxLight}`}>
          <div className={styles.responseTitle}>Agent Response:</div>
          <div className={styles.responseText}>{agentResponse}</div>
          <button className={styles.progressBtn}
            onClick={() => Navigate("/progress")}>See Progress</button>
        </div>
      )}
    </div>
  );
};

export default Home;