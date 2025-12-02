
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatMessageProps {
  username: string;
  message: string;
  timestamp: string;
  isSystem?: boolean;
  isNotice?: boolean;
  userType?: 'creator' | 'admin' | 'normal';
}

export function ChatMessage({ username, message, timestamp, isSystem, isNotice, userType }: ChatMessageProps) {
  const getUsernameColor = () => {
    if (isSystem) return '#FF8C00';
    if (userType === 'creator') return '#FF8C00';
    if (userType === 'admin') return '#FF8C00';
    return '#333';
  };

  if (isNotice) {
    return (
      <View style={styles.noticeContainer}>
        <Text style={styles.noticeText}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.messageContainer}>
      <Text style={styles.timestamp}>{timestamp}</Text>
      <Text style={[styles.username, { color: getUsernameColor() }]}>
        {username}
      </Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexWrap: 'wrap',
  },
  timestamp: {
    fontSize: 13,
    color: '#888',
    marginRight: 4,
  },
  username: {
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 4,
  },
  message: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  noticeContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF5F5',
    marginVertical: 4,
  },
  noticeText: {
    fontSize: 13,
    color: '#D32F2F',
    textAlign: 'center',
  },
});
