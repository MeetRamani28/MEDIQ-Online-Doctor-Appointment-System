import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSpecializations,
  createSpecialization,
  updateSpecialization,
  toggleSpecializationStatus,
} from "./specializationThunks";

const initialState = {
  list: [],
  loading: false,
  error: null,
  successMessage: null,
};

const specializationSlice = createSlice({
  name: "specialization",
  initialState,
  reducers: {
    clearSpecializationError: (state) => {
      state.error = null;
    },
    clearSpecializationSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecializations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecializations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSpecializations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createSpecialization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSpecialization.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload); // add new specialization at the top
        state.successMessage = "Specialization created successfully";
      })
      .addCase(createSpecialization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateSpecialization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSpecialization.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex((s) => s._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        state.successMessage = "Specialization updated successfully";
      })
      .addCase(updateSpecialization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(toggleSpecializationStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex((s) => s._id === action.payload.id);
        if (idx !== -1) state.list[idx].isActive = action.payload.isActive;
      });
  },
});

export const { clearSpecializationError, clearSpecializationSuccess } =
  specializationSlice.actions;

export default specializationSlice.reducer;
