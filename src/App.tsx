import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import ScrapedView from "./pages/ScrapedView";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ScreenshotListener from "./pages/Progress";
import "./App.css"; 
import CheckOnAmz from "./pages/un_gated";
// Ensure you have your CSS file imported

function AppContent() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 flex
      ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 px-4 py-6 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scraped" element={<ScrapedView />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/progress" element={<ScreenshotListener />} />
            <Route path="/ungated" element={<CheckOnAmz/>} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;