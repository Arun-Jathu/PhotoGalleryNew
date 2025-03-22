import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch photos from JSONPlaceholder API
export const fetchPhotos = createAsyncThunk("photos/fetchPhotos", async () => {
  const response = await axios.get("https://jsonplaceholder.typicode.com/photos");
  return response.data; // Fetch all photos from the API
});

// Redux slice for managing photo state
const photosSlice = createSlice({
  name: "photos",
  initialState: {
    photos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle loading state
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle successful fetch
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload;
      })
      // Handle fetch error
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default photosSlice.reducer;