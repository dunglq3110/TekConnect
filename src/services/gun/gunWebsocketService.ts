// src/services/gunWebsocketService.ts
import { GunBaseMessage, GunMessageHandler, GunWebSocketServiceInterface, isGunBaseMessage } from './gunTypes';
import { updateHostConnected, updateGunConnected, updateMacGun, updateMacVest, updateVestConnected } from '../../store/slices/playerSlice';

import { getHostWebSocket } from '../host/hostGlobalWebSocket';
import Toast from 'react-native-toast-message';
import { store } from '../../store/store';
class GunWebSocketService implements GunWebSocketServiceInterface {
  private url: string;
  private ws: WebSocket | null;
  private isConnected: boolean;
  private reconnectAttempts: number;
  private readonly maxReconnectAttempts: number;
  private readonly listeners: Map<string, Set<GunMessageHandler>>;

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
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('Gun WebSocket Connected');
          store.dispatch(updateGunConnected(true));
          Toast.show({
            type: 'success',
            text1: 'Connected to Gun',
            position: 'top',
            visibilityTime: 4000,
          });
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event: WebSocketMessageEvent) => {
          try {
            const rawData = event.data;

            // First check if it's a hex string
            if (typeof rawData === 'string' && this.isHexString(rawData)) {
              console.log('Received hex string:', rawData);

              // Split the string by "|" and filter out empty strings from leading/trailing "|"
              const hexSegments = rawData.split('|').filter(segment => segment.length > 0);

              // Process each hex segment
              hexSegments.forEach(segment => {
                // Get the first two characters of the segment and convert them to an integer
                const firstTwoHex = segment.slice(0, 2);
                const messageCode = parseInt(firstTwoHex, 16);

                try {
                  // Replace getHostWebSocket().sendMessage with your actual sending function
                  getHostWebSocket().sendMessage(messageCode, 0, "", segment);
                } catch (error) {
                  console.error('Failed to send hex message for segment:', segment, error);
                }
              });

              // Stop further processing since it's a hex string
              return;
            }

            // If not hex, try to parse as JSON
            const data = JSON.parse(rawData);
            if (isGunBaseMessage(data)) {
              console.log('Received accepted message:', data);
              this.handleMessage(data);
            } else {
              console.warn('Received message does not match expected format:', data);
            }
          } catch (error) {
            console.error('Error processing message:', error);
            Toast.show({
              type: 'error',
              text1: 'Error when sending message',
              position: 'top',
              visibilityTime: 4000,
            });
          }
        };


        this.ws.onerror = (event: Event) => {
          const error = event as WebSocketErrorEvent;
          console.error('Gun WebSocket Error:', error);
          store.dispatch(updateGunConnected(false));
          Toast.show({
            type: 'error',
            text1: 'Something Error with Gun connection!!',
            text2: 'we will try to reconnect',
            position: 'top',
            visibilityTime: 4000,
          });
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('Gun WebSocket Disconnected');
          this.isConnected = false;
          Toast.show({
            type: 'error',
            text1: 'Disconnected from Gun',
            text2: 'we will try to reconnect',
            position: 'top',
            visibilityTime: 4000,
          });
          this.handleReconnect();
        };

      } catch (error) {
        console.error('Connection Error:', error);
        reject(error);
      }
    });
  }

  private handleReconnect(): void {
    store.dispatch(updateGunConnected(false));
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => {
        this.connect();
      }, 3000);
    }
    else {
      Toast.show({
        type: 'error',
        text1: 'Failed to reconnect to Gun',
        text2: 'Please check your connection and try again',
        position: 'top',
        visibilityTime: 4000,
      });
    }
  }

  private handleMessage(message: GunBaseMessage): void {
    if (this.listeners.has(message.key)) {
      const callbacks = this.listeners.get(message.key);
      callbacks?.forEach(callback => callback(message));
    }
  }

  public addMessageListener(key: string, callback: GunMessageHandler): void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)?.add(callback);
  }

  public removeMessageListener(key: string, callback: GunMessageHandler): void {
    this.listeners.get(key)?.delete(callback);
  }

  public sendMessage(message: GunBaseMessage): void {
    if (!this.isConnected || !this.ws) {
      throw new Error('WebSocket is not connected');
    }

    this.ws.send(JSON.stringify(message));
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
  private isHexString(str: string): boolean {
    // Regular expression to check if the string contains only hex characters and "|" separators
    const hexWithSeparatorRegex = /^\|?(?:[0-9A-Fa-f]{2,})(?:\|[0-9A-Fa-f]{2,})*\|?$/;
    return typeof str === 'string' && hexWithSeparatorRegex.test(str);
  }


}

export default GunWebSocketService;