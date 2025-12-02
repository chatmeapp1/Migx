
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ChatMessage } from './ChatMessage';

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  isSystem?: boolean;
  isNotice?: boolean;
  userType?: 'creator' | 'admin' | 'normal';
}

interface ChatRoomContentProps {
  messages: Message[];
}

export function ChatRoomContent({ messages }: ChatRoomContentProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} {...msg} />
        ))}
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  spacer: {
    height: 20,
  },
});
