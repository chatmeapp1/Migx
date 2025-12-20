import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const EMOJI_PICKER_HEIGHT = 250;

interface EmojiPickerProps {
  visible: boolean;
  onClose: () => void;
  onEmojiSelect: (code: string) => void;
  bottomOffset?: number;
}

export function EmojiPicker({ visible, onClose, onEmojiSelect, bottomOffset = 0 }: EmojiPickerProps) {
  if (!visible) return null;

  return (
    <View style={[styles.container, { height: EMOJI_PICKER_HEIGHT, bottom: bottomOffset }]}>
      <Text>Emoji Picker</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
