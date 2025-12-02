
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { RoomItem } from './RoomItem';

interface Room {
  name: string;
  userCount: string;
}

interface RoomCategoryProps {
  title: string;
  rooms: Room[];
  backgroundColor?: string;
  isSpecial?: boolean;
}

const MinusIcon = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14" stroke="#2C5F7F" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const PlusIcon = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke="#2C5F7F" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ActionIcon = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke="#00AA00" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export function RoomCategory({ title, rooms, backgroundColor = '#B8E6F7', isSpecial = false }: RoomCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.header, { backgroundColor }]}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.headerContent}>
          {isExpanded ? <MinusIcon /> : <PlusIcon />}
          <Text style={[styles.title, isSpecial && styles.titleSpecial]}>{title}</Text>
        </View>
        {isSpecial && <ActionIcon />}
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.roomList}>
          {rooms.map((room, index) => (
            <RoomItem
              key={index}
              name={room.name}
              userCount={room.userCount}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 8,
    borderRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    color: '#2C5F7F',
    fontWeight: '600',
  },
  titleSpecial: {
    color: '#00AA00',
    fontWeight: 'bold',
  },
  roomList: {
    paddingTop: 2,
  },
});
