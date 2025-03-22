import { configureStore } from "@reduxjs/toolkit";
import photosReducer from "./features/photosSlice.js";

// Configure the Redux store with the photos reducer
export const store = configureStore({
  reducer: {
    photos: photosReducer,
  },
});