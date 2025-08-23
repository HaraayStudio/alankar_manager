
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import toast from "react-hot-toast"; // <-- Import here

// import { addOrderInPostSales } from "../api/postSale";
// import { addPreSalesOrderInPresales } from "../api/preSale";
// import { BASE_URL } from "../api/constants";
// import {
//   fetchClients, addClient,fetchClient,updateClientThunk 
// } from "../store/slices/clientSlice";
// import {
//   fetchEmployees, addEmployee, updateEmployeeThunk, deleteEmployeeThunk
// } from "../store/slices/employeeSlice";
// import {
//   fetchPresales, addPresale, updatePresale, deletePresaleThunk
// } from "../store/slices/presaleSlice";
// import {
//   fetchPostSales, addPostSale, updatePostSaleThunk, sendInvoiceThunk ,sendNgInvoiceThunk
// } from "../store/slices/postsaleSlice";
// import {
//   addQuotation, updateQuotationStatusThunk, updateQuotationThunk
// } from "../store/slices/quotationSlice";

// import {
//   loginThunk, setToken, setUser, logout
// } from "../store/slices/authSlice";
// import {getAllOrders} from "../api/orderApi"
// // Context setup
// export const DataContext = createContext();
// export const useData = () => useContext(DataContext);

// export const DataProvider = ({ children }) => {
//   const dispatch = useDispatch();
//   const authToken = useSelector((state) => state.auth.token);
//   const user = useSelector((state) => state.auth.user);
//   const clients = useSelector((state) => state.clients.list);
//   const employees = useSelector((state) => state.employees.list);
//   const presales = useSelector((state) => state.presales.list);
//   const postSales = useSelector((state) => state.postsales.list);
//   const invoices = useSelector((state) => state.invoices.list);

//   const [Orders, setOrders] = useState(null);
//   const [addPreSalePopup, setAddPreSalePopup] = useState(false);

//   const loading = useSelector(
//     (state) =>
//       state.clients.loading ||
//       state.employees.loading ||
//       state.presales.loading ||
//       state.postsales.loading ||
//       state.invoices.loading
//   );

//   // --- NOTIFICATION HELPER ---
//   const notify = {
//     success: (msg) => toast.success(msg),
//     error: (msg) => toast.error(msg),
//     loading: (msg) => toast.loading(msg),
//     promise: toast.promise, // For async promises
//   };

//   // --- Auth ---
//   const handleLoginAdmin = async (email, password) => {
//     return notify.promise(
//       dispatch(loginThunk({ email, password })),
//       {
//         loading: "Logging in...",
//         success: "Login successful!",
//         error: "Login failed",
//       }
//     );
//   };

//   // --- Clients ---
//   const handleGetAllClients = async () => dispatch(fetchClients(authToken));
//   const handleUpdateClient = async (id, clientINEPAGPDTO) => {
//   return notify.promise(
//     dispatch(updateClientThunk({ id, clientINEPAGPDTO, token: authToken })),
//     {
//       loading: "Updating client...",
//       success: "Client updated!",
//       error: "Failed to update client",
//     }
//   );
// };

//   const handleGetClient = async ()=> dispatch(fetchClient({id,authToken}))
//   const handleCreateClient = async (clientData) => {
//     return notify.promise(
//       dispatch(addClient({ clientData, token: authToken })),
//       {
//         loading: "Adding client...",
//         success: "Client added!",
//         error: "Failed to add client",
//       }
//     );
//   };

//   // --- Employees ---
//   const handleGetAllEmployees = async () => dispatch(fetchEmployees(authToken));
//   const handleCreateEmployee = async (employeeData) => {
//     return notify.promise(
//       dispatch(addEmployee({ employeeData, token: authToken })),
//       {
//         loading: "Adding employee...",
//         success: "Employee added!",
//         error: "Failed to add employee",
//       }
//     );
//   };
//   const handleUpdateEmployee = async (updatedData) => {
//   return notify.promise(
//     dispatch(updateEmployeeThunk({ updatedData, token: authToken })),
//     {
//       loading: "Updating employee...",
//       success: "Employee updated!",
//       error: "Failed to update employee",
//     }
//   );
// };

//   const handleDeleteEmployee = async (id) => {
//     return notify.promise(
//       dispatch(deleteEmployeeThunk({ id, token: authToken })),
//       {
//         loading: "Deleting employee...",
//         success: "Employee deleted!",
//         error: "Failed to delete employee",
//       }
//     );
//   };

//   // --- Presale ---
//   const handleGetAllPresales = async () => dispatch(fetchPresales(authToken));
//   const handleCreatePresale = async (presale, isOldClient = false) => {
//     return notify.promise(
//       dispatch(addPresale({ presale, isOldClient, token: authToken })),
//       {
//         loading: "Adding presale...",
//         success: "Presale added!",
//         error: "Failed to add presale",
//       }
//     );
//   };
//   const handleUpdatePresaleStatus = async (srNumber, status) => {
//     return notify.promise(
//       dispatch(updatePresale({ srNumber, status, token: authToken })),
//       {
//         loading: "Updating presale...",
//         success: "Presale updated!",
//         error: "Failed to update presale",
//       }
//     );
//   };
//   const handleDeletePresale = async (srNumber) => {
//     return notify.promise(
//       dispatch(deletePresaleThunk({ srNumber, token: authToken })),
//       {
//         loading: "Deleting presale...",
//         success: "Presale deleted!",
//         error: "Failed to delete presale",
//       }
//     );
//   };

//   // --- PostSale ---
//   const handleGetAllPostSales = async () => dispatch(fetchPostSales(authToken));
//   const handleCreatePostSale = async (postSalesObj, isOldClient = false) => {
//     return notify.promise(
//       dispatch(addPostSale({ postSalesObj, isOldClient, token: authToken })),
//       {
//         loading: "Adding postsale...",
//         success: "PostSale added!",
//         error: "Failed to add postsale",
//       }
//     );
//   };
//   const handleUpdatePostSale = async (postSale) => {
//     return notify.promise(
//       dispatch(updatePostSaleThunk({ postSale, token: authToken })),
//       {
//         loading: "Updating postsale...",
//         success: "PostSale updated!",
//         error: "Failed to update postsale",
//       }
//     );
//   };
//   const sendinvoice = async (srNumber) => {
//     return notify.promise(
//       dispatch(sendInvoiceThunk({ srNumber, token: authToken })),
//       {
//         loading: "Sending mail...",
//         success: "Mail sent!",
//         error: "Failed to send mail",
//       }
//     );
//   };
//   const sendnginvoice = async (srNumber) => {
//     return notify.promise(
//       dispatch(sendNgInvoiceThunk({ srNumber, token: authToken })),
//       {
//         loading: "Sending mail...",
//         success: "Mail sent!",
//         error: "Failed to send mail",
//       }
//     );
//   };

//   // --- Orders in PostSales (with images)
  

//   const handleAddOrderInPostSales = async (srNumber, order, images = []) => {
//     return notify.promise(
//       addOrderInPostSales(srNumber, order, images),
//       {
//         loading: "Adding order...",
//         success: "Order added to PostSales!",
//         error: "Failed to add order",
//       }
//     );
//   };

//   // --- Quotation ---
//   const handleAddQuotation = async (presalesSrNumber, quotationObj) => {
//     return notify.promise(
//       dispatch(addQuotation({ presalesSrNumber, quotationObj, token: authToken })),
//       {
//         loading: "Adding quotation...",
//         success: "Quotation added!",
//         error: "Failed to add quotation",
//       }
//     );
//   };
//   const handleUpdateQuotationStatus = async (quotationNumber, isAccepted) => {
//     return notify.promise(
//       dispatch(updateQuotationStatusThunk({ quotationNumber, isAccepted, token: authToken })),
//       {
//         loading: "Updating quotation...",
//         success: "Quotation updated!",
//         error: "Failed to update quotation",
//       }
//     );
//   };
//   const handleUpdateQuotation = async (quotationObj, quotationNumber) => {
//     return notify.promise(
//       dispatch(updateQuotationThunk({ quotationObj, quotationNumber, token: authToken })),
//       {
//         loading: "Updating quotation...",
//         success: "Quotation updated!",
//         error: "Failed to update quotation",
//       }
//     );
//   };


//   // --- Orders in Presales ---
//   const handleAddOrderInPresales = async (srNumber, order) => {
//     return notify.promise(
//       addPreSalesOrderInPresales(srNumber, order, authToken),
//       {
//         loading: "Adding order...",
//         success: "Order added to PreSales!",
//         error: "Failed to add order",
//       }
//     );
//   };
//   // --- Fetch all orders and store in Orders state ---
//   const handleGetAllOrders = async () => {
//     try {
//       const res = await getAllOrders(authToken)
    
      
//       // If you use ResponseStructure, the real data will be in res.data.data
//       const orders = res.data?.data || [];
//       setOrders(orders);
//       // Optional: notify.success("Orders loaded!");
//     } catch (err) {
//       setOrders([]); // Clear if failed
//       // Optional: notify.error("Failed to fetch orders");
//     }
//   };

//   // --- Fetch all orders (optional, global order list)

//   // --- Fetch all on login
//   const fetchAllData = async () => {
//     await Promise.all([
//       handleGetAllClients(),
//       handleGetAllEmployees(),
//       handleGetAllPresales(),
//       handleGetAllPostSales(),
    
//     handleGetAllOrders()
//     ]);
//     // notify.success("All data loaded!");
//   };
// // {console.log(Orders);
// // }
//   useEffect(() => {
//     if (authToken) {
//       dispatch(fetchClients(authToken));
//       dispatch(fetchEmployees(authToken));
//       dispatch(fetchPresales(authToken));
//       dispatch(fetchPostSales(authToken));
  
//       sessionStorage.setItem("token", authToken);
//     }
//   }, [authToken, dispatch]);

//   useEffect(() => {
//     if (authToken) fetchAllData();
//   }, []);

//   // --- Context value
//   return (
//     <DataContext.Provider
//       value={{
//         // Auth
//         authToken, user, loading,
//         handleLoginAdmin,
//         setToken: (t) => dispatch(setToken(t)),
//         setUser: (u) => dispatch(setUser(u)),
//         logout: () => dispatch(logout()),

//         // Clients
//         clients, handleGetAllClients, handleCreateClient,handleUpdateClient,

//         // Employees
//         employees, handleGetAllEmployees, handleCreateEmployee, handleUpdateEmployee, handleDeleteEmployee,

//         // Presales
//         presales, handleGetAllPresales, handleCreatePresale, handleUpdatePresaleStatus, handleDeletePresale,

//         // PostSales
//         postSales, handleGetAllPostSales, handleCreatePostSale, handleUpdatePostSale, sendinvoice , sendnginvoice, handleAddOrderInPostSales,

//         // Quotations
//         handleAddQuotation, handleUpdateQuotationStatus, handleUpdateQuotation,

       
//         // Orders and popups
//         fetchAllData, addPreSalePopup, setAddPreSalePopup, addOrderInPostSales, Orders, handleAddOrderInPresales, handleGetClient
//       }}
//     >
//       {children}
//     </DataContext.Provider>
//   );
// };



// src/context/DataContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

// Redux actions
import { loginThunk, setToken, setUser, logout } from "../store/slices/authSlice";
import { 
  fetchClients, 
  addClient, 
  fetchClient, 
  updateClientThunk,
  deleteClientThunk 
} from "../store/slices/clientSlice";
import {
  fetchEmployees, 
  addEmployee, 
  updateEmployeeThunk, 
  deleteEmployeeThunk
} from "../store/slices/employeeSlice";
import {
  fetchPresales, 
  addPresale, 
  updatePresale, 
  deletePresaleThunk,
  addOrderInPresales
} from "../store/slices/presaleSlice";
import {
  fetchPostSales, 
  addPostSale, 
  updatePostSaleThunk, 
  sendInvoiceThunk,
  sendNgInvoiceThunk,
  addOrderInPostSalesThunk
} from "../store/slices/postsaleSlice";
import {
  addQuotation, 
  updateQuotationStatusThunk, 
  updateQuotationThunk
} from "../store/slices/quotationSlice";
import {
  fetchInvoices,
  fetchNGInvoices,
  createInvoiceThunk,
  createNGInvoiceThunk
} from "../store/slices/invoiceSlice";
import {
  fetchOrders,
  fetchOrder,
  addOrder,
  updateOrderThunk,
  deleteOrderThunk,
  updateOrderStepStatusThunk,
  updateOrderStatusThunk
} from "../store/slices/orderSlice";

// Context setup
export const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const dispatch = useDispatch();
  
  // Redux state
  const authToken = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const clients = useSelector((state) => state.clients.list);
  const employees = useSelector((state) => state.employees.list);
  const presales = useSelector((state) => state.presales.list);
  const postSales = useSelector((state) => state.postsales.list);
  const orders = useSelector((state) => state.orders.list);
  const invoices = useSelector((state) => state.invoices.list);
  const ngInvoices = useSelector((state) => state.invoices.ngList);
  const quotations = useSelector((state) => state.quotations.list);

  // Local state
  const [addPreSalePopup, setAddPreSalePopup] = useState(false);

  // Loading states from all slices
  const loading = useSelector((state) =>
    state.clients.loading ||
    state.employees.loading ||
    state.presales.loading ||
    state.postsales.loading ||
    state.invoices.loading ||
    state.orders.loading ||
    state.quotations.loading
  );

  // Notification helper
  const notify = {
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),
    loading: (msg) => toast.loading(msg),
    promise: toast.promise,
  };

  // --- Auth Methods ---
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

  const handleLogout = () => {
    dispatch(logout());
    notify.success("Logged out successfully!");
  };

  // --- Client Methods ---
  const handleGetAllClients = async () => {
    return dispatch(fetchClients());
  };

  const handleGetClient = async (id) => {
    return dispatch(fetchClient(id));
  };

  const handleCreateClient = async (clientData) => {
    return notify.promise(
      dispatch(addClient(clientData)),
      {
        loading: "Adding client...",
        success: "Client added!",
        error: "Failed to add client",
      }
    );
  };

  const handleUpdateClient = async (id, clientINEPAGPDTO) => {
    return notify.promise(
      dispatch(updateClientThunk({ id, clientINEPAGPDTO })),
      {
        loading: "Updating client...",
        success: "Client updated!",
        error: "Failed to update client",
      }
    );
  };

  const handleDeleteClient = async (id) => {
    return notify.promise(
      dispatch(deleteClientThunk(id)),
      {
        loading: "Deleting client...",
        success: "Client deleted!",
        error: "Failed to delete client",
      }
    );
  };

  // --- Employee Methods ---
  const handleGetAllEmployees = async () => {
    return dispatch(fetchEmployees());
  };

  const handleCreateEmployee = async (employeeData) => {
    return notify.promise(
      dispatch(addEmployee(employeeData)),
      {
        loading: "Adding employee...",
        success: "Employee added!",
        error: "Failed to add employee"
      }
    );
  };

  const handleUpdateEmployee = async (id, updatedData) => {
    return notify.promise(
      dispatch(updateEmployeeThunk({ id, updatedData })),
      {
        loading: "Updating employee...",
        success: "Employee updated!",
        error: "Failed to update employee",
      }
    );
  };

  const handleDeleteEmployee = async (id) => {
    return notify.promise(
      dispatch(deleteEmployeeThunk(id)),
      {
        loading: "Deleting employee...",
        success: "Employee deleted!",
        error: "Failed to delete employee",
      }
    );
  };

  // --- Presale Methods ---
  const handleGetAllPresales = async () => {
    return dispatch(fetchPresales());
  };

  const handleCreatePresale = async (presale, isOldClient = false, images = []) => {
    return notify.promise(
      dispatch(addPresale({ presale, isOldClient, images })),
      {
        loading: "Adding presale...",
        success: "Presale added!",
        error: "Failed to add presale",
      }
    );
  };

  const handleUpdatePresaleStatus = async (srNumber, status) => {
    return notify.promise(
      dispatch(updatePresale({ srNumber, status })),
      {
        loading: "Updating presale...",
        success: "Presale updated!",
        error: "Failed to update presale",
      }
    );
  };

  const handleDeletePresale = async (srNumber) => {
    return notify.promise(
      dispatch(deletePresaleThunk(srNumber)),
      {
        loading: "Deleting presale...",
        success: "Presale deleted!",
        error: "Failed to delete presale",
      }
    );
  };

  const handleAddOrderInPresales = async (srNumber, order) => {
    return notify.promise(
      dispatch(addOrderInPresales({ srNumber, order })),
      {
        loading: "Adding order...",
        success: "Order added to PreSales!",
        error: "Failed to add order",
      }
    );
  };

  // --- PostSale Methods ---
  const handleGetAllPostSales = async () => {
    return dispatch(fetchPostSales());
  };

  const handleCreatePostSale = async (postSalesObj, isOldClient = false) => {
    return notify.promise(
      dispatch(addPostSale({ postSalesObj, isOldClient })),
      {
        loading: "Adding postsale...",
        success: "PostSale added!",
        error: "Failed to add postsale",
      }
    );
  };

  const handleUpdatePostSale = async (postSale) => {
    return notify.promise(
      dispatch(updatePostSaleThunk(postSale)),
      {
        loading: "Updating postsale...",
        success: "PostSale updated!",
        error: "Failed to update postsale",
      }
    );
  };

  const handleAddOrderInPostSales = async (srNumber, order, images = []) => {
    return notify.promise(
      dispatch(addOrderInPostSalesThunk({ srNumber, order, images })),
      {
        loading: "Adding order...",
        success: "Order added to PostSales!",
        error: "Failed to add order",
      }
    );
  };

  const sendinvoice = async (srNumber) => {
    return notify.promise(
      dispatch(sendInvoiceThunk(srNumber)),
      {
        loading: "Sending mail...",
        success: "Mail sent!",
        error: "Failed to send mail",
      }
    );
  };

  const sendnginvoice = async (srNumber) => {
    return notify.promise(
      dispatch(sendNgInvoiceThunk(srNumber)),
      {
        loading: "Sending mail...",
        success: "Mail sent!",
        error: "Failed to send mail",
      }
    );
  };

  // --- Quotation Methods ---
  const handleAddQuotation = async (presalesSrNumber, quotationObj) => {
    return notify.promise(
      dispatch(addQuotation({ presalesSrNumber, quotationObj })),
      {
        loading: "Adding quotation...",
        success: "Quotation added!",
        error: "Failed to add quotation",
      }
    );
  };

  const handleUpdateQuotationStatus = async (quotationNumber, isAccepted) => {
    return notify.promise(
      dispatch(updateQuotationStatusThunk({ quotationNumber, isAccepted })),
      {
        loading: "Updating quotation...",
        success: "Quotation updated!",
        error: "Failed to update quotation",
      }
    );
  };

  const handleUpdateQuotation = async (quotationObj, quotationNumber) => {
    return notify.promise(
      dispatch(updateQuotationThunk({ quotationObj, quotationNumber })),
      {
        loading: "Updating quotation...",
        success: "Quotation updated!",
        error: "Failed to update quotation",
      }
    );
  };

  // --- Order Methods ---
  const handleGetAllOrders = async () => {
    return dispatch(fetchOrders());
  };

  const handleGetOrder = async (id) => {
    return dispatch(fetchOrder(id));
  };

  const handleCreateOrder = async (order, isOldClient = false, images = []) => {
    return notify.promise(
      dispatch(addOrder({ order, isOldClient, images })),
      {
        loading: "Adding order...",
        success: "Order added!",
        error: "Failed to add order",
      }
    );
  };

  const handleUpdateOrder = async (id, data) => {
    return notify.promise(
      dispatch(updateOrderThunk({ id, data })),
      {
        loading: "Updating order...",
        success: "Order updated!",
        error: "Failed to update order",
      }
    );
  };

  const handleDeleteOrder = async (id) => {
    return notify.promise(
      dispatch(deleteOrderThunk(id)),
      {
        loading: "Deleting order...",
        success: "Order deleted!",
        error: "Failed to delete order",
      }
    );
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    return notify.promise(
      dispatch(updateOrderStatusThunk({ orderId, status })),
      {
        loading: "Updating order status...",
        success: "Order status updated!",
        error: "Failed to update order status",
      }
    );
  };

  const handleUpdateOrderStepStatus = async (orderStepId, orderStepStatus) => {
    return notify.promise(
      dispatch(updateOrderStepStatusThunk({ orderStepId, orderStepStatus })),
      {
        loading: "Updating step status...",
        success: "Step status updated!",
        error: "Failed to update step status",
      }
    );
  };

  // --- Invoice Methods ---
  const handleGetAllInvoices = async () => {
    return dispatch(fetchInvoices());
  };

  const handleGetAllNGInvoices = async () => {
    return dispatch(fetchNGInvoices());
  };

  const handleCreateInvoice = async (postSaleSrNumber) => {
    return notify.promise(
      dispatch(createInvoiceThunk(postSaleSrNumber)),
      {
        loading: "Creating invoice...",
        success: "Invoice created!",
        error: "Failed to create invoice",
      }
    );
  };

  const handleCreateNGInvoice = async (postSaleSrNumber) => {
    return notify.promise(
      dispatch(createNGInvoiceThunk(postSaleSrNumber)),
      {
        loading: "Creating NG invoice...",
        success: "NG Invoice created!",
        error: "Failed to create NG invoice",
      }
    );
  };

  // --- Fetch all data ---
  const fetchAllData = async () => {
    try {
      await Promise.all([
        dispatch(fetchClients()),
        dispatch(fetchEmployees()),
        dispatch(fetchPresales()),
        dispatch(fetchPostSales()),
        dispatch(fetchOrders()),
        dispatch(fetchInvoices()),
        dispatch(fetchNGInvoices()),
        console.log(orders)
        
      ]);
      notify.success("All data loaded!");
    } catch (error) {
      notify.error("Failed to load some data");
    }
  };

  // Initialize data on token change
  useEffect(() => {
    if (authToken) {
      sessionStorage.setItem("token", authToken);
      fetchAllData();
    }
  }, [authToken]);

  // Initialize token from storage on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    if (savedToken && !authToken) {
      dispatch(setToken(savedToken));
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        // Auth
        authToken,
        user,
        loading,
        handleLoginAdmin,
        handleLogout,
        setToken: (t) => dispatch(setToken(t)),
        setUser: (u) => dispatch(setUser(u)),

        // Clients
        clients,
        handleGetAllClients,
        handleGetClient,
        handleCreateClient,
        handleUpdateClient,
        handleDeleteClient,

        // Employees
        employees,
        handleGetAllEmployees,
        handleCreateEmployee,
        handleUpdateEmployee,
        handleDeleteEmployee,

        // Presales
        presales,
        handleGetAllPresales,
        handleCreatePresale,
        handleUpdatePresaleStatus,
        handleDeletePresale,
        handleAddOrderInPresales,

        // PostSales
        postSales,
        handleGetAllPostSales,
        handleCreatePostSale,
        handleUpdatePostSale,
        handleAddOrderInPostSales,
        sendinvoice,
        sendnginvoice,

        // Orders
        orders,
        handleGetAllOrders,
        handleGetOrder,
        handleCreateOrder,
        handleUpdateOrder,
        handleDeleteOrder,
        handleUpdateOrderStatus,
        handleUpdateOrderStepStatus,

        // Quotations
        quotations,
        handleAddQuotation,
        handleUpdateQuotationStatus,
        handleUpdateQuotation,

        // Invoices
        invoices,
        ngInvoices,
        handleGetAllInvoices,
        handleGetAllNGInvoices,
        handleCreateInvoice,
        handleCreateNGInvoice,

        // Utility
        fetchAllData,
        addPreSalePopup,
        setAddPreSalePopup,
        notify,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
  