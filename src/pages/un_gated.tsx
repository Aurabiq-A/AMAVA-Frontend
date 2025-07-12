import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import * as XLSX from "xlsx";
import styles from "./Home.module.css";

type ProductResult = {
  productASIN: string;
  status: string;
};

type CheckedData = {
  results: Record<string, ProductResult[]>;
  skipped: { productUPC: string }[];
  timestamp: string;
};

const CheckOnAmz: React.FC = () => {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [checkedData, setCheckedData] = useState<CheckedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [agentResponse, setAgentResponse] = useState<string | null>(null);

  // New state for search key modal
  const [showSearchKeyModal, setShowSearchKeyModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [searchKeys, setSearchKeys] = useState<string[]>([]);
  const [sendingSearchKey, setSendingSearchKey] = useState(false);

  function extractMainResponse(json: any): string {
    for (const entry of json) {
      const part = entry?.content?.parts?.[0];
      if (part?.text) {
        return part.text;
      }
    }
    return "No main response found.";
  }

  const handleCheckOnAmzClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://electric-mistakenly-rat.ngrok-free.app/api/get_scraped_data", {
        method: "GET",
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const data = await res.json();
      if (data.status === "success") {
        const parsed = JSON.parse(data.raw_string).data;
        if (parsed && parsed.length > 0) {
          setSearchKeys(Object.keys(parsed[0]));
          setShowSearchKeyModal(true);
        } else {
          setError("No scraped data found.");
        }
      } else {
        setError("Failed to load scraped data.");
      }
    } catch (err) {
      setError("Failed to fetch scraped data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendSearchKey = async () => {
    if (!selectedKey) return;
    setSendingSearchKey(true);

    try {
      const res = await fetch("https://electric-mistakenly-rat.ngrok-free.app/api/get_scraped_data", {
        method: "GET",
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      const data = await res.json();
      let unitList: any[] = [];
      if (data.status === "success") {
        const parsed = JSON.parse(data.raw_string).data;
        unitList = parsed.map((item: any) => item[selectedKey]).filter((v: any) => !!v);
      }

      await fetch("https://electric-mistakenly-rat.ngrok-free.app/search-key", {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "true", "Content-Type": "application/json" },
        body: JSON.stringify({ search_key: selectedKey, values: unitList }),
      });
      setShowSearchKeyModal(false);
      setSelectedKey("");
      setError("Search key sent! Now checking on Amazon...");

      await runAgentForAmazonCheck();
    } catch (err) {
      setError("Failed to send search key.");
    } finally {
      setSendingSearchKey(false);
    }
  };

  const runAgentForAmazonCheck = async () => {
    setLoading(true);
    setError(null);
    setAgentResponse(null);
    const userId = "us";
    const sessionId = "st";
    const appName = "AMAVAGENT";
    const promptText = `Hello from Server scraping is done wholesaler's website now start checking on Amazon`;

    try {
      let response = await fetch("https://electric-mistakenly-rat.ngrok-free.app/run", {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "true", "Content-Type": "application/json" },
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
      if (text.includes('"detail":"Session not found"')) {
        await fetch(
          `https://electric-mistakenly-rat.ngrok-free.app/apps/${appName}/users/${userId}/sessions/${sessionId}`,
          {
            method: "POST",
            headers: { "ngrok-skip-browser-warning": "true", "Content-Type": "application/json" },
            body: JSON.stringify({ state: { key1: "value1", key2: 42 } }),
          }
        );
        response = await fetch("https://electric-mistakenly-rat.ngrok-free.app/run", {
          method: "POST",
          headers: { "ngrok-skip-browser-warning": "true", "Content-Type": "application/json" },
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
      }

      const retryText = await response.text();

      let main = "No main response found.";
      try {
        const json = JSON.parse(retryText);
        main = extractMainResponse(json);
      } catch {
        main = retryText;
      }
      setAgentResponse(main);
      setError("Started checking on Amazon. We will notify you after its done!.");
    } catch (err) {
      setError(`Failed to contact agent for Amazon check. ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCheckedData = async () => {
      setLoading(true);
      setError(null);
      setCheckedData(null);
      setAgentResponse(null);
      try {
        const response = await fetch("https://electric-mistakenly-rat.ngrok-free.app/checkeddata", {
          method: "GET",
          headers: { "ngrok-skip-browser-warning": "true", "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch checked data");
        }
        const data = await response.json();
        if (!data.checked_data || !data.checked_data.results || Object.keys(data.checked_data.results).length === 0) {
          await runAgentForAmazonCheck();
        } else {
          setCheckedData(data.checked_data);
        }
      } catch (error) {
        await runAgentForAmazonCheck();
      } finally {
        setLoading(false);
      }
    };

    fetchCheckedData();
    // run fetchCheckedData every 10 minutes
    const interval = setInterval(fetchCheckedData, 600000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      const response = await fetch("https://electric-mistakenly-rat.ngrok-free.app/exceldata", {
        method: "GET",
        headers: { "ngrok-skip-browser-warning": "true", "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch merged data.");
      }
      const data = await response.json();
      const merged = data.merged_data;

      const rows: any[] = [];
      merged.forEach((item: any) => {
        if (item.amazon_data && item.amazon_data.length > 0) {
          item.amazon_data.forEach((ad: any) => {
            rows.push({
              ...item,
              ...ad,
            });
          });
        } else {
          rows.push(item);
        }
      });

      rows.forEach((row) => delete row.amazon_data);

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "MergedData");
      XLSX.writeFile(wb, "merged_data.xlsx");
    } catch (error) {
      setError("Failed to download Excel file. Please try again later.");
    } finally {
      setDownloading(false);
    }
  };

  const flatProducts: { upc: string; product: ProductResult }[] = checkedData
    ? Object.entries(checkedData.results).flatMap(([upc, products]) =>
        products.map((product) => ({ upc, product }))
      )
    : [];

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}>
      <div className={styles.responseBox}>
        {checkedData && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={styles.uploadBtn}
          >
            {downloading ? "Downloading..." : "Download Excel"}
          </button>
        )}

        <button
          onClick={handleCheckOnAmzClick}
          disabled={loading || !checkedData}
          className={styles.submitBtn}
        >
          {loading ? "Checking..." : "Check on Amz"}
        </button>

        {loading && (
          <div className={styles.heading} style={{ color: "#60a5fa" }}>
            Checking on Amazon...
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        {agentResponse && (
          <div className={styles.responseBox}>
            <div className={styles.responseTitle}>Agent Response:</div>
            <div className={styles.responseText}>{agentResponse}</div>
          </div>
        )}

        {checkedData && (
          <div className={styles.responseBox}>
            <h2 className={styles.heading}>Checked Products</h2>
            <div className={styles.productsGrid}>
              {flatProducts.slice(0, 10).map(({ upc, product }, idx) => (
                <div key={upc + idx} className={styles.productCard}>
                  <div className={styles.productLabel}>
                    UPC: <span className={styles.productMono}>{upc}</span>
                  </div>
                  <div>
                    ASIN: <span className={styles.productMono}>{product.productASIN}</span>
                  </div>
                  <div>
                    Status: <span className={styles.productStatus}>{product.status}</span>
                  </div>
                  <a
                    href={`https://www.amazon.com/dp/${product.productASIN}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.productLink}
                  >
                    View on Amazon
                  </a>
                </div>
              ))}
            </div>
            {flatProducts.length > 10 && (
              <button
                onClick={() => setShowAll(true)}
                className={styles.progressBtn}
              >
                Load More
              </button>
            )}

            {showAll && (
              <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                  <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>All Checked Products</h3>
                    <button
                      onClick={() => setShowAll(false)}
                      className={styles.modalClose}
                    >
                      &times;
                    </button>
                  </div>
                  <div className={styles.modalTableWrap}>
                    <table className={styles.modalTable}>
                      <thead>
                        <tr>
                          <th>UPC</th>
                          <th>ASIN</th>
                          <th>Status</th>
                          <th>Amazon Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flatProducts.map(({ upc, product }, idx) => (
                          <tr key={upc + idx}>
                            <td className={styles.productMono}>{upc}</td>
                            <td className={styles.productMono}>{product.productASIN}</td>
                            <td>{product.status}</td>
                            <td>
                              <a
                                href={`https://www.amazon.com/dp/${product.productASIN}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.productLink}
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    onClick={() => setShowAll(false)}
                    className={styles.progressBtn}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {checkedData.skipped && checkedData.skipped.length > 0 && (
              <div className={styles.skippedBox}>
                <h3 className={styles.modalTitle}>Skipped UPCs</h3>
                <div className={styles.skippedList}>
                  {checkedData.skipped.map((item, idx) => (
                    <span key={item.productUPC + idx} className={styles.skippedItem}>
                      {item.productUPC}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.checkedAt}>
              Checked at: {new Date(checkedData.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Modal for selecting search key */}
      {showSearchKeyModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Select Unit/Column for Amazon Check</h3>
            <div className={styles.modalSelectWrap}>
              <select
                value={selectedKey}
                onChange={e => setSelectedKey(e.target.value)}
                className={styles.modalSelect}
              >
                <option value="">Select column...</option>
                {searchKeys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            <button
              className={styles.modalSubmit}
              disabled={!selectedKey || sendingSearchKey}
              onClick={handleSendSearchKey}
            >
              {sendingSearchKey ? "Sending..." : "Submit"}
            </button>
            <button
              className={styles.modalCancel}
              onClick={() => setShowSearchKeyModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOnAmz;