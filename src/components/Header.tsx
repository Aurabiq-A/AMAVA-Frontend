import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import styles from "../pages/Home.module.css";

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <header className={`${styles.header} ${darkMode ? styles.headerDark : styles.headerLight}`}>
      <div className={styles.headerLeft}>
        <button
          onClick={() => navigate("/")}
          className={`${styles.headerBtn} ${darkMode ? styles.headerBtnDark : styles.headerBtnLight}`}
        >
          🏠 Find Products
        </button>
        <button
          onClick={() => navigate("/ungated")}
          className={`${styles.headerBtn} ${darkMode ? styles.headerBtnDark : styles.headerBtnLight}`}
        >
          🔓  Check Un/Gated
        </button>
        <button onClick={() => navigate("/scraped")} className={`${styles.headerBtn} ${darkMode ? styles.headerBtnDark : styles.headerBtnLight}`}>
          🏆 Winning Products
        </button>
        <button onClick={() => navigate("/chat")} className={`${styles.headerBtn} ${darkMode ? styles.headerBtnDark : styles.headerBtnLight}`}>
          💬 Chat
        </button>
        <button onClick={() => navigate("/progress")} className={`${styles.headerBtn} ${darkMode ? styles.headerBtnDark : styles.headerBtnLight}`}>
          📊 Scrapping Progress
        </button>
        <button onClick={() => navigate("/sales")} className={`${styles.headerBtn} ${darkMode ? styles.headerBtnDark : styles.headerBtnLight}`}>
          💰 Sales
        </button>
        <button onClick={() => navigate("/sales-performance")} className={`${styles.headerBtn} ${darkMode ? styles.headerBtnDark : styles.headerBtnLight}`}>
          💨 Performance
        </button>
      </div>

      <div className={styles.headerRight}>
        <button className={styles.themeSwitchBtn}>
          <label className={styles.themeSwitch}>
            <input type="checkbox" className={styles.themeSwitchCheckbox} onClick={toggleDarkMode} />
            <div className={styles.themeSwitchContainer}>
              <div className={styles.themeSwitchClouds}></div>
              <div className={styles.themeSwitchStarsContainer}></div>
              <div className={styles.themeSwitchCircleContainer}>
                <div className={styles.themeSwitchSunMoonContainer}>
                  <div className={styles.themeSwitchMoon}>
                    <div className={styles.themeSwitchSpot}></div>
                    <div className={styles.themeSwitchSpot}></div>
                    <div className={styles.themeSwitchSpot}></div>
                  </div>
                </div>
              </div>
            </div>
          </label>
        </button>

        <button aria-label="User Profile" className={styles.headerUserBtn}>
          <UserCircleIcon className={styles.headerUserIcon} />
        </button>
      </div>
    </header>
  );
};

export default Header;
