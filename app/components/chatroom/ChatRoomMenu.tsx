import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useThemeCustom } from '@/theme/provider';

interface ChatRoomMenuProps {
  visible: boolean;
  onClose: () => void;
  onMenuItemPress: (action: string) => void;
  onOpenParticipants?: () => void;
}

export function ChatRoomMenu({ visible, onClose, onMenuItemPress, onOpenParticipants }: ChatRoomMenuProps) {
  const { theme } = useThemeCustom();

  const menuItems = [
    { label: 'Room Info', action: 'room-info' },
    { label: 'Participants', action: 'participants' },
    { label: 'Add Favorite', action: 'add-favorite' },
    { label: 'Leave Room', action: 'leave-room' },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.menu, { backgroundColor: theme.card }]}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.action}
              onPress={() => {
                onMenuItemPress(item.action);
                onClose();
              }}
              style={[styles.menuItem, { borderBottomColor: theme.secondary }]}
            >
              <Text style={[styles.menuText, { color: theme.text }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onClose} style={styles.menuItem}>
            <Text style={[styles.menuText, { color: theme.text }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    borderRadius: 12,
    minWidth: 250,
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
