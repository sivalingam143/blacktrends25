import axiosInstance from "../config/API";
const API_ENDPOINT = "/member.php";

/* ---------- LIST ---------- */
export const fetchMembersApi = async (searchText = "") => {
  const payload = { action: "listMember", search_text: searchText };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  console.log(data);
  return data.body || { member: [] };
};

/* ---------- ADD ---------- */
export const addMemberApi = async (memberData) => {
  const payload = {
    action: "addmember",
    name: memberData.name,
    phone: memberData.phone,
    membership: memberData.membership,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  console.log(data);
  return data;
};

/* ---------- UPDATE ---------- */
export const updateMemberApi = async (memberData) => {
  const payload = {
    action: "updatemember",
    edit_member_id: memberData.member_id,
    name: memberData.name,
    phone: memberData.phone,
    membership: memberData.membership,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  return data;
};

/* ---------- DELETE ---------- */
export const deleteMemberApi = async (memberId) => {
  const payload = { action: "deleteMember", delete_member_id: memberId };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  console.log(data);
  return data;
};

/* ---------- TOGGLE GOLD ---------- */
export const toggleGoldApi = async (member_id, makeGold) => {
  const payload = {
    action: "toggleGold",
    member_id,
    make_gold: makeGold,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  return data;
};
export const updateWalletApi = async (walletData) => {
  const payload = {
    action: "updateWallet",
    member_id: walletData.member_id,
    bill_id: walletData.bill_id,
    bill_amount: walletData.bill_amount,
    paid_amount: walletData.paid_amount,
  };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  return data;
};

/* ---------- WALLET HISTORY ---------- */
export const fetchWalletHistoryApi = async (member_id) => {
  const payload = { action: "getWalletHistory", member_id };
  const { data } = await axiosInstance.post(API_ENDPOINT, payload);
  return data;
};
