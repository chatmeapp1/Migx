import React from 'react';
import { Modal, View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useThemeCustom } from '@/theme/provider';

interface MenuKickModalProps {
  visible: boolean;
  onClose: () => void;
  users: string[];
  currentUsername: string;
  onSelectUser: (username: string) => void;
}

export function MenuKickModal({ visible, onClose, users, currentUsername, onSelectUser }: MenuKickModalProps) {
  const { theme } = useThemeCustom();
  const otherUsers = users.filter((u) => u !== currentUsername);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Kick User</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeText, { color: theme.text }]}>✕</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={otherUsers}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelectUser(item)} style={[styles.userItem, { backgroundColor: theme.card }]}>
              <Text style={[styles.userName, { color: theme.text }]}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeText: {
    fontSize: 20,
  },
  list: {
    padding: 12,
  },
  userItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  userName: {
    fontSize: 14,
  },
});
