// =========================
// PostDetailScreen.js
// Màn hình chi tiết bài đăng cho ứng dụng mạng xã hội.
// - Hiển thị ảnh, caption, thông tin người đăng, số like, comment...
// - Cho phép người dùng like, comment, xem chi tiết các bình luận.
// - Điều hướng trở lại HomeScreen hoặc ProfileScreen.
// =========================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';

const initialComments = [];

const PostDetailScreen = ({ route }) => {
  const post = route?.params?.post;
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const { colors } = useTheme();

  if (!post) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Không có dữ liệu bài viết.</Text>
      </View>
    );
  }

  const handleLike = () => setLiked((prev) => !prev);

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setCommentText(comment.text);
  };

  const handleUpdateComment = () => {
    if (commentText.trim() !== '' && editingComment) {
      setComments(comments.map(comment => 
        comment.id === editingComment.id 
          ? { ...comment, text: commentText }
          : comment
      ));
      setCommentText('');
      setEditingComment(null);
    }
  };

  const handleAddComment = () => {
    if (commentText.trim() !== '') {
      if (editingComment) {
        handleUpdateComment();
      } else {
        setComments([
          ...comments,
          { id: Date.now().toString(), user: 'bạn', avatar: require('../../assets/favicon.png'), text: commentText },
        ]);
        setCommentText('');
      }
    }
  };

  // Render từng comment
  const renderComment = ({ item }) => (
    <View style={[styles.commentItem, { borderBottomColor: colors.border }]}>
      <Image source={item.avatar} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={[styles.commentText, { color: colors.text }]}>
          <Text style={[styles.commentUser, { color: colors.text }]}>{item.user} </Text>{item.text}
        </Text>
        <View style={styles.commentActions}>
          <TouchableOpacity onPress={() => handleEditComment(item)}>
            <Text style={[styles.commentAction, { color: colors.primary }]}>Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
            <Text style={[styles.commentAction, { color: colors.error }]}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <FlatList
        ListHeaderComponent={
          <>
            {/* User info */}
            <View style={[styles.userInfo, { borderBottomColor: colors.border }]}>
              <Image source={post.avatar} style={styles.userAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.userName, { color: colors.text }]}>{post.user}</Text>
                <Text style={[styles.userLocation, { color: colors.secondary }]}>{post.location}</Text>
              </View>
              <Ionicons name="ellipsis-horizontal" size={22} color={colors.text} />
            </View>
            {/* Post image */}
            <Image source={post.image} style={styles.postImage} />
            {/* Action icons */}
            <View style={[styles.actionRow, { borderBottomColor: colors.border }]}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={handleLike}>
                  <Ionicons
                    name={liked ? 'heart' : 'heart-outline'}
                    size={28}
                    color={liked ? colors.error : colors.text}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="chatbubble-outline" size={26} color={colors.text} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="paper-plane-outline" size={26} color={colors.text} style={styles.icon} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="bookmark-outline" size={26} color={colors.text} />
              </TouchableOpacity>
            </View>
            {/* Likes */}
            <Text style={[styles.likes, { color: colors.text }]}>{post.likes + (liked ? 1 : 0)} likes</Text>
            {/* Caption */}
            <Text style={[styles.caption, { color: colors.text }]}>
              <Text style={[styles.userName, { color: colors.text }]}>{post.user} </Text>{post.caption}
            </Text>
            {/* Date */}
            <Text style={[styles.postDate, { color: colors.secondary }]}>{post.date}</Text>
            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            {/* Comments title */}
            <Text style={[styles.commentsTitle, { color: colors.text }]}>Bình luận</Text>
          </>
        }
        data={comments}
        keyExtractor={item => item.id}
        renderItem={renderComment}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.secondary }]}>
            Chưa có bình luận nào.
          </Text>
        }
      />
      {/* Form nhập comment */}
      <View style={[styles.inputRow, { 
        backgroundColor: colors.background,
        borderTopColor: colors.border
      }]}>
        <Image source={require('../../assets/favicon.png')} style={styles.inputAvatar} />
        <TextInput
          style={[styles.input, { 
            color: colors.text,
            backgroundColor: colors.card
          }]}
          placeholder={editingComment ? "Chỉnh sửa bình luận..." : "Viết bình luận..."}
          placeholderTextColor={colors.secondary}
          value={commentText}
          onChangeText={setCommentText}
          onSubmitEditing={handleAddComment}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.sendBtn}>
          <Ionicons 
            name="send" 
            size={22} 
            color={commentText.trim() ? colors.primary : colors.border} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  userLocation: {
    fontSize: 12,
  },
  postImage: {
    width: '100%',
    height: 340,
    backgroundColor: '#eee',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  icon: {
    marginRight: 14,
  },
  likes: {
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 10,
    marginBottom: 2,
  },
  caption: {
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 2,
  },
  postDate: {
    fontSize: 12,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  divider: {
    height: 1,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  commentsTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  commentText: {
    fontSize: 13,
  },
  commentActions: {
    flexDirection: 'row',
    marginTop: 4,
  },
  commentAction: {
    fontSize: 12,
    marginRight: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  inputAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  sendBtn: {
    padding: 4,
  },
  emptyText: {
    paddingHorizontal: 10,
    fontSize: 14,
  },
});

export default PostDetailScreen; 