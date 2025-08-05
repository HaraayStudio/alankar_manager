import React, { useState, useMemo } from "react";
import styles from "./ongoingOrders.module.scss";
import Table from "../../Components/Table";
import { useData } from "../../context/DataContext";
import ContentStructure from "../../Layout/ContentStructure";
import { useDispatch } from "react-redux";
import { updateOrderStepStatus } from "../../store/ordersSlice";

// Step and status color mapping
const STEP_COLORS = [
  styles.stepBlue,
  styles.stepRed,
  styles.stepYellow,
  styles.stepPurple,
  styles.stepGreen,
  styles.stepOrange,
  styles.stepPink,
];

const STATUS_COLORS = {
  CREATED: styles.statusPending,
  PENDING: styles.statusPending,
  ONGOING: styles.statusOngoing,
  IN_PROGRESS: styles.statusOngoing,
  COMPLETED: styles.statusCompleted,
  CANCELLED: styles.statusCancelled,
};

const PRIORITY_COLORS = {
  HIGH: styles.priorityHigh,
  MEDIUM: styles.priorityMedium,
  LOW: styles.priorityLow,
};

const STATUS_OPTIONS = [
  "CREATED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "PENDING",
];

// For navigation header
const links = [
  { to: "/orders/new", label: "Add New Order" },
  { to: "/orders/ongoing", label: "Ongoing Orders" },
  // { to: "/orders/history", label: "History & Details" },
];

// Helpers
function getStatusColor(status = "") {
  return STATUS_COLORS[(status || "").toUpperCase()] || styles.statusPending;
}
function getPriorityColor(priority = "") {
  return (
    PRIORITY_COLORS[(priority || "").toUpperCase()] || styles.priorityMedium
  );
}
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function formatDateRange(start, end) {
  if (!start || !end) return "-";
  const startStr = new Date(start).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
  const endStr = new Date(end).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
  return `${startStr} - ${endStr}`;
}
function getStepColor(index) {
  return STEP_COLORS[index % STEP_COLORS.length];
}

// Main Component
const OngoingOrders = () => {
  const { Orders: postSales } = useData();
  const dispatch = useDispatch();
  const [updatingStepId, setUpdatingStepId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Table columns definition
  const columns = [
    { key: "srNumber", label: "Sr No." },
    { key: "clientName", label: "Client Name" },
    // { key: "clientType", label: "Client Type" },
    { key: "createdAtDateTime", label: "Created" },
    { key: "qty", label: "Qty" },
    { key: "unitPrice", label: "Unit Price" },
    { key: "totalAmount", label: "Total" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
    { key: "actions", label: "Actions" },
  ];

  // Table data - directly map postSales (your flat structure)
  const data = (postSales || []).map((order, idx) => ({
    srNumber: idx + 1,
    clientName: order.client?.name || "-",
    // clientType: order.clientType || "-",
    createdAtDateTime: formatDate(order.createdAtDateTime),
    qty: order.qty ?? "-",
    unitPrice: order.unitPrice !== undefined ? `₹${order.unitPrice}` : "-",
    totalAmount: order.totalAmount !== undefined ? `₹${order.totalAmount}` : "-",
    status: (
      <span className={`${styles.statusChip} ${getStatusColor(order.status)}`}>
        {order.status}
      </span>
    ),
    priority: (
      <span
        className={`${styles.priorityChip} ${getPriorityColor(order.priority)}`}
      >
        {order.priority}
      </span>
    ),
    actions: (
      <button
        className={styles.actionBtn}
        title="View Details"
        onClick={() => setSelectedOrder(order)}
      >
        👁️
      </button>
    ),
  }));

  // Step status update
  const handleStepStatusChange = async (stepId, status) => {
    setUpdatingStepId(stepId);
    try {
      await dispatch(
        updateOrderStepStatus({ orderStepId: stepId, status })
      ).unwrap();
    } catch (err) {
      alert("Error updating step status.");
    } finally {
      setUpdatingStepId(null);
      window.location.reload();
    }
  };

  // Modal helpers
  const steps = selectedOrder?.steps || [];
  const completedSteps = steps.filter((s) => s.status === "COMPLETED").length;

  return (
    <ContentStructure links={links}>
      <Table columns={columns} data={data} />

      {/* Details Modal */}
      {selectedOrder && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.headerRow}>
              <button
                className={styles.backBtn}
                onClick={() => setSelectedOrder(null)}
              >
                Back
              </button>
              <div className={styles.title}>
                {selectedOrder.orderType || "Project Name"}
              </div>
              <button className={styles.saveBtn} disabled>
                Save
              </button>
            </div>

            <div className={styles.mainSection}>
              {/* Client Info */}
              <div className={styles.clientInfoCard}>
                <div>
                  <strong>Client Name:</strong> {selectedOrder.client?.name || "-"}
                </div>
                <div>
                  <strong>E-mail :</strong> {selectedOrder.client?.email || "-"}
                </div>
                <div>
                  <strong>Mobile Number:</strong> {selectedOrder.client?.phone || "-"}
                </div>
                <div>
                  <strong>Address:</strong> {selectedOrder.client?.address || "-"}
                </div>
              </div>
              {/* Project info */}
              <div className={styles.projectInfo}>
                <h2>{selectedOrder.orderType}</h2>
                <div className={styles.projectGrid}>
                  <div>
                    <div className={styles.label}>Order ID:</div>
                    <div className={styles.value}>#{selectedOrder.id}</div>
                  </div>
                  <div>
                    <div className={styles.label}>Type:</div>
                    <div className={styles.value}>
                      {selectedOrder.orderType}
                    </div>
                  </div>
                  <div>
                    <div className={styles.label}>Print Type:</div>
                    <div className={styles.value}>
                      {selectedOrder.printType}
                    </div>
                  </div>
                  <div>
                    <div className={styles.label}>Media:</div>
                    <div className={styles.value}>
                      {selectedOrder.media}
                    </div>
                  </div>
                  <div>
                    <div className={styles.label}>Status:</div>
                    <span
                      className={`${styles.statusChip} ${getStatusColor(selectedOrder.status)}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <div className={styles.label}>Priority:</div>
                    <span
                      className={`${styles.priorityChip} ${getPriorityColor(selectedOrder.priority)}`}
                    >
                      {selectedOrder.priority}
                    </span>
                  </div>
                  <div>
                    <div className={styles.label}>Created at:</div>
                    <div className={styles.value}>
                      {formatDate(selectedOrder.createdAtDateTime)}
                    </div>
                  </div>
                  <div>
                    <div className={styles.label}>Start Date:</div>
                    <div className={styles.value}>
                      {formatDate(selectedOrder.orderStartDateTime)}
                    </div>
                  </div>
                  <div>
                    <div className={styles.label}>End Date:</div>
                    <div className={styles.value}>
                      {formatDate(selectedOrder.orderEndDateTime)}
                    </div>
                  </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className={styles.progressBox}>
                <div className={styles.label}>Work Progress</div>
                <div className={styles.progressBar}>
                  {steps.map((step, i) => (
                    <div
                      key={i}
                      className={`
                        ${styles.progressStep}
                        ${getStepColor(i)}
                        ${step.status === "COMPLETED" ? styles.completed : ""}
                      `}
                      style={{ width: `${100 / steps.length}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.progressBarCustom}>
                <div
                  className={styles.progressBarFill}
                  style={{
                    width: steps.length
                      ? `${(completedSteps / steps.length) * 100}%`
                      : "0%",
                  }}
                />
                {/* Step markers */}
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`
                      ${styles.progressMarker}
                      ${step.status === "COMPLETED" ? styles.completed : ""}
                    `}
                    style={{
                      left: steps.length === 1
                        ? "50%"
                        : `calc(${(idx / (steps.length - 1)) * 100}% - 8px)`,
                    }}
                  >
                    <span className={styles.progressStepNum}>{idx + 1}</span>
                  </div>
                ))}
              </div>
              <div className={styles.progressText}>
                {completedSteps} of {steps.length} Steps Completed
              </div>

              {/* Order Steps */}
              <div className={styles.stepsSection}>
                <div className={styles.sectionTitle}>Order Steps</div>
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className={`${styles.stepCard} ${getStepColor(i)}`}
                  >
                    <div className={styles.stepHeader}>
                      <span className={styles.stepCircle}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.stepName}>
                        {step.orderStepName}
                      </span>
                      <select
                        value={step.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          if (newStatus !== step.status) {
                            handleStepStatusChange(step.id, newStatus);
                          }
                        }}
                        disabled={updatingStepId === step.id}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.stepDetail}>
                      <span className={styles.measureLabel}>Measurement:</span>{" "}
                      <span className={styles.measureValue}>
                        {step.measurement || "-"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Images */}
              <div className={styles.imagesSection}>
                <div className={styles.sectionTitle}>All Uploaded Images</div>
                <div className={styles.imagesGrid}>
                  {selectedOrder.images && selectedOrder.images.length > 0 ? (
                    selectedOrder.images.map((img, idx) => (
                      <div key={idx} className={styles.imageCard}>
                        <img
                          src={img.imageUrl || img.url || img}
                          alt={`Order image ${idx + 1}`}
                        />
                      </div>
                    ))
                  ) : (
                    <div>No Images</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ContentStructure>
  );
};

export default OngoingOrders;
