// ChatRoomScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
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
// Khi muốn dùng API thật, hãy bỏ comment import messageApi và thay fetchMessages, handleSend, handleImagePick, handleDeleteMessage bằng gọi API.
// =========================
const mockMessages = [
  { id: '1', text: 'Hello!', sender: 'me', type: 'text' },
  { id: '2', text: 'Hi, how are you?', sender: 'them', type: 'text' },
  { id: '3', image: 'https://placekitten.com/200/200', sender: 'me', type: 'image' },
];

const ChatRoomScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { conversation } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const flatListRef = useRef();
  
  // Safely get theme colors with fallback
  let colors = defaultColors;
  try {
    const themeResult = useTheme();
    if (themeResult && themeResult.colors) {
      colors = themeResult.colors;
    }
  } catch (error) {
    console.error("Error getting theme in ChatRoomScreen:", error);
  }

  // =========================
  // Khi mount component, gọi fetchMessages để lấy dữ liệu (mock hoặc API)
  // =========================
  useEffect(() => {
    fetchMessages();
  }, [conversation?.id]);

  // =========================
  // Hàm lấy tin nhắn (mock)
  // Nếu dùng API thật, thay bằng gọi messageApi.getMessages(conversation.id)
  // =========================
  const fetchMessages = async () => {
    setLoading(true);
    setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
      setError(null);
    }, 500);
  };

  // =========================
  // Gửi tin nhắn mới (mock)
  // Nếu dùng API thật, thay bằng gọi messageApi.sendMessage
  // =========================
  const handleSend = async () => {
    if (inputText.trim() === '') return;
    setSending(true);
    setTimeout(() => {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        sender: 'me',
        type: 'text',
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      setSending(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, 300);
  };

  // =========================
  // Gửi ảnh (mock)
  // Nếu dùng API thật, thay bằng gọi messageApi.sendImage
  // =========================
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setSending(true);
      setTimeout(() => {
        const newMessage = {
          id: Date.now().toString(),
          image: result.assets[0].uri,
          sender: 'me',
          type: 'image',
        };
        setMessages([...messages, newMessage]);
        setSending(false);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }, 300);
    }
  };

  // =========================
  // Xóa tin nhắn (mock)
  // Nếu dùng API thật, thay bằng gọi messageApi.deleteMessage
  // =========================
  const handleDeleteMessage = async (id) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  // =========================
  // Render từng tin nhắn
  // =========================
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.myMessage : styles.theirMessage,
      ]}
    >
      {item.type === 'image' ? (
        <Image source={{ uri: item.image }} style={styles.messageImage} />
      ) : (
        <Text style={[styles.messageText, { color: colors.text }]}>{item.text}</Text>
      )}
      <TouchableOpacity onPress={() => handleDeleteMessage(item.id)} style={styles.deleteButton}>
        <Text style={[styles.deleteButtonText, { color: colors.primary }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  // =========================
  // UI loading/error/main
  // =========================
  if (loading) {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.primary }]}>Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{conversation?.name || 'Chat'}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (error) {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.primary }]}>Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{conversation?.name || 'Chat'}</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity onPress={fetchMessages} style={[styles.retryButton, { backgroundColor: colors.primary }]}>
            <Text style={[styles.retryButtonText, { color: colors.primary }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // =========================
  // UI chính
  // =========================
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{conversation?.name || 'Chat'}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
          placeholder="Type a message..."
          placeholderTextColor={colors.secondary}
          value={inputText}
          onChangeText={setInputText}
          editable={!sending}
        />
        <TouchableOpacity onPress={handleImagePick} style={styles.imageButton} disabled={sending}>
          <Text style={[styles.imageButtonText, { color: colors.primary }]}>Image</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={sending}>
          <Text style={[styles.sendText, { color: colors.primary }]}>{sending ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// =========================
// Styles cho màn hình ChatRoom
// =========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  // backButtonText: { color: colors.primary },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // color: colors.text,
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 16,
    maxWidth: '75%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    // backgroundColor: colors.primary + '22',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    // backgroundColor: colors.card,
  },
  messageText: {
    fontSize: 16,
    // color: colors.text,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    // borderTopColor: colors.border,
    // backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    borderRadius: 20,
    // backgroundColor: '#f2f2f2',
  },
  imageButton: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  // imageButtonText: { color: colors.primary },
  sendButton: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  // sendText: { color: colors.primary },
  deleteButton: {
    marginTop: 5,
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

export default ChatRoomScreen;
// Giao diện phòng chat