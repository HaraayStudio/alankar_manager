import React, { useEffect, useState } from "react";
import styles from "./InvoiceList.module.scss";
import { Eye } from "lucide-react";
import InvoicePreview from "../Sales/InvoicePreview";
import Table from "../../Components/Table";
import ContentStructure from "../../Layout/ContentStructure";
import { useData } from "../../context/DataContext"; // ✅ Use DataContext instead of direct Redux

const links = [
  { to: "/account/invoices", label: "Sale Invoicing" },
  { to: "/account/payments", label: "Client Payments" },
  { to: "/account/quotation", label: "Quotation" },
];

const formatCurrency = (amt = 0) =>
  `₹${Number(amt || 0).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;

const shortDate = (str) =>
  str
    ? new Date(str).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

function getStatusClass(status) {
  if (!status) return "";
  if (
    ["COMPLETED", "SUCCESS", "PAID"].includes(status.toUpperCase())
  )
    return styles.statusCompleted;
  if (status.toUpperCase() === "PENDING" || status.toUpperCase() === "CREATED")
    return styles.statusPending;
  return styles.statusDefault;
}

function getFirstPayment(inv) {
  if (!inv.payments || inv.payments.length === 0) return {};
  return inv.payments[0];
}

export default function InvoiceList() {
  // ✅ Use DataContext instead of direct Redux
  const { 
    invoices = [], 
    ngInvoices = [], 
    loading,
    handleGetAllInvoices,
    handleGetAllNGInvoices 
  } = useData();

  const [viewInvoice, setViewInvoice] = useState(null);
  const [invoiceType, setInvoiceType] = useState("GST");

  // ✅ Load data using DataContext methods
  useEffect(() => {
    handleGetAllInvoices();
    handleGetAllNGInvoices();
  }, []);

  // Debug logging
  useEffect(() => {
    console.log("GST Invoices:", invoices);
    console.log("NG Invoices:", ngInvoices);
    console.log("Current type:", invoiceType);
  }, [invoices, ngInvoices, invoiceType]);

  // Table columns config
  const columns = [
    { key: "sno", label: "S.No" },
    { key: "Invoiceno", label: "Invoice No" },
    { key: "clientName", label: "Customer Name" },
    { key: "createdOn", label: "Created On" },
    { key: "amount", label: "Amount" },
    { key: "paid", label: "Paid" },
    { key: "status", label: "Status" },
    { key: "paymentMode", label: "Payment Mode" },
    { key: "dueDate", label: "Due Date" },
    { key: "action", label: "Action" },
  ];

  // ✅ Show GST or NON GST invoices based on dropdown
  const selectedInvoices = invoiceType === "GST" ? invoices : ngInvoices;

  const data = selectedInvoices.map((inv, idx) => {
    const payment = getFirstPayment(inv);
    
    return {
      sno: String(idx + 1).padStart(2, "0"),
      Invoiceno: inv.invoiceNumber || `INV-${idx + 1}`,
      clientName: inv.clientName || "-",
      createdOn: shortDate(inv.issueDate),
      amount: formatCurrency(
        Array.isArray(inv.invoiceOrders)
          ? inv.invoiceOrders.reduce((sum, o) => sum + (Number(o.totalAmountWithGST) || 0), 0)
          : inv.totalAmount || 0
      ),
      paid: formatCurrency(payment.amount),
      status: (
        <span className={`${styles.statusBadge} ${getStatusClass(payment.status)}`}>
          {payment.status || "PENDING"}
        </span>
      ),
      paymentMode: payment.method || "N/A",
      dueDate: shortDate(inv.validTill),
      action: (
        <button
          className={styles.actionBtn}
          title="View"
          onClick={() => setViewInvoice(inv)}
        >
          <Eye size={18} />
        </button>
      ),
    };
  });

  return (
    <ContentStructure links={links}>
      <div className={styles.headerRow}>
        <h2 className="mainContentHeading">Sales Invoices</h2>
        <div>
          <select
            className={styles.invoiceTypeDropdown}
            value={invoiceType}
            onChange={e => setInvoiceType(e.target.value)}
          >
            <option value="GST">GST</option>
            <option value="NON GST">NON GST</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div>Loading invoices...</div>
      ) : (
        <>
          <div className={styles.invoiceStats}>
            <p>Showing {selectedInvoices.length} {invoiceType} invoices</p>
          </div>
          <Table columns={columns} data={data} />
        </>
      )}

      {/* Modal: Invoice Preview */}
      {viewInvoice && (
        <div className={styles.invoiceModalBackdrop} onClick={() => setViewInvoice(null)}>
          <div className={styles.invoiceModalBox} onClick={e => e.stopPropagation()}>
            <InvoicePreview
              postsale={{
                invoice: viewInvoice,
                client: {
                  name: viewInvoice.clientName,
                  email: viewInvoice.clientEmail,
                  phone: viewInvoice.clientPhone,
                  address: viewInvoice.clientAddress
                },
                remark: ""
              }}
              onClose={() => setViewInvoice(null)}
            />
          </div>
        </div>
      )}
    </ContentStructure>
  );
}