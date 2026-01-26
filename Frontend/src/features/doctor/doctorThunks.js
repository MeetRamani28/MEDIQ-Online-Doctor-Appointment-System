import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const axiosInstance = axios.create({ baseURL: API, withCredentials: true });

export const getDoctorDashboard = createAsyncThunk(
  "doctor/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/doctor/dashboard");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch doctor dashboard"
      );
    }
  }
);

export const getDoctorMedicalRecords = createAsyncThunk(
  "doctor/medicalRecords",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/doctor/medical-records");
      return res.data.records;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch medical records"
      );
    }
  }
);

export const getDoctorProfile = createAsyncThunk(
  "doctor/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/doctor/profile");
      return res.data.doctor;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateDoctorProfile = createAsyncThunk(
  "doctor/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch("/doctor/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.doctor;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);
