import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
// import { messageApi } from '../../services/api';

// Fallback colors to prevent errors
const defaultColors = {
  background: '#fff',
  text: '#222',
  primary: '#0095f6',
  secondary: '#fbbf24',
  border: '#eee',
  card: '#fafafa',
};

// =========================
// MOCK DATA & CHÚ THÍCH:
// Đoạn này dùng dữ liệu mẫu để test UI khi chưa có backend/API thực tế.
// Khi muốn dùng API thật, hãy bỏ comment import messageApi và thay fetchConversations bằng gọi API.
// =========================
const mockConversations = [
  { id: '1', name: 'Anna', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', lastMessage: 'Hi there!', time: '10:00', isRead: false },
  { id: '2', name: 'Mike', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', lastMessage: 'How are you?', time: '09:30', isRead: true },
  { id: '3', name: 'Lisa', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', lastMessage: 'See you soon!', time: 'Yesterday', isRead: false },
];

const MessagesScreen = () => {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Safely get theme colors with fallback
  let colors = defaultColors;
  try {
    const themeResult = useTheme();
    if (themeResult && themeResult.colors) {
      colors = themeResult.colors;
    }
  } catch (error) {
    console.error("Error getting theme in MessagesScreen:", error);
  }

  // =========================
  // Khi mount component, gọi fetchConversations để lấy dữ liệu (mock hoặc API)
  // =========================
  useEffect(() => {
    fetchConversations();
  }, []);

  // =========================
  // Hàm lấy danh sách cuộc trò chuyện (mock)
  // Nếu dùng API thật, thay bằng gọi messageApi.getConversations()
  // =========================
  const fetchConversations = async () => {
    setLoading(true);
    setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
      setError(null);
    }, 500);
  };

  // =========================
  // Lọc danh sách theo search
  // =========================
  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // =========================
  // Xóa một cuộc trò chuyện khỏi danh sách (mock)
  // =========================
  const handleDeleteConversation = async (id) => {
    setConversations(conversations.filter(conversation => conversation.id !== id));
  };

  // =========================
  // Đánh dấu đã đọc/chưa đọc (mock)
  // =========================
  const handleMarkAsRead = async (id) => {
    setConversations(conversations.map(conversation =>
      conversation.id === id ? { ...conversation, isRead: !conversation.isRead } : conversation
    ));
  };

  // =========================
  // Render từng item trong danh sách
  // =========================
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.conversationItem, { borderBottomColor: colors.border }]} 
      onPress={() => navigation.navigate('ChatRoom', { conversation: item })}
    >
      <Image source={{ uri: item.avatar }} style={[styles.avatar, { borderColor: colors.border }]} />
      <View style={[styles.conversationInfo, { borderBottomColor: colors.border }]}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.lastMessage, { color: colors.secondary }]}>{item.lastMessage}</Text>
      </View>
      <Text style={[styles.time, { color: colors.secondary }]}>{item.time}</Text>
      <TouchableOpacity onPress={() => handleMarkAsRead(item.id)} style={[styles.markButton, { borderColor: colors.primary }]}>
        <Text style={[styles.markButtonText, { color: colors.primary }]}>{item.isRead ? 'Mark as Unread' : 'Mark as Read'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteConversation(item.id)} style={[styles.deleteButton, { borderColor: colors.primary }]}>
        <Text style={[styles.deleteButtonText, { color: colors.primary }]}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // =========================
  // UI loading/error/main
  // =========================
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity onPress={fetchConversations} style={[styles.retryButton, { backgroundColor: colors.primary }]}>
            <Text style={[styles.retryButtonText, { color: colors.text }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // =========================
  // UI chính
  // =========================
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
      </View>
      <TextInput
        style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder="Search conversations..."
        placeholderTextColor={colors.secondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredConversations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={fetchConversations}
      />
    </SafeAreaView>
  );
};

// =========================
// Styles cho màn hình Messages
// =========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    paddingTop: 40,
    borderBottomWidth: 1,
    // borderBottomColor: '#eee',
    // backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    // color: colors.text,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    margin: 10,
    // backgroundColor: '#fff',
    // color: '#000',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    // color: colors.text,
  },
  lastMessage: {
    fontSize: 14,
    // color: colors.secondary,
  },
  time: {
    fontSize: 12,
    // color: colors.secondary,
  },
  markButton: {
    marginLeft: 10,
  },
  // markButtonText: { color: colors.primary },
  deleteButton: {
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'red',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MessagesScreen; 