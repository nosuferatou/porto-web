"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { usePathname } from "next/navigation";

export type Theme = "dark" | "day";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isAdmin: boolean;
}

const STORAGE_KEY = "theme_preference";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    return () => {
      if (transitionTimeout.current !== undefined) {
        window.clearTimeout(transitionTimeout.current);
      }
    };
  }, []);

  // Read the preference after hydration; the root head script sets the first paint.
  useEffect(() => {
    let initialTheme: Theme = "dark";
    try {
      initialTheme = localStorage.getItem(STORAGE_KEY) === "day" ? "day" : "dark";
    } catch {
      // Keep the default when storage is inaccessible.
    }

    setThemeState(initialTheme);
    setMounted(true);
  }, []);

  // Sync data-theme attribute with state and route
  useEffect(() => {
    if (!mounted) return;

    if (isAdmin) {
      // Admin routes are strictly locked to Dark Mode
      document.documentElement.removeAttribute("data-theme");
      return;
    }

    if (theme === "day") {
      document.documentElement.setAttribute("data-theme", "day");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme, isAdmin, mounted]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (isAdmin) return;

      document.documentElement.classList.add("theme-transitioning");
      setThemeState(newTheme);
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch {
        // Storage write failed.
      }

      if (transitionTimeout.current !== undefined) {
        window.clearTimeout(transitionTimeout.current);
      }
      transitionTimeout.current = window.setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 400);
    },
    [isAdmin]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "day" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isAdmin }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    // Graceful fallback for components rendered outside provider
    return {
      theme: "dark",
      toggleTheme: () => {},
      setTheme: () => {},
      isAdmin: false,
    };
  }
  return context;
}
