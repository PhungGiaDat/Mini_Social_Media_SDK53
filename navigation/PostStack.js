// =========================
// PostStack.js
// Stack điều hướng cho các màn hình bài đăng (CreatePost, PostDetail).
// - Quản lý luồng chuyển đổi giữa các màn hình liên quan đến bài đăng.
// - Có thể mở rộng thêm các màn hình post khác trong tương lai.
// =========================

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreatePostScreen from '../screens/Post/CreatePostScreen';
import PostDetailScreen from '../screens/Post/PostDetailScreen';

const Stack = createNativeStackNavigator();

export default function PostStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    </Stack.Navigator>
  );
} 