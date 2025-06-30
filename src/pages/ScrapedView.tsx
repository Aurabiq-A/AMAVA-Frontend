import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  title: string;
  price: number | string;
  upc: string;
  sku: string;
  asin: string;
  moq: number | string;
  link: string;
}

function ScrapedView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');
  const Navigate = useNavigate();

  useEffect(() => {
    fetch('https://electric-mistakenly-rat.ngrok-free.app/api/get_scraped_data', {
      method: "GET",
      headers: { "ngrok-skip-browser-warning": "true" },
    }) // Add an header to skip ngrok warning

      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          try {
            alert(data.raw_string);
            const parsed: Product[] = JSON.parse(data.raw_string);
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

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Products From Wholesaler</h1>
      {/* Create a button with some styling using tailwind */}
      <button
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mb-4'
        onClick={() => Navigate("/ungated")}> Start Check On Amazon </button>
      {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

      {products.length === 0 && !error && <p>No products to show.</p>}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        <script>console.log(products);</script>
        {Array.isArray(products) &&
          products.map((product, index) => (
            <div key={index} style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <h2>{product.title}</h2>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>UPC:</strong> {product.upc}</p>
              <p><strong>SKU:</strong> {product.sku}</p>
              <p><strong>ASIN:</strong> {product.asin}</p>
              <p><strong>MOQ:</strong> {product.moq}</p>
              <a href={product.link} target="_blank" rel="noopener noreferrer">View Product</a>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ScrapedView;
