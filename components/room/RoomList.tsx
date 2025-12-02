
import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { RoomCategory } from './RoomCategory';
import Svg, { Path } from 'react-native-svg';

const RefreshIcon = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="#00AA00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SearchIcon = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35" stroke="#00AA00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const recentRooms = [
  { name: 'Bangladesh3', userCount: '(6/25)' },
  { name: 'Khb', userCount: '(0/25)' },
  { name: 'dhaka', userCount: '(13/25)' },
  { name: 'Bangladesh', userCount: '(24/25)' },
  { name: 'Finding Angel', userCount: '(1/25)' },
];

const whatsHotRooms = [
  { name: 'Mobile fun', userCount: '(4/25)' },
  { name: 'Dhaka cafe', userCount: '(9/25)' },
  { name: 'tante janda', userCount: '(19/25)' },
  { name: 'surabaya gajl', userCount: '(12/25)' },
  { name: 'Sukabumi lucu', userCount: '(9/25)' },
];

export function RoomList() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <RoomCategory
          title="★ Your Favorites"
          rooms={[]}
          backgroundColor="#FF6B35"
        />
        
        <RoomCategory
          title="Recent Rooms"
          rooms={recentRooms}
          backgroundColor="#B8E6F7"
        />
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionContent}>
            <RefreshIcon />
            <Text style={styles.actionText}>Get more rooms</Text>
          </View>
        </TouchableOpacity>
        
        <RoomCategory
          title="What's Hot"
          rooms={whatsHotRooms}
          backgroundColor="#B8E6F7"
        />
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionContent}>
            <RefreshIcon />
            <Text style={styles.actionText}>Refresh What's Hot</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionContent}>
            <SearchIcon />
            <Text style={styles.actionText}>Search Rooms</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.spacer} />
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerText}>Refresh</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerText}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  actionButton: {
    backgroundColor: '#E8F4FD',
    marginHorizontal: 8,
    marginBottom: 4,
    borderRadius: 4,
    padding: 10,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#00AA00',
    fontWeight: '600',
  },
  spacer: {
    height: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#E8F4FD',
    borderTopWidth: 1,
    borderTopColor: '#B8E6F7',
  },
  footerText: {
    fontSize: 14,
    color: '#2C5F7F',
    fontWeight: '600',
  },
});
