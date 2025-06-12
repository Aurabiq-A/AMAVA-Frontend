import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-800 dark:text-white transition-colors duration-300 flex">
          <Sidebar />
          <div className="flex-1">
            <Header />
            <main className="px-4 py-6">
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;