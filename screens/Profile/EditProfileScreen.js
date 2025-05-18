// =========================
// EditProfileScreen.js
// Màn hình chỉnh sửa hồ sơ cá nhân cho ứng dụng mạng xã hội.
// - Cho phép người dùng thay đổi avatar, tên, username, bio...
// - Lưu thay đổi và điều hướng trở lại ProfileScreen.
// - Có thể tích hợp upload ảnh và cập nhật thông tin qua API thật.
// =========================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
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

const defaultAvatar = require('../../assets/favicon.png');

const EditProfileScreen = ({ navigation }) => {
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [pendingAvatar, setPendingAvatar] = useState(null); // preview ảnh mới
  const [name, setName] = useState('Joshua Lee');
  const [username, setUsername] = useState('joshua_l');
  const [bio, setBio] = useState('Travel | Photography | Life\nLove to share my moments!');
  
  // Safely get theme colors with fallback
  let colors = defaultColors;
  try {
    const themeResult = useTheme();
    if (themeResult && themeResult.colors) {
      colors = themeResult.colors;
    }
  } catch (error) {
    console.error("Error getting theme in EditProfileScreen:", error);
  }

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Bạn cần cấp quyền truy cập thư viện ảnh!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGE,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPendingAvatar({ uri: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    if (pendingAvatar) {
      setAvatar(pendingAvatar);
      setPendingAvatar(null);
    }
    Alert.alert('Thành công', 'Thông tin hồ sơ đã được lưu (giả lập)!');
    if (navigation && navigation.navigate) {
      navigation.navigate('ProfileMain');
    }
  };

  // Ảnh hiển thị: nếu có pendingAvatar thì preview, không thì dùng avatar chính thức
  const displayAvatar = pendingAvatar || avatar;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Chỉnh sửa hồ sơ</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveButton, { color: colors.primary }]}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={displayAvatar} style={styles.avatar} />
          <TouchableOpacity 
            style={[styles.changeAvatarButton, { backgroundColor: colors.card }]}
            onPress={pickAvatar}
          >
            <Text style={[styles.changeAvatarText, { color: colors.primary }]}>
              Thay đổi ảnh đại diện
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Tên</Text>
            <TextInput
              style={[styles.input, { 
                color: colors.text,
                backgroundColor: colors.card,
                borderColor: colors.border
              }]}
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.secondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Tên người dùng</Text>
            <TextInput
              style={[styles.input, { 
                color: colors.text,
                backgroundColor: colors.card,
                borderColor: colors.border
              }]}
              value={username}
              onChangeText={setUsername}
              placeholderTextColor={colors.secondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Tiểu sử</Text>
            <TextInput
              style={[styles.input, styles.bioInput, { 
                color: colors.text,
                backgroundColor: colors.card,
                borderColor: colors.border
              }]}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              placeholderTextColor={colors.secondary}
            />
          </View>
        </View>
      </ScrollView>
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
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  changeAvatarButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  changeAvatarText: {
    fontWeight: 'bold',
  },
  form: {
    padding: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default EditProfileScreen;