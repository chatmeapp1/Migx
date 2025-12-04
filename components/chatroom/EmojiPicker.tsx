
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { useThemeCustom } from '@/theme/provider';
import { emojiList } from '@/utils/emojiMapping';

interface EmojiPickerProps {
  visible: boolean;
  onClose: () => void;
  onEmojiSelect: (emojiCode: string) => void;
}

export function EmojiPicker({ visible, onClose, onEmojiSelect }: EmojiPickerProps) {
  const { theme } = useThemeCustom();

  const handleEmojiPress = (emojiCode: string) => {
    onEmojiSelect(emojiCode);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          style={[styles.container, { backgroundColor: theme.card + 'E6' }]}
          activeOpacity={1}
        >
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>Emoticons</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: theme.secondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.emojiGrid}>
              {emojiList.map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.emojiButton, { backgroundColor: theme.background }]}
                  onPress={() => handleEmojiPress(emoji.code)}
                >
                  <Image
                    source={emoji.image}
                    style={styles.emojiImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '40%',
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    paddingHorizontal: 8,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
    gap: 4,
  },
  emojiButton: {
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiImage: {
    width: 18,
    height: 18,
  },
});
