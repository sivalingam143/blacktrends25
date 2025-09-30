import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUsersApi,
  addUserApi,
  fetchUserByIdApi,
  updateUserApi,
  deleteUserApi,
} from "../services/UserService";

// Fetch all users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetchUsersApi();
  console.log('response',response);
  return response;
});

// Fetch user by ID
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId) => {
    const response = await fetchUserByIdApi(userId);
    return response;
  }
);

// Add new user
export const addUser = createAsyncThunk("users/addUser", async (userData) => {
  console.log("user data:" ,userData)
  const response = await addUserApi(userData);
  console.log("API Response on Add User:", response);
  return response;
});

// Update user by ID
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, Name,Mobile_Number,Password }) => {
    console.log("siva",{ id, Name,Mobile_Number,Password });
    const response = await updateUserApi({ id : id , Name : Name,Mobile_Number : Mobile_Number,Password :Password});
    return {
      id,
      Name,
      Mobile_Number,
      Password
    };
  }
);

// Delete user by ID
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId) => {
    const response = await deleteUserApi(userId);
    return response;
  }
);
const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("action.payload:", action.payload);
        state.users.push(action.payload[0]);  // Add the user to the users array
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.users.findIndex(user => user.id === action.payload.id);
        console.log(index);
        if (index !== -1) {
          // Replace the updated user with the response payload
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
