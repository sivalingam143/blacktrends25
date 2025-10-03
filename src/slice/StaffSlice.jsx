import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchStaffApi,
  addStaffApi,
  updateStaffApi,
  deleteStaffApi,
} from "../services/StaffService";

/* ---- thunks ---- */
export const fetchStaff = createAsyncThunk(
  "staff/fetchStaff",
  async (searchText = "") => await fetchStaffApi(searchText)
);

export const addStaff = createAsyncThunk(
  "staff/addStaff",
  async (staffData) => {
    const res = await addStaffApi(staffData);
    if (res.head.code !== 200) throw new Error(res.head.msg);
    return res.head.msg;
  }
);

export const updateStaff = createAsyncThunk(
  "staff/updateStaff",
  async (staffData) => {
    const res = await updateStaffApi(staffData);
    if (res.head.code !== 200) throw new Error(res.head.msg);
    return res.head.msg;
  }
);

export const deleteStaff = createAsyncThunk(
  "staff/deleteStaff",
  async (staffId) => {
    const res = await deleteStaffApi(staffId);
    if (res.head.code !== 200) throw new Error(res.head.msg);
    return res.head.msg;
  }
);

/* ---- slice ---- */
const staffSlice = createSlice({
  name: "staff",
  initialState: {
    staff: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchStaff.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchStaff.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.staff = a.payload.staff || [];
      })
      .addCase(fetchStaff.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message;
      });

    // add / update / delete – just change UI status
    const common = (builder) =>
      builder
        .addCase(addStaff.pending, (s) => {
          s.status = "loading";
        })
        .addCase(addStaff.fulfilled, (s) => {
          s.status = "succeeded";
        })
        .addCase(addStaff.rejected, (s, a) => {
          s.status = "failed";
          s.error = a.error.message;
        })
        .addCase(updateStaff.pending, (s) => {
          s.status = "loading";
        })
        .addCase(updateStaff.fulfilled, (s) => {
          s.status = "succeeded";
        })
        .addCase(updateStaff.rejected, (s, a) => {
          s.status = "failed";
          s.error = a.error.message;
        })
        .addCase(deleteStaff.pending, (s) => {
          s.status = "loading";
        })
        .addCase(deleteStaff.fulfilled, (s) => {
          s.status = "succeeded";
        })
        .addCase(deleteStaff.rejected, (s, a) => {
          s.status = "failed";
          s.error = a.error.message;
        });

    common(builder);
  },
});

export default staffSlice.reducer;
