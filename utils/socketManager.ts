import { io, Socket } from 'socket.io-client';
import { Platform, AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoomTabsStore } from '@/stores/useRoomTabsStore';

const API_BASE_URL = Platform.OS === 'web'
  ? 'https://48025373-674e-4c3a-9e28-01177a67a44d-00-2avodoixs3sz1.sisko.replit.dev'
  : 'https://48025373-674e-4c3a-9e28-01177a67a44d-00-2avodoixs3sz1.sisko.replit.dev';

interface SocketManagerState {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  reconnectAttempts: number;
  lastHeartbeat: number;
}

class SocketManager {
  private state: SocketManagerState = {
    socket: null,
    isConnected: false,
    isConnecting: false,
    reconnectAttempts: 0,
    lastHeartbeat: 0,
  };

  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private appStateSubscription: any = null;
  private eventListeners: Map<string, Set<(...args: any[]) => void>> = new Map();
  private joinedRooms: Set<string> = new Set();
  private userId: string | null = null;
  private username: string | null = null;

  private readonly HEARTBEAT_INTERVAL = 25000;
  private readonly RECONNECT_DELAYS = [1000, 2000, 5000, 10000, 30000, 60000];

  async initialize(): Promise<Socket | null> {
    if (this.state.socket && this.state.isConnected) {
      console.log('📌 Socket already connected, reusing');
      return this.state.socket;
    }

    if (this.state.isConnecting) {
      console.log('⏳ Socket connection in progress...');
      return this.waitForConnection();
    }

    return this.connect();
  }

  private async waitForConnection(): Promise<Socket | null> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.state.isConnected && this.state.socket) {
          clearInterval(checkInterval);
          resolve(this.state.socket);
        } else if (!this.state.isConnecting) {
          clearInterval(checkInterval);
          resolve(null);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(this.state.socket);
      }, 10000);
    });
  }

  private async connect(): Promise<Socket | null> {
    this.state.isConnecting = true;

    try {
      const authData = await AsyncStorage.getItem('user_data');
      if (!authData) {
        console.log('❌ No auth data, cannot connect');
        this.state.isConnecting = false;
        return null;
      }

      const { id, username } = JSON.parse(authData);
      this.userId = id?.toString();
      this.username = username;

      console.log(`🔌 Connecting to /chat as ${username} (${id})`);

      const socket = io(`${API_BASE_URL}/chat`, {
        auth: { userId: id, username },
        transports: ['websocket'],
        reconnection: false,
        timeout: 15000,
        forceNew: true,
      });

      this.setupSocketListeners(socket);
      this.state.socket = socket;

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.log('⏱️ Connection timeout');
          this.state.isConnecting = false;
          resolve(socket);
        }, 15000);

        socket.on('connect', () => {
          clearTimeout(timeout);
          resolve(socket);
        });
      });
    } catch (error) {
      console.error('❌ Socket connection error:', error);
      this.state.isConnecting = false;
      this.scheduleReconnect();
      return null;
    }
  }

  private setupSocketListeners(socket: Socket): void {
    socket.on('connect', () => {
      console.log(`✅ Socket connected! ID: ${socket.id}`);
      this.state.isConnected = true;
      this.state.isConnecting = false;
      this.state.reconnectAttempts = 0;
      
      useRoomTabsStore.getState().setSocket(socket);
      
      this.startHeartbeat();
      this.rejoinRooms();
      this.setupAppStateListener();
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${reason}`);
      this.state.isConnected = false;
      this.stopHeartbeat();

      if (reason === 'io server disconnect') {
        this.scheduleReconnect();
      } else if (reason !== 'io client disconnect') {
        this.scheduleReconnect();
      }
    });

    socket.on('connect_error', (error) => {
      console.error(`❌ Connection error: ${error.message}`);
      this.state.isConnected = false;
      this.state.isConnecting = false;
      this.scheduleReconnect();
    });

    socket.on('pong', () => {
      this.state.lastHeartbeat = Date.now();
    });

    socket.onAny((event, ...args) => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.forEach(listener => listener(...args));
      }
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      if (this.state.socket && this.state.isConnected) {
        this.state.socket.emit('ping');
        
        const timeSinceLastHeartbeat = Date.now() - this.state.lastHeartbeat;
        if (this.state.lastHeartbeat > 0 && timeSinceLastHeartbeat > this.HEARTBEAT_INTERVAL * 2) {
          console.log('💔 Heartbeat timeout, reconnecting...');
          this.forceReconnect();
        }
      }
    }, this.HEARTBEAT_INTERVAL);

    console.log('💓 Heartbeat started');
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      return;
    }

    const delay = this.RECONNECT_DELAYS[
      Math.min(this.state.reconnectAttempts, this.RECONNECT_DELAYS.length - 1)
    ];

    console.log(`🔄 Scheduling reconnect in ${delay}ms (attempt ${this.state.reconnectAttempts + 1})`);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.state.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  private async forceReconnect(): Promise<void> {
    console.log('🔄 Force reconnecting...');
    
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.state.socket) {
      this.state.socket.removeAllListeners();
      this.state.socket.disconnect();
      this.state.socket = null;
    }

    this.state.isConnected = false;
    this.state.isConnecting = false;
    
    await this.connect();
  }

  private setupAppStateListener(): void {
    if (this.appStateSubscription) {
      return;
    }

    this.appStateSubscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      console.log(`📱 App state changed: ${nextState}`);
      
      if (nextState === 'active') {
        if (!this.state.isConnected || !this.state.socket?.connected) {
          console.log('📱 App resumed, checking connection...');
          this.forceReconnect();
        }
      }
    });
  }

  private rejoinRooms(): void {
    if (this.joinedRooms.size > 0 && this.state.socket && this.state.isConnected) {
      console.log(`🔄 Rejoining ${this.joinedRooms.size} rooms...`);
      this.joinedRooms.forEach(roomId => {
        this.state.socket?.emit('join_room', {
          roomId,
          username: this.username,
          userId: this.userId,
        });
      });
    }
  }

  joinRoom(roomId: string): void {
    this.joinedRooms.add(roomId);
    if (this.state.socket && this.state.isConnected) {
      this.state.socket.emit('join_room', {
        roomId,
        username: this.username,
        userId: this.userId,
      });
    }
  }

  leaveRoom(roomId: string): void {
    this.joinedRooms.delete(roomId);
    if (this.state.socket && this.state.isConnected) {
      this.state.socket.emit('leave_room', {
        roomId,
        username: this.username,
      });
    }
  }

  emit(event: string, data?: any, callback?: (...args: any[]) => void): boolean {
    if (!this.state.socket || !this.state.isConnected) {
      console.log(`⚠️ Cannot emit "${event}", socket not connected. Reconnecting...`);
      this.forceReconnect();
      return false;
    }

    if (callback) {
      this.state.socket.emit(event, data, callback);
    } else {
      this.state.socket.emit(event, data);
    }
    return true;
  }

  on(event: string, listener: (...args: any[]) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(listener);

    if (this.state.socket) {
      this.state.socket.on(event, listener);
    }
  }

  off(event: string, listener: (...args: any[]) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(listener);
    }

    if (this.state.socket) {
      this.state.socket.off(event, listener);
    }
  }

  getSocket(): Socket | null {
    return this.state.socket;
  }

  isConnected(): boolean {
    return this.state.isConnected && this.state.socket?.connected === true;
  }

  disconnect(): void {
    console.log('🔌 Disconnecting socket...');
    
    this.stopHeartbeat();
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }

    if (this.state.socket) {
      this.state.socket.removeAllListeners();
      this.state.socket.disconnect();
      this.state.socket = null;
    }

    this.state.isConnected = false;
    this.state.isConnecting = false;
    this.state.reconnectAttempts = 0;
    this.joinedRooms.clear();
    this.eventListeners.clear();

    useRoomTabsStore.getState().setSocket(null);
  }
}

export const socketManager = new SocketManager();
export default socketManager;
