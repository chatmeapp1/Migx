
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeCustom } from '@/theme/provider';
import Svg, { Path, Circle } from 'react-native-svg';

const UserIcon = ({ size = 24, color = '#4A90E2' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" fill={color} />
    <Path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

const MenuIcon = ({ size = 24, color = '#fff' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18M3 12h18M3 18h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ListIcon = ({ size = 24, color = '#fff' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18M3 12h18M3 18h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export function Header() {
  const { theme } = useThemeCustom();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={[styles.topBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.leftSection}>
          <UserIcon size={20} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>My Friends</Text>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.primary }]}>
            <MenuIcon size={20} color={theme.background} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.primary }]}>
            <ListIcon size={20} color={theme.background} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.primary }]}>
            <ListIcon size={20} color={theme.background} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
    borderRadius: 4,
  },
});
