// =========================
// AppNavigator.js
// Điều hướng tổng cho ứng dụng mạng xã hội.
// - Kiểm tra trạng thái đăng nhập (user) để điều hướng vào AuthStack (login/register) hoặc MainTabs (giao diện chính).
// - Có thể mở rộng thêm các điều kiện điều hướng khác trong tương lai.
// =========================

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
// // MainTabs.js
// import React from 'react';