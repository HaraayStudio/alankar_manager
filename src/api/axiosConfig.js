// // src/api/api.js
// import axios from "axios";
// import { BASE_URL } from "./constants";

// const api = axios.create({
//   baseURL: BASE_URL,
// });

// export default api;


// src/api/axiosConfig.js
import axios from 'axios';
import { BASE_URL } from './constants';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status >= 200 && status < 400,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;