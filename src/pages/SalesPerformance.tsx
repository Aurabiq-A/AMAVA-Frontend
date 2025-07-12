import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { format } from "date-fns";

type SalesDay = {
  interval: string;
  unitCount: number;
  orderItemCount: number;
  orderCount: number;
  averageUnitPrice: {
    amount: number;
    currencyCode: string;
  };
  totalSales: {
    amount: number;
    currencyCode: string;
  };
};

export default function SalesMetricsPage() {
  const [metrics, setMetrics] = useState<SalesDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 6 * 86400000));
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchMetrics();
  }, [startDate, endDate]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const from = startDate.toISOString().split("T")[0];
      const to = endDate.toISOString().split("T")[0];

      const res = await axios.get("http://localhost:51483/sales-metrics", {
        params: { start_date: from, end_date: to },
      });

      setMetrics(res.data.data || []);
    } catch {
      setError("❌ Failed to fetch sales metrics.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = metrics.map((day) => {
    const [start] = day.interval.split("--");
    return {
      date: format(new Date(start), "MMM d"),
      revenue: day.totalSales.amount,
    };
  });

  const totalUnits = metrics.reduce((sum, d) => sum + d.unitCount, 0);
  const totalRevenue = metrics.reduce((sum, d) => sum + d.totalSales.amount, 0);
  const currency = metrics[0]?.totalSales?.currencyCode || "USD";

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">📊 Amazon Sales Metrics</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div>
          <label className="font-semibold">From: </label>
          <DatePicker selected={startDate} onChange={(date) => date && setStartDate(date)} />
        </div>
        <div>
          <label className="font-semibold">To: </label>
          <DatePicker selected={endDate} onChange={(date) => date && setEndDate(date)} />
        </div>
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && chartData.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-center">📈 Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {metrics.map((day, index) => {
          const [start] = day.interval.split("--");
          const dateStr = new Date(start).toLocaleDateString();

          return (
            <div key={index} className="border rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition">
              <h2 className="text-xl font-semibold mb-2">📅 {dateStr}</h2>
              <p><strong>Units Sold:</strong> {day.unitCount}</p>
              <p><strong>Orders:</strong> {day.orderCount}</p>
              <p><strong>Order Items:</strong> {day.orderItemCount}</p>
              <p>
                <strong>Avg. Unit Price:</strong> {day.averageUnitPrice.currencyCode}{" "}
                {day.averageUnitPrice.amount.toFixed(2)}
              </p>
              <p>
                <strong>Total Sales:</strong> {day.totalSales.currencyCode}{" "}
                {day.totalSales.amount.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      {!loading && metrics.length > 0 && (
        <div className="mt-8 text-right text-lg font-semibold">
          🧮 Total Units: {totalUnits} | 💰 Revenue: {currency} {totalRevenue.toFixed(2)}
        </div>
      )}
    </div>
  );
}
