import React, { useState } from "react";
import axios from "axios";
import styles from "./AddOrderForPostSalePopup.module.scss";
import PRINT_PRICES from "../../printprices";
import { X, Trash2, Upload } from "lucide-react";
import { useData } from "../../context/DataContext";
// --- Constants ---
const CLIENT_TYPES = ["Cash", "Online", "Printers"];
const PRIORITY_OPTIONS = ["HIGH", "MEDIUM", "LOW"];
const STATUS_OPTIONS = ["CREATED", "IN_PROGRESS", "COMPLETED"];
const GST_OPTIONS = [0, 5, 12, 18];
const ORDER_STEPS = [
  { key: "Media", label: "Media", stepName: "Media" },
  { key: "PrintType", label: "Print Type", stepName: "Print Type" },
  { key: "Lamination", label: "Lamination", stepName: "Lamination" },
  { key: "Mounting", label: "Mounting", stepName: "Mounting sheet" },
  { key: "Framing", label: "Framing", stepName: "Framing" },
  { key: "Installation", label: "Installation", stepName: "Installation" }
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

export default function AddOrderForPostSalePage({ srNumber, onSuccess }) {
  const { handleAddOrderInPostSales } = useData();
  // --- Main order state ---
  const [order, setOrder] = useState({
    clientType: "",
    priority: "HIGH",
    createdAtDateTime: nowDatetimeLocal() + ":00",
    orderType: "",
    printType: "",
    media: "",
    unitPrice: 0,
    qty: 1,
    budget: "",
    gst: 0,
    totalAmount: 0,
    totalAmountWithGST: 0,
    orderStartDateTime: "",
    orderEndDateTime: "",
    status: "CREATED",
    steps: [],
    images: []
  });
  const [stepSelections, setStepSelections] = useState({});
  const [stepTimes, setStepTimes] = useState({});
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ---- Print price config
  const clientType = order.clientType;
  const clientTypesObj = PRINT_PRICES.clientTypes;
  const orderTypesObj = clientType ? clientTypesObj[clientType]?.orderTypes || {} : {};
  const printTypesObj = order.orderType ? orderTypesObj[order.orderType]?.printTypes || {} : {};
  const stepOptionLists = order.printType
    ? Object.entries(printTypesObj[order.printType] || {})
        .filter(([group]) => ORDER_STEPS.some(s => s.key === group))
        .reduce((acc, [group, opts]) => {
          acc[group] = opts;
          return acc;
        }, {})
    : {};

  // --- Update field utility
  function updateField(key, value) {
    setOrder(o => ({ ...o, [key]: value }));
  }

  // --- Step values/buttons/manual entry
  function handleStepSelect(group, value) {
    setStepSelections(prev => ({ ...prev, [group]: value }));
    // Set initial times if needed
    if (!stepTimes[group]) {
      setStepTimes(prev => ({
        ...prev,
        [group]: {
          startDateTime: order.orderStartDateTime || nowDatetimeLocal(),
          endDateTime: order.orderEndDateTime || nowDatetimeLocal()
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

  // --- Price calculation
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
  const qty = Number(order.qty) || 1;
  const gstPercent = Number(order.gst) || 0;
  const totalAmount = unitPrice * qty;
  const gst = Math.round(totalAmount * gstPercent / 100);
  const totalAmountWithGST = totalAmount + gst;

  // --- Image handlers
  function handleImageChange(e) {
    setImages(Array.from(e.target.files));
  }
  function removeImage(idx) {
    setImages(arr => arr.filter((_, i) => i !== idx));
  }

  // --- API submit
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrMsg("");
    setSuccessMsg("");

    // Build steps for API
    const steps = ORDER_STEPS
      .map((step, idx) => {
        const val = stepSelections[step.key];
        if (!val) return null;
        const timeObj = stepTimes[step.key] || {};
        return {
          stepNumber: idx + 1,
          stepName: step.stepName,
          stepValue: val,
          startDateTime: toApiDatetime(timeObj.startDateTime || order.orderStartDateTime),
          endDateTime: toApiDatetime(timeObj.endDateTime || order.orderEndDateTime),
          status: "CREATED"
        };
      })
      .filter(Boolean);

    // API order structure
    const apiOrder = {
      priority: order.priority,
      createdAtDateTime: toApiDatetime(order.createdAtDateTime),
      orderType: order.orderType,
      printType: order.printType,
      media: order.media || (steps.find(s => s.stepName === "Media")?.stepValue || ""),
      unitPrice,
      qty,
      totalAmount,
      gst,
      totalAmountWithGST,
      // budget: order.budget,
      orderStartDateTime: toApiDatetime(order.orderStartDateTime),
      orderEndDateTime: toApiDatetime(order.orderEndDateTime),
      status: order.status,
      steps,
      images: [] // files are attached separately
    };

    // --- FormData with images ---
    const formData = new FormData();
    formData.append("srNumber", srNumber);
    formData.append("order", JSON.stringify(apiOrder));
    if (images.length > 0) {
      images.forEach(img => formData.append("images", img));
    }

    try {
      // const token = localStorage.getItem("token");
      // const response = await axios.post(
      //   "http://localhost:8080/api/postsales/addorderinpostsales",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //       Authorization: `Bearer ${token}`
      //     }
      //   }
      // );
       const response = await handleAddOrderInPostSales(srNumber, order, images);
      setSuccessMsg("Order added successfully!");
      document.alert("Order Added SucessFully !")
      window.location.reload()
      if (onSuccess) onSuccess();
      // Optional: reset form
      setOrder({
        clientType: "",
        priority: "HIGH",
        createdAtDateTime: nowDatetimeLocal() + ":00",
        orderType: "",
        printType: "",
        media: "",
        unitPrice: 0,
        qty: 1,
        // budget: "",
        gst: 0,
        totalAmount: 0,
        totalAmountWithGST: 0,
        orderStartDateTime: "",
        orderEndDateTime: "",
        status: "CREATED",
        steps: [],
        images: []
      });
      setStepSelections({});
      setStepTimes({});
      setImages([]);
    } catch (err) {
      setErrMsg(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add order"
      );
    }
    setSubmitting(false);
  }

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupBox} style={{maxWidth: 600, width: "100%"}}>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <h2 className={styles.heading}>Add Order for PostSale</h2>

          {/* --- Main fields --- */}
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
                  {/* Manual entry */}
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

          <div className={styles.section}>
            <label className={styles.imageUploadLabel}>
              <Upload size={18} />
              Attach Images
              <input
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </label>
            {images.length > 0 && (
              <div className={styles.imagesPreview}>
                {images.map((img, idx) => (
                  <span key={idx} className={styles.imgChip}>
                    <img
                      src={URL.createObjectURL(img)}
                      alt={img.name}
                      className={styles.thumb}
                    />
                    <span className={styles.imgName}>{img.name}</span>
                    <button type="button" onClick={() => removeImage(idx)} title="Remove Image">
                      <Trash2 size={16} />
                    </button>
                  </span>
                ))}
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
              {submitting ? "Adding..." : "Add Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
