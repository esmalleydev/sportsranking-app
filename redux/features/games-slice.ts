import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import HelperCBB from '@/components/helpers/CBB';


type InitialState = {
  visibleGames: string[],
  nonVisibleGames: string[],
  displayedGames: string[],
  scores: object,
  dates_checked: object,
  scrollTop: number,
  refreshRate: number,
  refreshCountdown: number,
};

const initialState = {
  visibleGames: [],
  nonVisibleGames: [],
  displayedGames: [],
  scores: {},
  dates_checked: {},
  scrollTop: 0,
  refreshRate: 30,
  refreshCountdown: 30,
} as InitialState;

export const games = createSlice({
  name: 'games',
  initialState: initialState,
  reducers: {
    setRefreshCountdown: (state, action: PayloadAction<number>) => {
      state.refreshCountdown = action.payload;
    },
    setScrollTop: (state, action: PayloadAction<number>) => {
      state.scrollTop = action.payload;
    },
    updateVisibleGames: (state, action: PayloadAction<string>) => {
      const index = state.visibleGames.indexOf(action.payload);
      const nonVisibleIndex = state.nonVisibleGames.indexOf(action.payload);
      if (nonVisibleIndex !== -1) {
        state.nonVisibleGames = [
          ...state.nonVisibleGames.slice(0, nonVisibleIndex),
          ...state.nonVisibleGames.slice(nonVisibleIndex + 1)
        ];
      }
      if (index === -1) {
        state.visibleGames = [...state.visibleGames, action.payload];
      }
    },
    updateNonVisibleGames: (state, action: PayloadAction<string>) => {
      const index = state.nonVisibleGames.indexOf(action.payload);
      const visibleIndex = state.visibleGames.indexOf(action.payload);
      if (visibleIndex !== -1) {
        state.visibleGames = [
          ...state.visibleGames.slice(0, visibleIndex),
          ...state.visibleGames.slice(visibleIndex + 1)
        ];
      }
      if (index === -1) {
        state.nonVisibleGames = [...state.nonVisibleGames, action.payload];
      }
    },
    updateDisplayedGames: (state, action: PayloadAction<Array<string>>) => {
      state.displayedGames = action.payload || [];
    },
    updateScores: (state, action: PayloadAction<object>) => {
      state.scores = action.payload || {};
    },
    updateDateChecked: (state, action: PayloadAction<string>) => {
      state.dates_checked[action.payload] = true;
    },
    clearDatesChecked: (state, action: PayloadAction<string| null>) => {
      if (action.payload && action.payload in state.dates_checked) {
        state.dates_checked[action.payload] = false;
      } else {
        state.dates_checked = {};
      }
    },
  }
});

export const { updateVisibleGames, updateNonVisibleGames, updateDisplayedGames, updateScores, updateDateChecked, clearDatesChecked, setScrollTop, setRefreshCountdown } = games.actions;
export default games.reducer;
