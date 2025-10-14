import React, { useEffect, useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity,
  FlatList, 
  Text, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet,
  SafeAreaView, 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const COLORS = {
  BACKGROUND_LIGHT: '#F7F8FC',       
  BACKGROUND_DARK: '#2D4B46',
  ACCENT_GOLD: '#FFB733',
  TEXT_DARK: '#333333',
  TEXT_LIGHT: '#FFFFFF',
  INPUT_BG: 'rgba(45, 75, 70, 0.05)',
  CARD_BG: '#FFFFFF',                
};
const socket = {
    connect: () => console.log('Simulating socket connect...'),
    emit: (event, data) => console.log(`Simulating socket emit: ${event}`, data),
    on: (event, callback) => {
        if (event === 'receiveMessage') {
            setTimeout(() => {
                callback({
                    userId: 'support',
                    message: 'Hello! How can I help you today?',
                    sentBy: 'agent',
                    agentId: 'A001',
                    createdAt: new Date(),
                });
            }, 1000);
        }
    },
    off: () => console.log('Simulating socket off...'),
};

const SupportChat = ({ route }) => {
  const { userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.connect();
    socket.emit('joinRoom', userId); 
    console.log(`🟢 Joined room: ${userId}`);

    socket.on('receiveMessage', (message) => {
      console.log('📩 Message received:', message);
      setMessages((prev) => [...prev, { ...message, createdAt: new Date() }]);
    });

    return () => {
      socket.off('receiveMessage');
      console.log('🔴 Disconnected from room');
    };
  }, [userId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const data = {
      userId, 
      message: input.trim(),
      sentBy: 'user',
      agentId: null, 
      createdAt: new Date(), 
    };

    socket.emit('sendMessage', data);
    console.log('📤 Message sent:', data);

    setMessages((prev) => [
      ...prev,
      data, 
    ]);
    setInput('');
  };

  const renderMessageItem = ({ item }) => {
    const isUser = item.sentBy === 'user';
    const time = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.agentRow]}>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.agentBubble,
          ]}
        >
          <Text style={isUser ? styles.userMessageText : styles.agentMessageText}>
            {item.message}
          </Text>
          <Text style={styles.timestamp}>{time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.flexOne}>
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} 
      >
        <View style={styles.container}>
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.flatListContent}
            inverted={true} 
          />

          <View style={styles.inputContainer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              style={styles.input}
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={sendMessage}
              disabled={!input.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={COLORS.BACKGROUND_DARK} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SupportChat;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    justifyContent: 'flex-end',
    flexGrow: 1,
    transform: [{ scaleY: -1 }], 
  },
  messageRow: {
    marginVertical: 4,
    maxWidth: '80%',
    transform: [{ scaleY: -1 }], 
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  agentRow: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    borderBottomLeftRadius: 15, 
    borderBottomRightRadius: 15, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: COLORS.ACCENT_GOLD, 
    borderBottomRightRadius: 4, 
    marginRight: 5,
  },
  agentBubble: {
    backgroundColor: COLORS.CARD_BG, 
    borderBottomLeftRadius: 4, 
    marginLeft: 5,
    borderWidth: 1,
    borderColor: COLORS.INPUT_BG, 
  },
  userMessageText: {
    fontSize: 15,
    color: COLORS.BACKGROUND_DARK, 
  },
  agentMessageText: {
    fontSize: 15,
    color: COLORS.TEXT_DARK,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.BACKGROUND_DARK, 
    opacity: 0.7,
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.CARD_BG, 
    borderTopWidth: 1,
    borderTopColor: COLORS.INPUT_BG, 
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.INPUT_BG,
    borderRadius: 20, 
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    marginRight: 10,
    maxHeight: 100, 
    fontSize: 16,
    color: COLORS.TEXT_DARK,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sendButton: {
    backgroundColor: COLORS.ACCENT_GOLD,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.ACCENT_GOLD,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
});