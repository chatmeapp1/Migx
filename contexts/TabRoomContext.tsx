import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { Socket } from 'socket.io-client';

export interface RoomTab {
  roomId: string;
  roomName: string;
  lastReadTime: number;
  messages: Message[];
  isActive: boolean;
}

export interface Message {
  id: string;
  username: string;
  message: string;
  isOwnMessage?: boolean;
  isSystem?: boolean;
  isNotice?: boolean;
  isCmd?: boolean;
  timestamp?: string;
}

interface TabRoomContextType {
  roomTabs: RoomTab[];
  activeRoomId: string | null;
  socket: Socket | null;
  currentUsername: string;
  currentUserId: string;
  
  setSocket: (socket: Socket | null) => void;
  setUserInfo: (username: string, userId: string) => void;
  
  openTab: (roomId: string, roomName: string) => void;
  closeTab: (roomId: string) => void;
  switchTab: (roomId: string) => void;
  
  addMessage: (roomId: string, message: Message) => void;
  updateRoomName: (roomId: string, newName: string) => void;
  clearAllTabs: () => void;
  
  getTab: (roomId: string) => RoomTab | undefined;
  hasTab: (roomId: string) => boolean;
}

const TabRoomContext = createContext<TabRoomContextType | undefined>(undefined);

export function TabRoomProvider({ children }: { children: ReactNode }) {
  const [roomTabs, setRoomTabs] = useState<RoomTab[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [socket, setSocketState] = useState<Socket | null>(null);
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  
  const socketRef = useRef<Socket | null>(null);
  
  const setSocket = useCallback((newSocket: Socket | null) => {
    socketRef.current = newSocket;
    setSocketState(newSocket);
  }, []);
  
  const setUserInfo = useCallback((username: string, userId: string) => {
    setCurrentUsername(username);
    setCurrentUserId(userId);
  }, []);

  const openTab = useCallback((roomId: string, roomName: string) => {
    setRoomTabs(prevTabs => {
      const existingTabIndex = prevTabs.findIndex(t => t.roomId === roomId);
      
      if (existingTabIndex !== -1) {
        console.log('📑 Tab already exists, activating:', roomId);
        return prevTabs.map((tab, index) => ({
          ...tab,
          isActive: index === existingTabIndex
        }));
      }
      
      console.log('📑 Creating new tab for room:', roomId);
      const newTab: RoomTab = {
        roomId,
        roomName,
        lastReadTime: Date.now(),
        messages: [],
        isActive: true,
      };
      
      return [
        ...prevTabs.map(tab => ({ ...tab, isActive: false })),
        newTab
      ];
    });
    
    setActiveRoomId(roomId);
  }, []);

  const closeTab = useCallback((roomId: string) => {
    setRoomTabs(prevTabs => {
      const filtered = prevTabs.filter(t => t.roomId !== roomId);
      
      if (filtered.length > 0 && activeRoomId === roomId) {
        filtered[0].isActive = true;
        setActiveRoomId(filtered[0].roomId);
      } else if (filtered.length === 0) {
        setActiveRoomId(null);
      }
      
      return filtered;
    });
  }, [activeRoomId]);

  const switchTab = useCallback((roomId: string) => {
    setRoomTabs(prevTabs => {
      const tabExists = prevTabs.some(t => t.roomId === roomId);
      if (!tabExists) return prevTabs;
      
      return prevTabs.map(tab => ({
        ...tab,
        isActive: tab.roomId === roomId
      }));
    });
    
    setActiveRoomId(roomId);
  }, []);

  const addMessage = useCallback((roomId: string, message: Message) => {
    setRoomTabs(prevTabs => {
      const tabIndex = prevTabs.findIndex(t => t.roomId === roomId);
      if (tabIndex === -1) return prevTabs;
      
      const tab = prevTabs[tabIndex];
      const messageExists = tab.messages.some(m => m.id === message.id);
      if (messageExists) return prevTabs;
      
      const updatedTabs = [...prevTabs];
      updatedTabs[tabIndex] = {
        ...tab,
        messages: [...tab.messages, message],
        lastReadTime: Date.now()
      };
      
      return updatedTabs;
    });
  }, []);

  const updateRoomName = useCallback((roomId: string, newName: string) => {
    setRoomTabs(prevTabs => {
      const tabIndex = prevTabs.findIndex(t => t.roomId === roomId);
      if (tabIndex === -1) return prevTabs;
      
      const updatedTabs = [...prevTabs];
      updatedTabs[tabIndex] = {
        ...updatedTabs[tabIndex],
        roomName: newName
      };
      
      return updatedTabs;
    });
  }, []);

  const clearAllTabs = useCallback(() => {
    setRoomTabs([]);
    setActiveRoomId(null);
  }, []);

  const getTab = useCallback((roomId: string) => {
    return roomTabs.find(t => t.roomId === roomId);
  }, [roomTabs]);

  const hasTab = useCallback((roomId: string) => {
    return roomTabs.some(t => t.roomId === roomId);
  }, [roomTabs]);

  const value: TabRoomContextType = {
    roomTabs,
    activeRoomId,
    socket,
    currentUsername,
    currentUserId,
    
    setSocket,
    setUserInfo,
    
    openTab,
    closeTab,
    switchTab,
    
    addMessage,
    updateRoomName,
    clearAllTabs,
    
    getTab,
    hasTab,
  };

  return (
    <TabRoomContext.Provider value={value}>
      {children}
    </TabRoomContext.Provider>
  );
}

export function useTabRoom() {
  const context = useContext(TabRoomContext);
  if (context === undefined) {
    throw new Error('useTabRoom must be used within a TabRoomProvider');
  }
  return context;
}
