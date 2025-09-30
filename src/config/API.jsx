import axios from "axios";
const API_URL = "https://gurulakshmipayroll.zentexus.com/api";
//const API_URL = "http://localhost/gurulakshmi_billing/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  mode: "no-cors",
});

export default axiosInstance;
