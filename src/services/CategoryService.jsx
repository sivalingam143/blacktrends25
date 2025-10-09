import axiosInstance from "../config/API";
const API_ENDPOINT = "/category.php";

// Fetch all categories
export const fetchCategoriesApi = async (searchText = "") => {
  const payload = {
    action: "listCategories",
    search_text: searchText,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("fetch categories :", response.data);
  return response.data.body.categories;
};

// Add a new category
export const addCategoryApi = async (categoryData) => {
  const payload = {
    action: "addCategory",
    category_name: categoryData.category_name,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("add category :", response.data);
  return response.data.head.categories;
};

// Update a category by ID
export const updateCategoryApi = async (categorydata) => {
  const payload = {
    action: "updateCategory",
    category_id: categorydata.id,
    category_name: categorydata.category_name,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log("update response", response.data.head);
  return response.data.head.id; // Corrected response structure
};

// Delete a category by ID
export const deleteCategoryApi = async (id) => {
  const payload = {
    action: "deleteCategory",
    delete_category_id: id,
  };
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  return id; // Return the category ID for successful deletion
};
