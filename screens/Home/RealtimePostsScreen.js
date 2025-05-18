import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import RealtimePosts from '../../components/RealtimePosts';
import { useTheme } from '../../contexts/ThemeContext';

const RealtimePostsScreen = () => {
  const { colors } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <RealtimePosts />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RealtimePostsScreen; 