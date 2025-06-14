import { useEffect, useState } from 'react';

function ScrapedView() {
  const [rawData, setRawData] = useState('');
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5137/api/get_scraped_data')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setRawData(data.raw_string);
          setItemCount(data.items_count);
        }
      })
      .catch(err => console.error("Fetch failed:", err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Scraped Data Viewer</h1>
      <p><strong>Item Count:</strong> {itemCount}</p>
      <pre style={{ backgroundColor: '#f0f0f0', padding: '1rem' }}>{rawData}</pre>
    </div>
  );
}

export default ScrapedView;
