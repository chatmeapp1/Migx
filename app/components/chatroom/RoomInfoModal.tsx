import React from 'react';
import { Modal, View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { useThemeCustom } from '@/theme/provider';

interface RoomInfoModalProps {
  visible: boolean;
  onClose: () => void;
  info: any;
  roomId: string;
}

export function RoomInfoModal({ visible, onClose, info, roomId }: RoomInfoModalProps) {
  const { theme } = useThemeCustom();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Room Info</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeText, { color: theme.text }]}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {info ? (
            <Text style={[styles.infoText, { color: theme.text }]}>
              {JSON.stringify(info, null, 2)}
            </Text>
          ) : (
            <Text style={[styles.infoText, { color: theme.secondary }]}>No room info</Text>
          )}
        </ScrollView>
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
  content: {
    padding: 16,
  },
  infoText: {
    fontSize: 14,
  },
});
