import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, ActivityIndicator } from 'react-native';
import MainTabs from './navigation/MainTabs'; // Đúng đường dẫn tới MainTabs.js
import { ThemeProvider } from './contexts/ThemeContext';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { auth } from './services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Simulating initialization time to make sure contexts are properly set up
  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 500);
  }, []);

  if (!isReady || initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0095f6" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#333' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <FirebaseProvider>
      <ThemeProvider>
        <NavigationContainer>
          <MainTabs user={user} />
        </NavigationContainer>
      </ThemeProvider>
    </FirebaseProvider>
  );
}
// // // MainTabs.js
// import React from 'react';