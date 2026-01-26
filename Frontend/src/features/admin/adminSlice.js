import { createSlice } from "@reduxjs/toolkit";
import {
  getAdminDashboard,
  fetchAllUsers,
  fetchAllDoctors,
  toggleDoctorStatus,
  deleteUserByAdmin,
  fetchAllAppointments,
} from "./adminThunks";

const initialState = {
  dashboard: {},
  users: [],
  doctors: [],
  appointments: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(getAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
      })
      .addCase(toggleDoctorStatus.fulfilled, (state, action) => {
        const idx = state.doctors.findIndex(
          (d) => d._id === action.payload.doctorId
        );
        if (idx !== -1)
          state.doctors[idx].doctorProfile.isActive = action.payload.isActive;
      })
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
      });
  },
});

export default adminSlice.reducer;
