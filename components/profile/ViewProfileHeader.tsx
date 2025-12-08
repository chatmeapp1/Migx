
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useThemeCustom } from '@/theme/provider';
import { API_BASE_URL } from '@/utils/api';

const BackIcon = ({ size = 24, color = '#fff' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const VerifiedIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#4CAF50" />
    <Path
      d="M9 12l2 2 4-4"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MaleIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="10" cy="14" r="6" stroke="#2196F3" strokeWidth="2" fill="none" />
    <Path
      d="M15 9L21 3M21 3h-5M21 3v5"
      stroke="#2196F3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const FemaleIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="9" r="6" stroke="#E91E63" strokeWidth="2" fill="none" />
    <Path
      d="M12 15v6M9 21h6"
      stroke="#E91E63"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface ViewProfileHeaderProps {
  backgroundImage?: string;
  avatarImage?: string;
  username?: string;
  level?: number;
  gender?: string;
  userId?: string;
  isFollowing?: boolean;
  onBackPress?: () => void;
  onFollowPress?: () => void;
}

export function ViewProfileHeader({
  backgroundImage,
  avatarImage,
  username = 'User',
  level = 1,
  gender,
  userId = '0',
  isFollowing = false,
  onBackPress,
  onFollowPress,
}: ViewProfileHeaderProps) {
  const { theme } = useThemeCustom();
  
  const avatarUri = avatarImage?.startsWith('http') 
    ? avatarImage 
    : avatarImage 
      ? `${API_BASE_URL}${avatarImage}` 
      : null;

  return (
    <View style={styles.container}>
      {/* Background Image Section */}
      <View style={styles.backgroundContainer}>
        {backgroundImage ? (
          <Image source={{ uri: backgroundImage }} style={styles.backgroundImage} />
        ) : (
          <View style={[styles.backgroundPlaceholder, { backgroundColor: theme.primary }]} />
        )}

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <BackIcon size={24} color="#fff" />
        </TouchableOpacity>

        {/* migX Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>migX</Text>
        </View>
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <Image 
              source={{ uri: avatarUri }} 
              style={styles.avatar}
              onError={(e) => console.log('❌ ViewProfile Avatar load error:', e.nativeEvent.error)}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
          )}
        </View>

        {/* Username and Info */}
        <View style={styles.userInfoContainer}>
          <View style={styles.usernameRow}>
            <Text style={[styles.username, { color: theme.text }]}>{username}</Text>
            <VerifiedIcon size={20} />
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>[{level}]</Text>
            </View>
            {gender && (
              gender.toLowerCase() === 'male' ? <MaleIcon size={20} /> : <FemaleIcon size={20} />
            )}
          </View>
          
          <Text style={[styles.subtitle, { color: theme.text + 'CC' }]}>{username}</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoText, { color: theme.text + 'CC' }]}>migx</Text>
            <Text style={[styles.infoText, { color: theme.text + 'CC' }]}>    {userId}</Text>
          </View>
        </View>

        {/* Follow Button */}
        <TouchableOpacity
          style={[
            styles.followButton,
            { 
              backgroundColor: isFollowing ? '#757575' : '#4CAF50',
            }
          ]}
          onPress={onFollowPress}
          activeOpacity={0.7}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  backgroundContainer: {
    height: 200,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  backgroundPlaceholder: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarSection: {
    paddingHorizontal: 16,
    marginTop: -50,
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 50,
  },
  userInfoContainer: {
    marginTop: 12,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
  },
  followButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
