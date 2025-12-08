import React, { useRef, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { ChatMessage } from './ChatMessage';

interface Message {
  id: string;
  username: string;
  message: string;
  isOwnMessage?: boolean;
  isSystem?: boolean;
  isNotice?: boolean;
  userType?: 'creator' | 'admin' | 'normal' | 'mentor' | 'merchant';
}

interface RoomInfo {
  name: string;
  description: string;
  creatorName: string;
  currentUsers: string[];
}

interface ChatRoomContentProps {
  messages: Message[];
  roomInfo?: RoomInfo | null;
}

export function ChatRoomContent({ messages, roomInfo }: ChatRoomContentProps) {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderHeader = () => {
    if (!roomInfo) return null;
    
    return (
      <View style={styles.roomInfoHeader}>
        {roomInfo.description ? (
          <Text style={styles.roomDescription}>{roomInfo.description}</Text>
        ) : null}
        <Text style={styles.roomMeta}>
          Managed by: {roomInfo.creatorName || 'Unknown'}
        </Text>
        <Text style={styles.roomMeta}>
          Currently: {roomInfo.currentUsers.length > 0 ? roomInfo.currentUsers.join(', ') : 'No users'}
        </Text>
        <View style={styles.divider} />
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <ChatMessage
          username={item.username}
          message={item.message}
          timestamp=""
          isSystem={item.isSystem}
          isNotice={item.isNotice}
          userType={item.userType}
          isOwnMessage={item.isOwnMessage}
        />
      )}
      contentContainerStyle={styles.container}
      onContentSizeChange={() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  roomInfoHeader: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(10, 82, 41, 0.1)',
  },
  roomDescription: {
    fontSize: 13,
    color: '#0a5229',
    fontWeight: '500',
    marginBottom: 4,
  },
  roomMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 10,
  },
});