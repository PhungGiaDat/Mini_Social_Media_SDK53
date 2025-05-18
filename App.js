import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import MainTabs from './navigation/MainTabs';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <MainTabs />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}