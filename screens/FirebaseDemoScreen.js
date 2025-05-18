import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import FirebaseDemo from '../components/FirebaseDemo';

const FirebaseDemoScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FirebaseDemo />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default FirebaseDemoScreen; 