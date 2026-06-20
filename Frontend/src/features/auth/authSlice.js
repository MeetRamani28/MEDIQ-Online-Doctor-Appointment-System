import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  fetchUserProfile,
  verifyLicenseThunk,
} from "./authThunks";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  authChecking: true,
  error: null,
  verifying: false,
  isDocVerified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    resetDocVerification: (state) => {
      state.isDocVerified = false;
      state.verifying = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(verifyLicenseThunk.pending, (state) => {
        state.verifying = true;
        state.error = null;
        state.isDocVerified = false;
      })
      .addCase(verifyLicenseThunk.fulfilled, (state) => {
        state.verifying = false;
        state.isDocVerified = true;
        state.error = null;
      })
      .addCase(verifyLicenseThunk.rejected, (state, action) => {
        state.verifying = false;
        state.isDocVerified = false;
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(fetchUserProfile.pending, (state) => {
        state.authChecking = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.authChecking = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.authChecking = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError, resetDocVerification } = authSlice.actions;
export default authSlice.reducer;
