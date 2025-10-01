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
    Company_Name: companyData.Company_Name,
    Contact_Number: companyData.Contact_Number,
    Email: companyData.Email,
    Address: companyData.Address,
    GSTIN: companyData.GSTIN,
    Contact_Person: companyData.Contact_Person,
  };
  const response = await axiosInstance.post(API_ENDPOINT, payload);
  console.log("add company:", response.data);
  return response.data;
};

// Update a company
export const updateCompanyApi = async (companyData) => {
  const payload = {
    action: "updatecompany",
    Company_Name: companyData.Company_Name,
    Contact_Number: companyData.Contact_Number,
    Email: companyData.Email,
    Address: companyData.Address,
    GSTIN: companyData.GSTIN,
    Contact_Person: companyData.Contact_Person,
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
