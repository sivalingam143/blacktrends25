import axiosInstance from "../config/API";
const API_ENDPOINT = "/billing.php";
const userId = sessionStorage.getItem("userid");

/* ---------- LIST ---------- */
export const fetchBillingsApi = async (searchText = "") => {
  const payload = { action: "listBilling", search_text: searchText };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  console.log(data);
  return data.body || { billing: [] };
};

/* ---------- ADD ---------- */
export const addBillingApi = async (billingData) => {
  const payload = {
    action: "addBilling",
    billing_date: billingData.billing_date,
    member_id: billingData.member_id,
    member_no: billingData.member_no,
    name: billingData.name,
    phone: billingData.phone,
    productandservice_details: billingData.productandservice_details,
    subtotal: billingData.subtotal,
    discount: billingData.discount,
    discount_type: billingData.discount_type,
    total: billingData.total,
    paid: billingData.paid,
    balance: billingData.balance,
    payment_details: billingData.payment_details,
    membership: billingData.membership,
    created_by_id: userId,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  console.log(data);
  return data;
};

/* ---------- UPDATE ---------- */
export const updateBillingApi = async (billingData) => {
  const payload = {
    action: "updateBilling",
    edit_billing_id: billingData.billing_id,
    member_id: billingData.member_id,
    billing_date: billingData.billing_date,
    member_no: billingData.member_no,
    name: billingData.name,
    phone: billingData.phone,
    productandservice_details: billingData.productandservice_details,
    subtotal: billingData.subtotal,
    discount: billingData.discount,
    discount_type: billingData.discount_type,
    total: billingData.total,
    paid: billingData.paid,
    balance: billingData.balance,
    payment_details: billingData.payment_details,
    membership: billingData.membership,
    updated_by_id: userId,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  console.log(data);
  return data;
};

/* ---------- DELETE ---------- */
export const deleteBillingApi = async (billingId) => {
  const payload = {
    action: "deleteBilling",
    delete_billing_id: billingId,
    delete_by_id: userId,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  return data;
};

/* ---------- STAFF REPORT ---------- */
export const fetchStaffReportApi = async (
  fromDate,
  toDate,
  searchText = ""
) => {
  const payload = {
    action: "staffReport",
    from_date: fromDate,
    to_date: toDate,
    search_text: searchText,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  console.log(data);
  return data.body || { staff: [] };
};

/* ---------- MEMBER REPORT ---------- */
export const fetchMemberReportApi = async (
  fromDate,
  toDate,
  searchText = ""
) => {
  const payload = {
    action: "memberReport",
    from_date: fromDate,
    to_date: toDate,
    search_text: searchText,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  console.log(data);
  return data.body || { member: [] };
};

/* ---------- GET MILESTONE DISCOUNT ---------- */
export const getMilestoneDiscountApi = async (memberId) => {
  const payload = {
    action: "getMilestoneDiscount",
    member_id: memberId,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  console.log(data);
  return data.body?.extra_discount_rate || 0;
};
