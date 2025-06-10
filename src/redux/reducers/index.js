// reducers/index.js
import { combineReducers } from 'redux';
import authReducer from '../authSlice';
import matchesReducer from '../matchesSlice';
import bookingsReducer from '../bookingsSlice';
// import uiReducer from './uiSlice';

export default combineReducers({
  auth: authReducer,
  matches: matchesReducer,
  bookings: bookingsReducer,
//   ui: uiReducer,
});