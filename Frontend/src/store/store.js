import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import specializationReducer from "../features/specialization/specializationSlice";
import contactReducer from "../features/contact/contactSlice";
import appointmentReducer from "../features/appointments/appointmentSlice";
import adminReducer from "../features/admin/adminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    specialization: specializationReducer,
    contact: contactReducer,
    appointment: appointmentReducer,
    admin: adminReducer,
  },
});

export default store;
