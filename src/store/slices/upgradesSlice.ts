import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define interfaces for the data structure
interface GameAttribute {
  Id: number;
  Name: string;
  Description: string;
  CodeName: string;
  IsGun: boolean;
}

interface Attribute {
  Id: number;
  GameAttribute: GameAttribute;
  Value: number;
}

interface Upgrade {
  Id: number;
  Name: string;
  Cost: number;
  Description: string;
  Attributes: Attribute[];
}

interface UpgradeWithAvailability {
  Upgrade: Upgrade;
  Available: boolean;
}

interface UpgradesState {
  credit: number;
  upgrades: UpgradeWithAvailability[];
}

// Initial state
const initialState: UpgradesState = {
  credit: 0,
  upgrades: []
};

// Create the slice
const upgradesSlice = createSlice({
  name: 'upgrades',
  initialState,
  reducers: {
    setCredit: (state, action: PayloadAction<number>) => {
      state.credit = action.payload;
    },
    setUpgrades: (state, action: PayloadAction<UpgradeWithAvailability[]>) => {
      state.upgrades = action.payload;
    },
    updateUpgradeState: (state, action: PayloadAction<{id: number, available: boolean}>) => {
      const upgrade = state.upgrades.find(u => u.Upgrade.Id === action.payload.id);
      if (upgrade) {
        upgrade.Available = action.payload.available;
      }
    }
  }
});

// Export actions and reducer
export const { setCredit, setUpgrades, updateUpgradeState } = upgradesSlice.actions;
export default upgradesSlice.reducer;

// Selectors
export const selectCredit = (state: { upgrades: UpgradesState }) => state.upgrades.credit;
export const selectUpgrades = (state: { upgrades: UpgradesState }) => state.upgrades.upgrades;
export const selectUpgradeById = (state: { upgrades: UpgradesState }, id: number) => 
  state.upgrades.upgrades.find(u => u.Upgrade.Id === id);