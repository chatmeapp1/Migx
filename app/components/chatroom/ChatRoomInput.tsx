import React, { forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeCustom } from '@/theme/provider';

interface ChatRoomInputProps {
  onSend: (message: string) => void;
  onMenuItemPress?: (action: string) => void;
  onMenuPress?: () => void;
  onOpenParticipants?: () => void;
  onEmojiPress?: () => void;
  emojiPickerVisible?: boolean;
  emojiPickerHeight?: number;
}

export const ChatRoomInput = forwardRef<
  { insertEmoji: (code: string) => void },
  ChatRoomInputProps
>(
  (
    {
      onSend,
      onMenuItemPress,
      onMenuPress,
      onOpenParticipants,
      onEmojiPress,
      emojiPickerVisible,
      emojiPickerHeight = 0,
    },
    ref
  ) => {
    const { theme } = useThemeCustom();
    const [message, setMessage] = React.useState('');

    const handleSend = () => {
      if (message.trim()) {
        onSend(message);
        setMessage('');
      }
    };

    return (
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
          placeholder="Type message..."
          placeholderTextColor={theme.secondary}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendIcon}>Send</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

ChatRoomInput.displayName = 'ChatRoomInput';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  sendIcon: {
    color: '#0a5229',
    fontWeight: '600',
    fontSize: 12,
  },
});
