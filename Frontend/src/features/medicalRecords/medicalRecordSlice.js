import { createSlice } from "@reduxjs/toolkit";
import {
  createMedicalRecord,
  updateMedicalRecord,
  getMedicalRecordByAppointment,
} from "./medicalRecordThunks";

const initialState = {
  record: null,
  loading: false,
  error: null,
  successMessage: null,
};

const medicalRecordSlice = createSlice({
  name: "medicalRecord",
  initialState,
  reducers: {
    clearMedicalRecordError: (state) => {
      state.error = null;
    },
    clearMedicalRecordSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMedicalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMedicalRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.record = action.payload;
        state.successMessage = "Medical record created";
      })
      .addCase(createMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateMedicalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMedicalRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.record = action.payload;
        state.successMessage = "Medical record updated";
      })
      .addCase(updateMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMedicalRecordByAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMedicalRecordByAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.record = action.payload;
      })
      .addCase(getMedicalRecordByAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMedicalRecordError, clearMedicalRecordSuccess } =
  medicalRecordSlice.actions;
export default medicalRecordSlice.reducer;
