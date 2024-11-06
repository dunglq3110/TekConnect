import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import upgradesReducer from './slices/upgradesSlice';
import attributeReducer from './slices/attributeSlice';
export const store = configureStore({
  reducer: {
    player: playerReducer,
    upgrades: upgradesReducer,
    attributes: attributeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;