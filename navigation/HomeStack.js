// =========================
// HomeStack.js
// Stack điều hướng cho các màn hình Home (Home, Notification, ...).
// - Quản lý luồng chuyển đổi giữa các màn hình liên quan đến trang chủ.
// - Có thể mở rộng thêm các màn hình home khác trong tương lai.
// =========================

// Stack cho Home
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen'; // Sửa đường dẫn
import PostDetailScreen from '../screens/Post/PostDetailScreen'; // Sửa đường dẫn

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    </Stack.Navigator>
  );
}
