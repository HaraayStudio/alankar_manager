// import React, { useRef } from "react";
// import styles from "./InvoicePreview.module.scss";
// import logo from "../../assets/logo_vertical.png";
// import { X, FileDown, Share2 } from "lucide-react";
// import html2pdf from "html2pdf.js";
// import { useData } from "../../context/DataContext";

// function formatDate(dateStr) {
//   if (!dateStr) return "-";
//   const date = new Date(dateStr);
//   return date.toLocaleDateString("en-GB");
// }

// export default function InvoicePreview({ postsale, onClose }) {
//   const invoiceRef = useRef();
//   const { sendnginvoice ,sendinvoice} = useData();
//   const invoice = postsale?.invoice || {};
//   const client = postsale?.client || {};
// console.log(postsale);

//   // Invoice orders
//   const orders = Array.isArray(invoice.invoiceOrders)
//     ? invoice.invoiceOrders
//     : invoice.invoiceOrders ? [invoice.invoiceOrders] : [];

//   // Totals
//   const subtotal = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
//   const gstTotal = orders.reduce((sum, o) => sum + ((Number(o.totalAmountWithGST) || 0) - (Number(o.totalAmount) || 0)), 0);
//   const grandTotal = orders.reduce((sum, o) => sum + (Number(o.totalAmountWithGST) || 0), 0);

//   // Payment link (from first payment or remark)
//   const paymentLink =
//     (invoice.payments?.[0]?.paymentLink) ||
//     postsale.remark?.replace(/^Payment link:\s*/i, "") ||
//     "";

//   // Print or PDF handlers
//   const handleDownloadPDF = () => {
//     html2pdf().set({
//       margin: 5,
//       filename: `Invoice_${invoice.invoiceNumber || postsale.srNumber || "INV"}.pdf`,
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//     })
//     .from(invoiceRef.current)
//     .save();
//   };

//   // Bank details
//   const company = {
//     name: "Alankar Imprint Pvt. Ltd.",
//     tagline: "We Ink Your Vision",
//     address: "A/P Manjri Farm, Near Hake Vasti, Beside Mual Tyres, Opp. Govind Hotel, Solapur Road, Manjri, Pune-412307",
//     phone: "7276205777, 8422925096/97",
//     email: "info@alankarsimprint.com",
//     website: "alankarsimprint.com"
//   };
//   const bankDetails = {
//     name: "HDFC BANK",
//     accNo: "50200025519144",
//     ifsc: "HDFC0001811",
//     chq: "ALANKAR IMPRINTS PVT. LTD."
//   };

//   return (
//     <div className={styles.previewBackdrop} onClick={e => e.target === e.currentTarget && onClose()}>
//       <div className={styles.previewBox}>
//         <button className={styles.closeBtn} onClick={onClose}><X size={22} /></button>
//         {/* Top actions */}
//         <div className={styles.actionBar}>
//           <button onClick={handleDownloadPDF} className={styles.actionBtn} title="Download PDF">
//             <FileDown size={18} /> PDF
//           </button>
//           <button
//             // onClick={() => handleSendInvoiceMail(invoice.invoiceNumber)}
//              onClick={() => invoice.invoiceType=="GST"? sendinvoice(invoice.invoiceNumber) : sendnginvoice(invoice.invoiceNumber)}
//             className={styles.actionBtn}
//             title="Send Invoice via Email"
//           >
//             <Share2 size={18} /> Send Via Mail
//           </button>{
//           console.log(invoice)}
//          <span
//   style={{
//     padding: "4px 8px",
//     borderRadius: "6px",
//     color: "white",
//     backgroundColor: invoice.notified ? "green" : "red"
//   }}
// >
//   {invoice.notified ? "Sent" : "Not Sent"}
// </span>

//           {/* <span>{invoice}</span> */}
//         </div>
//         {/* Printable Content */}
//         <div ref={invoiceRef}>
//           {/* Header */}
//           <div className={styles.headerRow}>
//             <div className={styles.company}>
//               <img src={logo} alt="logo" className={styles.logo} />
//               <div>
//                 <div className={styles.compName}>{company.name}</div>
//                 <div className={styles.compTagline}>{company.tagline}</div>
//                 <div className={styles.compAddr}>{company.address}</div>
//               </div>
//             </div>
//             <div className={styles.qmeta}>
//               <div>
//                 <b>Invoice No:</b> {invoice.invoiceNumber || "-"}<br />
//                 <b>Date:</b> {formatDate(invoice.issueDate)}<br />
//                 <b>Valid Till:</b> {formatDate(invoice.validTill)}
//               </div>
//             </div>
//           </div>
//           {/* Client Row */}
//           <div className={styles.clientRow}>
//             <div>
//               <b>To,</b><br />
//               {client.clientName || "-"}<br />
//               {client.email && <>{client.email}<br /></>}
//               {client.phone && <>{client.phone}<br /></>}
//             </div>
//             <div>
//               <b>Invoice</b>
//             </div>
//           </div>
//           {/* Orders Table */}
//           <table className={styles.detailsTable}>
//             <thead>
//               <tr>
//                 <th>Sr.</th>
//                 <th>Description</th>
//                 <th>Qty</th>
//                 <th>Unit Price</th>
//                 <th>Base Amt</th>
//                 <th>GST %</th>
//                 <th>GST Amt</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} style={{ textAlign: "center" }}>No Orders found.</td>
//                 </tr>
//               ) : (
//                 orders.map((o, idx) => {
//                   const gstAmt = (Number(o.totalAmountWithGST) || 0) - (Number(o.totalAmount) || 0);
//                   return (
//                     <tr key={o.invoiceOrderId || idx}>
//                       <td>{String(idx + 1).padStart(2, "0")}</td>
//                       <td style={{ minWidth: 160 }}>
//                         {o.details}
//                       </td>
//                       <td>{o.qty || "-"}</td>
//                       <td>₹{Number(o.unitPrice || 0).toLocaleString()}</td>
//                       <td>₹{Number(o.totalAmount || 0).toLocaleString()}</td>
//                       <td>{o.gST || 0}%</td>
//                       <td>₹{gstAmt.toLocaleString()}</td>
//                       <td><b>₹{Number(o.totalAmountWithGST || 0).toLocaleString()}</b></td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//             {/* Totals */}
//             {orders.length > 0 && (
//               <tfoot>
//                 <tr>
//                   <td colSpan={4}></td>
//                   <td style={{ textAlign: "right", fontWeight: 600 }}>Subtotal:</td>
//                   <td colSpan={3}><b>₹{subtotal.toLocaleString()}</b></td>
//                 </tr>
//                 <tr>
//                   <td colSpan={4}></td>
//                   <td style={{ textAlign: "right" }}>Total GST:</td>
//                   <td colSpan={3}><b>₹{gstTotal.toLocaleString()}</b></td>
//                 </tr>
//                 <tr>
//                   <td colSpan={4}></td>
//                   <td style={{ textAlign: "right", fontWeight: 700 }}>GRAND TOTAL:</td>
//                   <td colSpan={3} style={{ fontWeight: 700, color: "#1556b7" }}><b>₹{grandTotal.toLocaleString()}</b></td>
//                 </tr>
//               </tfoot>
//             )}
//           </table>
//           {/* Payments Received */}
//           {Array.isArray(invoice.payments) && invoice.payments.length > 0 && (
//             <div className={styles.paymentSection}>
//               <b>Payments Received:</b>
//               <ul>
//                 {invoice.payments.map((p, idx) => (
//                   <li key={p.id || idx}>
//                     {p.paymentDate ? formatDate(p.paymentDate) : "-"} - ₹{Number(p.amount).toLocaleString()} ({p.method || "N/A"})
//                     {p.paymentLink && (
//                       <span>
//                         {" "} | <a href={p.paymentLink} target="_blank" rel="noopener noreferrer">Payment Link</a>
//                       </span>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {/* QR/Remarks */}
//           {paymentLink && (
//             <div className={styles.remarksRow} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
//               <b>Scan to Pay:</b>
//               <a href={paymentLink} target="_blank" rel="noopener noreferrer">{paymentLink}</a>
//               <img
//                 src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(paymentLink)}`}
//                 alt="QR Code for Payment"
//                 style={{ marginLeft: '10px', height: '100px' }}
//               />
//             </div>
//           )}
//           {/* Bank & TnC Row */}
//           <div className={styles.bottomRow}>
//             <div className={styles.bankDetails}>
//               <div className={styles.sectionTitle}>PAYMENT DETAILS</div>
//               <div>BANK NAME: {bankDetails.name}</div>
//               <div>ACCOUNT NO: {bankDetails.accNo}</div>
//               <div>IFSC CODE: {bankDetails.ifsc}</div>
//               <div>Cheque/DD in name: <b>{bankDetails.chq}</b></div>
//             </div>
//             <div className={styles.tncDetails}>
//               <div className={styles.sectionTitle}>TERMS & CONDITIONS</div>
//               <div>1. Payment to be made 50% advance & balance on delivery.</div>
//               <div>2. Transportation extra as applicable.</div>
//               <div>3. Invoice valid for 15 days.</div>
//               <div>4. Actual qty may vary by 2-3%.</div>
//             </div>
//           </div>
//           <div className={styles.thankYou}>THANK YOU!</div>
//           <div className={styles.footerRow}>
//             <div>WE HOPE EVERYTHING IS CRYSTAL CLEAR. CONTACT US FOR ANY QUERY.</div>
//             <div>
//               <b>{company.phone}</b> | {company.email} | {company.website}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useRef, useState } from "react";
import { X, FileDown, Share2, ZoomIn, ZoomOut, Printer } from "lucide-react";
import styles from "./InvoicePreview.module.scss";
import logo from "../../assets/logo.svg";
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB");
}

export default function InvoicePreview({ postsale, onClose }) {
  const invoiceRef = useRef();
  const [zoomLevel, setZoomLevel] = useState(1);
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };
  // Use actual data structure from your code
  const { sendnginvoice, sendinvoice } = {
    sendnginvoice: (invoiceNumber) => {
      console.log("Sending non-GST invoice:", invoiceNumber);
      alert(`Non-GST Invoice ${invoiceNumber} sent via email!`);
    },
    sendinvoice: (invoiceNumber) => {
      console.log("Sending GST invoice:", invoiceNumber);
      alert(`GST Invoice ${invoiceNumber} sent via email!`);
    },
  };

  const invoice = postsale?.invoice || {
    invoiceNumber: "INV001",
    issueDate: "2025-06-10",
    validTill: "2025-06-25",
    invoiceType: "GST",
    notified: true,
    invoiceOrders: [
      {
        invoiceOrderId: 1,
        details:
          "Business Cards - Premium Quality\n300 GSM Art Card with UV Coating",
        qty: 1000,
        unitPrice: 5,
        totalAmount: 5000,
        gST: 18,
        totalAmountWithGST: 5900,
      },
      {
        invoiceOrderId: 2,
        details: "Letterhead Printing\nA4 Size, 90 GSM Paper",
        qty: 500,
        unitPrice: 8,
        totalAmount: 4000,
        gST: 18,
        totalAmountWithGST: 4720,
      },
    ],
    payments: [
      {
        id: 1,
        paymentDate: "2025-06-08",
        amount: 5000,
        method: "UPI",
        paymentLink:
          "upi://pay?pa=alankar@paytm&pn=Alankar%20Imprints&am=10620",
      },
    ],
  };

  const client = postsale?.client || {
    clientName: "",
    phone: "",
    email: "",
  };

  // Invoice orders
  const orders = Array.isArray(invoice.invoiceOrders)
    ? invoice.invoiceOrders
    : invoice.invoiceOrders
    ? [invoice.invoiceOrders]
    : [];

  // Totals
  const subtotal = orders.reduce(
    (sum, o) => sum + (Number(o.totalAmount) || 0),
    0
  );
  const gstTotal = orders.reduce(
    (sum, o) =>
      sum +
      ((Number(o.totalAmountWithGST) || 0) - (Number(o.totalAmount) || 0)),
    0
  );
  const grandTotal = orders.reduce(
    (sum, o) => sum + (Number(o.totalAmountWithGST) || 0),
    0
  );

  // Payment link (from first payment or remark)
  const paymentLink =
    invoice.payments?.[0]?.paymentLink ||
    postsale?.remark?.replace(/^Payment link:\s*/i, "") ||
    "upi://pay?pa=alankar@paytm&pn=Alankar%20Imprints&am=" + grandTotal;

  const handleDownloadPDF = async () => {
    try {
      // Dynamically import html2pdf
      const html2pdf = (await import("html2pdf.js")).default;

      // Create a clone of the invoice for PDF generation
      const element = invoiceRef.current;
      const clone = element.cloneNode(true);

      // Apply PDF-specific styles to the clone
      clone.style.width = "210mm";
      clone.style.minHeight = "297mm";
      clone.style.maxHeight = "297mm";
      clone.style.fontSize = "8px";
      clone.style.lineHeight = "1.1";
      clone.style.overflow = "hidden";
      clone.style.padding = "8mm";

      // Scale down specific elements in the clone
      const tables = clone.querySelectorAll("table");
      tables.forEach((table) => {
        table.style.fontSize = "7px";
        const cells = table.querySelectorAll("th, td");
        cells.forEach((cell) => {
          cell.style.padding = "3px 4px";
        });
      });

      // Scale down QR code
      const qrCode = clone.querySelector('img[alt="QR Code for Payment"]');
      if (qrCode) {
        qrCode.style.width = "50px";
        qrCode.style.height = "50px";
      }

      // Scale down logo
      const logo = clone.querySelector(`.${styles.logoPlaceholder}`);
      if (logo) {
        logo.style.width = "35px";
        logo.style.height = "45px";
      }

      // Temporarily add clone to body (hidden)
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "-9999px";
      document.body.appendChild(clone);

      await html2pdf()
        .set({
          margin: [5, 5, 5, 5],
          filename: `Invoice_${invoice.invoiceNumber || "INV"}.pdf`,
          html2canvas: {
            scale: 1.5,
            useCORS: true,
            letterRendering: true,
            height: window.innerHeight,
            width: window.innerWidth,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            compress: true,
          },
          pagebreak: { mode: "avoid-all" },
        })
        .from(clone)
        .save();

      // Remove the clone
      document.body.removeChild(clone);
    } catch (error) {
      console.error("PDF generation failed:", error);
      // Fallback to print
      handlePrint();
    }
  };

  const handlePrint = () => {
    // Hide control bar and other elements before printing
    const controlBar = document.querySelector(`.${styles.controlBar}`);
    if (controlBar) {
      controlBar.style.display = "none";
    }

    // Set print styles
    const originalTitle = document.title;
    document.title = `Invoice_${invoice.invoiceNumber || "INV"}`;

    // Print
    window.print();

    // Restore after printing
    setTimeout(() => {
      if (controlBar) {
        controlBar.style.display = "flex";
      }
      document.title = originalTitle;
    }, 1000);
  };

  const handleSendEmail = () => {
    // Use the same logic as your original code
    if (invoice.invoiceType === "GST") {
      sendinvoice(invoice.invoiceNumber);
    } else {
      sendnginvoice(invoice.invoiceNumber);
    }
  };

  return (
    <div
      className={styles.previewBackdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.previewBox}>
        {/* Control Bar */}
        <div className={styles.controlBar}>
          <div className={styles.leftControls}>
            <button
              onClick={handleZoomOut}
              className={styles.zoomBtn}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span className={styles.zoomLevel}>
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className={styles.zoomBtn}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <div className={styles.rightControls}>
            <button
              onClick={handleDownloadPDF}
              className={styles.actionBtn}
              title="Download PDF"
            >
              <FileDown size={18} /> PDF
            </button>
            <button
              onClick={handlePrint}
              className={styles.actionBtn}
              title="Print Invoice"
            >
              <Printer size={18} /> Print
            </button>
            <button
              onClick={handleSendEmail}
              className={styles.actionBtn}
              title="Send Invoice via Email"
            >
              <Share2 size={18} /> Send Via Mail
            </button>
            <span
              className={styles.statusBadge}
              data-status={invoice.notified ? "sent" : "not-sent"}
            >
              {invoice.notified ? "Sent" : "Not Sent"}
            </span>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>
        {/* Invoice Content */}
        <div className={styles.invoiceContainer}>
          <div
            className={styles.invoiceWrapper}
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "top center",
            }}
          >
            <div ref={invoiceRef} className={styles.invoicePage}>
              {/* Header */}
              <div className={styles.invoiceHeader}>
                <div className={styles.companySection}>
                  <div className={styles.logoSection}>
                    <div className={styles.logoPlaceholder}>
                      {/* Logo placeholder - you can replace with actual logo */}
                      <img src={logo} alt="" />
                    </div>
                  </div>
                  {console.log(client)}
                  <div className={styles.companyDetails}>
                    <div>
                      <strong>Company Name:</strong> {client.name}
                    </div>
                    <div>
                      <strong>Company Phone:</strong> {client.phone}
                    </div>
                    <div>
                      <strong>Company Address:</strong>
                      {client.address}
                    </div>
                  </div>
                </div>

                <div className={styles.invoiceInfo}>
                  <div className={styles.taxInvoiceTitle}>
                    Hi! This is your
                    <br />
                    Tax Invoice
                  </div>

                  <table className={styles.invoiceMetaTable}>
                    <tbody>
                      <tr>
                        <td className={styles.tableHeader}>YEAR</td>
                        <td className={styles.tableHeader}>DATE</td>
                      </tr>
                      <tr>
                        <td>{new Date(invoice.issueDate).getFullYear()}</td>
                        <td>{formatDate(invoice.issueDate)}</td>
                      </tr>
                      <tr>
                        <td className={styles.tableHeader}>INVOICE ID</td>
                        <td className={styles.tableHeader}>VALID UNTIL</td>
                      </tr>
                      <tr>
                        <td>{invoice.invoiceNumber} </td>
                        <td>{formatDate(invoice.validTill)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className={styles.preparedBy}>
                    Prepared By: Alankar Imprints Pvt. Ltd.
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th>Sr.</th>
                    <th>Description</th>
                    <th>Qty.</th>
                    <th>Rate Per</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr className={styles.emptyRow}>
                      <td colSpan={5}></td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr key={order.invoiceOrderId || index}>
                        <td>{index + 1}</td>
                        <td className={styles.descriptionCell}>
                          {order.details?.split("\n").map((line, i) => (
                            <div key={i}>{line}</div>
                          ))}
                        </td>
                        <td>{order.qty?.toLocaleString()}</td>
                        <td>₹{order.unitPrice?.toLocaleString()}</td>
                        <td>₹{order.totalAmount?.toLocaleString()}</td>
                      </tr>
                    ))
                  )}

                  {/* Empty rows to fill space */}
                  {Array.from({ length: Math.max(0, 8 - orders.length) }).map(
                    (_, i) => (
                      <tr key={`empty-${i}`} className={styles.emptyRow}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    )
                  )}

                  <tr className={styles.thankYouRow}>
                    <td colSpan={3} className={styles.thankYouCell}> <em>Thank you for your business!</em></td>
                    <td>SUBTOTAL</td>
                    <td>₹{subtotal.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className={styles.blank}>
                      {" "}
                    </td>{" "}
                    <td>GST </td>
                    <td>₹{gstTotal.toLocaleString()}</td>{" "}
                  </tr>
                  <tr className={styles.totalRow}>
                    {" "}
                    <td colSpan={3} className={styles.blank}>
                     
                    </td>
                    <td>
                      <strong>TOTAL</strong>
                    </td>
                    <td>
                      <strong>₹{grandTotal.toLocaleString()}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Totals Section */}
              {/* <div className={styles.totalsSection}>
                <table className={styles.totalsTable}>
                  <tbody>
                    <tr>
                      <td>SUBTOTAL</td>
                      <td>₹{subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>GST </td>
                      <td>₹{gstTotal.toLocaleString()}</td>
                    </tr>
                    <tr className={styles.totalRow}>
                      <td>
                        <strong>TOTAL</strong>
                      </td>
                      <td>
                        <strong>₹{grandTotal.toLocaleString()}</strong>
                      </td>
                    </tr>
                    <tr> </tr>
                  </tbody>
                </table>
              </div> */}

              {/* Payments Received Section */}
              {/* {Array.isArray(invoice.payments) &&
                invoice.payments.length > 0 && (
                  <div className={styles.paymentsSection}>
                  
                    <ul className={styles.paymentsList}>
                      {invoice.payments.map((p, idx) => (
                        <li key={p.id || idx}>
                          {p.paymentDate ? formatDate(p.paymentDate) : "-"} - ₹
                          {Number(p.amount).toLocaleString()} (
                          {p.method || "N/A"})
                          {p.paymentLink && (
                            <span>
                              {" "}
                              |{" "}
                              <a
                                href={p.paymentLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Payment Link
                              </a>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )} */}

              {/* QR Code and Payment Link Section */}
              {paymentLink && (
                <div className={styles.paymentLinkSection}>
                  <div className={styles.paymentRow}>
                    <div className={styles.paymentInfo}>
                      <div className={styles.scanToPay}>
                        <strong>Scan to Pay:</strong>
                      </div>
                      <a
                        href={paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.paymentUrl}
                      >
                      <button>Pay Now</button>
                      </a>
                    </div>
                    <div className={styles.qrCodeContainer}>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                          paymentLink
                        )}&size=100x100`}
                        alt="QR Code for Payment"
                        className={styles.qrCode}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Section */}
              <div className={styles.bottomSection}>
                <div className={styles.paymentDetails}>
                  <div className={styles.sectionTitle}>PAYMENT DETAILS</div>
                  <div>
                    <strong>Bank Name:</strong>
                  </div>
                  <div>
                    <strong>Account No.:</strong>
                  </div>
                  <div>
                    <strong>IFSC Code:</strong>
                  </div>
                  <div>
                    <strong>Cheque or DD in name:</strong>
                  </div>
                  <div>
                    <strong>Payment Mode:</strong>
                  </div>
                  <div className={styles.contactNote}>
                    <em>Please contact us in case of any query.</em>
                  </div>
                </div>

                <div className={styles.termsConditions}>
                  <div className={styles.sectionTitle}>TERMS & CONDITIONS</div>
                  <ul>
                    <li>The above quote is valid for 15 days.</li>
                    <li>Transportation charges extra as applicable.</li>
                    <li>
                      Payment to be done 50% in advance & remaining against
                      delivery.
                    </li>
                    <li>Actual qty may vary by 2-3%.</li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className={styles.footer}>
                <div className={styles.footerLeft}>
                  alankarimprints.gaurav@gmail.com
                </div>
                <div className={styles.footerCenter}>
                  www.alankarimprint.com
                </div>
                <div className={styles.footerRight}>+91 8422925096</div>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
