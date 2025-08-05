
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast"; // <-- Import here

import { addOrderInPostSales } from "../api/postSale";
import { addPreSalesOrderInPresales } from "../api/preSale";
import { BASE_URL } from "../api/constants";
import {
  fetchClients, addClient,fetchClient,updateClientThunk 
} from "../store/slices/clientSlice";
import {
  fetchEmployees, addEmployee, updateEmployeeThunk, deleteEmployeeThunk
} from "../store/slices/employeeSlice";
import {
  fetchPresales, addPresale, updatePresale, deletePresaleThunk
} from "../store/slices/presaleSlice";
import {
  fetchPostSales, addPostSale, updatePostSaleThunk, sendPostSaleMailThunk
} from "../store/slices/postsaleSlice";
import {
  addQuotation, updateQuotationStatusThunk, updateQuotationThunk
} from "../store/slices/quotationSlice";
import {
  fetchInvoices, addInvoice, sendInvoiceMailThunk
} from "../store/slices/invoiceSlice";
import {
  loginThunk, setToken, setUser, logout
} from "../store/slices/authSlice";
import {getAllOrders} from "../api/orderApi"
// Context setup
export const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const clients = useSelector((state) => state.clients.list);
  const employees = useSelector((state) => state.employees.list);
  const presales = useSelector((state) => state.presales.list);
  const postSales = useSelector((state) => state.postsales.list);
  const invoices = useSelector((state) => state.invoices.list);

  const [Orders, setOrders] = useState(null);
  const [addPreSalePopup, setAddPreSalePopup] = useState(false);

  const loading = useSelector(
    (state) =>
      state.clients.loading ||
      state.employees.loading ||
      state.presales.loading ||
      state.postsales.loading ||
      state.invoices.loading
  );

  // --- NOTIFICATION HELPER ---
  const notify = {
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),
    loading: (msg) => toast.loading(msg),
    promise: toast.promise, // For async promises
  };

  // --- Auth ---
  const handleLoginAdmin = async (email, password) => {
    return notify.promise(
      dispatch(loginThunk({ email, password })),
      {
        loading: "Logging in...",
        success: "Login successful!",
        error: "Login failed",
      }
    );
  };

  // --- Clients ---
  const handleGetAllClients = async () => dispatch(fetchClients(authToken));
  const handleUpdateClient = async (id, clientINEPAGPDTO) => {
  return notify.promise(
    dispatch(updateClientThunk({ id, clientINEPAGPDTO, token: authToken })),
    {
      loading: "Updating client...",
      success: "Client updated!",
      error: "Failed to update client",
    }
  );
};

  const handleGetClient = async ()=> dispatch(fetchClient({id,authToken}))
  const handleCreateClient = async (clientData) => {
    return notify.promise(
      dispatch(addClient({ clientData, token: authToken })),
      {
        loading: "Adding client...",
        success: "Client added!",
        error: "Failed to add client",
      }
    );
  };

  // --- Employees ---
  const handleGetAllEmployees = async () => dispatch(fetchEmployees(authToken));
  const handleCreateEmployee = async (employeeData) => {
    return notify.promise(
      dispatch(addEmployee({ employeeData, token: authToken })),
      {
        loading: "Adding employee...",
        success: "Employee added!",
        error: "Failed to add employee",
      }
    );
  };
  const handleUpdateEmployee = async (id, updatedData) => {
    return notify.promise(
      dispatch(updateEmployeeThunk({ id, updatedData, token: authToken })),
      {
        loading: "Updating employee...",
        success: "Employee updated!",
        error: "Failed to update employee",
      }
    );
  };
  const handleDeleteEmployee = async (id) => {
    return notify.promise(
      dispatch(deleteEmployeeThunk({ id, token: authToken })),
      {
        loading: "Deleting employee...",
        success: "Employee deleted!",
        error: "Failed to delete employee",
      }
    );
  };

  // --- Presale ---
  const handleGetAllPresales = async () => dispatch(fetchPresales(authToken));
  const handleCreatePresale = async (presale, isOldClient = false) => {
    return notify.promise(
      dispatch(addPresale({ presale, isOldClient, token: authToken })),
      {
        loading: "Adding presale...",
        success: "Presale added!",
        error: "Failed to add presale",
      }
    );
  };
  const handleUpdatePresaleStatus = async (srNumber, status) => {
    return notify.promise(
      dispatch(updatePresale({ srNumber, status, token: authToken })),
      {
        loading: "Updating presale...",
        success: "Presale updated!",
        error: "Failed to update presale",
      }
    );
  };
  const handleDeletePresale = async (srNumber) => {
    return notify.promise(
      dispatch(deletePresaleThunk({ srNumber, token: authToken })),
      {
        loading: "Deleting presale...",
        success: "Presale deleted!",
        error: "Failed to delete presale",
      }
    );
  };

  // --- PostSale ---
  const handleGetAllPostSales = async () =>  console.log();
  const handleCreatePostSale = async (postSalesObj, isOldClient = false) => {
    return notify.promise(
      dispatch(addPostSale({ postSalesObj, isOldClient, token: authToken })),
      {
        loading: "Adding postsale...",
        success: "PostSale added!",
        error: "Failed to add postsale",
      }
    );
  };
  const handleUpdatePostSale = async (postSale) => {
    return notify.promise(
      dispatch(updatePostSaleThunk({ postSale, token: authToken })),
      {
        loading: "Updating postsale...",
        success: "PostSale updated!",
        error: "Failed to update postsale",
      }
    );
  };
  const handleSendPostSaleMail = async (srNumber) => {
    return notify.promise(
      dispatch(sendPostSaleMailThunk({ srNumber, token: authToken })),
      {
        loading: "Sending mail...",
        success: "Mail sent!",
        error: "Failed to send mail",
      }
    );
  };

  // --- Orders in PostSales (with images)
  

  const handleAddOrderInPostSales = async (srNumber, order, images = []) => {
    return notify.promise(
      addOrderInPostSales(srNumber, order, images),
      {
        loading: "Adding order...",
        success: "Order added to PostSales!",
        error: "Failed to add order",
      }
    );
  };

  // --- Quotation ---
  const handleAddQuotation = async (presalesSrNumber, quotationObj) => {
    return notify.promise(
      dispatch(addQuotation({ presalesSrNumber, quotationObj, token: authToken })),
      {
        loading: "Adding quotation...",
        success: "Quotation added!",
        error: "Failed to add quotation",
      }
    );
  };
  const handleUpdateQuotationStatus = async (quotationNumber, isAccepted) => {
    return notify.promise(
      dispatch(updateQuotationStatusThunk({ quotationNumber, isAccepted, token: authToken })),
      {
        loading: "Updating quotation...",
        success: "Quotation updated!",
        error: "Failed to update quotation",
      }
    );
  };
  const handleUpdateQuotation = async (quotationObj, quotationNumber) => {
    return notify.promise(
      dispatch(updateQuotationThunk({ quotationObj, quotationNumber, token: authToken })),
      {
        loading: "Updating quotation...",
        success: "Quotation updated!",
        error: "Failed to update quotation",
      }
    );
  };

  // --- Invoice ---
  const handleGetAllInvoices = async () => dispatch(fetchInvoices(authToken));
  const handleAddInvoice = async (postSaleSrNumber) => {
    return notify.promise(
      dispatch(addInvoice({ postSaleSrNumber, token: authToken })),
      {
        loading: "Adding invoice...",
        success: "Invoice added!",
        error: "Failed to add invoice",
      }
    );
  };
  const handleSendInvoiceMail = async (srNumber) => {
    return notify.promise(
      dispatch(sendInvoiceMailThunk({ srNumber, token: authToken })),
      {
        loading: "Sending invoice mail...",
        success: "Invoice mail sent!",
        error: "Failed to send invoice mail",
      }
    );
  };

  // --- Orders in Presales ---
  const handleAddOrderInPresales = async (srNumber, order) => {
    return notify.promise(
      addPreSalesOrderInPresales(srNumber, order, authToken),
      {
        loading: "Adding order...",
        success: "Order added to PreSales!",
        error: "Failed to add order",
      }
    );
  };
  // --- Fetch all orders and store in Orders state ---
  const handleGetAllOrders = async () => {
    try {
      const res = await getAllOrders(authToken)
      console.log("fetching orders",res);
      
      // If you use ResponseStructure, the real data will be in res.data.data
      const orders = res.data?.data || [];
      setOrders(orders);
      // Optional: notify.success("Orders loaded!");
    } catch (err) {
      setOrders([]); // Clear if failed
      // Optional: notify.error("Failed to fetch orders");
    }
  };

  // --- Fetch all orders (optional, global order list)

  // --- Fetch all on login
  const fetchAllData = async () => {
    await Promise.all([
      handleGetAllClients(),
      handleGetAllEmployees(),
      handleGetAllPresales(),
      // handleGetAllPostSales(),
      // handleGetAllInvoices(),
    handleGetAllOrders()
    ]);
    // notify.success("All data loaded!");
  };
// {console.log(Orders);
// }
  useEffect(() => {
    if (authToken) {
      dispatch(fetchClients(authToken));
      dispatch(fetchEmployees(authToken));
      dispatch(fetchPresales(authToken));
      dispatch(fetchPostSales(authToken));
      dispatch(fetchInvoices(authToken));
      sessionStorage.setItem("token", authToken);
    }
  }, [authToken, dispatch]);

  useEffect(() => {
    if (authToken) fetchAllData();
  }, []);

  // --- Context value
  return (
    <DataContext.Provider
      value={{
        // Auth
        authToken, user, loading,
        handleLoginAdmin,
        setToken: (t) => dispatch(setToken(t)),
        setUser: (u) => dispatch(setUser(u)),
        logout: () => dispatch(logout()),

        // Clients
        clients, handleGetAllClients, handleCreateClient,handleUpdateClient,

        // Employees
        employees, handleGetAllEmployees, handleCreateEmployee, handleUpdateEmployee, handleDeleteEmployee,

        // Presales
        presales, handleGetAllPresales, handleCreatePresale, handleUpdatePresaleStatus, handleDeletePresale,

        // PostSales
        postSales, handleGetAllPostSales, handleCreatePostSale, handleUpdatePostSale, handleSendPostSaleMail, handleAddOrderInPostSales,

        // Quotations
        handleAddQuotation, handleUpdateQuotationStatus, handleUpdateQuotation,

        // Invoices
        invoices, handleGetAllInvoices, handleAddInvoice, handleSendInvoiceMail,

        // Orders and popups
        fetchAllData, addPreSalePopup, setAddPreSalePopup, addOrderInPostSales, Orders, handleAddOrderInPresales, handleGetClient
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
