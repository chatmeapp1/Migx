import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;

const TABS = ['/', '/chat', '/room', '/profile'];

interface SwipeableScreenProps {
  children: React.ReactNode;
}

export function SwipeableScreen({ children }: SwipeableScreenProps) {
  const router = useRouter();
  const pathname = usePathname();
  const translateX = useSharedValue(0);
  
  const getCurrentIndex = () => {
    if (pathname === '/' || pathname === '/index') return 0;
    if (pathname === '/chat') return 1;
    if (pathname === '/room') return 2;
    if (pathname === '/profile') return 3;
    return 0;
  };
  
  const navigateToIndex = (index: number) => {
    const route = TABS[index];
    if (route) {
      router.replace(route as any);
    }
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      translateX.value = e.translationX * 0.3;
    })
    .onEnd((e) => {
      const currentIndex = getCurrentIndex();
      
      if (e.translationX < -SWIPE_THRESHOLD && currentIndex < TABS.length - 1) {
        runOnJS(navigateToIndex)(currentIndex + 1);
      } else if (e.translationX > SWIPE_THRESHOLD && currentIndex > 0) {
        runOnJS(navigateToIndex)(currentIndex - 1);
      }
      
      translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
