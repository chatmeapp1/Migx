
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const EmailIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="5" width="18" height="14" rx="2" stroke="#4A90E2" strokeWidth="2" fill="none" />
    <Path d="M3 7l9 6 9-6" stroke="#4A90E2" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export function EmailSection() {
  return (
    <TouchableOpacity style={styles.container}>
      <EmailIcon />
      <Text style={styles.text}>Email (0)</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F4FD',
    padding: 12,
    marginHorizontal: 8,
    marginBottom: 4,
    borderRadius: 4,
  },
  text: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
});
