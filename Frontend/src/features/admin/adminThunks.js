import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const axiosInstance = axios.create({ baseURL: API, withCredentials: true });

export const getAdminDashboard = createAsyncThunk(
  "admin/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/dashboard");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/users");
      return res.data.users;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchAllDoctors = createAsyncThunk(
  "admin/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/doctors");
      return res.data.doctors;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch doctors"
      );
    }
  }
);

export const toggleDoctorStatus = createAsyncThunk(
  "admin/toggleDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/admin/doctors/${doctorId}/toggle`
      );
      return { doctorId, isActive: res.data.isActive };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle doctor status"
      );
    }
  }
);

export const deleteUserByAdmin = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      return userId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

export const fetchAllAppointments = createAsyncThunk(
  "admin/fetchAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/appointments");
      return res.data.appointments;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch appointments"
      );
    }
  }
);
