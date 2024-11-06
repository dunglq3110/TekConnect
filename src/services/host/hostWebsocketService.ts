// websocketService.ts
import { BaseMessage, MessageListener, HostWebSocketServiceInterface } from './hostTypes';
import { store } from '../../store/store';
import { updatePlayerInfo, updateHostConnected } from '../../store/slices/playerSlice';
import Toast from 'react-native-toast-message';

class HostWebSocketService implements HostWebSocketServiceInterface {
  private url: string;
  private ws: WebSocket | null;
  private isConnected: boolean;
  private reconnectAttempts: number;
  private readonly maxReconnectAttempts: number;
  private readonly listeners: Map<string, Set<MessageListener>>;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private readonly HEARTBEAT_INTERVAL = 3000; // Send heartbeat every 30 seconds
  private shouldReconnect: boolean = true; // Flag to control reconnection

  constructor(url: string) {
    this.url = url;
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.shouldReconnect = true;
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket Connected');
          store.dispatch(updateHostConnected(true));
          Toast.show({
            type: 'success',
            text1: 'Host connection established',
            position: 'top',
            visibilityTime: 4000,
          });
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event: WebSocketMessageEvent) => {
          try {
            const data: BaseMessage = JSON.parse(event.data);
            // Reset reconnect attempts on any successful message
            this.reconnectAttempts = 0;
            this.handleMessage(data);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        this.ws.onerror = (event: Event) => {
          const error = event as WebSocketErrorEvent;
          Toast.show({
            type: 'error',
            text1: 'Something error happened!!',
            text2 : 'we will try to reconnect',
            position: 'top',
            visibilityTime: 4000,
          });
          this.handleReconnect();
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket Disconnected');
          this.isConnected = false;
          Toast.show({
            type: 'error',
            text1: 'You are disconnected from Host!!',
            text2 : 'we will try to reconnect',
            position: 'top',
            visibilityTime: 4000,
          });
          this.stopHeartbeat();
          if (this.shouldReconnect) {
            this.handleReconnect();
          }
        };

      } catch (error) {
        console.error('Connection Error:', error);
        reject(error);
      }
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat(); // Clear any existing interval
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, this.HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private sendHeartbeat(): void {
    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      try {
        // Send a ping message with action code 999
        this.sendMessage(999, 0, "ping");
      } catch (error) {
        console.error('Error sending heartbeat:', error);
        this.handleReconnect();
      }
    }
  }

  private handleReconnect(): void {
    store.dispatch(updateHostConnected(false));

    if (!this.shouldReconnect) return;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff with max 30s
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts} after ${delay}ms`);
      
      setTimeout(() => {
        if (this.shouldReconnect) {
          this.connect().catch(error => {
            console.error('Reconnection failed:', error);
          });
        }
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      Toast.show({
        type: 'error',
        text1: 'It seems like you internet connection is unstable',
        text2: 'Failed to reconnect to Host',
        position: 'top',
        visibilityTime: 4000,
      });
    }
  }

  private handleMessage(data: BaseMessage): void {
    const key = `${data.ActionCode}`;
    
    if (this.listeners.has(key)) {
      const callbacks = this.listeners.get(key);
      callbacks?.forEach(callback => callback(data));
    }
  }

  public addMessageListener(
    actionCode: number,
    callback: MessageListener
  ): void {
    const key = `${actionCode}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)?.add(callback);
  }

  public removeMessageListener(
    actionCode: number,
    callback: MessageListener
  ): void {
    const key = `${actionCode}`;
    this.listeners.get(key)?.delete(callback);
  }

  public sendMessage<T>(
    actionCode: number,
    messageType: number,
    message: string = "",
    data: T | null = null
  ): void {
    if (!this.isConnected || !this.ws) {
      throw new Error('WebSocket is not connected');
    }

    const payload: BaseMessage<T> = {
      ActionCode: actionCode,
      MessageType: messageType,
      Message: message,
      Data: data as T
    };

    this.ws.send(JSON.stringify(payload));
  }

  public disconnect(): void {
    this.shouldReconnect = false; // Prevent auto-reconnection
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export default HostWebSocketService;