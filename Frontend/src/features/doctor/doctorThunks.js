import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const axiosInstance = axios.create({ baseURL: API, withCredentials: true });

export const getDoctorDashboard = createAsyncThunk(
  "doctor/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/doctor/dashboard");
      const data = res.data.data;

      // Ensure arrays
      data.upcomingAppointments = Array.isArray(data.upcomingAppointments)
        ? data.upcomingAppointments
        : [];
      data.todayAppointments = Array.isArray(data.todayAppointments)
        ? data.todayAppointments
        : [];
      data.recentRecords = Array.isArray(data.recentRecords)
        ? data.recentRecords
        : [];

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch doctor dashboard"
      );
    }
  }
);

// Fetch doctor medical records
export const getDoctorMedicalRecords = createAsyncThunk(
  "doctor/medicalRecords",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/doctor/medical-records");
      return res.data.records || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch medical records"
      );
    }
  }
);

// Fetch doctor profile
export const getDoctorProfile = createAsyncThunk(
  "doctor/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/doctor/profile");
      return res.data.doctor || null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// Update doctor profile
export const updateDoctorProfile = createAsyncThunk(
  "doctor/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch("/doctor/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.doctor || null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);
