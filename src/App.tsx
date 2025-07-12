import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import ScrapedView from "./pages/ScrapedView";
import Header from "./components/Header";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ScreenshotListener from "./pages/Progress";
import "./App.css";
import CheckOnAmz from "./pages/un_gated";
import styles from "./pages/Home.module.css"; // Use your CSS module
import SalesTable from "./pages/Sales";
import SalesMetricsPage from "./pages/SalesPerformance";
function AppContent() {
  const { darkMode } = useTheme();

  return (
    <div className={`${styles.appRoot} ${darkMode ? styles.dark : styles.light}`}>
      <Header />
      <div className={styles.mainContent}>
        <main className={styles.mainArea}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scraped" element={<ScrapedView />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/progress" element={<ScreenshotListener />} />
            <Route path="/ungated" element={<CheckOnAmz />} />
            <Route path="/sales" element={<SalesTable />} />
            <Route path="/sales-performance" element={<SalesMetricsPage />} />
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