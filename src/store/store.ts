import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import upgradesReducer from './slices/upgradesSlice';
import attributeReducer from './slices/attributeSlice';
import chatReducer from './slices/chatSlice'; 
export const store = configureStore({
  reducer: {
    player: playerReducer,
    upgrades: upgradesReducer,
    attributes: attributeReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;