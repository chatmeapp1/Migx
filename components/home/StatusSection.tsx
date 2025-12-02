
import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const BellIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const MessageIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="2" fill="none" />
  </Svg>
);

export function StatusSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.statusDot} />
          <Text style={styles.username}>h________</Text>
        </View>
        <View style={styles.icons}>
          <TouchableOpacity style={styles.iconButton}>
            <BellIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MessageIcon />
          </TouchableOpacity>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </View>
      </View>
      <TextInput
        style={styles.input}
        placeholder="<Enter your status message>"
        placeholderTextColor="#FFA07A"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF6347',
    borderWidth: 3,
    borderColor: '#D2691E',
    borderRadius: 8,
    margin: 8,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#90EE90',
    borderWidth: 2,
    borderColor: '#fff',
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  badge: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FF6347',
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    padding: 8,
    color: '#fff',
    fontSize: 14,
  },
});
