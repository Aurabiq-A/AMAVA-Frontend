// src/App.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Home.module.css"
import { useTheme } from "../context/ThemeContext";
type Sale = {
  id: number;
  amazon_order_id: string;
  purchase_date: string;
  order_status: string;
  product_name: string;
  sku: string;
  asin: string;
  quantity: number;
  currency: string;
  item_price: number;
  ship_city: string;
  ship_state: string;
  ship_postal_code: string;
  ship_country: string;
  fulfillment_channel: string;
  sales_channel: string;
  ship_service_level: string;
};
function SalesTable() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    axios
      .get("http://localhost:51483/todays-sales") // Change to your FastAPI URL
      .then((res) => {
        setSales(res.data.sales_data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Something went wrong.");
        setLoading(false);
      });
  }, []);

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}>

      {loading && (
        <p className="text-center text-gray-500 animate-pulse">Loading sales data...</p>
      )}

      {error && (
        <p className="text-center text-red-600 font-semibold">❌ {error}</p>
      )}

      {!loading && !error && sales.length === 0 && (
        <p className="text-center text-gray-500">No sales found for today.</p>
      )}


      {!loading && sales.length > 0 && (
        <div className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}>
          <h1 className="text-3xl font-bold text-center mb-6">📦 Today’s Amazon Sales</h1>

          <div className={styles.responseBox}>
            <div className="text-right font-semibold mt-4">
              Total Sales: {sales.reduce((sum, s) => sum + s.item_price, 0).toFixed(2)} {sales[0]?.currency || ""}
            </div>
            {sales.map((sale) => (
              <div
                key={sale.id}
                className={styles.responseBox}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6">
                  <div><strong>#</strong> {sale.id}</div>
                  <div><strong>Order ID:</strong> {sale.amazon_order_id}</div>
                  <div><strong>Date:</strong> {new Date(sale.purchase_date).toLocaleString()}</div>
                  <div><strong>Status:</strong> {sale.order_status}</div>
                  <div><strong>Product:</strong> {sale.product_name}</div>
                  <div><strong>SKU:</strong> {sale.sku}</div>
                  <div><strong>ASIN:</strong> {sale.asin}</div>
                  <div><strong>Quantity:</strong> {sale.quantity}</div>
                  <div><strong>Price:</strong> {sale.currency} {sale.item_price.toFixed(2)}</div>
                  <div>
                    <strong>Ship To:</strong> {sale.ship_city}, {sale.ship_state} {sale.ship_postal_code}, {sale.ship_country}
                  </div>
                  <div><strong>Fulfillment:</strong> {sale.fulfillment_channel}</div>
                  <div><strong>Sales Channel:</strong> {sale.sales_channel}</div>
                  <div><strong>Service Level:</strong> {sale.ship_service_level}</div>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
}

export default SalesTable;
