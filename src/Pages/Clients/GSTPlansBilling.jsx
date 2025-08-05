import React, { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { useLocation } from "react-router-dom";
import styles from "./ClientsList.module.scss";
import HeaderLinks from "../../Components/HeaderLinks";
import EditClientPopup from "./EditClientPopup";
import Table from "../../Components/Table"; // Adjust path if needed
import ContentStructure from "../../Layout/ContentStructure";
const links = [
  { to: "/clients/new", label: "Add New Client" },
  { to: "/clients/list", label: "All Clients" },
  { to: "/clients/billing", label: "GST Plans & Billing" },
];

export default function ClientsList() {
  const location = useLocation();
  const { clients, handleUpdateClient } = useContext(DataContext);

  // --- Main Client Table Columns & Data (including GST, Orders, Payments) ---
  const clientColumns = [
    { key: "sr", label: "Sr No" },
    { key: "name", label: "Client Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "totalOrders", label: "Total Orders" },
    { key: "gstTypes", label: "GST Types" },
    { key: "totalPayments", label: "Total Payments" },
  ];

  const clientTableData = (clients || []).map((client, idx) => {
    // Flatten all orders from all PostSales
    const allOrders = (client.postSales || []).flatMap((ps) => ps.orders || []);
    // Unique GST types, clean, sort, join
    const gstTypes = [
      ...new Set(
        allOrders.map((order) => order.gst ?? order.GST ?? order.gST ?? 0)
      ),
    ]
      .filter((val) => val !== null && val !== undefined)
      .sort((a, b) => a - b)
      .join(", ");
    // Total payments across all invoices
    const totalPayments = (client.postSales || []).reduce((sum, ps) => {
      if (ps.invoice && ps.invoice.payments && ps.invoice.payments.length > 0) {
        return (
          sum +
          ps.invoice.payments.reduce((pSum, pay) => pSum + (pay.amount || 0), 0)
        );
      }
      return sum;
    }, 0);

    return {
      sr: idx + 1,
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      totalOrders: allOrders.length,
      gstTypes: gstTypes || "-",
      totalPayments: <>₹{totalPayments.toLocaleString("en-IN")}</>,
    };
  });

  return (
    <ContentStructure links={links}>
       <h2 className='mainContentHeading'>GST Plan & Billing</h2>
      <Table columns={clientColumns} data={clientTableData} />
    </ContentStructure>
  );
}
