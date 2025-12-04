
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useThemeCustom } from '@/theme/provider';
import {
  InfoIcon,
  StarIcon,
  WalletIcon,
  ParticipantsIcon,
  BlockUserIcon,
  KickUserIcon,
  LeaveRoomIcon,
} from './ChatRoomMenuIcons';

interface ChatRoomMenuProps {
  visible: boolean;
  onClose: () => void;
  onMenuItemPress: (action: string) => void;
}

export function ChatRoomMenu({ visible, onClose, onMenuItemPress }: ChatRoomMenuProps) {
  const { theme } = useThemeCustom();

  const menuItems = [
    { icon: InfoIcon, label: 'Room Info', action: 'room-info' },
    { icon: StarIcon, label: 'Add as favorite', action: 'add-favorite' },
    { icon: WalletIcon, label: 'Check Balance', action: 'check-balance' },
    { icon: ParticipantsIcon, label: 'Participants', action: 'participants' },
    { icon: BlockUserIcon, label: 'Block User', action: 'block-user' },
    { icon: KickUserIcon, label: 'Kick User', action: 'kick-user' },
  ];

  const handleMenuPress = (action: string) => {
    onMenuItemPress(action);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.menuContainer}>
          <View style={[styles.menu, { backgroundColor: theme.card }]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.action}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => handleMenuPress(item.action)}
              >
                <item.icon size={22} color={theme.text} />
                <Text style={[styles.menuLabel, { color: theme.text }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('leave-room')}
            >
              <LeaveRoomIcon size={22} color="#EF4444" />
              <Text style={[styles.menuLabel, { color: '#EF4444' }]}>
                Leave Room
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  menu: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
});
