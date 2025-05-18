import axios from 'axios';
import { Platform } from 'react-native';

// Tự động chọn API_URL phù hợp với môi trường
// - Android emulator: http://10.0.2.2:3000
// - iOS simulator: http://localhost:3000
// - Thiết bị thật: http://<IP-máy-tính>:3000 (cùng mạng WiFi)
let API_URL = '';
if (Platform.OS === 'android') {
  API_URL = 'http://10.0.2.2:3000';
} else if (Platform.OS === 'ios') {
  API_URL = 'http://localhost:3000';
} else {
  API_URL = 'http://192.168.1.10:3000'; // Thay bằng IP LAN của máy tính bạn nếu chạy thiết bị thật
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// API calls cho Messages
export const messageApi = {
  // Lấy danh sách cuộc trò chuyện
  getConversations: () => api.get('/conversations'),
  
  // Lấy tin nhắn của một cuộc trò chuyện
  getMessages: (conversationId) => api.get(`/conversations/${conversationId}/messages`),
  
  // Gửi tin nhắn mới
  sendMessage: (conversationId, message) => 
    api.post(`/conversations/${conversationId}/messages`, message),
  
  // Gửi hình ảnh
  sendImage: (conversationId, imageData) => {
    const formData = new FormData();
    formData.append('image', imageData);
    return api.post(`/conversations/${conversationId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Xóa tin nhắn
  deleteMessage: (conversationId, messageId) => 
    api.delete(`/conversations/${conversationId}/messages/${messageId}`),
  
  // Đánh dấu đã đọc
  markAsRead: (conversationId) => 
    api.put(`/conversations/${conversationId}/read`),
};

// API calls cho Authentication
export const authApi = {
  // Đăng nhập
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Đăng ký
  register: (userData) => api.post('/auth/register', userData),
  
  // Đăng xuất
  logout: () => api.post('/auth/logout'),
  
  // Lấy thông tin người dùng
  getCurrentUser: () => api.get('/auth/me'),
};

// API calls cho Notifications
export const notificationApi = {
  // Lấy danh sách thông báo
  getNotifications: () => api.get('/notifications'),
  
  // Đánh dấu thông báo đã đọc
  markAsRead: (notificationId) => 
    api.put(`/notifications/${notificationId}/read`),
  
  // Xóa thông báo
  deleteNotification: (notificationId) => 
    api.delete(`/notifications/${notificationId}`),
};

export default api; 