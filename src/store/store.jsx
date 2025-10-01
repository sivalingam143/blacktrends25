import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import LoginMiddleware from "../middleware/LoginMiddleware";
import userReducer from "../slice/UserSlice";
import companyReducer from "../slice/CompanySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    company: companyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(LoginMiddleware),
});

export default store;
