import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/API";

const USERS_ENDPOINT = "/users.php";

// Login thunk to validate login
const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await axiosInstance.post(USERS_ENDPOINT, {
        action: "login",
        Mobile_Number: credentials.email,
        Password: credentials.password,
      });

      if (response?.data?.head?.code === 200) {
        console.log(response.data.body.name);
        // Successful login
        sessionStorage.setItem("username", response.data.body.name);
        sessionStorage.setItem("userid", response.data.body.user_id);
        return response?.data?.body?.user || {};
      } else {
        return thunkAPI.rejectWithValue(
          response?.data?.head?.msg || "Invalid login details"
        );
      }
    } catch (error) {
      console.error("Login Error:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("userid");
  return {};
});

export { loginUser, logoutUser };
