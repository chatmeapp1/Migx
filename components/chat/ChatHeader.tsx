import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeCustom } from '@/theme/provider';
import Svg, { Path } from 'react-native-svg';
import { API_ENDPOINTS } from '@/utils/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSocket } from '@/hooks/useSocket';


const StatsIcon = ({ size = 20, color = '#4A90E2' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3v18h18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18 17V9M13 17V5M8 17v-3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export function ChatHeader() {
  const { theme } = useThemeCustom();
  const insets = useSafeAreaInsets();
  const { socket } = useSocket();
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0
  });
  const roomStatsRef = useRef<Map<string, number>>(new Map());

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ROOM.LIST);
      const data = await response.json();

      if (data.success) {
        let totalUsers = 0;
        roomStatsRef.current.clear();
        data.rooms.forEach((room: any) => {
          roomStatsRef.current.set(room.id, room.user_count || 0);
          totalUsers += room.user_count || 0;
        });
        setStats({
          users: totalUsers,
          rooms: data.rooms.length
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (!socket) return;

    const handleRoomsUpdateCount = (data: { roomId: string; userCount: number }) => {
      const { roomId, userCount } = data;
      roomStatsRef.current.set(roomId, userCount);
      
      let totalUsers = 0;
      roomStatsRef.current.forEach((count) => {
        totalUsers += count;
      });
      
      setStats(prev => ({
        ...prev,
        users: totalUsers
      }));
    };

    const handleRoomsUpdate = (data: { room: any; action: string }) => {
      if (data.action === 'created') {
        roomStatsRef.current.set(data.room.id, 0);
        setStats(prev => ({
          ...prev,
          rooms: roomStatsRef.current.size
        }));
      } else if (data.action === 'deleted') {
        roomStatsRef.current.delete(data.room.id);
        let totalUsers = 0;
        roomStatsRef.current.forEach((count) => {
          totalUsers += count;
        });
        setStats({
          users: totalUsers,
          rooms: roomStatsRef.current.size
        });
      }
    };

    socket.on('rooms:updateCount', handleRoomsUpdateCount);
    socket.on('rooms:update', handleRoomsUpdate);

    return () => {
      socket.off('rooms:updateCount', handleRoomsUpdateCount);
      socket.off('rooms:update', handleRoomsUpdate);
    };
  }, [socket]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#082919', '#082919']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.statsBar}>
          <StatsIcon size={18} color="#FFFFFF" />
          <Text style={[styles.statsText, { color: '#FFFFFF' }]}>
            {formatNumber(stats.users)} User  {formatNumber(stats.rooms)} Rooms
          </Text>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 10,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '500',
  },
});