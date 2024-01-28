import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const rankLocalStorageKey = 'CBB.DISPLAY.RANK';

let rankLocalStorage: string | null = null;

if (typeof window !== 'undefined') {
  rankLocalStorage = localStorage.getItem(rankLocalStorageKey);
}

type InitialState = {
  rank: string,
};

const initialState = {
  rank: rankLocalStorage || 'composite_rank',
} as InitialState;

export const display = createSlice({
  name: 'ranking',
  initialState: initialState,
  reducers: {
    // setSeason: (state, action: PayloadAction<number>) => {
    //   state.value.season = action.payload;
    // },
  }
});

export const {  } = display.actions;
export default display.reducer;
