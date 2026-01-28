import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import specializationReducer from "../features/specialization/specializationSlice";
import contactReducer from "../features/contact/contactSlice";
import appointmentReducer from "../features/appointments/appointmentSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    specialization: specializationReducer,
    contact: contactReducer,
    appointment: appointmentReducer,
  },
});

export default store;
