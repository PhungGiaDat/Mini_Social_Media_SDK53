// =========================
// MessageStack.js
// Stack điều hướng cho các màn hình nhắn tin (Messages, ChatList, ChatRoom).
// - Quản lý luồng chuyển đổi giữa danh sách tin nhắn, phòng chat, danh sách chat.
// - Có thể mở rộng thêm các màn hình nhắn tin khác trong tương lai.
// =========================

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MessagesScreen from '../screens/Messages/MessagesScreen';
import ChatRoomScreen from '../screens/Messages/ChatRoomScreen';
import ChatListScreen from '../screens/Messages/ChatListScreen';

const Stack = createStackNavigator();

const MessageStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MessagesMain" component={MessagesScreen} />
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
    </Stack.Navigator>
  );
};

export default MessageStack;
