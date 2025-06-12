import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-200 dark:bg-gray-700 p-4">
      <h2 className="text-xl font-semibold mb-4">Navigation</h2>
      <div className="flex flex-col space-y-2">
        <button className="w-full p-2 text-left bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 rounded">
          Find Products
        </button>
        <button className="w-full p-2 text-left bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 rounded">
          Check Un/Gated
        </button>
        <button className="w-full p-2 text-left bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 rounded">
          Winning Products
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;