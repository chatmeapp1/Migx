import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeCustom } from '@/theme/provider';
import { ContactItem } from './ContactItem';
import { API_URL } from '@/utils/api';

type PresenceStatus = 'online' | 'away' | 'busy' | 'offline';

interface Contact {
  id: string;
  name: string;
  status: string;
  presence: PresenceStatus;
  lastSeen: string;
  avatar: string;
  role?: string;
}

export function ContactList() {
  const { theme } = useThemeCustom();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchContacts();
    }
  }, [userId]);

  const loadUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
    } catch (error) {
      console.error('Error loading user ID:', error);
    }
  };

  const fetchContacts = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/users/${userId}/contacts`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      
      const data = await response.json();
      
      const formattedContacts: Contact[] = data.contacts.map((contact: any) => ({
        id: contact.id,
        name: contact.username,
        status: contact.status_message || '',
        presence: mapStatusToPresence(contact.status),
        lastSeen: 'Online',
        avatar: contact.avatar || '👤',
        role: contact.role
      }));
      
      setContacts(formattedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const mapStatusToPresence = (status: string): PresenceStatus => {
    switch (status) {
      case 'online':
        return 'online';
      case 'away':
        return 'away';
      case 'busy':
        return 'busy';
      default:
        return 'offline';
    }
  };

  const handleContactPress = (contact: Contact) => {
    console.log(`Contact ${contact.name} pressed`);
  };

  const updateStatusMessage = async (contactName: string, newStatus: string) => {
    console.log(`Updating status for ${contactName} to: ${newStatus}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading contacts...</Text>
      </View>
    );
  }

  const onlineContacts = contacts.filter(c => c.presence === 'online');
  const otherContacts = contacts.filter(c => c.presence !== 'online');

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.sectionHeader, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
        <Text style={[styles.sectionTitle, { color: theme.secondary }]}>Email (0)</Text>
      </View>

      {onlineContacts.length > 0 && (
        <View style={styles.section}>
          {onlineContacts.map((contact) => (
            <ContactItem
              key={`online-${contact.id}`}
              name={contact.name}
              status={contact.status}
              presence={contact.presence}
              lastSeen={contact.lastSeen}
              avatar={contact.avatar}
              onPress={() => handleContactPress(contact)}
              onStatusUpdate={(newStatus) => updateStatusMessage(contact.name, newStatus)}
            />
          ))}
        </View>
      )}

      <View style={[styles.sectionHeader, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
        <Text style={[styles.sectionTitle, { color: theme.secondary }]}>
          migx Contacts ({contacts.length})
        </Text>
      </View>

      {otherContacts.length > 0 ? (
        <View style={styles.section}>
          {otherContacts.map((contact) => (
            <ContactItem
              key={`contact-${contact.id}`}
              name={contact.name}
              status={contact.status}
              presence={contact.presence}
              lastSeen={contact.lastSeen}
              avatar={contact.avatar}
              onPress={() => handleContactPress(contact)}
              onStatusUpdate={(newStatus) => updateStatusMessage(contact.name, newStatus)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={[styles.emptyText, { color: theme.secondary }]}>
            No contacts yet. Search and add users to your contact list.
          </Text>
        </View>
      )}
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  section: {
    paddingVertical: 4,
  },
  sectionHeader: {
    padding: 8,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    padding: 16,
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
  },
  spacer: {
    height: 20,
  },
});