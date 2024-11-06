import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerData } from '../../services/host/hostTypes';

interface PlayerState extends PlayerData {
  HostConnected: boolean;
  VestConnected: boolean;
  GunConnected: boolean;
}

const initialState: PlayerState = {
  Name: '',
  MacGun: '',
  MacVest: '',
  CurrentHealth: 0,
  CurrentArmor: 0,
  CurrentBullet: 30,
  CurrentSSketch: 0,
  VestConnected: false,
  HostConnected: false,
  GunConnected: false,
  TotalDamage: 0,
  TotalHeal: 0,
  TotalShots: 0,
  TotalHits: 0,
  TotalKills: 0,
  TotalAssists: 0,
  TotalDeath: 0,
  Credits: 0,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    updatePlayerInfo: (state, action: PayloadAction<Partial<PlayerData>>) => {
      Object.assign(state, {
          Name: action.payload.Name ?? state.Name,
          MacGun: action.payload.MacGun ?? state.MacGun,
          MacVest: action.payload.MacVest ?? state.MacVest,
          CurrentHealth: action.payload.CurrentHealth ?? state.CurrentHealth,
          CurrentArmor: action.payload.CurrentArmor ?? state.CurrentArmor,
          CurrentBullet: action.payload.CurrentBullet ?? state.CurrentBullet,
          CurrentSSketch: action.payload.CurrentSSketch ?? state.CurrentSSketch,
          TotalDamage: action.payload.TotalDamage ?? state.TotalDamage,
          TotalHeal: action.payload.TotalHeal ?? state.TotalHeal,
          TotalShots: action.payload.TotalShots ?? state.TotalShots,
          TotalHits: action.payload.TotalHits ?? state.TotalHits,
          TotalKills: action.payload.TotalKills ?? state.TotalKills,
          TotalAssists: action.payload.TotalAssists ?? state.TotalAssists,
          TotalDeath: action.payload.TotalDeath ?? state.TotalDeath,
          Credits: action.payload.Credits ?? state.Credits,
      });
    },
  
    updatePlayerName: (state, action: PayloadAction<string>) => {
      state.Name = action.payload;
    },
    updateMacGun: (state, action: PayloadAction<string>) => {
      state.MacGun = action.payload;
    },
    updateMacVest: (state, action: PayloadAction<string>) => {
      state.MacVest = action.payload;
    },
    updateVestConnected: (state, action: PayloadAction<boolean>) => {
      state.VestConnected = action.payload;
    },
    updateHostConnected: (state, action: PayloadAction<boolean>) => {
      state.HostConnected = action.payload;
    },
    updateGunConnected: (state, action: PayloadAction<boolean>) => {
      state.GunConnected = action.payload;
    },

  }
});

export const { updatePlayerInfo, updatePlayerName, updateMacGun, updateMacVest,updateVestConnected, updateHostConnected, updateGunConnected } = playerSlice.actions;
export default playerSlice.reducer;

// src/store/store.ts
