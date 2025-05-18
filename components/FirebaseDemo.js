import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { realtimeDb } from '../services/firebaseConfig';
import { ref, push, onValue, set, off } from 'firebase/database';

const FirebaseDemo = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug logging for Firebase initialization
  useEffect(() => {
    console.log("FirebaseDemo component mounted");
    console.log("realtimeDb value:", realtimeDb);
    
    if (!realtimeDb) {
      setError("Firebase Realtime Database not initialized");
      setLoading(false);
      return;
    }
    
    // Continue with Firebase connection
    connectToFirebase();
    
    return () => {
      console.log("FirebaseDemo component unmounted");
    };
  }, []);
  
  const connectToFirebase = () => {
    try {
      // Reference to the 'messages' node in your Firebase Realtime Database
      const messagesRef = ref(realtimeDb, 'messages');
      
      // Set up a listener for changes
      onValue(messagesRef, (snapshot) => {
        console.log("Firebase data received:", snapshot.exists());
        
        const data = snapshot.val();
        if (data) {
          // Convert the object to an array
          const messageList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          
          // Sort by timestamp in descending order
          messageList.sort((a, b) => b.timestamp - a.timestamp);
          
          setMessages(messageList);
        } else {
          setMessages([]);
        }
        setLoading(false);
      }, (error) => {
        console.error("Firebase onValue error:", error);
        setError(error.message);
        setLoading(false);
      });
    } catch (err) {
      console.error("Firebase connection error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;
    
    try {
      const messagesRef = ref(realtimeDb, 'messages');
      const newMessageRef = push(messagesRef);
      
      await set(newMessageRef, {
        text: newMessage,
        timestamp: Date.now(),
        sender: 'Anonymous User'
      });
      
      setNewMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0095f6" />
        <Text style={styles.loadingText}>Connecting to Firebase...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.helpText}>
          Make sure your Firebase configuration is correct and that you have internet connectivity.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Real-time Messages</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      
      {messages.length === 0 ? (
        <Text style={styles.emptyText}>No messages yet. Be the first to send one!</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <Text style={styles.messageSender}>{item.sender}</Text>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.messageTime}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#333',
    padding: 8,
  },
  sendButton: {
    backgroundColor: '#0095f6',
    borderRadius: 4,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageSender: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 32,
  },
});

export default FirebaseDemo; 