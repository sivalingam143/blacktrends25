import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import LoginMiddleware from "../middleware/LoginMiddleware";
import userReducer from "../slice/UserSlice";
import categoryReducer from "../slice/CategorySlice";
import companyReducer from "../slice/CompanySlice";
import memberReducer from "../slice/MemberSlice";
import staffReducer from "../slice/StaffSlice";
import productAndServiceReducer from "../slice/ProductAndServiceSlice";
import billingReducer from "../slice/BillingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    categories: categoryReducer,
    company: companyReducer,
    member: memberReducer,
    staff: staffReducer,
    productandservice: productAndServiceReducer,
    billing: billingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(LoginMiddleware),
});

export default store;
