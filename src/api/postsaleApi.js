// import axios from "axios";

// import { BASE_URL } from "./constants";
// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   validateStatus: (status) => status >= 200 && status < 400,
// });
// export const getAllPostSales = (token) =>
//   api.get("/postsales/getallpostsales", {
//     headers: { Authorization: `Bearer ${token}` },
//   });

// export const createPostSale = (formData, token) =>
//   axios.post(`${BASE_URL}/postsales/createpostsales`, formData, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       // Do NOT set Content-Type header manually when sending FormData.
//     },
//   });
// export const updatePostSale = (postSale, token) =>
//   axios.put(`${BASE_URL}/postsales/updatepostsales`, postSale, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// export const sendinvoice = (invoiceNumber, token) =>
//   axios.post(`${BASE_URL}/invoice/sendinvoice`, null, {
//     params: { invoiceNumber },
//     headers: { Authorization: `Bearer ${token}` },
//   });


// export const sendnginvoice = (invoiceNumber, token) =>
//   axios.post(`${BASE_URL}/invoice/sendnginvoice`, null, {
//     params: { invoiceNumber },
//     headers: { Authorization: `Bearer ${token}` },
//   });



// export const addOrderInPostSales = async (
//   srNumber,
//   order,
//   token,
//   images = []
// ) => {
//   const formData = new FormData();
//   formData.append("srNumber", srNumber);
//   formData.append("order", JSON.stringify(order));
//   if (images && images.length > 0) {
//     images.forEach((img) => formData.append("images", img));
//   }
//   const res = await axios.post(
//     `${BASE_URL}/postsales/addorderinpostsales`,
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return res.data;
// };



// src/api/postsaleApi.js
import api from './axiosConfig';
import { BASE_URL } from './constants';
import axios from 'axios';

export const getAllPostSales = () =>
  api.get('/postsales/getallpostsales');

export const createPostSale = (formData) => {
  const token = sessionStorage.getItem('token');
  return axios.post(`${BASE_URL}/postsales/createpostsales`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      // Don't set Content-Type for FormData
    },
  });
};

export const updatePostSale = (postSale) =>
  api.put('/postsales/updatepostsales', postSale);

export const addOrderInPostSales = async (srNumber, order, images = []) => {
  const formData = new FormData();
  formData.append('srNumber', srNumber);
  formData.append('order', JSON.stringify(order));
  
  if (images && images.length > 0) {
    images.forEach((img) => formData.append('images', img));
  }

  const token = sessionStorage.getItem('token');
  const res = await axios.post(
    `${BASE_URL}/postsales/addorderinpostsales`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};