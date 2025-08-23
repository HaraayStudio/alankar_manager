import React, { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { useLocation } from "react-router-dom";
import styles from "./ClientsList.module.scss";
import HeaderLinks from "../../Components/HeaderLinks";
import EditClientPopup from "./EditClientPopup";
import Table from "../../Components/Table"; // Adjust if your path differs
import ContentStructure from "../../Layout/ContentStructure";
import eye from "../../assets/eye.png"
import edit from "../../assets/edit.png"
const links = [
  { to: "/clients/new", label: "Add New Client" },
  { to: "/clients/list", label: "All Clients" },
  { to: "/clients/billing", label: "GST Plans & Billing" },
];

export default function ClientsList() {
  const location = useLocation();
  const { clients, handleUpdateClient } = useContext(DataContext);
  const [viewClient, setViewClient] = useState(null); // Popup 1: client details + postSales
  const [selectedPostSale, setSelectedPostSale] = useState(null); // Popup 2: orders for selected postSale
  const [editClient, setEditClient] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // --- Main Client Table Columns & Data ---
  const clientColumns = [
    { key: "sr", label: "Sr No" },
    { key: "name", label: "Client Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    // { key: "view", label: "View" },
    { key: "action", label: "Action" }
  ];
  const clientTableData = (clients || []).map((client, idx) => ({
    sr: idx + 1,
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address,
    pan: client.pan,
    gstcertificate: client.gstcertificate,
 
    action: (
     <div className={styles.actnbtns}>
      <button
        className={styles.viewBtn}
        onClick={() => setViewClient(client)}
      >
       <img src={eye} alt="" />
      </button>
    
      <button
        className={styles.editBtn}
        onClick={() => setEditClient(client)}
      >
              <img src={edit} alt="" />

      </button>   </div>
    )
  }));

  // --- PostSales Table Columns & Data (Popup 1) ---
  const postSalesColumns = [
    { key: "sr", label: "Sr. No" },
    { key: "clientType", label: "Client Type" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
    { key: "orders", label: "Orders" }
  ];
  const postSalesTableData = (viewClient?.postSales || []).map((ps, idx) => ({
    sr: idx + 1,
    clientType: ps.clientType,
    date: ps.postSalesdateTime
      ? new Date(ps.postSalesdateTime).toLocaleString("en-GB")
      : "-",
    status: ps.status,
    orders: (
      <button
        className={styles.viewBtn}
        onClick={() => setSelectedPostSale(ps)}
      >
        View Orders
      </button>
    )
  }));

  // --- Orders Table Columns & Data (Popup 2) ---
  const orderColumns = [
    { key: "id", label: "Order ID" },
    { key: "orderType", label: "Order Type" },
    { key: "media", label: "Media" },
    { key: "qty", label: "Qty" },
    { key: "totalAmountWithGST", label: "Total Amount" },
    { key: "status", label: "Status" },
    { key: "steps", label: "Steps" }
  ];
  const ordersTableData = (selectedPostSale?.orders || []).map(order => ({
    id: order.id,
    orderType: order.orderType,
    media: order.media,
    qty: order.qty,
    totalAmountWithGST: (
      <>₹{order.totalAmountWithGST?.toLocaleString("en-IN")}</>
    ),
    status: order.status,
    steps: (
      <details>
        <summary>Show Steps</summary>
        <ul>
          {(order.steps || []).map((step) => (
            <li key={step.id}>
              {step.orderStepName}: {step.measurement} [{step.status}]
            </li>
          ))}
        </ul>
      </details>
    )
  }));
console.log(clients);

  return (
   <ContentStructure links={links}> 

     
         <h2 className='mainContentHeading'>All Clients </h2>
        <Table columns={clientColumns} data={clientTableData} />
    

      {/* ---- Popup 1: Client Details and PostSales ---- */}
      {viewClient && (
        <div className={styles.viewPopup}>
          <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
              <span className={styles.clientName}>{viewClient.name}</span>
              <button
                className={styles.closeBtn}
                onClick={() => setViewClient(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.clientDetailsCard}>
              <div>
                <div className={styles.clientAvatar}>
                  {viewClient.name?.slice(0, 1).toUpperCase()}
                </div>
                <h2>{viewClient.name}</h2>
              </div>
              <div className={styles.mainContent}>
                <div className={styles.clientMainInfo}>
                  <div>
                    <b>Name:</b>  <p>{viewClient.name}</p>
                  </div>
                  <div>
                    <b>Mobile Number:</b>  <p>{viewClient.phone}</p>
                  </div>
                </div>
                <div className={styles.clientMainInfo}>
                  <div>
                    <b>E-mail address:</b>  <p>{viewClient.email}</p>
                  </div>
                  <div>
                    <b>Address:</b>  <p>{viewClient.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ----- PostSales List Table ----- */}
            <div className={styles.projectsSection}>
              <div className={styles.sectionTitle}>All PostSales</div>
              <div className={styles.projectsTableWrapper}>
                <Table columns={postSalesColumns} data={postSalesTableData} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Popup 2: Orders of a PostSale ---- */}
      {selectedPostSale && (
        <div className={styles.viewPopup}>
          <div className={styles.popupContent} style={{ width: "50vw" }}>
            <div className={styles.popupHeader}>
              <span className={styles.clientName}>
                Orders for PostSale {selectedPostSale.client?.name || ""}
              </span>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedPostSale(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.projectsSection}>
              <div className={styles.sectionTitle}>All Orders</div>
              <div className={styles.projectsTableWrapper}>
                <Table columns={orderColumns} data={ordersTableData} />
              </div>
            </div>
          </div>
        </div>
      )}

      <EditClientPopup
        open={!!editClient}
        client={editClient}
        loading={editLoading}
        onClose={() => setEditClient(null)}
        onSubmit={async (form) => {
          setEditLoading(true);
          try {
            await handleUpdateClient(editClient.id, form);
            setEditClient(null);
          } finally {
            setEditLoading(false);
          }
        }}
      />
   </ContentStructure>
  );
}
