import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const axiosInstance = axios.create({ baseURL: API, withCredentials: true });

export const createMedicalRecord = createAsyncThunk(
  "medicalRecord/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/medical-records", data);
      return res.data.medicalRecord;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create medical record"
      );
    }
  }
);

export const updateMedicalRecord = createAsyncThunk(
  "medicalRecord/update",
  async ({ recordId, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/medical-records/${recordId}`,
        data
      );
      return res.data.medicalRecord;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update medical record"
      );
    }
  }
);

export const getMedicalRecordByAppointment = createAsyncThunk(
  "medicalRecord/byAppointment",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/medical-records/${appointmentId}`);
      return res.data.medicalRecord;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch medical record"
      );
    }
  }
);
