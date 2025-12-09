import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useThemeCustom } from '@/theme/provider';
import { HomeIcon, ChatIcon, RoomIcon, ProfileIcon, FeedIcon } from '@/components/ui/SvgIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 300;

const TAB_CONFIG: Record<string, { title: string; icon: (props: { color: string; size: number }) => React.ReactNode }> = {
  'index': { title: 'Home', icon: HomeIcon },
  'chat': { title: 'Chat', icon: ChatIcon },
  'feed': { title: 'Feed', icon: FeedIcon },
  'room': { title: 'Room', icon: RoomIcon },
  'profile': { title: 'Profile', icon: ProfileIcon },
};

const VISIBLE_TAB_ORDER = ['index', 'chat', 'feed', 'room', 'profile'];

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const { theme, isDark } = useThemeCustom();
  const insets = useSafeAreaInsets();
  const isNavigating = useRef(false);
  const swipeProgress = useSharedValue(0);
  const currentVisualIndexRef = useRef(0);
  
  const currentRouteName = state.routes[state.index]?.name || 'index';
  const currentVisualIndex = VISIBLE_TAB_ORDER.indexOf(currentRouteName);
  const safeVisualIndex = currentVisualIndex >= 0 ? currentVisualIndex : 0;
  
  const animatedIndex = useSharedValue(safeVisualIndex);
  const totalTabs = VISIBLE_TAB_ORDER.length;

  const TAB_WIDTH = SCREEN_WIDTH / totalTabs;
  const INDICATOR_WIDTH = 40;
  const INDICATOR_OFFSET = (TAB_WIDTH - INDICATOR_WIDTH) / 2;

  useEffect(() => {
    currentVisualIndexRef.current = safeVisualIndex;
    animatedIndex.value = withSpring(safeVisualIndex, {
      damping: 18,
      stiffness: 180,
      mass: 0.3,
    });
  }, [safeVisualIndex]);

  const indicatorStyle = useAnimatedStyle(() => {
    const basePosition = animatedIndex.value * TAB_WIDTH + INDICATOR_OFFSET;
    const swipeOffset = interpolate(
      swipeProgress.value,
      [-1, 0, 1],
      [TAB_WIDTH, 0, -TAB_WIDTH],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateX: basePosition + swipeOffset * 0.3 }],
    };
  });

  const doNavigation = useCallback((targetVisualIndex: number) => {
    if (isNavigating.current) return;
    if (targetVisualIndex < 0 || targetVisualIndex >= totalTabs) return;
    
    isNavigating.current = true;
    
    if (Platform.OS === 'ios') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {}
    }
    
    const targetRouteName = VISIBLE_TAB_ORDER[targetVisualIndex];
    if (targetRouteName) {
      navigation.navigate(targetRouteName);
    }
    
    setTimeout(() => {
      isNavigating.current = false;
    }, 150);
  }, [navigation, totalTabs]);

  const handlePress = useCallback((visualIndex: number) => {
    doNavigation(visualIndex);
  }, [doNavigation]);

  const handleSwipeEnd = useCallback((translationX: number, velocityX: number) => {
    const idx = currentVisualIndexRef.current;
    const canGoNext = idx < totalTabs - 1;
    const canGoPrev = idx > 0;
    
    const shouldGoNext = (translationX < -SWIPE_THRESHOLD || velocityX < -VELOCITY_THRESHOLD) && canGoNext;
    const shouldGoPrev = (translationX > SWIPE_THRESHOLD || velocityX > VELOCITY_THRESHOLD) && canGoPrev;
    
    if (shouldGoNext) {
      doNavigation(idx + 1);
    } else if (shouldGoPrev) {
      doNavigation(idx - 1);
    }
  }, [doNavigation, totalTabs]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      const normalizedTranslation = event.translationX / SCREEN_WIDTH;
      let progress = normalizedTranslation * 2.5;
      
      const idx = currentVisualIndexRef.current;
      const canGoPrev = idx > 0;
      const canGoNext = idx < totalTabs - 1;
      
      if (!canGoPrev && progress > 0) {
        progress *= 0.15;
      }
      if (!canGoNext && progress < 0) {
        progress *= 0.15;
      }
      
      swipeProgress.value = Math.max(-1, Math.min(1, progress));
    })
    .onEnd((event) => {
      runOnJS(handleSwipeEnd)(event.translationX, event.velocityX);
      swipeProgress.value = withTiming(0, { duration: 120 });
    });

  return (
    <GestureDetector gesture={panGesture}>
      <LinearGradient 
        colors={['#0D5E32', '#0A4726']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 0 }}
        style={[
          styles.tabBar, 
          { 
            paddingBottom: Math.max(insets.bottom, 8),
            borderTopColor: '#0A4726',
          }
        ]}
      >
        <Animated.View
          style={[
            styles.indicator,
            { backgroundColor: '#FFFFFF' },
            indicatorStyle,
          ]}
        />

        <View style={styles.tabsRow}>
          {VISIBLE_TAB_ORDER.map((tabName, index) => {
            const config = TAB_CONFIG[tabName];
            if (!config) return null;
            
            const isActive = safeVisualIndex === index;
            const color = isActive ? '#FFFFFF' : 'rgba(255,255,255,0.6)';

            return (
              <TouchableOpacity
                key={tabName}
                style={styles.tab}
                onPress={() => handlePress(index)}
                activeOpacity={0.7}
              >
                <View style={styles.tabContent}>
                  {config.icon({ color, size: 24 })}
                  <Text style={[styles.tabLabel, { color }]}>{config.title}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </GestureDetector>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 100,
        lazy: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: 'Chat' }}
      />
      <Tabs.Screen
        name="feed"
        options={{ title: 'Feed' }}
      />
      <Tabs.Screen
        name="room"
        options={{ title: 'Room' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0.5,
    position: 'relative',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabContent: {
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 40,
    height: 3,
    borderRadius: 1.5,
  },
});