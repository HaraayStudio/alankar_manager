// src/pages/OrderHistoryTable.jsx
import React, { useState, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import styles from "./OrderHistoryTable.module.scss";
import { Calendar, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ContentStructure from "../../Layout/ContentStructure";
import Table from "../../Components/Table";

const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

const links = [
  { to: "/Orders/new", label: "Add New Order" },
  { to: "/Orders/ongoing", label: "Ongoing Orders" },
  { to: "/Orders/history", label: "History & Details" },
];

const getStatusBadge = (status) => {
  const map = {
    "CREATED": { txt: "Pending", color: "#ffe9be", text: "#f2a103" },
    "PENDING": { txt: "Pending", color: "#ffe9be", text: "#f2a103" },
    "IN_PROGRESS": { txt: "Ongoing", color: "#d4f9e8", text: "#27cb7a" },
    "ONGOING": { txt: "Ongoing", color: "#d4f9e8", text: "#27cb7a" },
    "COMPLETED": { txt: "Completed", color: "#e7f1fd", text: "#2674e0" },
  };
  const s = map[status?.toUpperCase()] || map["CREATED"];
  return (
    <span className={styles.statusBadge} style={{ background: s.color, color: s.text }}>
      {s.txt}
    </span>
  );
};

const getPriorityBadge = (priority) => {
  const map = {
    "HIGH": { txt: "High", color: "#fde9fc", text: "#ea49dc" },
    "MEDIUM": { txt: "Medium", color: "#ffe7e0", text: "#fc6a41" },
    "LOW": { txt: "Low", color: "#e9fbe6", text: "#21cc55" },
  };
  const p = map[priority?.toUpperCase()] || map["MEDIUM"];
  return (
    <span className={styles.priorityBadge} style={{ background: p.color, color: p.text }}>
      {p.txt}
    </span>
  );
};

export default function OrderHistoryTable() {
  const { orders } = useContext(DataContext);
  const [popupOrder, setPopupOrder] = useState(null);
const Orders = orders;
console.log(Orders);

  // Table columns config (adjusted for your structure)
  const columns = [
    { key: "orderId", label: "Sr" },
    { key: "media", label: "Client" },
    { key: "orderType", label: "Order Type" },
    { key: "qty", label: "Qty" },
    { key: "unitPrice", label: "Unit Price" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "gst", label: "GST (%)" },
    { key: "totalAmountWithGST", label: "Total With GST" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
    // { key: "startDate", label: "Start Date" },
    // { key: "endDate", label: "End Date" },
    { key: "action", label: "Action" },
  ];

  // Table data mapping
// Table data mapping

const tableData =
  Orders && Orders.length > 0
    ? Orders
        .filter((o) => String(o.status).toUpperCase() === "COMPLETED") // <-- Only COMPLETED orders
        .map((o, i) => ({
          orderId: String(i+1),
          media: o?.client?.name,
          orderType: o.orderType,
          qty: o.qty,
          unitPrice: o.unitPrice,
          totalAmount: o.totalAmount,
          gst: o.gst,
          totalAmountWithGST: o.totalAmountWithGST,
          priority: getPriorityBadge(o.priority),
          status: getStatusBadge(o.status),
          // startDate: formatDate(o.orderStartDateTime),
          // endDate: formatDate(o.orderEndDateTime),
          action: (
            <button className={styles.viewBtn} onClick={() => setPopupOrder(o)}>
              <Eye size={16} /> View Order
            </button>
          ),
        }))
    : [];

  return (
    <>
      <ContentStructure links={links}>
        <Table
          columns={columns}
          data={tableData}
          emptyContent={<div className={styles.emptyText}>No orders found</div>}
        />
      </ContentStructure>
      <AnimatePresence>
        {popupOrder && (
          <motion.div
            className={styles.popupOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.popupCard}
              initial={{ y: 60, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 50, scale: 0.93, opacity: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 22 }}
            >
              <div className={styles.popupHeader}>
                <h2>
                  <span className={styles.popupTitle}>Order</span>
                  <span className={styles.orderId}>#{popupOrder.id}</span>
                </h2>
                <button onClick={() => setPopupOrder(null)} className={styles.closeBtn}>
                  ×
                </button>
              </div>
              <div className={styles.popupBody}>
                {/* Status & Priority */}
                <div className={styles.summaryRow}>
                  <div className={styles.badgeCol}>
                    {getStatusBadge(popupOrder.status)}
                    {getPriorityBadge(popupOrder.priority)}
                  </div>
                  <div className={styles.detailCol}>
                    <span className={styles.label}>Type:</span>
                    <span>{popupOrder.printType}</span>
                  </div>
                </div>
                {/* Dates */}
                <div className={styles.infoGrid}>
                  <div>
                    <span className={styles.label}>Created</span>
                    <span>{formatDate(popupOrder.createdAtDateTime)}</span>
                  </div>
                  <div>
                    <span className={styles.label}>Start</span>
                    <span>{formatDate(popupOrder.orderStartDateTime)}</span>
                  </div>
                  <div>
                    <span className={styles.label}>End</span>
                    <span>{formatDate(popupOrder.orderEndDateTime)}</span>
                  </div>
                </div>
                {/* Description */}
                <div className={styles.descBox}>
                  <span className={styles.label}>Media</span>
                  <p>{popupOrder.media || <em>No media specified.</em>}</p>
                </div>
                {/* Steps */}
                <div className={styles.stepsSection}>
                  <div className={styles.stepsHeader}>
                    <span>Order Steps</span>
                    <span className={styles.stepsCount}>
                      {popupOrder.steps?.length || 0}
                    </span>
                  </div>
                  {popupOrder.steps && popupOrder.steps.length > 0 ? (
                    <ul className={styles.stepsList}>
                      {popupOrder.steps.map((step, idx) => (
                        <li className={styles.stepItem} key={step.id || idx}>
                          <span className={styles.stepNum}>{idx + 1}</span>
                          <span className={styles.stepName}>
                            {step.orderStepName}
                          </span>
                          <span className={styles.stepValue}>
                            {step.measurement}
                          </span>
                          <span
                            className={styles.stepStatus}
                            style={{
                              background:
                                step.status === "COMPLETED"
                                  ? "#e7f1fd"
                                  : step.status === "IN_PROGRESS" ||
                                    step.status === "ONGOING"
                                  ? "#d4f9e8"
                                  : "#ffe9be",
                              color:
                                step.status === "COMPLETED"
                                  ? "#2674e0"
                                  : step.status === "IN_PROGRESS" ||
                                    step.status === "ONGOING"
                                  ? "#27cb7a"
                                  : "#f2a103",
                            }}
                          >
                            {step.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={styles.noSteps}>No steps found</div>
                  )}
                </div>
                {/* Images */}
                {popupOrder.images && popupOrder.images.length > 0 && (
                  <div className={styles.imagesSection}>
                    <span className={styles.label}>Images</span>
                    <div className={styles.imagesRow}>
                      {popupOrder.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.imageUrl}
                          alt={`Order Img ${idx + 1}`}
                          className={styles.orderImage}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
