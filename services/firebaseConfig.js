import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMbBzAY36jhfpnjtSFzYdxFnqV96437is",
  authDomain: "mini-social-media-1fb23.firebaseapp.com",
  databaseURL: "https://mini-social-media-1fb23-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mini-social-media-1fb23",
  storageBucket: "mini-social-media-1fb23.firebasestorage.app",
  messagingSenderId: "257373122506",
  appId: "1:257373122506:ios:4855f839ed8f72bd032933"
};

let auth, database, firestore;

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully!");

  // Initialize Auth with React Native persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

  // Initialize other services
  database = getDatabase(app);
  firestore = getFirestore(app);
  console.log("Firebase services initialized successfully!");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { auth, database as realtimeDb, firestore as firestoreDb }; 