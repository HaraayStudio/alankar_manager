// // src/api/presalesApi.js
// import axios from 'axios';
// import { BASE_URL } from './constants';
// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   validateStatus: status => status >= 200 && status < 400
// });
// export const getAllPresales = (token) =>
//   api.get('/presales/getallpresales', {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// export const createPresale = (presale, isOldClient, token) =>
//   // console.log(presale , isOldClient , token);
  
//   api.post('/presales/createpresales', presale, {
//     params: { existingClient: isOldClient },
//     headers: { Authorization: `Bearer ${token}` }
//   });
// export const updatePresaleStatus = (srNumber, status, token) =>
//   api.put('/presales/updatepresalestatus', null, {
//     params: { srNumber, status },
//     headers: { Authorization: `Bearer ${token}` }
//   });
// export const deletePresale = (srNumber, token) =>
//   api.put('/presales/deletepresale', null, {
//     params: { srNumber },
//     headers: { Authorization: `Bearer ${token}` }
//   });


// export const addPreSalesOrderInPresales = (srNumber, preSalesOrder, token) =>
//   api.post('/presales/addpreSalesOrderinpresales', preSalesOrder, {
//     params: { srNumber },
//     headers: { Authorization: `Bearer ${token}` }
//   });



// src/api/presalesApi.js
import api from './axiosConfig';
import { BASE_URL } from './constants';
import axios from 'axios';

export const getAllPresales = () =>
  api.get('/presales/getallpresales');

export const createPresale = (presale, isOldClient = false, images = []) => {
  const formData = new FormData();
  formData.append('order', new Blob([JSON.stringify(presale)], { type: 'application/json' }));
  
  if (images.length > 0) {
    images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const token = sessionStorage.getItem('token');
  return axios.post(`${BASE_URL}/presales/createpresales`, formData, {
    params: { existingClient: isOldClient },
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updatePresaleStatus = (srNumber, status) =>
  api.put('/presales/updatepresalestatus', null, {
    params: { srNumber, status }
  });

export const deletePresale = (srNumber) =>
  api.put('/presales/deletepresale', null, {
    params: { srNumber }
  });

export const addPreSalesOrderInPresales = (srNumber, preSalesOrder) =>
  api.post('/presales/addpreSalesOrderinpresales', preSalesOrder, {
    params: { srNumber }
  });
