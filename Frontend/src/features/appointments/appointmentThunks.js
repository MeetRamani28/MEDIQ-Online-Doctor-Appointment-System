import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const axiosInstance = axios.create({ baseURL: API, withCredentials: true });

export const createAppointment = createAsyncThunk(
  "appointment/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/appointments", data);
      return res.data.appointment;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create appointment"
      );
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  "appointment/cancel",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/appointments/cancel/${appointmentId}`
      );
      return { appointmentId, message: res.data.message };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to cancel appointment"
      );
    }
  }
);

export const completeAppointment = createAsyncThunk(
  "appointment/complete",
  async ({ appointmentId, medicalRecord }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/appointments/complete/${appointmentId}`,
        medicalRecord
      );
      return res.data.medicalRecord;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to complete appointment"
      );
    }
  }
);

export const getMyAppointments = createAsyncThunk(
  "appointment/myAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/appointments/my");
      return res.data.appointments;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch appointments"
      );
    }
  }
);

export const getDoctorAppointments = createAsyncThunk(
  "appointment/doctorAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/appointments/doctor");
      return res.data.appointments;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch doctor appointments"
      );
    }
  }
);
