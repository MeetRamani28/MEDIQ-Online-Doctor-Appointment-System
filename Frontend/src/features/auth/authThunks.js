import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
});

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid credentials",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      return res.data;
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      return rejectWithValue("Logout failed");
    }
  },
);

export const fetchUserProfile = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data.user;
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      return rejectWithValue("Unauthorized");
    }
  },
);

export const verifyLicenseThunk = createAsyncThunk(
  "auth/verifyLicense",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/verify-license", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data; // સક્સેસ મેસેજ રિટર્ન કરશે
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Verification failed",
      );
    }
  },
);
