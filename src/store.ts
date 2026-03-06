// Redux Store - ניהול מצב גלובלי
import { configureStore, createSlice } from '@reduxjs/toolkit';

// מצב ראשוני
const initialState = {
  selectedCoins: [] as string[],
};

// יצירת ה-Slice
const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    addCoin: (state, action) => {
      if (!state.selectedCoins.includes(action.payload) && state.selectedCoins.length < 5) {
        state.selectedCoins.push(action.payload);
      }
    },
    removeCoin: (state, action) => {
      state.selectedCoins = state.selectedCoins.filter((id) => id !== action.payload);
    },
    replaceCoin: (state, action) => {
      const index = state.selectedCoins.indexOf(action.payload.oldCoinId);
      if (index !== -1) {
        state.selectedCoins[index] = action.payload.newCoinId;
      }
    },
  },
});

export const { addCoin, removeCoin, replaceCoin } = coinsSlice.actions;

const store = configureStore({
  reducer: {
    coins: coinsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
