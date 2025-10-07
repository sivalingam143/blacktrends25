import axios from "axios";
const API_URL = "https://blacktrends.zentexus.in/api";
//const API_URL = "http://localhost/blacktrends/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  mode: "no-cors",
});

export default axiosInstance;
