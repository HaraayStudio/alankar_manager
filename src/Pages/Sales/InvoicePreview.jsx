import React, { useRef } from "react";
import styles from "./InvoicePreview.module.scss";
import logo from "../../assets/logo_vertical.png";
import { X, FileDown, Share2 } from "lucide-react";
import html2pdf from "html2pdf.js";
import { useData } from "../../context/DataContext";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB");
}

export default function InvoicePreview({ postsale, onClose }) {
  const invoiceRef = useRef();
  const { handleSendInvoiceMail } = useData();
  const invoice = postsale?.invoice || {};
  const client = postsale?.client || {};

  // Invoice orders
  const orders = Array.isArray(invoice.invoiceOrders)
    ? invoice.invoiceOrders
    : invoice.invoiceOrders ? [invoice.invoiceOrders] : [];

  // Totals
  const subtotal = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const gstTotal = orders.reduce((sum, o) => sum + ((Number(o.totalAmountWithGST) || 0) - (Number(o.totalAmount) || 0)), 0);
  const grandTotal = orders.reduce((sum, o) => sum + (Number(o.totalAmountWithGST) || 0), 0);

  // Payment link (from first payment or remark)
  const paymentLink =
    (invoice.payments?.[0]?.paymentLink) ||
    postsale.remark?.replace(/^Payment link:\s*/i, "") ||
    "";

  // Print or PDF handlers
  const handleDownloadPDF = () => {
    html2pdf().set({
      margin: 5,
      filename: `Invoice_${invoice.invoiceNumber || postsale.srNumber || "INV"}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
    .from(invoiceRef.current)
    .save();
  };

  // Bank details
  const company = {
    name: "Alankar Imprint Pvt. Ltd.",
    tagline: "We Ink Your Vision",
    address: "A/P Manjri Farm, Near Hake Vasti, Beside Mual Tyres, Opp. Govind Hotel, Solapur Road, Manjri, Pune-412307",
    phone: "7276205777, 8422925096/97",
    email: "info@alankarsimprint.com",
    website: "alankarsimprint.com"
  };
  const bankDetails = {
    name: "HDFC BANK",
    accNo: "50200025519144",
    ifsc: "HDFC0001811",
    chq: "ALANKAR IMPRINTS PVT. LTD."
  };

  return (
    <div className={styles.previewBackdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.previewBox}>
        <button className={styles.closeBtn} onClick={onClose}><X size={22} /></button>
        {/* Top actions */}
        <div className={styles.actionBar}>
          <button onClick={handleDownloadPDF} className={styles.actionBtn} title="Download PDF">
            <FileDown size={18} /> PDF
          </button>
          <button
            onClick={() => handleSendInvoiceMail(invoice.invoiceNumber)}
            className={styles.actionBtn}
            title="Send Invoice via Email"
          >
            <Share2 size={18} /> Send Via Mail
          </button>
        </div>
        {/* Printable Content */}
        <div ref={invoiceRef}>
          {/* Header */}
          <div className={styles.headerRow}>
            <div className={styles.company}>
              <img src={logo} alt="logo" className={styles.logo} />
              <div>
                <div className={styles.compName}>{company.name}</div>
                <div className={styles.compTagline}>{company.tagline}</div>
                <div className={styles.compAddr}>{company.address}</div>
              </div>
            </div>
            <div className={styles.qmeta}>
              <div>
                <b>Invoice No:</b> {invoice.invoiceNumber || "-"}<br />
                <b>Date:</b> {formatDate(invoice.issueDate)}<br />
                <b>Valid Till:</b> {formatDate(invoice.validTill)}
              </div>
            </div>
          </div>
          {/* Client Row */}
          <div className={styles.clientRow}>
            <div>
              <b>To,</b><br />
              {client.clientName || "-"}<br />
              {client.email && <>{client.email}<br /></>}
              {client.phone && <>{client.phone}<br /></>}
            </div>
            <div>
              <b>Invoice</b>
            </div>
          </div>
          {/* Orders Table */}
          <table className={styles.detailsTable}>
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Base Amt</th>
                <th>GST %</th>
                <th>GST Amt</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>No Orders found.</td>
                </tr>
              ) : (
                orders.map((o, idx) => {
                  const gstAmt = (Number(o.totalAmountWithGST) || 0) - (Number(o.totalAmount) || 0);
                  return (
                    <tr key={o.invoiceOrderId || idx}>
                      <td>{String(idx + 1).padStart(2, "0")}</td>
                      <td style={{ minWidth: 160 }}>
                        {o.details}
                      </td>
                      <td>{o.qty || "-"}</td>
                      <td>₹{Number(o.unitPrice || 0).toLocaleString()}</td>
                      <td>₹{Number(o.totalAmount || 0).toLocaleString()}</td>
                      <td>{o.gST || 0}%</td>
                      <td>₹{gstAmt.toLocaleString()}</td>
                      <td><b>₹{Number(o.totalAmountWithGST || 0).toLocaleString()}</b></td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Totals */}
            {orders.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={4}></td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>Subtotal:</td>
                  <td colSpan={3}><b>₹{subtotal.toLocaleString()}</b></td>
                </tr>
                <tr>
                  <td colSpan={4}></td>
                  <td style={{ textAlign: "right" }}>Total GST:</td>
                  <td colSpan={3}><b>₹{gstTotal.toLocaleString()}</b></td>
                </tr>
                <tr>
                  <td colSpan={4}></td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>GRAND TOTAL:</td>
                  <td colSpan={3} style={{ fontWeight: 700, color: "#1556b7" }}><b>₹{grandTotal.toLocaleString()}</b></td>
                </tr>
              </tfoot>
            )}
          </table>
          {/* Payments Received */}
          {Array.isArray(invoice.payments) && invoice.payments.length > 0 && (
            <div className={styles.paymentSection}>
              <b>Payments Received:</b>
              <ul>
                {invoice.payments.map((p, idx) => (
                  <li key={p.id || idx}>
                    {p.paymentDate ? formatDate(p.paymentDate) : "-"} - ₹{Number(p.amount).toLocaleString()} ({p.method || "N/A"})
                    {p.paymentLink && (
                      <span>
                        {" "} | <a href={p.paymentLink} target="_blank" rel="noopener noreferrer">Payment Link</a>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* QR/Remarks */}
          {paymentLink && (
            <div className={styles.remarksRow} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <b>Scan to Pay:</b>
              <a href={paymentLink} target="_blank" rel="noopener noreferrer">{paymentLink}</a>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(paymentLink)}`}
                alt="QR Code for Payment"
                style={{ marginLeft: '10px', height: '100px' }}
              />
            </div>
          )}
          {/* Bank & TnC Row */}
          <div className={styles.bottomRow}>
            <div className={styles.bankDetails}>
              <div className={styles.sectionTitle}>PAYMENT DETAILS</div>
              <div>BANK NAME: {bankDetails.name}</div>
              <div>ACCOUNT NO: {bankDetails.accNo}</div>
              <div>IFSC CODE: {bankDetails.ifsc}</div>
              <div>Cheque/DD in name: <b>{bankDetails.chq}</b></div>
            </div>
            <div className={styles.tncDetails}>
              <div className={styles.sectionTitle}>TERMS & CONDITIONS</div>
              <div>1. Payment to be made 50% advance & balance on delivery.</div>
              <div>2. Transportation extra as applicable.</div>
              <div>3. Invoice valid for 15 days.</div>
              <div>4. Actual qty may vary by 2-3%.</div>
            </div>
          </div>
          <div className={styles.thankYou}>THANK YOU!</div>
          <div className={styles.footerRow}>
            <div>WE HOPE EVERYTHING IS CRYSTAL CLEAR. CONTACT US FOR ANY QUERY.</div>
            <div>
              <b>{company.phone}</b> | {company.email} | {company.website}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
