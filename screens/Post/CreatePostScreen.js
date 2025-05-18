// =========================
// CreatePostScreen.js
// Màn hình tạo bài đăng mới cho ứng dụng mạng xã hội.
// - Cho phép chọn ảnh từ thư viện hoặc chụp ảnh mới.
// - Cho phép nhập caption và location.
// - Có thể tích hợp upload ảnh và tạo post với API thật.
// =========================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';

const CreatePostScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const { colors } = useTheme();

  const handleSelectImage = () => {
    // TODO: Implement image picker
    console.log('Select image');
  };

  const handleCreatePost = () => {
    // TODO: Implement post creation
    console.log('Create post:', { image, caption, location });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.content}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Tạo bài viết mới</Text>
          <TouchableOpacity onPress={handleCreatePost}>
            <Text style={[styles.shareButton, { color: colors.primary }]}>Chia sẻ</Text>
          </TouchableOpacity>
        </View>

        {/* Image Preview */}
        <TouchableOpacity style={styles.imageContainer} onPress={handleSelectImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={[styles.placeholder, { backgroundColor: colors.card }]}>
              <Ionicons name="image-outline" size={40} color={colors.secondary} />
              <Text style={[styles.placeholderText, { color: colors.secondary }]}>
                Chọn ảnh
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Caption Input */}
        <TextInput
          style={[styles.input, { 
            color: colors.text,
            backgroundColor: colors.card,
            borderColor: colors.border
          }]}
          placeholder="Viết caption..."
          placeholderTextColor={colors.secondary}
          multiline
          value={caption}
          onChangeText={setCaption}
        />

        {/* Location Input */}
        <View style={[styles.locationContainer, { borderTopColor: colors.border }]}>
          <Ionicons name="location-outline" size={20} color={colors.text} />
          <TextInput
            style={[styles.locationInput, { color: colors.text }]}
            placeholder="Thêm vị trí"
            placeholderTextColor={colors.secondary}
            value={location}
            onChangeText={setLocation}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
  shareButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
  },
  locationInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});

export default CreatePostScreen;