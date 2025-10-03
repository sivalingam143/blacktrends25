import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProductAndServicesApi,
  addProductAndServiceApi,
  updateProductAndServiceApi,
  deleteProductAndServiceApi,
} from "../services/ProductAndServiceService";

/* ---- thunks ---- */
export const fetchProductAndServices = createAsyncThunk(
  "productandservice/fetchProductAndServices",
  async (searchText = "") => await fetchProductAndServicesApi(searchText)
);

export const addProductAndService = createAsyncThunk(
  "productandservice/addProductAndService",
  async (psData) => {
    const res = await addProductAndServiceApi(psData);
    if (res.head.code !== 200) throw new Error(res.head.msg);
    return res.head.msg;
  }
);

export const updateProductAndService = createAsyncThunk(
  "productandservice/updateProductAndService",
  async (psData) => {
    const res = await updateProductAndServiceApi(psData);
    if (res.head.code !== 200) throw new Error(res.head.msg);
    return res.head.msg;
  }
);

export const deleteProductAndService = createAsyncThunk(
  "productandservice/deleteProductAndService",
  async (psId) => {
    const res = await deleteProductAndServiceApi(psId);
    if (res.head.code !== 200) throw new Error(res.head.msg);
    return res.head.msg;
  }
);

/* ---- slice ---- */
const productAndServiceSlice = createSlice({
  name: "productandservice",
  initialState: {
    productandservice: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchProductAndServices.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchProductAndServices.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.productandservice = a.payload.productandservice || [];
      })
      .addCase(fetchProductAndServices.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message;
      });

    // add / update / delete – just change UI status
    const common = (builder) =>
      builder
        .addCase(addProductAndService.pending, (s) => {
          s.status = "loading";
        })
        .addCase(addProductAndService.fulfilled, (s) => {
          s.status = "succeeded";
        })
        .addCase(addProductAndService.rejected, (s, a) => {
          s.status = "failed";
          s.error = a.error.message;
        })
        .addCase(updateProductAndService.pending, (s) => {
          s.status = "loading";
        })
        .addCase(updateProductAndService.fulfilled, (s) => {
          s.status = "succeeded";
        })
        .addCase(updateProductAndService.rejected, (s, a) => {
          s.status = "failed";
          s.error = a.error.message;
        })
        .addCase(deleteProductAndService.pending, (s) => {
          s.status = "loading";
        })
        .addCase(deleteProductAndService.fulfilled, (s) => {
          s.status = "succeeded";
        })
        .addCase(deleteProductAndService.rejected, (s, a) => {
          s.status = "failed";
          s.error = a.error.message;
        });

    common(builder);
  },
});

export default productAndServiceSlice.reducer;
