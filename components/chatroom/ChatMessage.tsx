
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useThemeCustom } from '@/theme/provider';
import { parseEmojiMessage } from '@/utils/emojiParser';

interface ChatMessageProps {
  username: string;
  message: string;
  timestamp: string;
  isSystem?: boolean;
  isNotice?: boolean;
  userType?: 'creator' | 'admin' | 'normal';
}

export function ChatMessage({ username, message, timestamp, isSystem, isNotice, userType }: ChatMessageProps) {
  const { theme } = useThemeCustom();
  
  const getUsernameColor = () => {
    if (isSystem) return '#FF8C00';
    if (userType === 'creator') return '#FF8C00';
    if (userType === 'admin') return '#FF8C00';
    return theme.text;
  };

  if (isNotice) {
    return (
      <View style={[styles.noticeContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.noticeText, { color: theme.primary }]}>{message}</Text>
      </View>
    );
  }

  const parsedMessage = parseEmojiMessage(message);

  return (
    <View style={styles.messageContainer}>
      <Text style={[styles.username, { color: getUsernameColor() }]}>
        {username}
      </Text>
      <View style={styles.messageContent}>
        {parsedMessage.map((item) => {
          if (item.type === 'emoji') {
            return (
              <Image
                key={item.key}
                source={item.src}
                style={styles.emojiImage}
                resizeMode="contain"
              />
            );
          }
          return (
            <Text key={item.key} style={[styles.message, { color: theme.text }]}>
              {item.content}
            </Text>
          );
        })}
      </View>
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
  username: {
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 4,
  },
  messageContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    fontSize: 13,
  },
  emojiImage: {
    width: 18,
    height: 18,
    marginHorizontal: 2,
  },
  noticeContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  noticeText: {
    fontSize: 13,
    textAlign: 'center',
  },
});
