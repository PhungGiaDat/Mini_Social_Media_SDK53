// =========================
// SettingScreen.js
// Màn hình cài đặt cho ứng dụng mạng xã hội.
// - Cho phép người dùng chuyển đổi giữa chế độ sáng/tối (dark mode).
// - Có thể mở rộng thêm các cài đặt khác trong tương lai.
// =========================

import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

// Fallback colors and theme functions
const defaultColors = {
  background: '#fff',
  text: '#222',
  primary: '#0095f6',
  secondary: '#fbbf24',
  border: '#eee',
  card: '#fafafa',
};

const SettingScreen = () => {
  // Safely get theme with fallback
  let theme = 'light';
  let colors = defaultColors;
  let toggleTheme = () => console.log('Theme toggle not available');
  
  try {
    const themeContext = useTheme();
    if (themeContext) {
      theme = themeContext.theme || 'light';
      colors = themeContext.colors || defaultColors;
      toggleTheme = themeContext.toggleTheme || (() => console.log('Theme toggle not available'));
    }
  } catch (error) {
    console.error("Error getting theme in SettingScreen:", error);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.title, { color: colors.text }]}>Cài đặt</Text>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Chế độ tối</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          thumbColor={theme === 'dark' ? colors.primary : '#ccc'}
          trackColor={{ false: '#ccc', true: colors.primary }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
  },
});

export default SettingScreen; 