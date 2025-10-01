import axiosInstance from "../config/API";

const API_ENDPOINT = "/company.php";

// Fetch all companies
export const fetchCompaniesApi = async (searchText = "") => {
  const payload = {
    action: "listCompany",
    search_text: searchText,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("fetch companies:", response.data);
  return response.data.body || { company: [] };
};

// Add a new company
export const addCompanyApi = async (companyData) => {
  const payload = {
    action: "addcompany",
    company_name: companyData.company_name,
    contact_number: companyData.contact_number,
    email: companyData.email,
    address: companyData.address,
    gst_no: companyData.gst_no,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("add company:", response.data);
  return response.data;
};

// Update a company
export const updateCompanyApi = async (companyData) => {
  const payload = {
    action: "updatecompany",
    company_name: companyData.company_name,
    contact_number: companyData.contact_number,
    email: companyData.email,
    address: companyData.address,
    gst_no: companyData.gst_no,
    edit_company_id: companyData.company_id,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("update company:", response.data);
  return response.data;
};

// Delete a company
export const deleteCompanyApi = async (companyId) => {
  const payload = {
    action: "deleteCompany",
    delete_company_id: companyId,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("delete company:", response.data);
  return response.data;
};
