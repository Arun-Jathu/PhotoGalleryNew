import { configureStore } from '@reduxjs/toolkit';
import photosReducer from './features/photosSlice.js';

export const store = configureStore({
  reducer: {
    photos: photosReducer,
  },
});