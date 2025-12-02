
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface RoomItemProps {
  name: string;
  userCount: string;
}

const RoomIcon = ({ size = 18 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#4A90E2" />
  </Svg>
);

export function RoomItem({ name, userCount }: RoomItemProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.leftSection}>
        <RoomIcon size={16} />
        <Text style={styles.name}>{name}</Text>
      </View>
      <Text style={styles.userCount}>{userCount}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#E8F4FD',
    marginHorizontal: 8,
    marginBottom: 2,
    borderRadius: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  name: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  userCount: {
    fontSize: 13,
    color: '#999',
  },
});
