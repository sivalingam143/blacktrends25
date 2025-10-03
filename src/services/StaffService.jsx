import axiosInstance from "../config/API";
const API_ENDPOINT = "/staff.php";

/* ---------- LIST ---------- */
export const fetchStaffApi = async (searchText = "") => {
  const payload = { action: "listStaff", search_text: searchText };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  return data.body || { staff: [] };
};

/* ---------- ADD ---------- */
export const addStaffApi = async (staffData) => {
  const payload = {
    action: "addstaff",
    name: staffData.name,
    phone: staffData.phone,
    address: staffData.address,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  return data;
};

/* ---------- UPDATE ---------- */
export const updateStaffApi = async (staffData) => {
  const payload = {
    action: "updatestaff",
    edit_staff_id: staffData.staff_id,
    name: staffData.name,
    phone: staffData.phone,
    address: staffData.address,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  return data;
};

/* ---------- DELETE ---------- */
export const deleteStaffApi = async (staffId) => {
  const payload = { action: "deleteStaff", delete_staff_id: staffId };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  return data;
};
