import React, { useState } from "react";
import styles from "./OrderPostsale.module.scss";
import { ChevronDown, ChevronUp, Plus, Pencil } from "lucide-react";
import AddOrderPopup from "./AddOrderPopupPostsale";
import UpdateOrderPopup from "./UpdateOrderPopup"; // import your update popup

const statusColors = {
  CREATED: styles.statusCreated,
  COMPLETED: styles.statusCompleted,
  PENDING: styles.statusPending,
};

function formatDate(dt) {
  if (!dt) return "-";
  const d = new Date(dt);
  return d.toLocaleString("en-GB").replace(",", "");
}

export default function OrderListPage({ orders = [], srNumber, onOrderAdded, onOrderUpdated }) {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div className={styles.pageTitle}>Orders – PostSales #{srNumber}</div>
        <button className={styles.addBtn} onClick={() => setShowAddOrder(true)} 
        disabled>
          <Plus size={17} /> Add New Order
        </button>
      </div>
      {orders.length === 0 ? (
        <div className={styles.noData}>No Orders found.</div>
      ) : (
        <div className={styles.list}>
          {orders.map((order, idx) => {
            const expanded = expandedIdx === idx;
            return (
              <div
                key={order.id || idx}
                className={`${styles.orderCard} ${expanded ? styles.expanded : ""}`}
              >
                <div
                  className={styles.summary}
                  onClick={() => setExpandedIdx(expanded ? null : idx)}
                  tabIndex={0}
                >
                  <div className={styles.left}>
                    <div className={styles.orderType}>{order.orderType}</div>
                    <span className={styles.dot}>•</span>
                    <div className={styles.printType}>{order.printType}</div>
                    <span className={styles.dot}>•</span>
                    <div className={styles.media}>{order.media}</div>
                  </div>
                  <div className={styles.right}>
                    <span className={styles.qty}>Qty: <b>{order.qty}</b></span>
                    <span className={`${styles.status} ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </span>
                    {/* Edit Button */}
                    <button
                      className={styles.editBtn}
                      type="button"
                      onClick={e => {
                        e.stopPropagation(); // prevent expand/collapse
                        setEditOrder(order);
                      }}
                      title="Edit Order"
                    >
                      <Pencil size={17} />
                    </button>
                    <span className={styles.chevron}>
                      {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </div>
                </div>
                {expanded && (
                  <div className={styles.details}>
                    <div className={styles.grid}>
                      <div><label>Unit Price</label>₹{order.unitPrice?.toLocaleString()}</div>
                      <div><label>Budget</label>₹{order.budget?.toLocaleString()}</div>
                      <div><label>Total</label>₹{order.totalAmount?.toLocaleString()}</div>
                      <div><label>GST</label>{order.gst}%</div>
                      <div><label>Total (GST)</label>₹{order.totalAmountWithGST?.toLocaleString()}</div>
                      <div><label>Start</label>{formatDate(order.orderStartDateTime)}</div>
                      <div><label>End</label>{formatDate(order.orderEndDateTime)}</div>
                      <div><label>Priority</label>{order.priority || "-"}</div>
                    </div>
                    {order.steps && order.steps.length > 0 && (
                      <div className={styles.stepsSection}>
                        <div className={styles.stepsTitle}>Order Steps</div>
                        <div className={styles.stepsList}>
                          {order.steps.map((step) => (
                            <span className={styles.stepChip} key={step.id || step.stepNumber}>
                              <b>{step.orderStepName}</b>
                              <span className={styles.stepValue}>: {step.measurement}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {order.images && order.images.length > 0 && (
                      <div className={styles.imagesSection}>
                        <div className={styles.imagesTitle}>Attached Images</div>
                        <div className={styles.imagesGrid}>
                          {order.images.map((img, i) => (
                            <img src={img.imageUrl} alt={`order-img-${i}`} key={i} className={styles.imgThumb} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {showAddOrder && (
        <AddOrderPopup
          open={showAddOrder}
          srNumber={srNumber}
          onClose={() => setShowAddOrder(false)}
          onSuccess={() => {
            setShowAddOrder(false);
            if (onOrderAdded) onOrderAdded();
          }}
        />
      )}
      {editOrder && (
        <UpdateOrderPopup
          open={!!editOrder}
          orderData={editOrder}
          onClose={() => setEditOrder(null)}
          onUpdated={() => {
            setEditOrder(null);
            if (onOrderUpdated) onOrderUpdated();
            if (onOrderAdded) onOrderAdded(); // reload list if needed
          }}
        />
      )}
    </div>
  );
}
