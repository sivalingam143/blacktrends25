import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCategoriesApi,
  addCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../services/CategoryService";

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await fetchCategoriesApi();
    console.log("response", response);
    return response;
  }
);

// Add new category
export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (categoryData) => {
    console.log("category data:", categoryData);
    const response = await addCategoryApi(categoryData);
    console.log("API Response on Add Category:", response);
    return response;
  }
);

// Update category by ID
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, category_name }) => {
    console.log("update category", { id, category_name });
    const response = await updateCategoryApi({
      id: id,
      category_name: category_name,
    });
    return {
      id,
      category_name,
    };
  }
);

// Delete category by ID
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId) => {
    const response = await deleteCategoryApi(categoryId);
    return response;
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("action.payload:", action.payload);
        state.categories.push(action.payload[0]); // Add the category to the categories array
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.categories.findIndex(
          (category) => category.id === action.payload.id
        );
        console.log(index);
        if (index !== -1) {
          // Replace the updated category with the response payload
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
