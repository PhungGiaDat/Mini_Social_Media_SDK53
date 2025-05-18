import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { postService } from '../services/firebaseService';
import { useTheme } from '../contexts/ThemeContext';

const RealtimePosts = () => {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    // Subscribe to real-time updates
    const postsQuery = postService.onPostsUpdate((updatedPosts) => {
      setPosts(updatedPosts);
      setLoading(false);
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      postService.unsubscribe(postsQuery);
    };
  }, []);

  const handleAddPost = async () => {
    if (newPostText.trim() === '') return;
    
    try {
      await postService.createPost({
        text: newPostText,
        userId: 'user123', // Replace with actual user ID
        userName: 'User Name', // Replace with actual user name
      });
      setNewPostText('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const renderPost = ({ item }) => (
    <View style={[styles.postContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.postAuthor, { color: colors.text }]}>{item.userName}</Text>
      <Text style={[styles.postText, { color: colors.text }]}>{item.text}</Text>
      <Text style={[styles.postTimestamp, { color: colors.text + '99' }]}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Posts (Real-time)</Text>
      
      <View style={[styles.inputContainer, { borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={newPostText}
          onChangeText={setNewPostText}
          placeholder="What's on your mind?"
          placeholderTextColor={colors.text + '80'}
          multiline
        />
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleAddPost}
        >
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <Text style={[styles.loadingText, { color: colors.text + '99' }]}>Loading posts...</Text>
      ) : posts.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.text + '99' }]}>No posts yet. Be the first to post!</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          style={styles.postsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    padding: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  postsList: {
    flex: 1,
  },
  postContainer: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  postAuthor: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  postText: {
    fontSize: 16,
    marginBottom: 8,
  },
  postTimestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
});

export default RealtimePosts; 