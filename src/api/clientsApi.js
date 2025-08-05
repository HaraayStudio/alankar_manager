// src/api/clientsApi.js
import axios from 'axios';
import { BASE_URL } from './constants';
// ✅ Create configured axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  maxRedirects: 1,
  validateStatus: (status) => (status >= 200 && status < 303) || status === 302,
  headers: {
    'Content-Type': 'application/json',
  },
});
// ✅ API functions
export const createClient = (order, token) =>
  axiosInstance.post('/clients/createclient', order, {
  
    headers: { Authorization: `Bearer ${token}` }
  });
export const getClientById = (id, token) =>
  axiosInstance.get(`/clients/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
export const getAllClients = (token) =>
  axiosInstance.get('/clients/getallclients', {
    headers: { Authorization: `Bearer ${token}` }
  });
// ✅ Add updateClient API function
export const updateClient = (id, clientINEPAGPDTO, token) =>
  axiosInstance.put(
    '/clients/updateclient',
    clientINEPAGPDTO,
    {
      params: { id },
      headers: { Authorization: `Bearer ${token}` }
    }
  );