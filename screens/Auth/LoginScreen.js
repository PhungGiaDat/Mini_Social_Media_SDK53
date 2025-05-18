// =========================
// LoginScreen.js
// Màn hình đăng nhập cho ứng dụng mạng xã hội.
// - Cho phép người dùng nhập email và mật khẩu để đăng nhập.
// - Điều hướng sang RegisterScreen, ForgetPasswordScreen nếu cần.
// - Khi đăng nhập thành công, gọi hàm login từ AuthContext để chuyển sang giao diện chính.
// =========================

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      // Đăng nhập với Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Lưu token và cập nhật trạng thái đăng nhập
      await login(user.uid);
      
      // Chuyển hướng đến màn hình chính
      navigation.navigate('MainTabs');
    } catch (error) {
      let message = 'Đã xảy ra lỗi khi đăng nhập';
      
      // Xử lý các lỗi cụ thể từ Firebase
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Không tìm thấy tài khoản với email này';
          break;
        case 'auth/wrong-password':
          message = 'Mật khẩu không đúng';
          break;
        case 'auth/invalid-email':
          message = 'Email không hợp lệ';
          break;
        case 'auth/user-disabled':
          message = 'Tài khoản đã bị vô hiệu hóa';
          break;
        case 'auth/too-many-requests':
          message = 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau';
          break;
      }
      
      Alert.alert('Lỗi đăng nhập', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Background và logo có thể tuỳ chỉnh thêm */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/favicon.png')}
            style={styles.logo}
          />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Đăng nhập</Text>

        <View style={[styles.inputContainer, { borderColor: colors.primary }]}>
          <Icon name="mail-outline" size={18} color={colors.secondary} />
          <TextInput
            placeholder="Email"
            style={[styles.input, { color: colors.text }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor={colors.secondary}
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputContainer, { borderColor: colors.primary }]}>
          <Icon name="lock-closed-outline" size={18} color={colors.secondary} />
          <TextInput
            placeholder="Mật khẩu"
            style={[styles.input, { color: colors.text }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor={colors.secondary}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Ghi nhớ và quên mật khẩu */}
        <View style={styles.row}>
          <View style={styles.checkboxContainer}>
            <Text style={[styles.remember, { color: colors.text }]}>Remember me</Text>
          </View>
          <TouchableOpacity>
            <Text style={[styles.forgot, { color: colors.text }]}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: colors.secondary }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.loginText, { color: colors.text }]}>Đăng nhập</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={{ color: colors.text }}>Don't have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.registerLink, { color: colors.secondary }]}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remember: {
    fontSize: 12,
  },
  forgot: {
    fontSize: 12,
  },
  loginButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
    elevation: 2,
    marginBottom: 20,
  },
  loginText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerLink: {
    fontWeight: 'bold',
  },
});

