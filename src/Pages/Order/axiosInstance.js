// src/api/axiosInstance.js
import axios from "axios";

const BASE_URL = "https://api.alankardigitalhub.in/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  maxRedirects: 1,
  validateStatus: (status) => (status >= 200 && status < 303) || status === 302,
});

export default axiosInstance;
