import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./UpdateOrderPopup.module.scss";
import PRINT_PRICES from "../../printprices";
import { X, Trash2, Upload } from "lucide-react";

const CLIENT_TYPES = ["Cash", "Online", "Printers"];
const PRIORITY_OPTIONS = ["HIGH", "MEDIUM", "LOW"];
const STATUS_OPTIONS = ["CREATED", "IN_PROGRESS", "COMPLETED"];
const GST_OPTIONS = [0, 5, 12, 18];
const ORDER_STEPS = [
  { key: "Media", label: "Media", stepName: "Media" },
  { key: "PrintType", label: "Print Type", stepName: "Print Type" },
  { key: "Lamination", label: "Lamination", stepName: "Lamination" },
  { key: "Mounting", label: "Mounting", stepName: "Mounting" },
  { key: "Framing", label: "Framing", stepName: "Framing" },
  { key: "Installation", label: "Installation", stepName: "Installation" },
  { key: "Delivery", label: "Delivery", stepName: "Delivery" },
];

// --- Helpers ---
function toInputDatetime(val) {
  if (!val) return "";
  if (val.length === 16) return val;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(val)) return val.slice(0, 16);
  try {
    const d = new Date(val);
    if (!isNaN(d)) return d.toISOString().slice(0, 16);
  } catch {}
  return "";
}
function toApiDatetime(val) {
  if (!val) return "";
  if (val.length === 16) return val + ":00";
  if (val.length === 19 && val[16] === ":") return val;
  return val;
}
function nowDatetimeLocal() {
  const d = new Date();
  d.setSeconds(0, 0);
  return d.toISOString().slice(0, 16);
}

// ---- Main Component ----
export default function UpdateOrderPopup({ orderData, open, onClose, onUpdated }) {
  // 1. State
  const [order, setOrder] = useState(null); // working order object
  const [stepSelections, setStepSelections] = useState({});
  const [stepTimes, setStepTimes] = useState({});
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [imageSubmitting, setImageSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 2. Load initial order data into local state
  useEffect(() => {
    if (orderData) {
      setOrder({
        ...orderData,
        createdAtDateTime: toInputDatetime(orderData.createdAtDateTime),
        orderStartDateTime: toInputDatetime(orderData.orderStartDateTime),
        orderEndDateTime: toInputDatetime(orderData.orderEndDateTime),
        qty: orderData.qty || 1,
        gst: orderData.gst || 0,
        priority: orderData.priority || "HIGH",
        status: orderData.status || "CREATED",
        budget: orderData.budget || "",
      });
      // map stepSelections & stepTimes
      const sel = {};
      const tms = {};
      (orderData.steps || []).forEach((s, idx) => {
        sel[s.orderStepName] = s.measurement;
        tms[s.orderStepName] = {
          startDateTime: toInputDatetime(s.startDateTime),
          endDateTime: toInputDatetime(s.endDateTime),
        };
      });
      setStepSelections(sel);
      setStepTimes(tms);
      setExistingImages(orderData.images || []);
      setNewImages([]);
      setErrMsg("");
      setSuccessMsg("");
    }
  }, [orderData, open]);

  // 3. Print prices
  const clientType = order?.clientType;
  const clientTypesObj = PRINT_PRICES.clientTypes;
  const orderTypesObj = clientType ? clientTypesObj[clientType]?.orderTypes || {} : {};
  const printTypesObj = order?.orderType ? orderTypesObj[order.orderType]?.printTypes || {} : {};
  const stepOptionLists = order?.printType
    ? Object.entries(printTypesObj[order.printType] || {})
        .filter(([group]) => ORDER_STEPS.some(s => s.key === group))
        .reduce((acc, [group, opts]) => {
          acc[group] = opts;
          return acc;
        }, {})
    : {};

  // 4. Price calculation
  let unitPrice = 0;
  ORDER_STEPS.forEach(step => {
    const selected = stepSelections[step.key];
    if (selected) {
      const list = stepOptionLists[step.key] || [];
      const found = list.find(o => o.name === selected);
      if (found) {
        if (typeof found.cost === "number") unitPrice += found.cost;
        else if (typeof found.costCMYK === "number") unitPrice += found.costCMYK;
      }
    }
  });
  const qty = Number(order?.qty) || 1;
  const gstPercent = Number(order?.gst) || 0;
  const totalAmount = unitPrice * qty;
  const gst = Math.round(totalAmount * gstPercent / 100);
  const totalAmountWithGST = totalAmount + gst;

  // --- FIELD HANDLERS ---
  function updateField(key, value) {
    setOrder(o => ({ ...o, [key]: value }));
  }
  function handleStepSelect(group, value) {
    setStepSelections(prev => ({ ...prev, [group]: value }));
    if (!stepTimes[group]) {
      setStepTimes(prev => ({
        ...prev,
        [group]: {
          startDateTime: order.orderStartDateTime,
          endDateTime: order.orderEndDateTime,
        }
      }));
    }
  }
  function handleStepTimeChange(group, field, value) {
    setStepTimes(prev => ({
      ...prev,
      [group]: { ...prev[group], [field]: value }
    }));
  }

  // --- IMAGE HANDLERS ---
  function handleNewImagesChange(e) {
    setNewImages(arr => [...arr, ...Array.from(e.target.files)]);
  }
  function removeNewImage(idx) {
    setNewImages(arr => arr.filter((_, i) => i !== idx));
  }
  // Delete existing image (API)
  async function handleDeleteImage(imageUrl) {
    if (!window.confirm("Remove this image?")) return;
    try {
      setImageSubmitting(true);
      const token = sessionStorage.getItem("token");
      await axios.delete("https://api.alankardigitalhub.in/api/orders/deleteimage", {
        headers: { Authorization: `Bearer ${token}` },
        params: { imageUrl },
      });
      setExistingImages(arr => arr.filter(url => url !== imageUrl));
      setSuccessMsg("Image deleted!");
    } catch (err) {
      setErrMsg("Failed to delete image");
    } finally {
      setImageSubmitting(false);
    }
  }
  // Upload new images (API)
  async function handleUploadImages() {
    if (!newImages.length) return;
    try {
      setImageSubmitting(true);
      setErrMsg("");
      const formData = new FormData();
      formData.append("orderid", order.id);
      newImages.forEach(img => formData.append("images", img));
      await axios.post("https://api.alankardigitalhub.in/api/orders/addimagesinorder", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      setSuccessMsg("Images added!");
      setNewImages([]);
      if (onUpdated) onUpdated(); // reload order if needed
    } catch (err) {
      setErrMsg("Failed to add images");
    } finally {
      setImageSubmitting(false);
    }
  }

  // --- MAIN SUBMIT: Update order
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrMsg("");
    setSuccessMsg("");

    // Build steps for API
    const steps = ORDER_STEPS.map((step, idx) => {
      const val = stepSelections[step.key];
      if (!val) return null;
      const timeObj = stepTimes[step.key] || {};
      const existing = (order.steps || []).find(s => s.orderStepName === step.key);
      return {
        id: existing?.id,
        orderStepName: step.key,
        measurement: val,
        startDateTime: toApiDatetime(timeObj.startDateTime || order.orderStartDateTime),
        endDateTime: toApiDatetime(timeObj.endDateTime || order.orderEndDateTime),
        status: existing?.status || "CREATED"
      };
    }).filter(Boolean);

    // API order structure
    const apiOrder = {
      ...order,
      unitPrice,
      qty,
      totalAmount,
      gst,
      totalAmountWithGST,
      steps,
      createdAtDateTime: toApiDatetime(order.createdAtDateTime),
      orderStartDateTime: toApiDatetime(order.orderStartDateTime),
      orderEndDateTime: toApiDatetime(order.orderEndDateTime),
      printType: order.printType,
      media: order.media || (steps.find(s => s.orderStepName === "Media")?.measurement || ""),
      // budget: order.budget,
    };
    try {
      await axios.put(
        `https://api.alankardigitalhub.in/api/orders/updateorder?id=${order.id}`,
        apiOrder
      );
      setSuccessMsg("Order updated successfully!");
      if (onUpdated) onUpdated();
      setTimeout(onClose, 1000);
    } catch (err) {
      setErrMsg(err?.response?.data?.message || "Failed to update order");
    }
    setSubmitting(false);
  }

  if (!order || !open) return null;
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupBox}>
        <button className={styles.closeBtn} onClick={onClose}><X /></button>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <h2 className={styles.heading}>Update Order</h2>

          <div className={styles.section}>
            <label>
              <span>Client Type</span>
              <select
                value={order.clientType}
                onChange={e => {
                  setStepSelections({});
                  setStepTimes({});
                  updateField("clientType", e.target.value);
                  updateField("orderType", "");
                  updateField("printType", "");
                }}
                required
              >
                <option value="">Select</option>
                {CLIENT_TYPES.map(ct => <option key={ct} value={ct}>{ct}</option>)}
              </select>
            </label>
            <label>
              <span>Priority</span>
              <select value={order.priority} onChange={e => updateField("priority", e.target.value)}>
                {PRIORITY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Status</span>
              <select value={order.status} onChange={e => updateField("status", e.target.value)}>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.section}>
            <label>
              <span>Created At</span>
              <input
                type="datetime-local"
                value={toInputDatetime(order.createdAtDateTime)}
                onChange={e => updateField("createdAtDateTime", toApiDatetime(e.target.value))}
              />
            </label>
            <label>
              <span>Order Start</span>
              <input
                type="datetime-local"
                value={toInputDatetime(order.orderStartDateTime)}
                onChange={e => updateField("orderStartDateTime", toApiDatetime(e.target.value))}
              />
            </label>
            <label>
              <span>Order End</span>
              <input
                type="datetime-local"
                value={toInputDatetime(order.orderEndDateTime)}
                onChange={e => updateField("orderEndDateTime", toApiDatetime(e.target.value))}
              />
            </label>
          </div>

          <div className={styles.section}>
            <label>
              <span>Order Type</span>
              <select
                value={order.orderType}
                onChange={e => {
                  setStepSelections({});
                  setStepTimes({});
                  updateField("orderType", e.target.value);
                  updateField("printType", "");
                }}
                required
              >
                <option value="">Select Order Type</option>
                {Object.keys(orderTypesObj).map(ot => (
                  <option key={ot} value={ot}>{ot}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Print Type</span>
              <div className={styles.optionsWrap}>
                {order.orderType &&
                  Object.keys(printTypesObj).map(pt => (
                    <button
                      key={pt}
                      type="button"
                      className={`${styles.optionChip} ${order.printType === pt ? styles.selected : ""}`}
                      onClick={() => {
                        setStepSelections({});
                        setStepTimes({});
                        updateField("printType", pt);
                      }}
                    >{pt}</button>
                  ))}
              </div>
            </label>
            <label>
              <span>Media</span>
              <input
                type="text"
                value={order.media}
                onChange={e => updateField("media", e.target.value)}
                required
              />
            </label>
          </div>

          <div className={styles.section}>
            <label>
              <span>Quantity</span>
              <input
                type="number"
                min={1}
                value={order.qty}
                onChange={e => updateField("qty", Number(e.target.value))}
                required
              />
            </label>
            <label>
              <span>GST (%)</span>
              <select value={order.gst} onChange={e => updateField("gst", Number(e.target.value))}>
                {GST_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}%</option>
                ))}
              </select>
            </label>
            <label>
              <span>Budget</span>
              <input
                type="number"
                value={order.budget}
                onChange={e => updateField("budget", e.target.value)}
              />
            </label>
          </div>

          <div className={styles.section}>
            <h4 className={styles.stepsTitle}>Order Steps & Timings</h4>
            {ORDER_STEPS.map((step, idx) => (
              <div key={step.key} className={styles.stepRow}>
                <label>
                  <span>{step.label}</span>
                  <div className={styles.optionsWrap}>
                    {(stepOptionLists[step.key] || []).map(opt => (
                      <button
                        key={opt.name}
                        type="button"
                        className={`${styles.optionChip} ${stepSelections[step.key] === opt.name ? styles.selected : ""}`}
                        onClick={() => handleStepSelect(step.key, stepSelections[step.key] === opt.name ? "" : opt.name)}
                      >
                        {opt.name}
                        {typeof opt.cost === "number"
                          ? ` (${opt.cost})`
                          : typeof opt.costCMYK === "number"
                          ? ` (${opt.costCMYK})`
                          : ""}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Custom value"
                    value={stepSelections[step.key] || ""}
                    onChange={e => handleStepSelect(step.key, e.target.value)}
                    style={{ marginTop: 6 }}
                  />
                </label>
                {stepSelections[step.key] && (
                  <div className={styles.timeInputs}>
                    <label>
                      <span>Start</span>
                      <input
                        type="datetime-local"
                        value={toInputDatetime(stepTimes[step.key]?.startDateTime || order.orderStartDateTime)}
                        onChange={e => handleStepTimeChange(step.key, "startDateTime", e.target.value)}
                      />
                    </label>
                    <label>
                      <span>End</span>
                      <input
                        type="datetime-local"
                        value={toInputDatetime(stepTimes[step.key]?.endDateTime || order.orderEndDateTime)}
                        onChange={e => handleStepTimeChange(step.key, "endDateTime", e.target.value)}
                      />
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Existing Images */}
          <div className={styles.section}>
            <div className={styles.imagesPreview}>
              {existingImages.length > 0 && (
                <>
                  <div className={styles.imagesTitle}>Existing Images</div>
                  {existingImages.map((url, idx) => (
                    <span key={idx} className={styles.imgChip}>
                      <img src={url} alt={`img-${idx}`} className={styles.thumb} />
                      <button
                        type="button"
                        className={styles.deleteImgBtn}
                        disabled={imageSubmitting}
                        onClick={() => handleDeleteImage(url)}
                        title="Delete image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
          {/* Upload New Images */}
          <div className={styles.section}>
            <label className={styles.imageUploadLabel}>
              <Upload size={18} />
              Add Images
              <input
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleNewImagesChange}
              />
            </label>
            {newImages.length > 0 && (
              <div className={styles.imagesPreview}>
                <div className={styles.imagesTitle}>To be Uploaded</div>
                {newImages.map((img, idx) => (
                  <span key={idx} className={styles.imgChip}>
                    <img src={URL.createObjectURL(img)} alt={img.name} className={styles.thumb} />
                    <span className={styles.imgName}>{img.name}</span>
                    <button type="button" onClick={() => removeNewImage(idx)}><Trash2 size={16} /></button>
                  </span>
                ))}
                <button
                  type="button"
                  className={styles.uploadImgBtn}
                  onClick={handleUploadImages}
                  disabled={imageSubmitting}
                  style={{marginTop: 8}}
                >
                  {imageSubmitting ? "Uploading..." : "Upload Images"}
                </button>
              </div>
            )}
          </div>

          <div className={styles.calculationRow}>
            <div><strong>Unit Price: </strong>₹{unitPrice}</div>
            <div><strong>Total: </strong>₹{totalAmount}</div>
            <div><strong>GST Amt: </strong>₹{gst}</div>
            <div><strong>Total (GST): </strong>₹{totalAmountWithGST}</div>
          </div>

          {errMsg && <div className={styles.errorMsg}>{errMsg}</div>}
          {successMsg && <div className={styles.successMsg}>{successMsg}</div>}

          <div className={styles.submitRow}>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Updating..." : "Update Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
