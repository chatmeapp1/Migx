import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeCustom } from '@/theme/provider';

interface ChatRoomTabsProps {
  bottomPadding?: number;
  renderVoteButton?: () => React.ReactNode;
}

export function ChatRoomTabs({ bottomPadding = 70, renderVoteButton }: ChatRoomTabsProps) {
  const { theme } = useThemeCustom();

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingBottom: bottomPadding }]}>
      <Text style={[styles.text, { color: theme.text }]}>Messages</Text>
      {renderVoteButton?.()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
});
