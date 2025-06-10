// reducers/bookingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  selectedSeats: [],
  currentBooking: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    selectSeat(state, action) {
      state.selectedSeats.push(action.payload);
    },
    deselectSeat(state, action) {
      state.selectedSeats = state.selectedSeats.filter(seat => seat !== action.payload);
    },
    clearSelection(state) {
      state.selectedSeats = [];
    },
    createBookingStart(state) {
      state.loading = true;
    },
    createBookingSuccess(state, action) {
      state.bookings.push(action.payload);
      state.currentBooking = action.payload;
      state.selectedSeats = [];
      state.loading = false;
    },
    loadUserBookings(state, action) {
      state.bookings = action.payload;
    },
  },
});

export const { 
  selectSeat, 
  deselectSeat, 
  clearSelection,
  createBookingStart,
  createBookingSuccess,
  loadUserBookings,
} = bookingsSlice.actions;
export default bookingsSlice.reducer;