import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const axiosInstance = axios.create({ baseURL: API, withCredentials: true });

export const getAdminDashboard = createAsyncThunk(
  "admin/getDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/dashboard");
      return res.data?.data || {};
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const fetchAllDoctors = createAsyncThunk(
  "admin/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/doctors");
      return Array.isArray(res.data?.doctors) ? res.data.doctors : [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch doctors"
      );
    }
  }
);

export const addDoctor = createAsyncThunk(
  "admin/addDoctor",
  async (doctorData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/admin/doctors", doctorData);
      return res.data?.doctor || null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add doctor"
      );
    }
  }
);

export const updateDoctor = createAsyncThunk(
  "admin/updateDoctor",
  async ({ id, doctorData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/admin/doctors/${id}`, doctorData);
      return res.data?.doctor || null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update doctor"
      );
    }
  }
);

export const toggleDoctorStatus = createAsyncThunk(
  "admin/toggleDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/admin/doctors/toggle/${doctorId}`
      );
      return { doctorId, isActive: res.data?.isActive ?? false };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle doctor status"
      );
    }
  }
);

export const deleteDoctor = createAsyncThunk(
  "admin/deleteDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/doctors/${doctorId}`);
      return doctorId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete doctor"
      );
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/users");
      return Array.isArray(res.data?.users) ? res.data.users : [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
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
      return Array.isArray(res.data?.appointments) ? res.data.appointments : [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch appointments"
      );
    }
  }
);

export const updateAppointmentStatusByAdmin = createAsyncThunk(
  "admin/updateAppointmentStatus",
  async ({ appointmentId, status }, { rejectWithValue }) => {
    const allowedStatuses = ["PENDING", "CANCELLED", "COMPLETED"];
    if (!allowedStatuses.includes(status)) {
      return rejectWithValue("Invalid appointment status");
    }

    try {
      const res = await axiosInstance.patch(
        `/admin/appointments/${appointmentId}/status`,
        { status }
      );

      return res.data.appointment;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update appointment status"
      );
    }
  }
);

export const addUserByAdmin = createAsyncThunk(
  "admin/addUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/admin/users", data);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add user"
      );
    }
  }
);

export const updateUserByAdmin = createAsyncThunk(
  "admin/updateUser",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/admin/users/${userId}`, data);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update user"
      );
    }
  }
);
