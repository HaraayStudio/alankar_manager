import React, { useContext, useState } from "react";
import styles from "./QuotationList.module.scss";
import { DataContext } from "../../context/DataContext";
import { Eye } from "lucide-react";
import QuotationPreview from "../Sales/QuotationPreview";
import Table from "../../Components/Table";
import ContentStructure from "../../Layout/ContentStructure";

const links = [
  { to: "/account/invoices", label: "Sale Invoicing" },
  { to: "/account/payments", label: "Client Payments" },
  { to: "/account/quotation", label: "Quotation" },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);

const shortDate = (str) =>
  str
    ? new Date(str).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

function getStatusBadge(quotation) {
  if (!quotation) return null;
  if (quotation.accepted) {
    return <span className={styles.statusBadge + " " + styles.accepted}>Accepted</span>;
  } else if (quotation.sended) {
    return <span className={styles.statusBadge + " " + styles.sent}>Sent</span>;
  } else {
    return <span className={styles.statusBadge + " " + styles.draft}>Draft</span>;
  }
}

export default function QuotationList() {
  const { presales = [] } = useContext(DataContext);
  const [previewQuotation, setPreviewQuotation] = useState(null);
  const [previewPresale, setPreviewPresale] = useState(null);

  // Latest quotations only
  const rows = presales
    .map((ps) => {
      const latestQuotation = ps.quotations?.length ? ps.quotations[ps.quotations.length - 1] : null;
      const quotationOrder = latestQuotation?.quotationOrders?.length
        ? latestQuotation.quotationOrders[0]
        : null;
      return {
        srNumber: ps.srNumber,
        quotationNumber: latestQuotation?.quotationNumber || "-",
        dateTimeIssued: latestQuotation?.dateTimeIssued,
        clientName: ps.client?.name || "",
        personName: ps.personName || "",
        material: quotationOrder?.media || "",
        requirements: quotationOrder?.requirements || "", // If you have it, else leave blank
        qty: quotationOrder?.qty,
        totalAmount: quotationOrder?.totalAmount,
        gst: quotationOrder?.gst,
        totalAmountWithGST: quotationOrder?.totalAmountWithGST,
        status: latestQuotation,
        action: latestQuotation,
        quotation: latestQuotation,
        presale: ps,
      };
    })
    .filter((row) => row.quotation); // Only those with at least one quotation

  // Table columns
  const columns = [
    { key: "sno", label: "S.No" },
 
    { key: "clientName", label: "Client" },
    { key: "dateTimeIssued", label: "Date" },
    { key: "personName", label: "Person" },
    // { key: "material", label: "Material" },
    // { key: "requirements", label: "Requirements" },
    // { key: "priority", label: "Priority" },
    { key: "totalAmount", label: "Amount" },
    { key: "gst", label: "GST" },
    { key: "totalAmountWithGST", label: "Total With GST" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  // Table data with all values correctly mapped
  const tableData = rows.map((row, idx) => ({
    sno: String(idx + 1).padStart(2, "0"),
 
    clientName: row.clientName,
    dateTimeIssued: shortDate(row.dateTimeIssued),
    personName: row.personName,
    // material: row.material,
    // requirements: (
    //   <div className={styles.ellipsis} title={row.requirements}>
    //     {row.requirements}
    //   </div>
    // ),
    qty: row.qty,
    totalAmount: formatCurrency(row.totalAmount),
    gst: row.gst !== undefined && row.gst !== null ? `${row.gst}%` : "-",
    totalAmountWithGST: formatCurrency(row.totalAmountWithGST),
    status: getStatusBadge(row.quotation),
    action: (
      <button
        className={styles.actionBtn}
        title="View"
        onClick={() => {
          setPreviewQuotation(row.quotation);
          setPreviewPresale(row.presale);
        }}
      >
        <Eye size={18} />
      </button>
    ),
  }));

  return (
    <ContentStructure links={links}>
      <Table
        columns={columns}
        data={tableData}
        emptyContent={<div className={styles.emptyText}>No quotations found.</div>}
      />

      {/* Quotation Preview Modal */}
      {previewQuotation && (
        <QuotationPreview
          quotation={previewQuotation}
          presale={previewPresale}
          onClose={() => setPreviewQuotation(null)}
        />
      )}
    </ContentStructure>
  );
}
