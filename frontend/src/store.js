import { configureStore } from "@reduxjs/toolkit";
import patientAuthReducer from "./slices/patientAuthSlice";
import doctorAuthReducer from "../src/slices/doctorAuthSlice";
import adminAuthSlice from "./slices/adminAuthSlice";

export const store = configureStore({
  reducer: {
    patientAuthReducer,
    doctorAuthReducer,
    adminAuthSlice
  },
});
