import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import * as XLSX from "xlsx";

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

  // Extract main agent response (copied from Home.tsx)
  function extractMainResponse(json: any): string {
    for (const entry of json) {
      const part = entry?.content?.parts?.[0];
      if (part?.text) {
        return part.text;
      }
    }
    return "No main response found.";
  }

  // Move this function OUTSIDE of useEffect!
  const runAgentForAmazonCheck = async () => {
    setLoading(true);
    setError(null);
    setAgentResponse(null);
    const userId = "us";
    const sessionId = "st";
    const appName = "AMAVAGENT";
    const promptText = `Hello from Server scraping is done wholesale(888lots)'s website now start checking on Amazon`;

    try {
      const response = await fetch("https://electric-mistakenly-rat.ngrok-free.app/run", {
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
      let main = "No main response found.";
      try {
        const json = JSON.parse(text);
        main = extractMainResponse(json);
      } catch {
        main = text;
      }
      setAgentResponse(main);
      setError("Started checking on Amazon. We will notify you after its done!.");
    } catch (err) {
      setError("Failed to contact agent for Amazon check.");
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
          // If no checked data, run agent
          await runAgentForAmazonCheck();
        } else {
          setCheckedData(data.checked_data);
        }
      } catch (error) {
        // If fetch fails, run the agent as fallback
        await runAgentForAmazonCheck();
      } finally {
        setLoading(false);
      }
    };

    fetchCheckedData();
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      const response = await fetch("https://electric-mistakenly-rat.ngrok-free.app/exceldata", {
        method: "GET",
        headers: { "ngrok-skip-browser-warning": "true","Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch merged data.");
      }
      const data = await response.json();
      const merged = data.merged_data;

      // Flatten merged_data for Excel
      const rows: any[] = [];
      merged.forEach((item:any) => {
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

      // Remove amazon_data array from each row (since it's flattened)
      rows.forEach((row) => delete row.amazon_data);

      // Create worksheet and workbook
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "MergedData");

      // Download as Excel file
      XLSX.writeFile(wb, "merged_data.xlsx");
    } catch (error) {
      setError("Failed to download Excel file. Please try again later.");
    } finally {
      setDownloading(false);
    }
  };

  // Prepare a flat list of products for display
  const flatProducts: { upc: string; product: ProductResult }[] = checkedData
    ? Object.entries(checkedData.results).flatMap(([upc, products]) =>
        products.map((product) => ({ upc, product }))
      )
    : [];

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="text-center w-full max-w-3xl">
        {checkedData && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`mb-8 px-4 py-2 rounded h-15 cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:opacity-60`}
          >
            {downloading ? "Downloading..." : "Download Excel"}
          </button>
        )}

        {/* New "Check on Amz" button */}
        <button
          onClick={runAgentForAmazonCheck}
          disabled={loading}
          className="mb-8 ml-4 px-4 py-2 rounded h-15 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check on Amz"}
        </button>

        {loading && (
          <div className="mb-8 text-lg font-semibold text-blue-500">
            Checking on Amazon...
          </div>
        )}

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {agentResponse && (
          <div className={`w-full max-w-2xl mt-6 p-4 rounded-xl shadow border
            ${darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
            <div className="font-semibold mb-2">Agent Response:</div>
            <div className="whitespace-pre-wrap">{agentResponse}</div>
          </div>
        )}

        {checkedData && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Checked Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {flatProducts.slice(0, 10).map(({ upc, product }, idx) => (
                <div
                  key={upc + idx}
                  className={`rounded-xl border shadow p-4 flex flex-col items-start ${
                    darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <div className="font-semibold mb-1">
                    UPC: <span className="font-mono">{upc}</span>
                  </div>
                  <div>
                    ASIN: <span className="font-mono">{product.productASIN}</span>
                  </div>
                  <div>
                    Status: <span className="font-bold">{product.status}</span>
                  </div>
                  <a
                    href={`https://www.amazon.com/dp/${product.productASIN}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-blue-500 underline"
                  >
                    View on Amazon
                  </a>
                </div>
              ))}
            </div>
            {flatProducts.length > 10 && (
              <button
                onClick={() => setShowAll(true)}
                className="mt-6 px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Load More
              </button>
            )}

            {/* Modal for all products */}
            {showAll && (
              <div className="fixed inset-0 z-50 flex items-center justify-center ">
                <div className={`bg-${darkMode ? "gray-700" : "white"} text-${darkMode ? "white" : "black"} rounded-xl shadow-lg max-w-5xl w-full p-6 overflow-auto max-h-[90vh]`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">All Checked Products</h3>
                    <button
                      onClick={() => setShowAll(false)}
                      className="hover:text-red-500 text-2xl font-bold"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 dark:border-gray-700">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 border dark:border-gray-700">UPC</th>
                          <th className="px-3 py-2 border dark:border-gray-700">ASIN</th>
                          <th className="px-3 py-2 border dark:border-gray-700">Status</th>
                          <th className="px-3 py-2 border dark:border-gray-700">Amazon Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flatProducts.map(({ upc, product }, idx) => (
                          <tr key={upc + idx}>
                            <td className="px-3 py-2 border dark:border-gray-700 font-mono">{upc}</td>
                            <td className="px-3 py-2 border dark:border-gray-700 font-mono">{product.productASIN}</td>
                            <td className="px-3 py-2 border dark:border-gray-700">{product.status}</td>
                            <td className="px-3 py-2 border dark:border-gray-700">
                              <a
                                href={`https://www.amazon.com/dp/${product.productASIN}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
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
                    className="mt-6 px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {checkedData.skipped && checkedData.skipped.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Skipped UPCs</h3>
                <div className="flex flex-wrap gap-2">
                  {checkedData.skipped.map((item, idx) => (
                    <span
                      key={item.productUPC + idx}
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {item.productUPC}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 text-sm text-gray-400">
              Checked at: {new Date(checkedData.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOnAmz;