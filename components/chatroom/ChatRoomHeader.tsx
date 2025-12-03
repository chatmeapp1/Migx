
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeCustom } from '@/theme/provider';
import { BackIcon, MenuGridIcon } from '@/components/ui/SvgIcons';

interface ChatTab {
  id: string;
  name: string;
  type: 'room' | 'private';
}

interface ChatRoomHeaderProps {
  tabs: ChatTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
}

export function ChatRoomHeader({ tabs, activeTab, onTabChange, onCloseTab }: ChatRoomHeaderProps) {
  const router = useRouter();
  const { theme } = useThemeCustom();

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <View style={[styles.topBar, { backgroundColor: theme.primary }]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <BackIcon color={theme.background} size={24} />
        </TouchableOpacity>
        
        <View style={styles.spacer} />
        
        <TouchableOpacity 
          onPress={() => {/* Handle menu grid action */}}
          style={styles.iconButton}
        >
          <MenuGridIcon color={theme.background} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsContainer, { backgroundColor: theme.primary }]}
      >
        {tabs.map((tab) => (
          <View key={tab.id} style={styles.tabWrapper}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab,
              ]}
              onPress={() => onTabChange(tab.id)}
            >
              <Text style={[
                styles.tabText,
                { color: `${theme.background}B3` },
                activeTab === tab.id && { color: theme.background },
              ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
            {activeTab === tab.id && <View style={[styles.activeIndicator, { backgroundColor: theme.background }]} />}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  iconButton: {
    padding: 8,
  },
  spacer: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tabWrapper: {
    position: 'relative',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});
