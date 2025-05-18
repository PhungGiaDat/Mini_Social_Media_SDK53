// =========================
// MainTabs.js
// Điều hướng tab chính cho ứng dụng mạng xã hội.
// - Quản lý các tab: Home, Search, AddPost, Notifications, Profile, Messages, Settings...
// - Có thể mở rộng thêm tab mới hoặc tuỳ chỉnh icon/tab bar.
// =========================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import các màn hình
import HomeScreen from '../screens/Home/HomeScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import PostStack from './PostStack';
import NotificationScreen from '../screens/Home/NotificationScreen';
import ProfileStack from './ProfileStack';
import MessageStack from './MessageStack';
import SettingScreen from '../screens/SettingScreen';
import FirebaseDemoScreen from '../screens/FirebaseDemoScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

// Khởi tạo Bottom Tab Navigator và Stack Navigator
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Auth Stack Navigator
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// MainTabs component
const MainTabs = ({ user }) => {
  if (!user) {
    return <AuthStack />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Custom icon cho từng tab
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Thiết lập icon theo từng route
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'AddPost') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Firebase') {
            iconName = focused ? 'flame' : 'flame-outline';
          }

          // Trả về icon tương ứng
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0095f6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      {/* Các tab screen */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="AddPost" component={PostStack} />
      <Tab.Screen name="Firebase" component={FirebaseDemoScreen} options={{ title: 'Firebase' }} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Messages" component={MessageStack} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
