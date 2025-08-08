import { useState } from "react";
// import axios from "axios";

interface ProfitResult {
    asin: string;
    price: number;
    fee: number;
    cost: number;
    net: number;
}

const FBAProfitCalculatorPage = () => {
    const [asin, setAsin] = useState<string>("");
    const [cost, setCost] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<ProfitResult | null>(null);
    const [error, setError] = useState<string>("");

    const handleCalculate = async () => {
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const res = await fetch("http://localhost:51483/fba-profit-calculator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ asin: "B00ZZ1G3I2", cost: 8.5 })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to calculate profit.");
            }

            const data: ProfitResult = await res.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4 mt-10 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">FBA Profit Calculator</h2>
            <div className="mb-4">
                <label className="block mb-1 font-medium">ASIN</label>
                <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={asin}
                    onChange={(e) => setAsin(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1 font-medium">Cost Price (USD)</label>
                <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                />
            </div>
            <button
                onClick={handleCalculate}
                disabled={loading || !asin || !cost}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Calculating..." : "Calculate Profit"}
            </button>

            {error && <div className="mt-4 text-red-600">❌ {error}</div>}

            {result && (
                <div className="mt-6 border-t pt-4 text-sm text-gray-800 space-y-2">
                    <div><strong>ASIN:</strong> {result.asin}</div>
                    <div><strong>FBA Price:</strong> ${result.price.toFixed(2)}</div>
                    <div><strong>FBA Fees:</strong> ${result.fee.toFixed(2)}</div>
                    <div><strong>Cost Price:</strong> ${result.cost.toFixed(2)}</div>
                    <div className="font-semibold">
                        ✅ Net Profit: ${result.net.toFixed(2)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FBAProfitCalculatorPage;
