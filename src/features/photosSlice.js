import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch photos from Unsplash API
export const fetchPhotos = createAsyncThunk("photos/fetchPhotos", async (searchTerm) => {
  try {
    const apiKey = "HISZC5YhJeF7ZHWnMkAzMpk7NJu5efYAyofzFrNs4fo"; // Your Access Key
    const query = searchTerm.trim() ? encodeURIComponent(searchTerm) : "random";
    const response = await axios.get(`https://api.unsplash.com/search/photos?page=1&per_page=30&query=${query}&client_id=${apiKey}`);
    console.log("Unsplash Response:", response.data); // Debug log
    if (!response.data.results || response.data.results.length === 0) {
      throw new Error("No photos found in API response");
    }
    return response.data.results.map((photo) => ({
      id: photo.id,
      description: photo.description || photo.alt_description || "Untitled",
      urls: {
        small: photo.urls.small,
        regular: photo.urls.regular,
      },
      albumId: 1,
    }));
  } catch (error) {
    console.error("Unsplash API Error:", error);
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch photos from Unsplash API");
  }
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
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.photos = [];
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default photosSlice.reducer;