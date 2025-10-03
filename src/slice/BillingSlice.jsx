import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchBillingsApi,
  addBillingApi,
  updateBillingApi,
  deleteBillingApi,
} from "../services/BillingService";

/* ---- thunks ---- */
export const fetchBillings = createAsyncThunk(
  "billing/fetchBillings",
  async (searchText = "") => await fetchBillingsApi(searchText)
);

export const addBilling = createAsyncThunk(
  "billing/addBilling",
  async (billingData) => {
    const res = await addBillingApi(billingData);
    if (res.head.code !== 200) throw new Error(res.head.msg);
    return res.head.msg;
  }
);

export const updateBilling = createAsyncThunk(
  "billing/updateBilling",
  async (billingData) => {
    const res = await updateBillingApi(billingData);
    if (res.head.code !== 200) throw new Error(res.head.msg);
    return res.head.msg;
  }
);

export const deleteBilling = createAsyncThunk(
  "billing/deleteBilling",
  async (billingId) => {
    const res = await deleteBillingApi(billingId);
    if (res.head.code !== 200) throw new Error(res.head.msg);
    return res.head.msg;
  }
);

/* ---- slice ---- */
const billingSlice = createSlice({
  name: "billing",
  initialState: {
    billing: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchBillings.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchBillings.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.billing = a.payload.billing || [];
      })
      .addCase(fetchBillings.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message;
      });

    // add / update / delete – just change UI status
    const common = (builder) =>
      builder
        .addCase(addBilling.pending, (s) => {
          s.status = "loading";
        })
        .addCase(addBilling.fulfilled, (s) => {
          s.status = "succeeded";
        })
        .addCase(addBilling.rejected, (s, a) => {
          s.status = "failed";
          s.error = a.error.message;
        })
        .addCase(updateBilling.pending, (s) => {
          s.status = "loading";
        })
        .addCase(updateBilling.fulfilled, (s) => {
          s.status = "succeeded";
        })
        .addCase(updateBilling.rejected, (s, a) => {
          s.status = "failed";
          s.error = a.error.message;
        })
        .addCase(deleteBilling.pending, (s) => {
          s.status = "loading";
        })
        .addCase(deleteBilling.fulfilled, (s) => {
          s.status = "succeeded";
        })
        .addCase(deleteBilling.rejected, (s, a) => {
          s.status = "failed";
          s.error = a.error.message;
        });

    common(builder);
  },
});

export default billingSlice.reducer;
