import axios from "axios";
// const BASE_URL = 'http://localhost:8080/api';
// // All API calls return axios promises
// export const getAllPostSales = (token) =>
//   axios.get(`${BASE_URL}/postsales/getallpostsales`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });

import { BASE_URL } from "./constants";
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => status >= 200 && status < 400,
});
export const getAllPostSales = (token) =>
  api.get("/postsales/getallpostsales", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createPostSale = (formData, token) =>
  axios.post(`${BASE_URL}/postsales/createpostsales`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type header manually when sending FormData.
    },
  });
export const updatePostSale = (postSale, token) =>
  axios.put(`${BASE_URL}/postsales/updatepostsales`, postSale, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const sendPostSaleMail = (srNumber, token) =>
  axios.post(`${BASE_URL}/postsales/sendpostsalecompletemail`, null, {
    params: { srNumber },
    headers: { Authorization: `Bearer ${token}` },
  });
export const addOrderInPostSales = async (
  srNumber,
  order,
  token,
  images = []
) => {
  const formData = new FormData();
  formData.append("srNumber", srNumber);
  formData.append("order", JSON.stringify(order));
  if (images && images.length > 0) {
    images.forEach((img) => formData.append("images", img));
  }
  const res = await axios.post(
    `${BASE_URL}/postsales/addorderinpostsales`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
