
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ContactItemProps {
  name: string;
  status?: string;
  isOnline?: boolean;
}

export function ContactItem({ name, status, isOnline = false }: ContactItemProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={[styles.statusDot, isOnline && styles.statusDotOnline]} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        {status && <Text style={styles.status} numberOfLines={1}> - {status}</Text>}
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
    backgroundColor: '#F5F5F5',
    marginHorizontal: 8,
    marginBottom: 2,
    borderRadius: 4,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CCC',
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#999',
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
    color: '#333',
    fontWeight: '500',
  },
  status: {
    fontSize: 14,
    color: '#4A90E2',
    flex: 1,
  },
});
