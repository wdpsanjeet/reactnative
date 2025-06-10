// reducers/matchesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  matches: [],
  loading: false,
  error: null,
};

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    fetchMatchesStart(state) {
      state.loading = true;
    },
    fetchMatchesSuccess(state, action) {
      state.matches = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchMatchesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchMatchesStart, fetchMatchesSuccess, fetchMatchesFailure } = matchesSlice.actions;
export default matchesSlice.reducer;