// src/api/invoiceApi.js
import api from './axiosConfig'; // Use centralized config like employeeApi

// 1. Create GST Invoice
export const createInvoice = (postSaleSrNumber) =>
  api.post(`/invoice/createinvoice?postSaleSrNumber=${postSaleSrNumber}`);

// 2. Create NON-GST Invoice  
export const createNGInvoice = (postSaleSrNumber) =>
  api.post(`/invoice/createnginvoice?postSaleSrNumber=${postSaleSrNumber}`);

// 3. Get All GST Invoices
export const getAllInvoices = () =>
  api.get('/invoice/getallinvoices');

// 4. Get All NON-GST Invoices
export const getAllNGInvoices = () =>
  api.get('/invoice/getallnginvoices');

// 5. Send GST Invoice by Mail
export const sendInvoiceMail = (invoiceNumber) =>
  api.post(`/invoice/sendinvoice?invoiceNumber=${invoiceNumber}`);

// 6. Send NON-GST Invoice by Mail
export const sendNGInvoiceMail = (invoiceNumber) =>
  api.post(`/invoice/sendnginvoice?invoiceNumber=${invoiceNumber}`);