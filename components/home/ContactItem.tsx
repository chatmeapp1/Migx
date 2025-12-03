
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeCustom } from '@/theme/provider';

interface ContactItemProps {
  name: string;
  status?: string;
  isOnline?: boolean;
}

export function ContactItem({ name, status, isOnline = false }: ContactItemProps) {
  const { theme } = useThemeCustom();
  
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={[styles.statusDot, { backgroundColor: theme.border, borderColor: theme.secondary }, isOnline && styles.statusDotOnline]} />
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{name}</Text>
        {status && <Text style={[styles.status, { color: theme.primary }]} numberOfLines={1}> - {status}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    marginBottom: 2,
    borderRadius: 4,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
    borderWidth: 2,
  },
  statusDotOnline: {
    backgroundColor: '#90EE90',
    borderColor: '#5CB85C',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
  },
  status: {
    fontSize: 14,
    flex: 1,
  },
});
