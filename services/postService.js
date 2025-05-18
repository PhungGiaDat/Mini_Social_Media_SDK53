import { firestoreDb } from './firebaseConfig';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { checkPermission, PERMISSIONS } from './authService';

// Tạo bài đăng mới
export const createPost = async (postData) => {
  try {
    const postsRef = collection(firestoreDb, 'posts');
    const newPost = {
      ...postData,
      createdAt: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected
      approvedBy: null,
      approvedAt: null
    };
    return await addDoc(postsRef, newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Phê duyệt bài đăng
export const approvePost = async (postId) => {
  try {
    const hasPermission = await checkPermission(PERMISSIONS.MANAGE_POSTS);
    if (!hasPermission) {
      throw new Error('Không có quyền phê duyệt bài đăng');
    }

    const postRef = doc(firestoreDb, 'posts', postId);
    await updateDoc(postRef, {
      status: 'approved',
      approvedBy: auth.currentUser.uid,
      approvedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error approving post:', error);
    throw error;
  }
};

// Từ chối bài đăng
export const rejectPost = async (postId, reason) => {
  try {
    const hasPermission = await checkPermission(PERMISSIONS.MANAGE_POSTS);
    if (!hasPermission) {
      throw new Error('Không có quyền từ chối bài đăng');
    }

    const postRef = doc(firestoreDb, 'posts', postId);
    await updateDoc(postRef, {
      status: 'rejected',
      rejectedBy: auth.currentUser.uid,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason
    });
  } catch (error) {
    console.error('Error rejecting post:', error);
    throw error;
  }
};

// Xóa bài đăng
export const deletePost = async (postId) => {
  try {
    const hasPermission = await checkPermission(PERMISSIONS.MANAGE_POSTS);
    if (!hasPermission) {
      throw new Error('Không có quyền xóa bài đăng');
    }

    const postRef = doc(firestoreDb, 'posts', postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Lấy danh sách bài đăng cần phê duyệt
export const getPendingPosts = async () => {
  try {
    const hasPermission = await checkPermission(PERMISSIONS.MANAGE_POSTS);
    if (!hasPermission) {
      throw new Error('Không có quyền xem bài đăng chờ phê duyệt');
    }

    const postsRef = collection(firestoreDb, 'posts');
    const q = query(postsRef, where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting pending posts:', error);
    throw error;
  }
};

// Đánh dấu bài đăng nổi bật
export const toggleFeaturedPost = async (postId, isFeatured) => {
  try {
    const hasPermission = await checkPermission(PERMISSIONS.MANAGE_CONTENT);
    if (!hasPermission) {
      throw new Error('Không có quyền quản lý bài đăng nổi bật');
    }

    const postRef = doc(firestoreDb, 'posts', postId);
    await updateDoc(postRef, {
      isFeatured,
      featuredAt: isFeatured ? new Date().toISOString() : null,
      featuredBy: isFeatured ? auth.currentUser.uid : null
    });
  } catch (error) {
    console.error('Error toggling featured post:', error);
    throw error;
  }
};
