// =========================
// ResetPasswordScreen.js
// Màn hình đặt lại mật khẩu cho ứng dụng mạng xã hội.
// - Cho phép người dùng nhập mật khẩu mới sau khi xác thực qua email/token.
// - Điều hướng trở lại LoginScreen sau khi đặt lại thành công.
// =========================

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';

// Bắt đầu component
const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { colors } = useTheme();

  const handleReset = () => {
    if (newPassword === confirmPassword) {
      // Xử lý logic Reset Password ở đây
      alert('Password reset successfully!');
      navigation.navigate('Login'); // Điều hướng về Login sau khi reset
    } else {
      alert('Passwords do not match!');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      {/* Logo */}
      <Image source={require('../../assets/favicon.png')} style={styles.logo} />

      {/* Tiêu đề */}
      <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>

      {/* Ô nhập mật khẩu mới */}
      <TextInput
        style={[styles.input, { borderBottomColor: colors.primary, color: colors.text }]}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholderTextColor={colors.secondary}
      />

      {/* Ô xác nhận lại mật khẩu */}
      <TextInput
        style={[styles.input, { borderBottomColor: colors.primary, color: colors.text }]}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor={colors.secondary}
      />

      {/* Nút Reset */}
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.secondary }]} onPress={handleReset}>
        <Text style={[styles.buttonText, { color: colors.text }]}>RESET</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;

// StyleSheet cho màn hình Reset Password
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 30,
    paddingVertical: 8,
    fontSize: 16,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
