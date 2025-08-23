// import React, { useState , useEffect } from "react";
// import styles from "./PostSalesPage.module.scss";
// import HeaderLinks from "../../Components/HeaderLinks";
// import Table from "../../Components/Table";
// import OrdersPopup from "./UpdateOrderPopupPostsale";
// import UpdateOrderPopup from "./UpdateOrderPopupPostsale";
// import InvoiceListPopup from "./InvoiceListPopup";
// import { Check, Eye, FileText, Pencil } from "lucide-react";
// import { useData } from "../../context/DataContext";
// import { useNavigate } from "react-router-dom";
// import { fetchPostSales } from "../../store/slices/postsaleSlice";
// import { useSelector, useDispatch } from "react-redux";
// // Navigation links
// const links = [
//   { to: "/sales/presale", label: "Pre-sales" },
//   { to: "/sales/postsale", label: "Post sales" },
// ];

// // Table columns
// const columns = [
//   { key: "srNumber", label: "S.No" },
//   { key: "clientName", label: "Client Name" },
//   { key: "contact", label: "Contact" },
//   { key: "finalAmt", label: "Final Amt (No GST)" },
//   { key: "gst", label: "GST %" },
//   { key: "totalWithGst", label: "Total (With GST)" },
//   { key: "status", label: "Status" },
//   { key: "notified", label: "Notified" },
//   { key: "orders", label: "Orders" },
//   { key: "invoices", label: "Invoices" },
//   { key: "actions", label: "Actions" },
// ];

// // Status badge
// const StatusBadge = ({ status }) => (
//   <span
//     className={`${styles.statusBadge} ${
//       status?.toLowerCase() === "completed"
//         ? styles.statusCompleted
//         : status?.toLowerCase() === "created"
//         ? styles.statusCreated
//         : status?.toLowerCase() === "onboarded"
//         ? styles.statusOnboarded
//         : styles.statusPending
//     }`}
//   >
//     {status ? status.charAt(0) + status.slice(1).toLowerCase() : "Pending"}
//   </span>
// );

// export default function PostSalesPage() {
//   const navigate = useNavigate();
// const dispatch = useDispatch();
// const { list: postSales = [], loading } = useSelector((state) => state.postsales);

// useEffect(() => {
//   dispatch(fetchPostSales());
// }, [dispatch]);

// console.log(postSales); // <-- Should now log your data

//   // Popups
//   const [showOrders, setShowOrders] = useState({
//     open: false,
//     order: null,
//     srNumber: null,
//   });
//   const [showInvoices, setShowInvoices] = useState(null);
//   const [editPostSale, setEditPostSale] = useState(null);

//   // Calculate totals for all orders in a postsale
//   const calculatePostSaleTotals = (orders) => {
//     if (!orders || orders.length === 0) {
//       return { totalAmount: 0, totalWithGST: 0, avgGST: 0 };
//     }

//     let totalAmount = 0;
//     let totalWithGST = 0;
//     let totalGSTAmount = 0;

//     orders.forEach(order => {
//       totalAmount += Number(order.totalAmount || 0);
//       totalWithGST += Number(order.totalAmountWithGST || 0);
//     });

//     const avgGST = totalAmount > 0 ? ((totalWithGST - totalAmount) / totalAmount) * 100 : 0;

//     return { 
//       totalAmount, 
//       totalWithGST, 
//       avgGST: Math.round(avgGST * 100) / 100 
//     };
//   };

//   // Build data for Table
//   const data = (postSales || []).map((item, i) => {
//     const totals = calculatePostSaleTotals(item.orders);
    
//     return {
//       srNumber: item.srNumber || i + 1,
//       clientName: item.client?.name || "-",
//       contact: (
//         <div className={styles.contactCell}>
//           <span className={styles.email}>{item.client?.email || "-"}</span>
//           <span className={styles.phone}>{item.client?.phone || "-"}</span>
//         </div>
//       ),
//       finalAmt: totals.totalAmount > 0
//         ? `₹${totals.totalAmount.toLocaleString()}`
//         : "-",
//       gst: totals.avgGST > 0 ? `${totals.avgGST}%` : "-",
//       totalWithGst: totals.totalWithGST > 0
//         ? `₹${totals.totalWithGST.toLocaleString()}`
//         : "-",
//       status: <StatusBadge status={item.status} />,
//       notified: item.notified ? (
//         <span className={styles.tickBadge}>
//           <Check size={14} color="white" />
//         </span>
//       ) : (
//         <span className={styles.crossBadge}>✗</span>
//       ),
//       orders: (
//         <button
//           className={`${styles.actionBtn} ${styles.ordersBtn}`}
//           onClick={() =>
//             setShowOrders({
//               open: true,
//               order: item, // Pass the whole postsale object
//               srNumber: item.srNumber || i + 1,
//             })
//           }
//           disabled={!item.orders || !item.orders.length}
//           title={`View ${item.orders?.length || 0} orders`}
//         >
//           <Eye size={16} /> 
//           <span className={styles.orderCount}>
//             {item.orders?.length || 0}
//           </span>
//         </button>
//       ),
//       invoices: (
//         <button
//           className={`${styles.actionBtn} ${styles.invoicesBtn}`}
//           onClick={() => setShowInvoices(item)}
//           title="View invoices"
//         >
//           <FileText size={16} /> Invoices
//         </button>
//       ),
//       actions: (
//         <div className={styles.actionButtons}>
//           <button
//             className={`${styles.actionBtn} ${styles.editBtn}`}
//             onClick={() => setEditPostSale(item)}
//             title="Edit order"
//           >
//             <Pencil size={14} />
//           </button>
//         </div>
//       ),
//     };
//   });

//   const handleOrderUpdated = () => {
//     // Refresh the post sales data
    
//   };

//   const handleOrderAdded = () => {
//     // Refresh the post sales data
   
//   };

//   return (
//     <div className={styles.PostSaleMainDiv}>
//       {/* Orders Popup */}
//       {showOrders.open && (
//         <OrdersPopup
//           order={showOrders.order} // Pass the whole postsale object
//           onClose={() =>
//             setShowOrders({ open: false, order: null, srNumber: null })
//           }
//           onOrderAdded={handleOrderAdded}
//           onOrderUpdated={handleOrderUpdated}
//         />
//       )}

//       {/* Update Order Popup */}
//       {editPostSale && (
//         <UpdateOrderPopup
//           postSaleData={editPostSale}
//           onClose={() => setEditPostSale(null)}
//           onSuccess={() => {
//             setEditPostSale(null);
//             handleOrderUpdated();
//           }}
//         />
//       )}

//       <HeaderLinks links={links} />
//       <div className={styles.mainContent}>
//         <div className={styles.heading}>
//           <div className={styles.headtext}>
//             <h1>Post-Sales</h1>
           
//           </div>
//           <div className={styles.addButton}>
//             <button onClick={() => navigate("/orders/new")}>
//               <span>+</span> Add Post-Sale
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         {/* <div className={styles.summaryCards}>
//           <div className={styles.summaryCard}>
//             <h3>Total Orders</h3>
//             <p className={styles.summaryNumber}>
//               {postSales?.reduce((total, item) => total + (item.orders?.length || 0), 0) || 0}
//             </p>
//           </div>
//           <div className={styles.summaryCard}>
//             <h3>Active Clients</h3>
//             <p className={styles.summaryNumber}>
//               {postSales?.length || 0}
//             </p>
//           </div>
//           <div className={styles.summaryCard}>
//             <h3>Total Revenue</h3>
//             <p className={styles.summaryNumber}>
//               ₹{postSales?.reduce((total, item) => {
//                 const totals = calculatePostSaleTotals(item.orders);
//                 return total + totals.totalWithGST;
//               }, 0).toLocaleString() || 0}
//             </p>
//           </div>
//         </div> */}

//         <Table columns={columns} data={data} />
//       </div>

//       {/* Invoices Popup */}
//       {showInvoices && (
//         <InvoiceListPopup
//           open={!!showInvoices}
//           postsale={showInvoices}
//           onClose={() => setShowInvoices(null)}
//         />
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import styles from "./PostSalesPage.module.scss";
import HeaderLinks from "../../Components/HeaderLinks";
import Table from "../../Components/Table";
import OrdersPopup from "./UpdateOrderPopupPostsale";
import UpdateOrderPopup from "./UpdateOrderPopupPostsale";
import InvoiceListPopup from "./InvoiceListPopup";
import { Check, Eye, FileText, Pencil, RefreshCw } from "lucide-react";
import { useData } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";
import { fetchPostSales } from "../../store/slices/postsaleSlice";
import { useSelector, useDispatch } from "react-redux";

// Navigation links
const links = [
  { to: "/sales/presale", label: "Pre-sales" },
  { to: "/sales/postsale", label: "Post sales" },
];

// Table columns
const columns = [
  { key: "srNumber", label: "S.No" },
  { key: "clientName", label: "Client Name" },
  { key: "contact", label: "Contact" },
  { key: "finalAmt", label: "Final Amt (No GST)" },
  { key: "gst", label: "GST %" },
  { key: "totalWithGst", label: "Total (With GST)" },
  { key: "status", label: "Status" },
  { key: "notified", label: "Notified" },
  { key: "orders", label: "Orders" },
  { key: "invoices", label: "Invoices" },
  { key: "actions", label: "Actions" },
];

// Status badge
const StatusBadge = ({ status }) => (
  <span
    className={`${styles.statusBadge} ${
      status?.toLowerCase() === "completed"
        ? styles.statusCompleted
        : status?.toLowerCase() === "created"
        ? styles.statusCreated
        : status?.toLowerCase() === "onboarded"
        ? styles.statusOnboarded
        : styles.statusPending
    }`}
  >
    {status ? status.charAt(0) + status.slice(1).toLowerCase() : "Pending"}
  </span>
);

export default function PostSalesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { list: postSales = [], loading, error } = useSelector((state) => state.postsales);
  
  // Local state for popups
  const [showOrders, setShowOrders] = useState({
    open: false,
    order: null,
    srNumber: null,
  });
  const [showInvoices, setShowInvoices] = useState(null);
  const [editPostSale, setEditPostSale] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Initial data fetch
  useEffect(() => {
    console.log("🔄 PostSalesPage mounted, fetching data...");
    dispatch(fetchPostSales());
  }, [dispatch]);

  // Debug log
  useEffect(() => {
    console.log("📊 PostSales data updated:", { 
      count: postSales.length, 
      loading, 
      error 
    });
  }, [postSales, loading, error]);

  // Manual refresh function
  const refreshData = async () => {
    setRefreshing(true);
    try {
      console.log("🔄 Manual refresh triggered");
      await dispatch(fetchPostSales()).unwrap();
      console.log("✅ Data refreshed successfully");
    } catch (error) {
      console.error("❌ Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate totals for all orders in a postsale
  const calculatePostSaleTotals = (orders) => {
    if (!orders || orders.length === 0) {
      return { totalAmount: 0, totalWithGST: 0, avgGST: 0 };
    }

    let totalAmount = 0;
    let totalWithGST = 0;

    orders.forEach(order => {
      totalAmount += Number(order.totalAmount || 0);
      totalWithGST += Number(order.totalAmountWithGST || 0);
    });

    const avgGST = totalAmount > 0 ? ((totalWithGST - totalAmount) / totalAmount) * 100 : 0;

    return { 
      totalAmount, 
      totalWithGST, 
      avgGST: Math.round(avgGST * 100) / 100 
    };
  };

  // Build data for Table
  const data = (postSales || []).map((item, i) => {
    const totals = calculatePostSaleTotals(item.orders);
    
    return {
      srNumber: item.srNumber || i + 1,
      clientName: item.client?.name || "-",
      contact: (
        <div className={styles.contactCell}>
          <span className={styles.email}>{item.client?.email || "-"}</span>
          <span className={styles.phone}>{item.client?.phone || "-"}</span>
        </div>
      ),
      finalAmt: totals.totalAmount > 0
        ? `₹${totals.totalAmount.toLocaleString()}`
        : "-",
      gst: totals.avgGST > 0 ? `${totals.avgGST}%` : "-",
      totalWithGst: totals.totalWithGST > 0
        ? `₹${totals.totalWithGST.toLocaleString()}`
        : "-",
      status: <StatusBadge status={item.status} />,
      notified: item.notified ? (
        <span className={styles.tickBadge}>
          <Check size={14} color="white" />
        </span>
      ) : (
        <span className={styles.crossBadge}>✗</span>
      ),
      orders: (
        <button
          className={`${styles.actionBtn} ${styles.ordersBtn}`}
          onClick={() =>
            setShowOrders({
              open: true,
              order: item, // Pass the whole postsale object
              srNumber: item.srNumber || i + 1,
            })
          }
          disabled={!item.orders || !item.orders.length}
          title={`View ${item.orders?.length || 0} orders`}
        >
          <Eye size={16} /> 
          <span className={styles.orderCount}>
            {item.orders?.length || 0}
          </span>
        </button>
      ),
      invoices: (
        <button
          className={`${styles.actionBtn} ${styles.invoicesBtn}`}
          onClick={() => setShowInvoices(item)}
          title="View invoices"
        >
          <FileText size={16} /> Invoices
        </button>
      ),
      actions: (
        <div className={styles.actionButtons}>
          <button
            className={`${styles.actionBtn} ${styles.editBtn}`}
            onClick={() => setEditPostSale(item)}
            title="Edit order"
          >
            <Pencil size={14} />
          </button>
        </div>
      ),
    };
  });

  // Handle successful order operations
  const handleOrderSuccess = async () => {
    console.log("🎉 Order operation successful, refreshing data...");
    
    // Close any open popups
    setEditPostSale(null);
    setShowOrders({ open: false, order: null, srNumber: null });
    
    // Refresh PostSales data to get updated information
    await refreshData();
  };

  // Handle order popup close
  const handleOrderPopupClose = () => {
    setShowOrders({ open: false, order: null, srNumber: null });
  };

  // Handle edit popup close
  const handleEditPopupClose = () => {
    setEditPostSale(null);
  };

  return (
    <div className={styles.PostSaleMainDiv}>
      {/* Orders Popup */}
      {showOrders.open && (
        <OrdersPopup
          order={showOrders.order} // Pass the whole postsale object
          onClose={handleOrderPopupClose}
          onOrderAdded={handleOrderSuccess}
          onOrderUpdated={handleOrderSuccess}
        />
      )}

      {/* Update Order Popup */}
      {editPostSale && (
        <UpdateOrderPopup
          postSaleData={editPostSale}
          onClose={handleEditPopupClose}
          onSuccess={handleOrderSuccess}
        />
      )}

      <HeaderLinks links={links} />
      <div className={styles.mainContent}>
        <div className={styles.heading}>
          <div className={styles.headtext}>
            <h1>Post-Sales</h1>
            {error && (
              <div className={styles.errorMsg}>
                Error: {error}
              </div>
            )}
          </div> 
       <div className={styles.addButton}>
             <button onClick={() => navigate("/orders/new")}>
               <span>+</span> Add Post-Sale
             </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loading}>Loading post-sales data...</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && postSales.length === 0 && (
          <div className={styles.emptyState}>
            <h3>No Post-Sales Found</h3>
            <p>Create your first post-sale to get started.</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && postSales.length > 0 && (
          <>
          

            <Table columns={columns} data={data} />
          </>
        )}
      </div>

      {/* Invoices Popup */}
      {showInvoices && (
        <InvoiceListPopup
          open={!!showInvoices}
          postsale={showInvoices}
          onClose={() => setShowInvoices(null)}
        />
      )}
    </div>
  );
}