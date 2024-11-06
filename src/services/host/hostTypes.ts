export interface BaseMessage<T = any> {
    ActionCode: number;
    MessageType: number;
    Message: string;
    Data: T;
}
  
export interface PlayerData {
    Name: string;
    MacGun: string;
    MacVest: string;
    CurrentHealth: number;
    CurrentArmor: number;
    CurrentBullet: number;
    CurrentSSketch: number;
    TotalDamage: number;
    TotalHeal: number;
    TotalShots: number;
    TotalHits: number;
    TotalKills: number;
    TotalAssists: number;
    TotalDeath: number;
    Credits: number;
}

  
export type MessageListener = (data: BaseMessage) => void;
  
export interface HostWebSocketServiceInterface {
    connect(): Promise<void>;
    disconnect(): void;
    sendMessage<T>(actionCode: number, messageType: number, message?: string, data?: T): void;
    addMessageListener(actionCode: number, callback: MessageListener): void;
    removeMessageListener(actionCode: number, callback: MessageListener): void;
}