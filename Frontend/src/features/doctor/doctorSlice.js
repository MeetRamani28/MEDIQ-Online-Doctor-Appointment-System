import { createSlice } from "@reduxjs/toolkit";
import {
  getDoctorDashboard,
  getDoctorMedicalRecords,
  getDoctorProfile,
  updateDoctorProfile,
} from "./doctorThunks";

const initialState = {
  dashboard: {},
  medicalRecords: [],
  profile: null,
  loading: false,
  error: null,
  successMessage: null,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    clearDoctorError: (state) => {
      state.error = null;
    },
    clearDoctorSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDoctorDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(getDoctorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDoctorMedicalRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorMedicalRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalRecords = action.payload;
      })
      .addCase(getDoctorMedicalRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.successMessage = "Profile updated successfully";
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDoctorError, clearDoctorSuccess } = doctorSlice.actions;
export default doctorSlice.reducer;
