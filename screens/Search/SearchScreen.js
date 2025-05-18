// =========================
// SearchScreen.js
// Màn hình tìm kiếm cho ứng dụng mạng xã hội.
// - Cho phép tìm kiếm người dùng, bài viết, hiển thị gợi ý.
// - Điều hướng sang ProfileScreen hoặc PostDetailScreen khi bấm vào kết quả.
// - Có thể tích hợp fetch dữ liệu từ API thật.
// =========================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
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

const GRID_SIZE = 3;
const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH / GRID_SIZE;

// Dữ liệu mẫu cho user
const users = [
  { id: '1', name: 'Anna K', username: 'anna_k', avatar: require('../../assets/favicon.png') },
  { id: '2', name: 'Mike Lee', username: 'mike_lee', avatar: require('../../assets/favicon.png') },
  { id: '3', name: 'Joshua L', username: 'joshua_l', avatar: require('../../assets/favicon.png') },
];
// Dữ liệu mẫu cho post
const explorePosts = Array.from({ length: 18 }).map((_, i) => ({
  id: i + 1,
  image: require('../../assets/favicon.png'),
  caption: `Ảnh số ${i + 1}`,
  user: users[i % users.length],
}));

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  
  // Safely get theme colors with fallback
  let colors = defaultColors;
  try {
    const themeResult = useTheme();
    if (themeResult && themeResult.colors) {
      colors = themeResult.colors;
    }
  } catch (error) {
    console.error("Error getting theme in SearchScreen:", error);
  }

  // Mock data for users and posts
  const mockUsers = [
    { id: '1', username: 'user1', avatar: 'https://via.placeholder.com/50' },
    { id: '2', username: 'user2', avatar: 'https://via.placeholder.com/50' },
    { id: '3', username: 'user3', avatar: 'https://via.placeholder.com/50' },
  ];

  const mockPosts = [
    { id: '1', image: 'https://via.placeholder.com/300', caption: 'Post 1' },
    { id: '2', image: 'https://via.placeholder.com/300', caption: 'Post 2' },
    { id: '3', image: 'https://via.placeholder.com/300', caption: 'Post 3' },
  ];

  // Mock fetch functions
  const fetchUsers = (query) => {
    // Simulate API call
    setTimeout(() => {
      const filteredUsers = mockUsers.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setUsers(filteredUsers);
    }, 500);
  };

  const fetchPosts = (query) => {
    // Simulate API call
    setTimeout(() => {
      const filteredPosts = mockPosts.filter(post => 
        post.caption.toLowerCase().includes(query.toLowerCase())
      );
      setPosts(filteredPosts);
    }, 500);
  };

  useEffect(() => {
    if (searchQuery) {
      if (activeTab === 'users') {
        fetchUsers(searchQuery);
      } else {
        fetchPosts(searchQuery);
      }
    } else {
      setUsers([]);
      setPosts([]);
    }
  }, [searchQuery, activeTab]);

  const renderItem = ({ item }) => {
    if (activeTab === 'users') {
      return (
        <TouchableOpacity 
          style={[styles.userItem, { borderBottomColor: colors.border }]} 
          onPress={() => navigation.navigate('ProfileMain', { user: item })}
        >
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Text style={[styles.username, { color: colors.text }]}>{item.username}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity 
          style={[styles.postItem, { borderBottomColor: colors.border }]} 
          onPress={() => navigation.navigate('PostDetail', { post: item })}
        >
          <Image source={{ uri: item.image }} style={styles.postImage} />
          <Text style={[styles.postCaption, { color: colors.text }]}>{item.caption}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text
          }]}
          placeholder="Tìm kiếm"
          placeholderTextColor={colors.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'users' && [styles.activeTab, { borderBottomColor: colors.primary }]
          ]} 
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, { color: colors.text }]}>Người dùng</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'posts' && [styles.activeTab, { borderBottomColor: colors.primary }]
          ]} 
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, { color: colors.text }]}>Bài viết</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={activeTab === 'users' ? users : posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        key={activeTab}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.secondary }]}>
              {searchQuery ? 'Không tìm thấy kết quả' : 'Nhập từ khóa để tìm kiếm'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 10,
    paddingTop: 50,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
  },
  postItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  postCaption: {
    marginTop: 5,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default SearchScreen;