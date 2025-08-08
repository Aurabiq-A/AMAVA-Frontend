import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./Home.module.css";
import { useTheme } from '../context/ThemeContext';
type Product = Record<string, any>;

function ScrapedView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');
  const Navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    fetch('http://localhost:51483/api/get_scraped_data', {
      method: "GET",
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          try {
            const parsed: Product[] = JSON.parse(data.raw_string).data;
            setProducts(parsed);
          } catch (err) {
            setError('Failed to parse JSON');
            console.error(err);
          }
        } else {
          setError('Failed to load data from server');
        }
      })
      .catch(err => {
        setError('Network error');
        console.error(err);
      });
  }, []);

  // Keys you want to skip in the card display
  const skipKeys = ["image", "websiteUrl"];

  return (
    <div style={{ padding: '2rem' }} className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}>
      <div className={styles.responseBox}>

        <h1>Products From Wholesaler</h1>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mb-4'
          onClick={() => Navigate("/ungated")}> Start Check On Amazon </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {products.length === 0 && !error && <p>No products to show.</p>}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem'
        }} >
          {Array.isArray(products) &&
            products.map((product, index) => (
              <div key={index} style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px'
              }} className={styles.responseBox}>
                {Object.entries(product)
                  .filter(([key, value]) => value && !skipKeys.includes(key))
                  .map(([key, value]) => (
                    <p key={key}>
                      <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong>{" "}
                      {typeof value === "string" && value.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
                        <img src={value} alt={key} style={{ maxWidth: 120, maxHeight: 120, display: "block", margin: "8px 0" }} />
                      ) : typeof value === "string" && value.startsWith("http") ? (
                        <a href={value} target="_blank" rel="noopener noreferrer">View</a>
                      ) : (
                        value
                      )}
                    </p>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ScrapedView;
