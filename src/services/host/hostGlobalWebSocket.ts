// src/services/globalWebSocket.ts
import WebSocketService from './hostWebsocketService';
import { store } from '../../store/store';
import { updatePlayerInfo, updateHostConnected } from '../../store/slices/playerSlice';
import { setCredit, setUpgrades } from '../../store/slices/upgradesSlice';
import { setAttributes, updateAttributeValues } from '../../store/slices/attributeSlice';
import { BaseMessage, PlayerData } from './hostTypes';
import Toast from 'react-native-toast-message';
import { getGunWebSocket } from '../gun/gunGlobalWebSocket';
import {parseStartBattleMessage} from '../gun/gunTypes';

interface BattleMessageData {
  key: string;
  for_gun: Record<string, number>;
  for_vest: Record<string, number>;
}

class HostGlobalWebSocketService {
  private static instance: HostGlobalWebSocketService;
  private wsService: WebSocketService | null = null;

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): HostGlobalWebSocketService {
    if (!HostGlobalWebSocketService.instance) {
      HostGlobalWebSocketService.instance = new HostGlobalWebSocketService();
    }
    return HostGlobalWebSocketService.instance;
  }

  public async connect(url: string): Promise<void> {
    if (!this.wsService) {
      this.wsService = new WebSocketService(url);
      
      // Set up global message handlers
      this.setupMessageHandlers();
      
      try {
        await this.wsService.connect();
        
      } catch (error) {
        console.error('Failed to connect:', error);
        
        throw error;
      }
    }
  }

  private setupMessageHandlers(): void {
    if (!this.wsService) return;

    this.wsService.addMessageListener(221, (frame: BaseMessage) => {
      console.log('frame data 21:', frame);
      if (frame?.Data) {
        // Update the Redux store with the new data
        store.dispatch(setCredit(frame.Data.Credit));
        store.dispatch(setUpgrades(frame.Data.Upgrades));
        
        Toast.show({
          type: 'info',  
          text1: 'Upgrades list!',
          text2: frame.Message,  
          position: 'top',  
          visibilityTime: 4000,
        });
      }     
    });

    // Handle player info updates (ActionCode 0)
    this.wsService.addMessageListener(222,(frame: BaseMessage) => {
      console.log('frame data 22:', frame);
      if (frame?.Data) {
        getGunWebSocket().sendMessage({
          key: 'players_registering',
          data: frame.Data
        });
      }
    });

    this.wsService.addMessageListener(223, (frame: BaseMessage) => {
      console.log('frame data 23:', frame);
      if (frame?.Data) {
        try {
          const battleData = frame.Data as BattleMessageData;
          
          // Update attribute values in the store
          store.dispatch(updateAttributeValues({
            for_gun: battleData.for_gun,
            for_vest: battleData.for_vest
          }));
    
          // Continue with the existing battle message parsing and sending
          const battleMessage = parseStartBattleMessage(frame.Data);
          getGunWebSocket().sendMessage(battleMessage);
        } catch (error) {
          console.error('Failed to process battle data:', error);
        }
      }
    });

    this.wsService.addMessageListener(224, (frame: BaseMessage) => {
      console.log('frame data 24:', frame);
      if (frame?.Data) {
        store.dispatch(setAttributes(frame.Data));
      }
    });

    this.wsService.addMessageListener(225, (frame: BaseMessage) => {
      console.log('frame data 24:', frame);
      if (frame?.Data) {
        store.dispatch(updatePlayerInfo(frame.Data as PlayerData));
      }
    });

    this.wsService.addMessageListener(200,(frame: BaseMessage) => {
      console.log('frame data 200:', frame);
      if (frame?.Message) {
        //set toast type based on message type
        var messageType = 'info';
        if (frame.MessageType === 1) {
          messageType = 'success';
        }
        else if (frame.MessageType === 2) {
          messageType = 'error';
        }
        Toast.show({
          type: messageType,  
          text1: 'Game Notification!',
          text2: frame.Message,  
          position: 'top',  
          visibilityTime: 4000,
        });
      }     
    });
    // In setupMessageHandlers()
    this.wsService.addMessageListener(999, (frame: BaseMessage) => {
      console.log('Heartbeat received');
      // You can handle the server's response to heartbeat here if needed
    });
    

    // Add more global message handlers here
  }

  public sendMessage<T>(actionCode: number, messageType: number, message: string = "", data: T | null = null): void {
    if (!this.wsService) {
      Toast.show({
        type: 'error',
        text1: 'Please connect to Host first',
        position: 'top',
        visibilityTime: 4000,
      });
      return;
    }
    this.wsService.sendMessage(actionCode, messageType, message, data);
  }

  public disconnect(): void {
    if (this.wsService) {
      this.wsService.disconnect();
      
    }
  }

  public isConnected(): boolean {
    return this.wsService?.getConnectionStatus() ?? false;
  }
}

export default HostGlobalWebSocketService;

// Export a convenience function to get the instance
export const getHostWebSocket = () => HostGlobalWebSocketService.getInstance();