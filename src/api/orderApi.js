
// // import axios from 'axios'; 
// // import React, { useState, useContext } from 'react';
// // import { DataContext } from './../context/DataContext';
// // import { BASE_URL } from './constants';
// // const axiosInstance = axios.create({
// //   baseURL: BASE_URL,
// //   maxRedirects: 1,
// //   validateStatus: (status) => (status >= 200 && status < 303) || status === 302,
// // });


// // export const createOrder = (order, isOldClient, token, images = []) => {
// //   const formData = new FormData();
// //   // Append order as JSON blob
// //   formData.append('order', new Blob([JSON.stringify(order)], { type: 'application/json' }));
// //   // Append images if present
// //   if (images.length > 0) {
// //     images.forEach((image) => {
// //       formData.append('images', image);
// //     });
// //   }
// //   return axiosInstance.post('/presales/createpresales', formData, {
// //     params: { isOldClient },
// //     headers: {
// //       'Content-Type': 'multipart/form-data',
// //       Authorization: `Bearer ${token}`,
// //     },
// //   });
// // };
// // export const getOrderById = (id, token) =>
// //   axiosInstance.get(`/orders/${id}`, {
// //     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
// //   });
// // export const getAllOrders = (token) => {
// //   console.log("Sending request with token:", token);
// //   return axiosInstance.get('/orders/getallorders', {
// //     headers: {  Authorization: `Bearer ${token}` }
// //   });
// // };
// // export const updateOrder = (id, data, token) =>
// //   axiosInstance.put(`/orders/updateorder/${id}`, data, {
// //     headers: {  'Content-Type': 'application/json',Authorization: `Bearer ${token}` }
// //   });
// // export const deleteOrder = (id, token) =>
// //   axiosInstance.delete(`/orders/deleteorder/${id}`, {
// //     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
// //   });



  
// // src/api/orderApi.js
// import api from './axiosConfig';

// export const getAllOrders = () =>
//   api.get('/orders/getallorders');

// export const getOrderById = (id) =>
//   api.get(`/orders/${id}`);

// export const createOrder = (order, isOldClient = false, images = []) => {
//   const formData = new FormData();
//   formData.append('order', new Blob([JSON.stringify(order)], { type: 'application/json' }));
  
//   if (images.length > 0) {
//     images.forEach((image) => {
//       formData.append('images', image);
//     });
//   }

//   const token = sessionStorage.getItem('token');
//   return axios.post(`${BASE_URL}/orders/createorder`, formData, {
//     params: { isOldClient },
//     headers: {
//       'Content-Type': 'multipart/form-data',
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// export const updateOrder = (id, data) =>
//   api.put(`/orders/updateorder/${id}`, data);

// export const deleteOrder = (id) =>
//   api.delete(`/orders/deleteorder/${id}`);

// export const updateOrderStepStatus = (orderStepId, orderStepStatus) =>
//   api.put('/updateorderstepstatus', {}, {
//     params: { orderStepId, OrderStepStatus: orderStepStatus }
//   });

// export const updateOrderStatus = (orderId, status) =>
//   api.post('/change/orderstatus', { orderId, status });

// src/api/orderApi.js
import api from './axiosConfig';
import axios from 'axios';
import { BASE_URL } from './constants';

// Get all orders
export const getAllOrders = () =>
  api.get('/orders/getallorders');

// Get order by ID
export const getOrderById = (id) =>
  api.get(`/orders/${id}`);

// Create order with images
export const createOrder = (order, isOldClient = false, images = []) => {
  const formData = new FormData();
  formData.append('order', new Blob([JSON.stringify(order)], { type: 'application/json' }));
  
  if (images.length > 0) {
    images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const token = sessionStorage.getItem('token');
  return axios.post(`${BASE_URL}/orders/createorder`, formData, {
    params: { isOldClient },
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update existing order - matches your current API endpoint
export const updateOrder = (id, data) =>
  api.put(`/orders/updateorder`, data, {
    params: { id }
  });

// Delete order - matches your current API endpoint  
export const deleteOrder = (id) =>
  api.delete(`/orders/deleteorder`, {
    params: { id }
  });

// Update order step status
export const updateOrderStepStatus = (orderStepId, orderStepStatus) =>
  api.put('/updateorderstepstatus', {}, {
    params: { orderStepId, OrderStepStatus: orderStepStatus }
  });

// Update order status
export const updateOrderStatus = (orderId, status) =>
  api.post('/change/orderstatus', { orderId, status });

// Add order to PostSales - for new orders in PostSales
export const addOrderToPostSales = (srNumber, order, images = []) => {
  const formData = new FormData();
  formData.append('srNumber', srNumber.toString());
  formData.append('order', JSON.stringify(order));
  
  if (images && images.length > 0) {
    images.forEach((img) => formData.append('images', img));
  }

  const token = sessionStorage.getItem('token');
  return axios.post(`${BASE_URL}/postsales/addorderinpostsales`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};