// =========================
// AppNavigator.js
// Điều hướng tổng cho ứng dụng mạng xã hội.
// - Kiểm tra trạng thái đăng nhập (user) để điều hướng vào AuthStack (login/register) hoặc MainTabs (giao diện chính).
// - Có thể mở rộng thêm các điều kiện điều hướng khác trong tương lai.
// =========================

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';

// Import các màn hình
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import PostStack from './PostStack';
import NotificationScreen from '../screens/Home/NotificationScreen';
import MessageStack from './MessageStack';
import ProfileStack from './ProfileStack';
import MainTabs from './MainTabs';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const UserStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingScreen} />
    <Stack.Screen name="PostStack" component={PostStack} />
    <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    <Stack.Screen name="MessageStack" component={MessageStack} />
    <Stack.Screen name="SettingScreen" component={SettingScreen} />
    <Stack.Screen name="ProfileStack" component={ProfileStack} />
    <Stack.Screen name="MainTabs" component={MainTabs} />
  </Stack.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return null; // hoặc một màn hình loading
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          role === 'admin' ? (
            <Stack.Screen name="AdminStack" component={AdminStack} />
          ) : (
            <Stack.Screen name="UserStack" component={UserStack} />
          )
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
// // MainTabs.js
// import React from 'react';