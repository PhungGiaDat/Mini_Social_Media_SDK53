// =========================
// HomeScreen.js
// Màn hình trang chủ (feed) cho ứng dụng mạng xã hội.
// - Hiển thị danh sách bài đăng, story bar, các icon tương tác.
// - Điều hướng sang PostDetailScreen, CreatePostScreen, ProfileScreen...
// - Có thể tích hợp fetch dữ liệu từ API thật.
// =========================

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
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

// Dữ liệu mẫu cho story
const stories = [
  { id: 1, name: 'User1', image: require('../../assets/favicon.png') },
  { id: 2, name: 'User2', image: require('../../assets/favicon.png') },
  { id: 3, name: 'User3', image: require('../../assets/favicon.png') },
  { id: 4, name: 'User4', image: require('../../assets/favicon.png') },
  { id: 5, name: 'User5', image: require('../../assets/favicon.png') },
  { id: 6, name: 'User6', image: require('../../assets/favicon.png') },
];

// Dữ liệu mẫu cho post
const posts = [
  {
    id: 1,
    user: 'joshua_l',
    location: 'Tokyo, Japan',
    avatar: require('../../assets/favicon.png'),
    image: require('../../assets/favicon.png'),
    likes: 123,
    caption: 'The game in Japan was amazing and I want to share some photos',
    date: 'September 19',
  },
  {
    id: 2,
    user: 'anna_k',
    location: 'Seoul, Korea',
    avatar: require('../../assets/favicon.png'),
    image: require('../../assets/favicon.png'),
    likes: 98,
    caption: 'Enjoying the cherry blossoms!',
    date: 'September 20',
  },
];

const HomeScreen = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  
  // Safely get theme colors with fallback
  let colors = defaultColors;
  try {
    const themeResult = useTheme();
    if (themeResult && themeResult.colors) {
      colors = themeResult.colors;
    }
  } catch (error) {
    console.error("Error getting theme in HomeScreen:", error);
  }

  const handleLike = (postId) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  // Render story item
  const renderStory = ({ item }) => (
    <View style={styles.storyItem}>
      <TouchableOpacity>
        <View style={[styles.storyBorder, { borderColor: colors.primary }] }>
          <Image source={item.image} style={styles.storyImage} />
        </View>
      </TouchableOpacity>
      <Text style={[styles.storyName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
    </View>
  );

  // Render post item
  const renderPost = ({ item }) => (
    <View style={[styles.postContainer, { backgroundColor: colors.background }] }>
      {/* User info */}
      <View style={styles.userInfo}>
        <Image source={item.avatar} style={styles.userAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.userName, { color: colors.text }]}>{item.user}</Text>
          <Text style={[styles.userLocation, { color: colors.text }]}>{item.location}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={22} color={colors.text} />
      </View>
      {/* Post image */}
      <Image source={item.image} style={styles.postImage} />
      {/* Action icons */}
      <View style={styles.actionRow}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => handleLike(item.id)}>
            <Ionicons
              name={likedPosts.includes(item.id) ? 'heart' : 'heart-outline'}
              size={28}
              color={likedPosts.includes(item.id) ? 'red' : colors.text}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={26} color={colors.text} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="paper-plane-outline" size={26} color={colors.text} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>
      {/* Likes */}
      <Text style={[styles.likes, { color: colors.text }]}>{item.likes + (likedPosts.includes(item.id) ? 1 : 0)} likes</Text>
      {/* Caption */}
      <Text style={[styles.caption, { color: colors.text }]}><Text style={styles.userName}>{item.user} </Text>{item.caption}</Text>
      {/* Date */}
      <Text style={[styles.postDate, { color: colors.text }]}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }] }>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }] }>
        <Text style={[styles.headerText, { color: colors.text }]}>Fine</Text>
      </View>
      {/* Story bar */}
      <View style={[styles.storyContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }] }>
        <FlatList
          data={stories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderStory}
        />
      </View>
      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 30 }} />}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'left',
  },
  storyContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  storyItem: {
    width: 70,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  storyBorder: {
    borderWidth: 2,
    borderRadius: 40,
    padding: 2,
  },
  storyImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  storyName: {
    fontSize: 12,
    marginTop: 4,
    maxWidth: 60,
    textAlign: 'center',
  },
  postContainer: {
    marginBottom: 18,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  userLocation: {
    fontSize: 12,
    marginTop: 2,
  },
  postImage: {
    width: '100%',
    height: 375,
    resizeMode: 'cover',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 16,
  },
  likes: {
    fontWeight: 'bold',
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  caption: {
    paddingHorizontal: 12,
    marginBottom: 4,
    lineHeight: 20,
  },
  postDate: {
    fontSize: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
});
// Trang chủ Feed