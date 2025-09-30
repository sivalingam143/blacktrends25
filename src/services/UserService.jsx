import axiosInstance from "../config/API";
const API_ENDPOINT = '/users.php';

// Fetch all users
export const fetchUsersApi = async (searchText = "") => {
  const payload ={
    action : "listUsers",
    search_text : searchText
  }
  const response = await axiosInstance.post(API_ENDPOINT,payload);
  console.log("fetch user :" , response.data.body.users)
  return response.data.body.users;
};

// Fetch a single user by ID
export const fetchUserByIdApi = async (id) => {
  const response = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
  return response.data.body.data;  // Corrected response structure
};

// Add a new user
export const addUserApi = async (userData) => {
  const payload = {
    action: "addusers",
    Name: userData.Name,
    Mobile_Number : userData.Mobile_Number,
    Password : userData.Password
  }
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("add user :" ,response.data)
  return response.data.head.users;  
};

// Update a user by ID
export const updateUserApi = async (userdata) => {
  const payload = {
   action: "updateuser",
   user_id : userdata.id,
   Name : userdata.Name,
   Mobile_Number : userdata.Mobile_Number,
   Password : userdata.Password,
  }
  const response = await axiosInstance.post(`${API_ENDPOINT}`, payload);
  console.log('update response',response.data.head);
  return response.data.head.id;  // Corrected response structure
};

// Delete a user by ID
export const deleteUserApi = async (id) => {
  const payload = {
    action: "deleteUsers",
    delete_user_id : id
  }
  const response = await axiosInstance.post(`${API_ENDPOINT}`,payload);
  return id;  // Return the user ID for successful deletion
};
