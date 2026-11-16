/**
 * Theme Context for ParkVolt
 * Supports 'light', 'dark', and 'auto' (which follows device theme live).
 * Saves choice in localStorage and dynamically sets data-theme on document.documentElement.
 */
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Read saved theme preference or default to 'auto'
  const [themePreference, setThemePreference] = useState(() => {
    return localStorage.getItem("parkvolt_theme_pref") || "auto";
  });

  // System dark preference detected live
  const [systemIsDark, setSystemIsDark] = useState(() => {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Listen to live system dark mode changes
  useEffect(() => {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setSystemIsDark(e.matches);

    // Modern and fallback listener syntax
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, []);

  // Compute active theme: 'light' or 'dark'
  const activeTheme =
    themePreference === "auto" ? (systemIsDark ? "dark" : "light") : themePreference;

  // Apply to documentElement so CSS variables and 3D scenes respond immediately
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeTheme);
    localStorage.setItem("parkvolt_theme_pref", themePreference);
  }, [activeTheme, themePreference]);

  const changeTheme = (newPref) => {
    setThemePreference(newPref);
  };

  return (
    <ThemeContext.Provider
      value={{
        themePreference,
        activeTheme,
        isDark: activeTheme === "dark",
        changeTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
