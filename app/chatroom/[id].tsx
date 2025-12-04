import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Keyboard,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeCustom } from '@/theme/provider';

import { ChatRoomHeader } from '@/components/chatroom/ChatRoomHeader';
import { ChatRoomContent } from '@/components/chatroom/ChatRoomContent';
import { ChatRoomInput } from '@/components/chatroom/ChatRoomInput';

interface ChatTab {
  id: string;
  name: string;
  type: 'room' | 'private';
  messages: any[];
}

const HEADER_COLOR = '#0a5229';

export default function ChatRoomScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeCustom();

  const roomId = params.id as string;
  const roomName = (params.name as string) || 'Mobile fun';

  const keyboardHeight = useSharedValue(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (e) => {
      setIsKeyboardVisible(true);
      keyboardHeight.value = withTiming(e.endCoordinates.height, { duration: 250 });
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
      keyboardHeight.value = withTiming(0, { duration: 250 });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const inputAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -keyboardHeight.value }],
    };
  });

  const [tabs, setTabs] = useState<ChatTab[]>([
    {
      id: roomId,
      name: roomName,
      type: 'room',
      messages: [
        { id: '1', username: 'Indonesia', message: 'Welcome to Indonesia...', isSystem: true },
        { id: '2', username: 'Indonesia', message: 'Currently users in the room: migx, mad', isSystem: true },
        { id: '3', username: 'Indonesia', message: 'This room created by migx', isSystem: true },
        { id: '4', username: 'Indonesia', message: 'migx [1] has entered', isSystem: true },
        { id: '5', username: '', message: '🔊 <<Welcome Migx community happy fun!!>>', isNotice: true },
      ],
    },
  ]);

  const [activeTab, setActiveTab] = useState(roomId);

  const handleSendMessage = (message: string) => {
    const index = tabs.findIndex(t => t.id === activeTab);
    if (index === -1) return;

    const copy = [...tabs];
    copy[index].messages.push({
      id: Date.now().toString(),
      username: 'migx',
      message,
      isOwnMessage: true,
    });

    setTabs(copy);
  };

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <View style={[styles.container, { backgroundColor: HEADER_COLOR }]}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_COLOR} />
      
      <ChatRoomHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCloseTab={(id) => {
          if (tabs.length === 1) return router.back();
          const filtered = tabs.filter(t => t.id !== id);
          setTabs(filtered);
          if (activeTab === id) setActiveTab(filtered[0].id);
        }}
      />

      <View style={[styles.contentContainer, { backgroundColor: theme.background }]}>
        {currentTab && (
          <ChatRoomContent messages={currentTab.messages} />
        )}
      </View>

      <Animated.View 
        style={[
          styles.inputWrapper,
          { 
            backgroundColor: HEADER_COLOR,
            paddingBottom: isKeyboardVisible ? 0 : insets.bottom,
          },
          inputAnimatedStyle,
        ]}
      >
        <ChatRoomInput onSend={handleSendMessage} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
