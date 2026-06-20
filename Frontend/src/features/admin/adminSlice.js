import { createSlice } from "@reduxjs/toolkit";
import {
  getAdminDashboard,
  fetchAllDoctors,
  addDoctor,
  updateDoctor,
  toggleDoctorStatus,
  deleteDoctor,
  fetchAllUsers,
  deleteUserByAdmin,
  fetchAllAppointments,
  updateAppointmentStatusByAdmin,
  addUserByAdmin,
  updateUserByAdmin,
} from "./adminThunks";

const initialState = {
  dashboard: {
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    latestAppointments: [],
  },
  doctors: [],
  users: [],
  appointments: [],
  loading: false,
  appointmentsLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        const stats = action.payload || {};
        state.dashboard = {
          totalUsers: stats.totalUsers ?? 0,
          totalDoctors: stats.totalDoctors ?? 0,
          totalAppointments: stats.totalAppointments ?? 0,
          pendingAppointments: stats.pendingAppointments ?? 0,
          latestAppointments: stats.latestAppointments ?? [],
        };
      })
      .addCase(getAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload || [];
      })
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addDoctor.fulfilled, (state, action) => {
        if (action.payload) state.doctors.unshift(action.payload);
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(
          (d) => d._id === action.payload?._id,
        );
        if (index !== -1) state.doctors[index] = action.payload;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter((d) => d._id !== action.payload);
      })
      .addCase(toggleDoctorStatus.fulfilled, (state, action) => {
        const { doctorId, isActive } = action.payload;
        const index = state.doctors.findIndex((d) => d._id === doctorId);
        if (index !== -1 && state.doctors[index]?.doctorProfile) {
          state.doctors[index].doctorProfile.isActive = isActive;
        }
      })

      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload || [];
      })
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })

      .addCase(fetchAllAppointments.pending, (state) => {
        state.appointmentsLoading = true;
        state.error = null;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.appointmentsLoading = false;
        state.appointments = action.payload || [];
      })
      .addCase(fetchAllAppointments.rejected, (state, action) => {
        state.appointmentsLoading = false;
        state.error = action.payload;
      })
      .addCase(updateAppointmentStatusByAdmin.fulfilled, (state, action) => {
        const updatedAppt = action.payload;
        const index = state.appointments.findIndex(
          (a) => a._id === updatedAppt._id,
        );
        if (index !== -1) {
          state.appointments[index] = updatedAppt; // replace old appointment
        }
      })
      .addCase(addUserByAdmin.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
      })

      .addCase(updateUserByAdmin.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
