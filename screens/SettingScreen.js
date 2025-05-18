// =========================
// SettingScreen.js
// Màn hình cài đặt cho ứng dụng mạng xã hội.
// - Cho phép người dùng chuyển đổi giữa chế độ sáng/tối (dark mode).
// - Có thể mở rộng thêm các cài đặt khác trong tương lai.
// =========================

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';

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
  const navigation = useNavigation();
  const { colors, theme, toggleTheme } = useTheme();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigation sẽ tự động chuyển về màn hình đăng nhập
              // vì MainTabs đã được cấu hình để kiểm tra userToken
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Cài đặt</Text>

      {/* Dark Mode Toggle */}
      <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
        <Icon name={theme === 'dark' ? 'moon' : 'sunny-outline'} size={24} color={colors.text} />
        <Text style={[styles.settingText, { color: colors.text }]}>Chế độ tối</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={theme === 'dark' ? '#fff' : '#f4f3f4'}
        />
      </View>

      {/* Các tùy chọn cài đặt khác */}
      <TouchableOpacity
        style={[styles.settingItem, { borderBottomColor: colors.border }]}
        onPress={() => navigation.navigate('Profile')}
      >
        <Icon name="person-outline" size={24} color={colors.text} />
        <Text style={[styles.settingText, { color: colors.text }]}>Thông tin cá nhân</Text>
        <Icon name="chevron-forward" size={24} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.settingItem, { borderBottomColor: colors.border }]}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Icon name="notifications-outline" size={24} color={colors.text} />
        <Text style={[styles.settingText, { color: colors.text }]}>Thông báo</Text>
        <Icon name="chevron-forward" size={24} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.settingItem, { borderBottomColor: colors.border }]}
        onPress={() => navigation.navigate('Privacy')}
      >
        <Icon name="shield-outline" size={24} color={colors.text} />
        <Text style={[styles.settingText, { color: colors.text }]}>Quyền riêng tư</Text>
        <Icon name="chevron-forward" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Nút đăng xuất */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.error }]}
        onPress={handleLogout}
      >
        <Icon name="log-out-outline" size={24} color={colors.text} />
        <Text style={[styles.logoutText, { color: colors.text }]}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default SettingScreen; 