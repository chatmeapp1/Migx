
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';

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

const CloseIcon = ({ size = 14 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export function ChatRoomHeader({ tabs, activeTab, onTabChange, onCloseTab }: ChatRoomHeaderProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => onTabChange(tab.id)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText,
            ]}>
              {tab.name}
            </Text>
            {tabs.length > 1 && (
              <TouchableOpacity
                onPress={() => onCloseTab(tab.id)}
                style={styles.closeButton}
              >
                <CloseIcon size={12} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4A90E2',
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#5BA3E8',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginRight: 2,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#4A90E2',
  },
  closeButton: {
    padding: 2,
  },
});
