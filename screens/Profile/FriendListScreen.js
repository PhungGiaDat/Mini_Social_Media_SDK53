// =========================
// FriendListScreen.js
// Màn hình hiển thị danh sách bạn bè/người theo dõi.
// - Hiển thị danh sách người dùng với avatar và thông tin cơ bản.
// - Có thể thêm/xóa bạn bè hoặc theo dõi/bỏ theo dõi.
// =========================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
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

const FriendListScreen = ({ navigation, route }) => {
  const { type, title } = route.params;
  
  // Safely get theme colors with fallback
  let colors = defaultColors;
  try {
    const themeResult = useTheme();
    if (themeResult && themeResult.colors) {
      colors = themeResult.colors;
    }
  } catch (error) {
    console.error("Error getting theme in FriendListScreen:", error);
  }

  // Mock data - sẽ được thay thế bằng API call
  const friends = [
    {
      id: '1',
      username: 'john_doe',
      name: 'John Doe',
      avatar: require('../../assets/favicon.png'),
      isFollowing: true,
    },
    {
      id: '2',
      username: 'jane_smith',
      name: 'Jane Smith',
      avatar: require('../../assets/favicon.png'),
      isFollowing: false,
    },
    // Thêm mock data khác nếu cần
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.friendItem, { borderBottomColor: colors.border }]}
      onPress={() => navigation.navigate('Profile', { userId: item.id })}
    >
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={[styles.username, { color: colors.text }]}>{item.username}</Text>
        <Text style={[styles.name, { color: colors.secondary }]}>{item.name}</Text>
      </View>
      <TouchableOpacity 
        style={[
          styles.followButton,
          { 
            backgroundColor: item.isFollowing ? colors.card : colors.primary,
            borderColor: colors.border
          }
        ]}
      >
        <Text style={[
          styles.followButtonText,
          { color: item.isFollowing ? colors.text : '#fff' }
        ]}>
          {item.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* List */}
      <FlatList
        data={friends}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 15,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 1,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FriendListScreen;