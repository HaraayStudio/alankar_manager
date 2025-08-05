import React, { useContext } from "react";
import styles from "./ClientPayments.module.scss";
import { DataContext } from "../../context/DataContext";
import { Eye, Edit, Trash2 } from "lucide-react";
import Table from "../../Components/Table";
import HeaderLinks from "../../Components/HeaderLinks";

const links = [
  { to: "/account/invoices", label: "Sale Invoicing" },
  { to: "/account/payments", label: "Client Payments" },
  { to: "/account/quotation", label: "Quotation" },
];

// Currency formatter
const formatCurrency = (amt = 0) =>
  `₹${Number(amt || 0).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;

// Date formatter
const shortDate = (str) =>
  str
    ? new Date(str).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

// Status color
function getStatusClass(status) {
  if (!status) return "";
  if (["COMPLETED", "SUCCESS", "PAID"].includes(status?.toUpperCase()))
    return styles.statusCompleted;
  if (["PENDING", "CREATED"].includes(status?.toUpperCase()))
    return styles.statusPending;
  if (status?.toUpperCase() === "CANCELLED")
    return styles.statusCancelled;
  return styles.statusDefault;
}

// Get client email from context
function getClientEmail(name, clients = []) {
  if (!name) return "-";
  const c = clients.find(
    (c) => c.name && c.name.toLowerCase() === name.toLowerCase()
  );
  return c?.email || "-";
}

export default function ClientPayments() {
  const { postSales = [], clients = [] } = useContext(DataContext);
console.log(postSales);

  // Only consider postSales that have a valid invoice (not null)
  const invoices = postSales.filter((ps) => ps.invoice && ps.invoice !== null);

  // All payments for table
  const allPayments = invoices.flatMap((ps) =>
    (ps.invoice.payments || []).map((pay) => ({
      invoiceId: ps.invoice.invoiceNumber,
      clientName: ps.invoice.clientName || ps.client?.name || "-",
      email: ps.invoice.clientEmail || getClientEmail(ps.invoice.clientName, clients) || ps.client?.email || "-",
      date: shortDate(pay.paymentDate) || shortDate(ps.invoice.issueDate),
      billed: pay.amount,
      status: pay.status,
      paymentId: pay.id,
      paymentMethod: pay.method,
    }))
  );

  // Stats
  const allCount = invoices.length;
  const paid = invoices.filter(
    (ps) =>
      ps.invoice.payments &&
      ps.invoice.payments[0] &&
      ["COMPLETED", "SUCCESS", "PAID"].includes(ps.invoice.payments[0].status?.toUpperCase())
  );
  const unpaid = invoices.filter(
    (ps) =>
      ps.invoice.payments &&
      ps.invoice.payments[0] &&
      ["PENDING", "CREATED"].includes(ps.invoice.payments[0].status?.toUpperCase())
  );
  const cancelled = invoices.filter(
    (ps) =>
      ps.invoice.payments &&
      ps.invoice.payments[0] &&
      ps.invoice.payments[0].status?.toUpperCase() === "CANCELLED"
  );

  // Totals for cards
  const totalPaid = paid.reduce(
    (sum, ps) => sum + (ps.invoice.payments?.[0]?.amount || 0),
    0
  );
  const totalUnpaid = unpaid.reduce(
    (sum, ps) => sum + (ps.invoice.payments?.[0]?.amount || 0),
    0
  );
  const totalCancelled = cancelled.reduce(
    (sum, ps) => sum + (ps.invoice.payments?.[0]?.amount || 0),
    0
  );

  // Helper for stat card numbers
  const statFmt = (num) => (num > 1000 ? `${Math.round(num / 100) / 10}K` : num);

  // Table columns
  const columns = [
    { key: "sno", label: "S.No" },
    { key: "invoiceId", label: "Invoice ID" },
    { key: "clientName", label: "Client Name" },
    { key: "email", label: "Email" },
    { key: "date", label: "Date" },
    { key: "billed", label: "Billed" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  // Table data with React elements for custom cells
  const tableData = allPayments.map((p, idx) => ({
    sno: String(idx + 1).padStart(2, "0"),
    invoiceId: p.invoiceId ? `#${p.invoiceId}` : "N/A",
    clientName: p.clientName,
    email: p.email,
    date: p.date,
    billed: formatCurrency(p.billed),
    status: (
      <span className={`${styles.statusBadge} ${getStatusClass(p.status)}`}>
        {p.status}
      </span>
    ),
    action: (
      <div style={{ display: "flex", gap: 6 }}>
        <button className={styles.actionBtn}>View</button>

      </div>
    ),
  }));

  return (
    <>
      <HeaderLinks links={links} />
      {/* Stat Cards */}
      <div className={styles.mainCard}>
        <div className={styles.statsCardGrid}>
          <div className={styles.statCard}>
            <div className={styles.statMain}>{statFmt(allCount)}</div>
            <div className={styles.statTitle}>All Invoices</div>
            <div className={styles.statSub}>
              <span className={styles.statSubGreen}>{statFmt(unpaid.length)}</span> Unpaid by clients
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statMain}>{statFmt(paid.length)}</div>
            <div className={styles.statTitle}>Paid Invoices</div>
            <div className={styles.statSub}>
              <span className={styles.statSubGreen}>{formatCurrency(totalPaid)}</span> Paid by clients
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statMain}>{statFmt(unpaid.length)}</div>
            <div className={styles.statTitle}>Un-paid Invoices</div>
            <div className={styles.statSub}>
              <span className={styles.statSubRed}>{formatCurrency(totalUnpaid)}</span> Unpaid by clients
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statMain}>{statFmt(cancelled.length)}</div>
            <div className={styles.statTitle}>Cancelled Invoices</div>
            <div className={styles.statSub}>
              <span className={styles.statSubRed}>{formatCurrency(totalCancelled)}</span> Cancelled by clients
            </div>
          </div>
        </div>
        {/* Payments Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeaderRow}>
            <h2 className="mainContentHeading">Clients Payments</h2>
          </div>
          <div className={styles.tableScrollWrap}>
            <Table columns={columns} data={tableData} />
          </div>
        </div>
      </div>
    </>
  );
}
