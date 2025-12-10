import React, { useRef, useEffect, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
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

  const allMessages = useMemo(() => {
    const result: Message[] = [];
    
    if (roomInfo) {
      if (roomInfo.description) {
        result.push({
          id: 'room-info-description',
          username: roomInfo.name || 'Room',
          message: roomInfo.description,
          isSystem: true,
        });
      }
      
      if (roomInfo.currentUsers && roomInfo.currentUsers.length > 0) {
        result.push({
          id: 'room-info-users',
          username: roomInfo.name || 'Room',
          message: `Currently users in the room: ${roomInfo.currentUsers.join(', ')}`,
          isSystem: true,
        });
      }
      
      if (roomInfo.creatorName) {
        result.push({
          id: 'room-info-creator',
          username: roomInfo.name || 'Room',
          message: `This room created by ${roomInfo.creatorName}`,
          isSystem: true,
        });
      }
    }
    
    return [...result, ...messages];
  }, [messages, roomInfo]);

  return (
    <FlatList
      ref={flatListRef}
      data={allMessages}
      keyExtractor={(item) => item.id}
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
});