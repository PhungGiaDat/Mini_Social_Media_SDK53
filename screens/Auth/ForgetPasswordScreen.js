// =========================
// ForgetPasswordScreen.js
// Màn hình quên mật khẩu cho ứng dụng mạng xã hội.
// - Cho phép người dùng nhập email để nhận hướng dẫn đặt lại mật khẩu.
// - Điều hướng trở lại LoginScreen sau khi gửi yêu cầu thành công.
// =========================

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';

// Bắt đầu component
const ForgetPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const { colors } = useTheme();

  const handleContinue = () => {
    // Điều hướng đến màn hình Reset Password
    navigation.navigate('ResetPassword');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      {/* Logo */}
      <Image source={require('../../assets/favicon.png')} style={styles.logo} />

      {/* Tiêu đề */}
      <Text style={[styles.title, { color: colors.text }]}>Forget Password</Text>

      {/* Ô nhập email */}
      <TextInput
        style={[styles.input, { borderBottomColor: colors.primary, color: colors.text }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={colors.secondary}
      />

      {/* Nút Continue */}
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.secondary }]} onPress={handleContinue}>
        <Text style={[styles.buttonText, { color: colors.text }]}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgetPasswordScreen;

// StyleSheet cho màn hình Forget Password
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
