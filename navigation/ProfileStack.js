// =========================
// ProfileStack.js
// Stack điều hướng cho các màn hình hồ sơ cá nhân (Profile, EditProfile, FriendList).
// - Quản lý luồng chuyển đổi giữa các màn hình liên quan đến hồ sơ.
// - Có thể mở rộng thêm các màn hình profile khác trong tương lai.
// =========================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import FriendListScreen from '../screens/Profile/FriendListScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="FriendList" component={FriendListScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;