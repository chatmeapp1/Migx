
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ChatRoomInputProps {
  onSend: (message: string) => void;
}

const MenuIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12h18M3 6h18M3 18h18" stroke="#666" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const EmojiIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#666" strokeWidth="2" />
    <Path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" stroke="#666" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const SendIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export function ChatRoomInput({ onSend }: ChatRoomInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton}>
        <MenuIcon />
      </TouchableOpacity>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
      </View>

      <TouchableOpacity style={styles.iconButton}>
        <EmojiIcon />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!message.trim()}
      >
        <SendIcon />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  input: {
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    padding: 8,
    backgroundColor: '#F3E8FF',
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
