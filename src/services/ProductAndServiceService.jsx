import axiosInstance from "../config/API";
const API_ENDPOINT = "/productandservice.php";

/* ---------- LIST ---------- */
export const fetchProductAndServicesApi = async (searchText = "") => {
  const payload = { action: "listProductAndService", search_text: searchText };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  return data.body || { productandservice: [] };
};

/* ---------- ADD ---------- */
export const addProductAndServiceApi = async (psData) => {
  const payload = {
    action: "addProductAndService",
    productandservice_name: psData.productandservice_name,
    productandservice_price: psData.productandservice_price,
    category_id: psData.category_id,
    serial_no: psData.serial_no,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  return data;
};

/* ---------- UPDATE ---------- */
export const updateProductAndServiceApi = async (psData) => {
  const payload = {
    action: "updateProductAndService",
    edit_productandservice_id: psData.productandservice_id,
    productandservice_name: psData.productandservice_name,
    productandservice_price: psData.productandservice_price,
    category_id: psData.category_id,
    serial_no: psData.serial_no,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  return data;
};

/* ---------- DELETE ---------- */
export const deleteProductAndServiceApi = async (psId) => {
  const payload = {
    action: "deleteProductAndService",
    delete_productandservice_id: psId,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  return data;
};
