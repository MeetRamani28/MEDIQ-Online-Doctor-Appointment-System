import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
});

export const submitContact = createAsyncThunk(
  "contact/submit",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/contact", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to submit message"
      );
    }
  }
);

export const getAllContacts = createAsyncThunk(
  "contact/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/contact");
      return res.data.contacts;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch contacts"
      );
    }
  }
);
