// attributeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameAttribute {
  Id: number;
  Name: string;
  Description: string;
  CodeName: string;
  IsGun: boolean;
  Value: number;
}

interface AttributeState {
  attributes: GameAttribute[];
}

const initialState: AttributeState = {
  attributes: [],
};

interface AttributeValues {
  for_gun: Record<string, number>;
  for_vest: Record<string, number>;
}

const attributeSlice = createSlice({
  name: 'attributes',
  initialState,
  reducers: {
    setAttributes: (state, action: PayloadAction<GameAttribute[]>) => {
      state.attributes = action.payload;
    },
    updateAttributeValues: (state, action: PayloadAction<AttributeValues>) => {
      const { for_gun, for_vest } = action.payload;
      
      state.attributes = state.attributes.map(attr => {
        if (attr.IsGun && for_gun.hasOwnProperty(attr.CodeName)) {
          return { ...attr, Value: for_gun[attr.CodeName] };
        }
        if (!attr.IsGun && for_vest.hasOwnProperty(attr.CodeName)) {
          return { ...attr, Value: for_vest[attr.CodeName] };
        }
        return attr;
      });
    },
  },
});

export const { setAttributes, updateAttributeValues } = attributeSlice.actions;
export default attributeSlice.reducer;