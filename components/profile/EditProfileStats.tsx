import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useThemeCustom } from '@/theme/provider';
import { API_ENDPOINTS } from '@/utils/api';

interface StatItemProps {
  label: string;
  value: number;
  onPress?: () => void;
}

function StatItem({ label, value, onPress }: StatItemProps) {
  const { theme } = useThemeCustom();

  return (
    <TouchableOpacity
      style={styles.statItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.statLabel, { color: theme.text + 'CC' }]}>{label}</Text>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
    </TouchableOpacity>
  );
}

interface EditProfileStatsProps {
  userId: string;
  postCount?: number;
  giftCount?: number;
  followersCount?: number;
  followingCount?: number;
  onPostPress?: () => void;
  onGiftPress?: () => void;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
}

export function EditProfileStats({
  userId,
  postCount: propPostCount,
  giftCount: propGiftCount,
  followersCount: propFollowersCount,
  followingCount: propFollowingCount,
  onPostPress,
  onGiftPress,
  onFollowersPress,
  onFollowingPress
}: EditProfileStatsProps) {
  const { theme } = useThemeCustom();
  const [stats, setStats] = useState({
    postCount: propPostCount || 0,
    giftCount: propGiftCount || 0,
    followersCount: propFollowersCount || 0,
    followingCount: propFollowingCount || 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propPostCount !== undefined) {
      // Use props if provided
      setStats({
        postCount: propPostCount,
        giftCount: propGiftCount || 0,
        followersCount: propFollowersCount || 0,
        followingCount: propFollowingCount || 0,
      });
      setLoading(false);
    } else {
      // Otherwise load from API
      loadStats();
    }
  }, [userId, propPostCount, propGiftCount, propFollowersCount, propFollowingCount]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.PROFILE.STATS(userId));
      const data = await response.json();

      if (response.ok) {
        setStats({
          postCount: data.postCount || 0,
          giftCount: data.giftCount || 0,
          followersCount: data.followersCount || 0,
          followingCount: data.followingCount || 0,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <TouchableOpacity style={styles.statButton} onPress={onPostPress}>
        <View style={styles.statItem}>
          <Text style={[styles.statCount, { color: theme.text }]}>{stats.postCount}</Text>
          <Text style={[styles.statLabel, { color: theme.text + 'CC' }]}>Post</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.statButton} onPress={onGiftPress}>
        <View style={styles.statItem}>
          <Text style={[styles.statCount, { color: theme.text }]}>{stats.giftCount}</Text>
          <Text style={[styles.statLabel, { color: theme.text + 'CC' }]}>Gift</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.statButton} onPress={onFollowersPress}>
        <View style={styles.statItem}>
          <Text style={[styles.statCount, { color: theme.text }]}>{stats.followersCount}</Text>
          <Text style={[styles.statLabel, { color: theme.text + 'CC' }]}>Followers</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.statButton} onPress={onFollowingPress}>
        <View style={styles.statItem}>
          <Text style={[styles.statCount, { color: theme.text }]}>{stats.followingCount}</Text>
          <Text style={[styles.statLabel, { color: theme.text + 'CC' }]}>Following</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  statItem: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statButton: {
    flex: 1,
  },
  divider: {
    width: 1,
  },
});