import { auth, firestoreDb } from './firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Định nghĩa các vai trò
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
};

// Định nghĩa các quyền
export const PERMISSIONS = {
  MANAGE_POSTS: 'manage_posts',
  MANAGE_COMMENTS: 'manage_comments',
  MANAGE_USERS: 'manage_users',
  MANAGE_CONTENT: 'manage_content',
  VIEW_ANALYTICS: 'view_analytics'
};

// Map vai trò với quyền
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_POSTS,
    PERMISSIONS.MANAGE_COMMENTS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.VIEW_ANALYTICS
  ],
  [ROLES.MODERATOR]: [
    PERMISSIONS.MANAGE_POSTS,
    PERMISSIONS.MANAGE_COMMENTS,
    PERMISSIONS.MANAGE_CONTENT
  ],
  [ROLES.USER]: []
};

// Kiểm tra quyền của người dùng
export const checkPermission = async (permission) => {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    const userDoc = await getDoc(doc(firestoreDb, 'users', user.uid));
    if (!userDoc.exists()) return false;

    const userData = userDoc.data();
    const role = userData.role || ROLES.USER;
    return ROLE_PERMISSIONS[role].includes(permission);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

// Tạo tài khoản mới với vai trò
export const createUserWithRole = async (email, password, role = ROLES.USER) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Lưu thông tin vai trò vào Firestore
    await setDoc(doc(firestoreDb, 'users', user.uid), {
      email: user.email,
      role: role,
      createdAt: new Date().toISOString(),
      permissions: ROLE_PERMISSIONS[role]
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Cập nhật vai trò người dùng
export const updateUserRole = async (userId, newRole) => {
  try {
    await setDoc(doc(firestoreDb, 'users', userId), {
      role: newRole,
      permissions: ROLE_PERMISSIONS[newRole]
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Lấy thông tin vai trò của người dùng hiện tại
export const getCurrentUserRole = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const userDoc = await getDoc(doc(firestoreDb, 'users', user.uid));
    if (!userDoc.exists()) return ROLES.USER;
    return userDoc.data().role || ROLES.USER;
  } catch (error) {
    console.error('Error getting user role:', error);
    return ROLES.USER;
  }
};
