import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';

// Định nghĩa màu cho từng theme
const lightColors = {
  background: '#fff',
  text: '#222',
  primary: '#0095f6',
  secondary: '#fbbf24',
  border: '#eee',
  card: '#fafafa',
};
const darkColors = {
  background: '#181818',
  text: '#fff',
  primary: '#0095f6',
  secondary: '#fbbf24',
  border: '#333',
  card: '#222',
};

// Fallback colors in case of errors
const defaultColors = {
  background: '#fff',
  text: '#222',
  primary: '#0095f6',
  secondary: '#fbbf24',
  border: '#eee',
  card: '#fafafa',
};

// Create context with default values to prevent null reference errors
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  colors: defaultColors
});

export function ThemeProvider({ children }) {
  // Lấy theme mặc định từ hệ điều hành
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState(systemScheme || 'light');

  // Hàm chuyển đổi theme
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  // Object màu sắc theo theme
  const colors = useMemo(() => (theme === 'dark' ? darkColors : lightColors), [theme]);

  // Create the context value
  const contextValue = useMemo(() => ({
    theme, 
    toggleTheme, 
    colors
  }), [theme, colors]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  try {
    const context = useContext(ThemeContext);
    if (!context) {
      console.warn('useTheme must be used within a ThemeProvider');
      return { theme: 'light', toggleTheme: () => {}, colors: defaultColors };
    }
    return context;
  } catch (error) {
    console.error('Error in useTheme:', error);
    return { theme: 'light', toggleTheme: () => {}, colors: defaultColors };
  }
}