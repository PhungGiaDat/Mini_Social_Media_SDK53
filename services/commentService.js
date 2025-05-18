import { firestoreDb } from './firebaseConfig';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { checkPermission, PERMISSIONS } from './authService';

// Thêm bình luận mới
export const addComment = async (postId, commentData) => {
  try {
    const commentsRef = collection(firestoreDb, 'comments');
    const newComment = {
      ...commentData,
      postId,
      createdAt: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected
      approvedBy: null,
      approvedAt: null
    };
    return await addDoc(commentsRef, newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Phê duyệt bình luận
export const approveComment = async (commentId) => {
  try {
    const hasPermission = await checkPermission(PERMISSIONS.MANAGE_COMMENTS);
    if (!hasPermission) {
      throw new Error('Không có quyền phê duyệt bình luận');
    }

    const commentRef = doc(firestoreDb, 'comments', commentId);
    await updateDoc(commentRef, {
      status: 'approved',
      approvedBy: auth.currentUser.uid,
      approvedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error approving comment:', error);
    throw error;
  }
};

// Từ chối bình luận
export const rejectComment = async (commentId, reason) => {
  try {
    const hasPermission = await checkPermission(PERMISSIONS.MANAGE_COMMENTS);
    if (!hasPermission) {
      throw new Error('Không có quyền từ chối bình luận');
    }

    const commentRef = doc(firestoreDb, 'comments', commentId);
    await updateDoc(commentRef, {
      status: 'rejected',
      rejectedBy: auth.currentUser.uid,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason
    });
  } catch (error) {
    console.error('Error rejecting comment:', error);
    throw error;
  }
};

// Xóa bình luận
export const deleteComment = async (commentId) => {
  try {
    const hasPermission = await checkPermission(PERMISSIONS.MANAGE_COMMENTS);
    if (!hasPermission) {
      throw new Error('Không có quyền xóa bình luận');
    }

    const commentRef = doc(firestoreDb, 'comments', commentId);
    await deleteDoc(commentRef);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Lấy danh sách bình luận cần phê duyệt
export const getPendingComments = async () => {
  try {
    const hasPermission = await checkPermission(PERMISSIONS.MANAGE_COMMENTS);
    if (!hasPermission) {
      throw new Error('Không có quyền xem bình luận chờ phê duyệt');
    }

    const commentsRef = collection(firestoreDb, 'comments');
    const q = query(commentsRef, where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting pending comments:', error);
    throw error;
  }
}; 