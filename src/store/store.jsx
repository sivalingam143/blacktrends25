import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import LoginMiddleware from "../middleware/LoginMiddleware";
import userReducer from "../slice/UserSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(LoginMiddleware),
});

export default store;
