import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchBillingsApi,
  addBillingApi,
  updateBillingApi,
  deleteBillingApi,
  fetchStaffReportApi,
  fetchMemberReportApi,
  getMilestoneDiscountApi,
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

export const fetchStaffReport = createAsyncThunk(
  "billing/fetchStaffReport",
  async ({ fromDate, toDate, searchText = "" }) =>
    await fetchStaffReportApi(fromDate, toDate, searchText)
);

export const fetchMemberReport = createAsyncThunk(
  "billing/fetchMemberReport",
  async ({ fromDate, toDate, searchText = "" }) =>
    await fetchMemberReportApi(fromDate, toDate, searchText)
);

export const getMilestoneDiscount = createAsyncThunk(
  "billing/getMilestoneDiscount",
  async (memberId) => await getMilestoneDiscountApi(memberId)
);

/* ---- slice ---- */
const billingSlice = createSlice({
  name: "billing",
  initialState: {
    billing: [],
    staffReport: [],
    memberReport: [],
    milestoneDiscount: 0,
    status: "idle",
    error: null,
  },
  reducers: {
    clearMilestoneDiscount: (state) => {
      state.milestoneDiscount = 0;
    },
  },
  extraReducers: (builder) => {
    // fetch billings
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

    // fetch staff report
    builder
      .addCase(fetchStaffReport.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchStaffReport.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.staffReport = a.payload.staff || [];
      })
      .addCase(fetchStaffReport.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message;
      });

    // fetch member report
    builder
      .addCase(fetchMemberReport.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchMemberReport.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.memberReport = a.payload.member || [];
      })
      .addCase(fetchMemberReport.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message;
      });

    // get milestone discount
    builder.addCase(getMilestoneDiscount.fulfilled, (s, a) => {
      s.milestoneDiscount = a.payload;
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

export const { clearMilestoneDiscount } = billingSlice.actions;
export default billingSlice.reducer;
