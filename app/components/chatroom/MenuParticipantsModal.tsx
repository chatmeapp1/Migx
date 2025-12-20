import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeCustom } from '@/theme/provider';
import API_BASE_URL from '@/utils/api';

interface MenuParticipantsModalProps {
  visible: boolean;
  onClose: () => void;
  roomId: string;
  onUserMenuPress?: (username: string) => void;
}

interface Participant {
  userId: string;
  username: string;
  userLevel?: number;
}

export function MenuParticipantsModal({
  visible,
  onClose,
  roomId,
  onUserMenuPress,
}: MenuParticipantsModalProps) {
  const router = useRouter();
  const { theme } = useThemeCustom();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      loadParticipants();
    }
  }, [visible, roomId]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}/participants`);
      const data = await response.json();
      if (data.success && data.participants) {
        setParticipants(data.participants);
      }
    } catch (error) {
      console.error('Error loading participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (userId: string, username: string) => {
    setUserMenuVisible(false);
    setSelectedUser(null);
    onClose();
    router.push(`/view-profile?userId=${userId}`);
  };

  const handleUserOptionsPress = (username: string, userId: string) => {
    setSelectedUser(userId);
    setUserMenuVisible(true);
    if (onUserMenuPress) {
      onUserMenuPress(username);
    }
  };

  const renderParticipantItem = ({ item }: { item: Participant }) => (
    <View style={[styles.participantItem, { backgroundColor: theme.card }]}>
      <View style={styles.participantInfo}>
        <Text
          style={[styles.participantName, { color: theme.text }]}
          numberOfLines={1}
        >
          {item.username}
        </Text>
        {item.userLevel && (
          <Text style={[styles.levelText, { color: theme.secondary }]}>
            Level {item.userLevel}
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => handleUserOptionsPress(item.username, item.userId)}
        style={styles.menuButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[styles.menuIcon, { color: theme.secondary }]}>⋯</Text>
      </TouchableOpacity>
    </View>
  );

  const renderUserMenu = () => {
    if (!userMenuVisible || !selectedUser) return null;

    const selectedParticipant = participants.find(p => p.userId === selectedUser);
    if (!selectedParticipant) return null;

    return (
      <Modal
        visible={userMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setUserMenuVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.userMenu, { backgroundColor: theme.card }]}>
            <TouchableOpacity
              onPress={() => handleViewProfile(selectedUser, selectedParticipant.username)}
              style={[styles.menuOption, { borderBottomColor: theme.secondary }]}
            >
              <Text style={[styles.menuOptionText, { color: theme.text }]}>
                👤 View Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setUserMenuVisible(false)}
              style={styles.menuOption}
            >
              <Text style={[styles.menuOptionText, { color: theme.secondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { backgroundColor: theme.card }]}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Participants ({participants.length})
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.closeIcon, { color: theme.text }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : (
            <FlatList
              data={participants}
              renderItem={renderParticipantItem}
              keyExtractor={(item) => item.userId}
              contentContainerStyle={styles.listContent}
              scrollEnabled={true}
            />
          )}
        </View>
      </Modal>
      {renderUserMenu()}
    </>
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 12,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  participantInfo: {
    flex: 1,
    marginRight: 12,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  levelText: {
    fontSize: 12,
  },
  menuButton: {
    padding: 8,
    borderRadius: 6,
  },
  menuIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMenu: {
    borderRadius: 12,
    minWidth: 200,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  menuOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  menuOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
