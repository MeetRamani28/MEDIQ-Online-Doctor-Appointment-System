import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSpecializations,
  fetchDoctorsBySpecialization,
  fetchDoctorById,
  createSpecialization,
  updateSpecialization,
  toggleSpecializationStatus,
} from "./specializationThunks";

const initialState = {
  list: [],
  doctors: [],
  doctorCount: 0,
  loading: false,
  error: null,
  successMessage: null,
  selectedDoctor: null,
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
    clearDoctors: (state) => {
      state.doctors = [];
      state.doctorCount = 0;
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

      .addCase(fetchDoctorsBySpecialization.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.doctors = [];
        state.doctorCount = 0;
      })
      .addCase(fetchDoctorsBySpecialization.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.doctors;
        state.doctorCount = action.payload.count;
      })
      .addCase(fetchDoctorsBySpecialization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state) => {
        state.loading = false;
        state.selectedDoctor = null;
      })

      .addCase(createSpecialization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSpecialization.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
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
