import React, { createContext, useContext, useState, useEffect } from 'react';
import app, { realtimeDb } from '../services/firebaseConfig';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, onValue, set } from 'firebase/database';

// Create context
export const FirebaseContext = createContext();

// Custom hook to use the Firebase context
export const useFirebase = () => useContext(FirebaseContext);

// Firebase provider component
export const FirebaseProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, [auth]);

  // Sign up with email and password
  const signUp = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Realtime Database
      await set(ref(realtimeDb, `users/${user.uid}`), {
        ...userData,
        email: user.email,
        uid: user.uid,
        createdAt: Date.now()
      });
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Sign out
  const logOut = () => {
    return signOut(auth);
  };

  // Subscribe to real-time data
  const subscribeToData = (path, callback) => {
    const dataRef = ref(realtimeDb, path);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
    
    return unsubscribe;
  };

  // Context value
  const value = {
    currentUser,
    loading,
    signUp,
    signIn,
    logOut,
    subscribeToData,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider; 