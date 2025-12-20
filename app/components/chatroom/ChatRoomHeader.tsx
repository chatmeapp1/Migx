import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useThemeCustom } from '@/theme/provider';

interface ChatRoomHeaderProps {
  onBack: () => void;
  onMenuPress: () => void;
}

export function ChatRoomHeader({ onBack, onMenuPress }: ChatRoomHeaderProps) {
  const { theme } = useThemeCustom();

  return (
    <View style={[styles.header, { backgroundColor: '#0a5229' }]}>
      <TouchableOpacity onPress={onBack} style={styles.button}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Chat Room</Text>
      <TouchableOpacity onPress={onMenuPress} style={styles.button}>
        <Text style={styles.menuText}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  button: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  backText: {
    fontSize: 20,
    color: '#ffffff',
  },
  menuText: {
    fontSize: 20,
    color: '#ffffff',
  },
});
