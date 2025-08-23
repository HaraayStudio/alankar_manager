import React, { useContext ,useEffect} from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import AddPreSale from "./Pages/Sales/AddPreSale.jsx";
import { DataProvider, DataContext } from "./context/DataContext";

// Layout
import MainLayout from "./Layout/MainLayout.jsx";

// Pages
import Login from "./Pages/Login/Login.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import Projects from "./Pages/Order/Order.jsx";
import AddProject from "./Pages/Order/AddOrder.jsx";
import AddProject2 from "./Pages/Order/AddOrder2.jsx";
import OngoingProjects from "./Pages/Order/OngoingOrder.jsx";
import ProjectHistory from "./Pages/Order/OrderHistory.jsx";
import Clients from "./Pages/Clients/Clients.jsx";
import AddClient from "./Pages/Clients/AddClient.jsx";
import AllClients from "./Pages/Clients/AllClients.jsx";
import GSTPlansBilling from "./Pages/Clients/GSTPlansBilling.jsx";
import Account from "./Pages/Account/Account.jsx";
import Invoices from "./Pages/Account/Invoices.jsx";
import ClientPayments from "./Pages/Account/ClientPayments.jsx";
import QuotationList from "./Pages/Account/QuotationList.jsx";
import Employee from "./Pages/Employee/Employee.jsx";
import AddEmployee from "./Pages/Employee/AddEmployee.jsx";
import AllEmployee from "./Pages/Employee/AllEmployee.jsx";
import SalesDashboard from "./Pages/Sales/SalesDashbaord.jsx";
import PreSale from "./Pages/Sales/PreSale.jsx";
import PostSale from "./Pages/Sales/PostSale.jsx";
import AddPostSales from "./Pages/Sales/AddPostSales.jsx";
import Jobsheet from "./Pages/Jobsheet/jobsheet.jsx"
import { Toaster } from "react-hot-toast";

import { useDispatch } from 'react-redux';
import { fetchInvoices } from './store/slices/invoiceSlice.js';

// PrivateRoute wrapper (optional, if you want route protection)
const PrivateRoute = ({ children }) => {
  const { authToken } = useContext(DataContext);
  return authToken ? children : <Navigate to="/login" replace />;
};

// All App routes, wrapped in DataContext
const AppRoutes = () => {
  const { authToken } = useContext(DataContext);
   const dispatch = useDispatch();
  const token = sessionStorage.getItem('token');
 useEffect(() => {
    if (token) {
      dispatch(fetchInvoices(token)); // Fetch only once
    }
  }, [dispatch, token]);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
           </PrivateRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Navigate to="login" replace />} />

        {/* <Route index element={<Navigate to="dashboard" replace />} /> */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Projects/Orders */}
        <Route path="orders" element={<Projects />} />
        {/* <Route path="orders/new2" element={<AddProject />} /> */}
        <Route path="orders/new" element={<AddProject2 />} />
        <Route path="orders/ongoing" element={<OngoingProjects />} />
        <Route path="orders/history" element={<ProjectHistory />} />

        {/* Sales */}
        <Route path="sales" element={<SalesDashboard />} />
        <Route path="sales/presale" element={<PreSale />} />
        <Route path="sales/postsale" element={<PostSale />} />
        <Route path="sales/addpostsale" element={<AddPostSales />} />

        {/* Clients */}
        <Route path="clients" element={<Clients />} />
        <Route path="clients/new" element={<AddClient />} />
        <Route path="clients/list" element={<AllClients />} />
        <Route path="clients/billing" element={<GSTPlansBilling />} />

        {/* Account */}
        <Route path="account" element={<Account />} />
        <Route path="account/invoices" element={<Invoices />} />
        <Route path="account/payments" element={<ClientPayments />} />
        <Route path="account/quotation" element={<QuotationList />} />

        {/* Employee */}
        <Route path="employee" element={<Employee />} />
        <Route path="employee/new" element={<AddEmployee />} />
        <Route path="employee/list" element={<AllEmployee />} />

            {/* Jobsheet */}
        <Route path="jobsheet" element={<Jobsheet />} />
      </Route>
      {/* Fallback Route */}
      <Route
        path="*"
        element={<Navigate to={authToken ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
};

// Popup modal wrapper (only uses hooks inside the function)
function PopupWrapper() {
  const { addPreSalePopup, setAddPreSalePopup } = useContext(DataContext);
  return (
    <>
      {addPreSalePopup && (
        <AddPreSale onClose={() => setAddPreSalePopup(false)} />
      )}
    </>
  );
}

// Main App component
const App = () => (
  <ReduxProvider store={store}> 
    <DataProvider>
      <Router>  <Toaster position="top-center" reverseOrder={false} />
        <PopupWrapper />
        <AppRoutes />
      </Router>
    </DataProvider>
  </ReduxProvider>
);

export default App;
 