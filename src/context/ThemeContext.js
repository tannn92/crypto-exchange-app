import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { lightTheme, darkTheme } from '../theme/colors';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
    
    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      handleSystemThemeChange(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        // User has a saved preference, use it
        setIsDarkMode(savedTheme === 'dark');
      } else {
        // No saved preference, detect system theme
        const systemColorScheme = Appearance.getColorScheme();
        setIsDarkMode(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      // Fallback to system theme if error occurs
      const systemColorScheme = Appearance.getColorScheme();
      setIsDarkMode(systemColorScheme === 'dark');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemThemeChange = async (colorScheme) => {
    try {
      // Only auto-update if user hasn't manually set a preference
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === null) {
        // No manual preference saved, follow system theme
        setIsDarkMode(colorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error handling system theme change:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};
