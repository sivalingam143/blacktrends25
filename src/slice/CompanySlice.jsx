// Same as previous – no field-specific changes needed here
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCompaniesApi,
  addCompanyApi,
  updateCompanyApi,
  deleteCompanyApi,
} from "../services/CompanyService";

// Fetch all companies
export const fetchCompanies = createAsyncThunk(
  "company/fetchCompanies",
  async (searchText = "") => {
    const response = await fetchCompaniesApi(searchText);
    return response;
  }
);

// Add a new company
export const addCompany = createAsyncThunk(
  "company/addCompany",
  async (companyData) => {
    const response = await addCompanyApi(companyData);
    if (response.head.code === 200) {
      return response.head.msg;
    } else {
      throw new Error(response.head.msg);
    }
  }
);

// Update a company
export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async (companyData) => {
    const response = await updateCompanyApi(companyData);
    if (response.head.code === 200) {
      return response.head.msg;
    } else {
      throw new Error(response.head.msg);
    }
  }
);

// Delete a company
export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (companyId) => {
    const response = await deleteCompanyApi(companyId);
    if (response.head.code === 200) {
      return response.head.msg;
    } else {
      throw new Error(response.head.msg);
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    company: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.company = action.payload.company || [];
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCompany.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCompany.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCompany.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default companySlice.reducer;
