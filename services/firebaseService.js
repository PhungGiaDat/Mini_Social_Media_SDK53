import { realtimeDb } from './firebaseConfig';
import { 
  ref, 
  set, 
  push, 
  get, 
  update, 
  remove, 
  onValue,
  query,
  orderByChild,
  limitToLast, 
  off
} from 'firebase/database';

// User-related functions
export const userService = {
  // Create or update a user profile
  updateUserProfile: (userId, userData) => {
    return set(ref(realtimeDb, `users/${userId}`), userData);
  },
  
  // Get a user profile by ID
  getUserProfile: async (userId) => {
    const snapshot = await get(ref(realtimeDb, `users/${userId}`));
    return snapshot.exists() ? snapshot.val() : null;
  },
  
  // Listen to changes on a user profile
  onUserProfileChange: (userId, callback) => {
    const userRef = ref(realtimeDb, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      callback(snapshot.val());
    });
    return userRef; // Return reference for later unsubscribing
  }
};

// Post-related functions
export const postService = {
  // Create a new post
  createPost: (postData) => {
    const postRef = ref(realtimeDb, 'posts');
    const newPostRef = push(postRef);
    return set(newPostRef, {
      ...postData,
      timestamp: Date.now(),
      id: newPostRef.key
    }).then(() => newPostRef.key);
  },
  
  // Update an existing post
  updatePost: (postId, postData) => {
    return update(ref(realtimeDb, `posts/${postId}`), postData);
  },
  
  // Delete a post
  deletePost: (postId) => {
    return remove(ref(realtimeDb, `posts/${postId}`));
  },
  
  // Get a single post
  getPost: async (postId) => {
    const snapshot = await get(ref(realtimeDb, `posts/${postId}`));
    return snapshot.exists() ? snapshot.val() : null;
  },
  
  // Get all posts (with optional limit)
  getPosts: async (limit = 20) => {
    const postsQuery = query(
      ref(realtimeDb, 'posts'),
      orderByChild('timestamp'),
      limitToLast(limit)
    );
    const snapshot = await get(postsQuery);
    const posts = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        posts.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    }
    return posts.reverse(); // Return most recent first
  },
  
  // Listen to all posts (real-time)
  onPostsUpdate: (callback, limit = 20) => {
    const postsQuery = query(
      ref(realtimeDb, 'posts'),
      orderByChild('timestamp'),
      limitToLast(limit)
    );
    
    onValue(postsQuery, (snapshot) => {
      const posts = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          posts.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
      }
      callback(posts.reverse());
    });
    
    return postsQuery; // Return query reference for unsubscribing
  },
  
  // Unsubscribe from real-time updates
  unsubscribe: (reference) => {
    off(reference);
  }
};

// Comment-related functions
export const commentService = {
  // Add a comment to a post
  addComment: (postId, commentData) => {
    const commentRef = ref(realtimeDb, `comments/${postId}`);
    const newCommentRef = push(commentRef);
    return set(newCommentRef, {
      ...commentData,
      timestamp: Date.now(),
      id: newCommentRef.key
    });
  },
  
  // Get comments for a post
  getComments: async (postId) => {
    const snapshot = await get(ref(realtimeDb, `comments/${postId}`));
    const comments = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        comments.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    }
    return comments;
  },
  
  // Listen to comments for a post in real-time
  onCommentsUpdate: (postId, callback) => {
    const commentsRef = ref(realtimeDb, `comments/${postId}`);
    onValue(commentsRef, (snapshot) => {
      const comments = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          comments.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
      }
      callback(comments);
    });
    return commentsRef; // Return reference for unsubscribing
  }
};

// Message-related functions 
export const messageService = {
  // Send a message in a conversation
  sendMessage: (conversationId, messageData) => {
    const messageRef = ref(realtimeDb, `messages/${conversationId}`);
    const newMessageRef = push(messageRef);
    return set(newMessageRef, {
      ...messageData,
      timestamp: Date.now(),
      id: newMessageRef.key
    });
  },
  
  // Get or create a conversation between two users
  getOrCreateConversation: async (userId1, userId2) => {
    // Create a consistent conversation ID regardless of user order
    const users = [userId1, userId2].sort();
    const conversationId = `${users[0]}_${users[1]}`;
    
    // Check if conversation exists
    const conversationRef = ref(realtimeDb, `conversations/${conversationId}`);
    const snapshot = await get(conversationRef);
    
    if (!snapshot.exists()) {
      // Create new conversation
      await set(conversationRef, {
        participants: {
          [userId1]: true,
          [userId2]: true
        },
        createdAt: Date.now()
      });
    }
    
    return conversationId;
  },
  
  // Get messages for a conversation
  getMessages: async (conversationId, limit = 50) => {
    const messagesQuery = query(
      ref(realtimeDb, `messages/${conversationId}`),
      orderByChild('timestamp'),
      limitToLast(limit)
    );
    
    const snapshot = await get(messagesQuery);
    const messages = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    }
    return messages;
  },
  
  // Listen to messages in a conversation in real-time
  onMessagesUpdate: (conversationId, callback) => {
    const messagesQuery = query(
      ref(realtimeDb, `messages/${conversationId}`),
      orderByChild('timestamp')
    );
    
    onValue(messagesQuery, (snapshot) => {
      const messages = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          messages.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
      }
      callback(messages);
    });
    
    return messagesQuery; // Return query reference for unsubscribing
  }
}; 