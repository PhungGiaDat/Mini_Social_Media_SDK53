// =========================
// NotificationScreen.js
// Màn hình thông báo cho ứng dụng mạng xã hội.
// - Hiển thị danh sách thông báo, avatar, nội dung, thời gian.
// - Có thể điều hướng sang các màn hình liên quan khi bấm vào thông báo.
// - Có thể tích hợp fetch dữ liệu từ API thật.
// =========================

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';

// Fallback colors to prevent errors
const defaultColors = {
  background: '#fff',
  text: '#222',
  primary: '#0095f6',
  secondary: '#fbbf24',
  border: '#eee',
  card: '#fafafa',
};

// Dữ liệu mẫu cho thông báo
const notifications = [
  {
    id: '1',
    type: 'like',
    user: 'anna_k',
    avatar: require('../../assets/favicon.png'),
    content: 'đã thích ảnh của bạn.',
    image: require('../../assets/favicon.png'),
    time: '2 phút trước',
  },
  {
    id: '2',
    type: 'comment',
    user: 'joshua_l',
    avatar: require('../../assets/favicon.png'),
    content: 'đã bình luận: "Tuyệt vời!"',
    image: require('../../assets/favicon.png'),
    time: '10 phút trước',
  },
  {
    id: '3',
    type: 'follow',
    user: 'mike_lee',
    avatar: require('../../assets/favicon.png'),
    content: 'đã bắt đầu theo dõi bạn.',
    image: null,
    time: '1 ngày trước',
  },
];

const NotificationScreen = () => {
  // Safely get theme colors with fallback
  let colors = defaultColors;
  try {
    const themeResult = useTheme();
    if (themeResult && themeResult.colors) {
      colors = themeResult.colors;
    }
  } catch (error) {
    console.error("Error getting theme in NotificationScreen:", error);
  }
  
  // Render từng item thông báo
  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }] }>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={[styles.text, { color: colors.text }]}><Text style={styles.userName}>{item.user} </Text>{item.content}</Text>
        <Text style={[styles.time, { color: colors.text }]}>{item.time}</Text>
      </View>
      {item.type === 'follow' ? (
        <Ionicons name="person-add-outline" size={32} color={colors.text} style={styles.rightIcon} />
      ) : (
        <Image source={item.image} style={styles.rightImage} />
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }] }>
        <Text style={[styles.headerText, { color: colors.text }]}>Thông báo</Text>
      </View>
      {/* Danh sách thông báo */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 36,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  text: {
    fontSize: 15,
  },
  time: {
    fontSize: 12,
    marginTop: 2,
  },
  rightImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginLeft: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
});

export default NotificationScreen;