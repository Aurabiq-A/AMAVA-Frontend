import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import ScrapedView from "./pages/ScrapedView";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ScreenshotListener from "./pages/Progress";
import "./App.css";
import CheckOnAmz from "./pages/un_gated";
import styles from "./pages/Home.module.css"; // Use your CSS module

function AppContent() {
  const { darkMode } = useTheme();

  return (
    <div className={`${styles.appRoot} ${darkMode ? styles.dark : styles.light}`}>
      <Sidebar />
      <div className={styles.mainContent}>
        <main className={styles.mainArea}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scraped" element={<ScrapedView />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/progress-s" element={<ScreenshotListener />} />
            <Route path="/ungated" element={<CheckOnAmz />} />
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