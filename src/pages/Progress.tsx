import React, { useEffect, useState } from "react";

const ScreenshotListener: React.FC = () => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    let interval: number;

    // Poll the endpoint every 2 seconds for a new screenshot
    const fetchScreenshot = async () => {
      try {
        const res = await fetch("http://localhost:51483/get-screenshot", {
        method: "GET",
        headers: { "ngrok-skip-browser-warning": "true", },
      });
        if (res.ok) {
          const blob = await res.blob();
          // Only update if it's an image
          if (blob.type.startsWith("image/")) {
            setImgSrc(URL.createObjectURL(blob));
          }
        }
      } catch {
        setImgSrc(null);
      }
    };

    fetchScreenshot();
    interval = setInterval(fetchScreenshot, 200);

    return () => {
      clearInterval(interval);
      // Clean up object URL
      if (imgSrc) URL.revokeObjectURL(imgSrc);
    };
    // eslint-disable-next-line 
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
        Live Screenshot Listener
      </h2>
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="Live Screenshot"
          className="rounded-2xl shadow-lg max-w-full max-h-[70vh] border border-gray-300 dark:border-gray-700"
        />
      ) : (
        <div className="text-gray-500 dark:text-gray-400">No screenshot available.</div>
      )}
    </div>
  );
};

export default ScreenshotListener;
