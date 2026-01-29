import { createSlice } from "@reduxjs/toolkit";
import {
  createAppointment,
  cancelAppointment,
  completeAppointment,
  getMyAppointments,
  getDoctorAppointments,
} from "./appointmentThunks";

const initialState = {
  myAppointments: [],
  doctorAppointments: [],
  loading: false,
  error: null,
  successMessage: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearAppointmentError: (state) => {
      state.error = null;
    },
    clearAppointmentSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.myAppointments.push(action.payload);
        state.successMessage = "Appointment created successfully";
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.myAppointments = state.myAppointments.map((a) =>
          a._id === action.payload.appointmentId
            ? { ...a, status: "CANCELLED" }
            : a
        );
        state.successMessage = action.payload.message;
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(completeAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeAppointment.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Appointment completed";
      })
      .addCase(completeAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMyAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.myAppointments = action.payload;
      })
      .addCase(getMyAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDoctorAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorAppointments = action.payload;
      })
      .addCase(getDoctorAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAppointmentError, clearAppointmentSuccess } =
  appointmentSlice.actions;
export default appointmentSlice.reducer;
