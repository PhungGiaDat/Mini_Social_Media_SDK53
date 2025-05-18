// =========================
// ProfileScreen.js
// Màn hình hồ sơ cá nhân cho ứng dụng mạng xã hội.
// - Hiển thị avatar, tên, username, bio, stats, lưới ảnh post.
// - Điều hướng sang EditProfileScreen, FriendListScreen, PostDetailScreen...
// - Có thể tích hợp fetch dữ liệu từ API thật.
// =========================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, ScrollView, SafeAreaView } from 'react-native';
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

const AVATAR = require('../../assets/favicon.png');
const GRID_SIZE = 3;
const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH / GRID_SIZE;

// Dữ liệu động (có thể lấy từ props, context, API...)
const defaultUser = {
  name: '',
  username: '',
  bio: '',
  avatar: AVATAR,
  posts: 0,
  followers: 0,
  following: 0,
};

const ProfileScreen = ({ navigation, user = defaultUser, posts = [] }) => {
  const [selectedTab, setSelectedTab] = useState('Posts');
  
  // Safely get theme colors with fallback
  let colors = defaultColors;
  try {
    const themeResult = useTheme();
    if (themeResult && themeResult.colors) {
      colors = themeResult.colors;
    }
  } catch (error) {
    console.error("Error getting theme in ProfileScreen:", error);
  }

  const renderGridItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItem} activeOpacity={0.8}>
      <Image source={item.image || AVATAR} style={styles.gridImage} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{user.username}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="menu-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar + Stats */}
        <View style={styles.infoRow}>
          <Image source={user.avatar || AVATAR} style={[styles.avatar, { borderColor: colors.border }]} />
          <View style={[styles.statsRow, { borderColor: colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{user.posts}</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Bài viết</Text>
            </View>
            <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('FriendList', { type: 'followers' })}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{user.followers}</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Follower</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('FriendList', { type: 'following' })}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{user.following}</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Name + Bio */}
        <View style={[styles.bioSection, { borderColor: colors.border }]}>
          <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.bio, { color: colors.text }]}>{user.bio}</Text>
        </View>
        {/* Edit Profile Button */}
        <View style={[styles.editBtn, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={[styles.editBtnText, { color: colors.text }]}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </View>
        {/* Tabs (Posts) */}
        <View style={[styles.tabRow, { borderBottomColor: colors.border }]}>
          <TouchableOpacity style={[styles.tabItem, selectedTab === 'Posts' && { borderBottomColor: colors.primary }]} onPress={() => setSelectedTab('Posts')}>
            <Ionicons name="grid" size={22} color={selectedTab === 'Posts' ? colors.primary : colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, selectedTab === 'Tagged' && { borderBottomColor: colors.primary }]} onPress={() => setSelectedTab('Tagged')}>
            <Ionicons name="person" size={22} color={selectedTab === 'Tagged' ? colors.primary : colors.text} />
          </TouchableOpacity>
        </View>
        {/* Grid Posts */}
        {selectedTab === 'Posts' && (
          <FlatList
            data={posts}
            renderItem={renderGridItem}
            keyExtractor={item => item.id?.toString() || Math.random().toString()}
            numColumns={GRID_SIZE}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
        {selectedTab === 'Tagged' && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#888' }}>Chưa có bài viết được gắn thẻ.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

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
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    marginRight: 24,
    borderWidth: 1.5,
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  statLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  bioSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  bio: {
    fontSize: 14,
    marginTop: 2,
    lineHeight: 18,
  },
  editBtn: {
    marginHorizontal: 16,
    marginBottom: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editBtnText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  tabRow: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    marginBottom: 2,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  gridItem: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
});