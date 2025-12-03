
import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ChatRoomHeader } from '@/components/chatroom/ChatRoomHeader';
import { ChatRoomContent } from '@/components/chatroom/ChatRoomContent';
import { ChatRoomInput } from '@/components/chatroom/ChatRoomInput';

interface ChatTab {
  id: string;
  name: string;
  type: 'room' | 'private';
  messages: any[];
}

export default function ChatRoomScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const roomId = params.id as string;
  const roomName = params.name as string || 'Mobile fun';

  const [tabs, setTabs] = useState<ChatTab[]>([
    {
      id: roomId,
      name: roomName,
      type: 'room',
      messages: [
        {
          id: '1',
          username: 'Indonesia',
          message: 'Welcome to Indonesia...',
          timestamp: '[02:05]:',
          isSystem: true,
        },
        {
          id: '2',
          username: 'Indonesia',
          message: 'Currently users in the room: marmuet, master',
          timestamp: '[02:05]:',
          isSystem: true,
        },
        {
          id: '3',
          username: 'Indonesia',
          message: 'This room created by tolist',
          timestamp: '[02:05]:',
          isSystem: true,
        },
        {
          id: '4',
          username: 'Indonesia',
          message: 'marmuet [5] has entered',
          timestamp: '',
          isSystem: true,
        },
        {
          id: '5',
          username: '',
          message: '🔊 <<Fitur Feeds kini telah dibuka dalam mode Akses Awal (Early Access). Anda sudah dapat menggunakannya, namun perlu dicatat bahwa fitur ini masih dalam tahap penyempurnaan>>',
          timestamp: '',
          isNotice: true,
        },
      ],
    },
  ]);

  const [activeTab, setActiveTab] = useState(roomId);

  const handleSendMessage = (message: string) => {
    const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentTabIndex !== -1) {
      const newMessage = {
        id: Date.now().toString(),
        username: 'You',
        message,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        userType: 'normal' as const,
      };

      const updatedTabs = [...tabs];
      updatedTabs[currentTabIndex].messages = [
        ...updatedTabs[currentTabIndex].messages,
        newMessage,
      ];
      setTabs(updatedTabs);
    }
  };

  const handleCloseTab = (tabId: string) => {
    if (tabs.length === 1) {
      router.back();
      return;
    }

    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);

    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ChatRoomHeader
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onCloseTab={handleCloseTab}
        />
        {currentTab && (
          <>
            <ChatRoomContent messages={currentTab.messages} />
            <ChatRoomInput onSend={handleSendMessage} />
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});
