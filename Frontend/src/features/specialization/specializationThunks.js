import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
});

export const fetchSpecializations = createAsyncThunk(
  "specialization/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/specializations");
      return res.data.specializations;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch specializations"
      );
    }
  }
);

export const fetchDoctorsBySpecialization = createAsyncThunk(
  "specialization/fetchDoctorsBySpecialization",
  async (specializationId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/users/specialization/${specializationId}/doctors`
      );

      return {
        doctors: res.data.doctors,
        count: res.data.count,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch doctors"
      );
    }
  }
);

export const fetchDoctorById = createAsyncThunk(
  "specialization/fetchDoctorById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/specialization/doctors/${id}`);
      return res.data.doctor;
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      return rejectWithValue("Failed to fetch doctor");
    }
  }
);

export const createSpecialization = createAsyncThunk(
  "specialization/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/specializations", data);
      return res.data.specialization;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create specialization"
      );
    }
  }
);

export const updateSpecialization = createAsyncThunk(
  "specialization/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/specializations/${id}`, data);
      return res.data.specialization;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update specialization"
      );
    }
  }
);

export const toggleSpecializationStatus = createAsyncThunk(
  "specialization/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/specializations/toggle/${id}`);
      return { id, isActive: res.data.isActive };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle specialization status"
      );
    }
  }
);
