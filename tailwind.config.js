/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <-- important for class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
