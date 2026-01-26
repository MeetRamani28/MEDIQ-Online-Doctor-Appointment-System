import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import specializationReducer from "../features/specialization/specializationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    specialization: specializationReducer,
  },
});

export default store;
