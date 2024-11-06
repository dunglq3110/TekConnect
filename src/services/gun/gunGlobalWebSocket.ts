// src/services/gunGlobalWebSocket.ts
import { store } from '../../store/store';
import { updateHostConnected, updateGunConnected ,updateMacGun, updateMacVest, updateVestConnected } from '../../store/slices/playerSlice';
import GunWebSocketService from './gunWebsocketService';
import { GunBaseMessage, PlayersRegisteringMessage, StartBattleMessage, SubmitMacMessage } from './gunTypes';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { RootState } from   '../../store/store';

class GunGlobalWebSocketService {
  private static instance: GunGlobalWebSocketService;
  private wsService: GunWebSocketService | null = null;

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): GunGlobalWebSocketService {
    if (!GunGlobalWebSocketService.instance) {
      GunGlobalWebSocketService.instance = new GunGlobalWebSocketService();
    }
    return GunGlobalWebSocketService.instance;
  }
  
  public async connect(url: string): Promise<void> {
    if (!this.wsService) {
      this.wsService = new GunWebSocketService(url);
      
      // Set up message handlers
      this.setupMessageHandlers();
      
      try {
        await this.wsService.connect();
        
      } catch (error) {
        console.error('Failed to connect:', error);
        store.dispatch(updateGunConnected(false));
        Toast.show({
          type: 'error',
          text1: 'Gun Connection Failed',
          position: 'top',
          visibilityTime: 4000,
        });
        throw error;
      }
    }
  }

  private setupMessageHandlers(): void {
    if (!this.wsService) return;

    // Handle players registering
    this.wsService.addMessageListener('submit_mac', (message: GunBaseMessage) => {
      const msg = message as SubmitMacMessage;
      store.dispatch(updateMacGun(msg.gun_mac));
      store.dispatch(updateMacVest(msg.vest_mac));
      store.dispatch(updateVestConnected(msg.is_vest_connected));
      console.log('MAC Addresses', msg.gun_mac, msg.vest_mac);
      Toast.show({
        type: 'info',
        text1: 'MAC Addresses Submitted',
        text2: `Gun: ${msg.gun_mac} \nVest: ${msg.vest_mac}`,
        position: 'top',
        visibilityTime: 4000,
      });
    });


    this.wsService.addMessageListener('players_registering', (message: GunBaseMessage) => {
      const msg = message as PlayersRegisteringMessage;
      // Handle players registering data
      console.log('Players registering:', msg.data);
      Toast.show({
        type: 'info',
        text1: 'Players Registering',
        text2: `${msg.data.length} players joined`,
        position: 'top',
        visibilityTime: 4000,
      });
    });

    // Add more message handlers as needed
  }

  public sendMessage(message: GunBaseMessage): void {
    if (!this.wsService) {
      Toast.show({
        type: 'error',
        text1: 'Please connect to Gun first',
        position: 'top',
        visibilityTime: 4000,
      });
      return;
    }
    this.wsService.sendMessage(message);
  }

  public disconnect(): void {
    if (this.wsService) {
      this.wsService.disconnect();
      store.dispatch(updateGunConnected(false));
      Toast.show({
        type: 'error',
        text1: 'You are disconnected from Gun',
        position: 'top',
        visibilityTime: 4000,
      });
    }
  }

  public isConnected(): boolean {
    return this.wsService?.getConnectionStatus() ?? false;
  }
}

export default GunGlobalWebSocketService;

// Export a convenience function to get the instance
export const getGunWebSocket = () => GunGlobalWebSocketService.getInstance();