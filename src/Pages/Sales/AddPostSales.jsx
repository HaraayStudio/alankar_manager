// import React, { useState } from "react";
// import axios from "axios";
// import styles from "./AddPostSalePage.module.scss";
// import PRINT_PRICES from "../../printprices";
// import { X, Trash2, Upload, Plus, MinusCircle } from "lucide-react";

// const CLIENT_TYPES = ["Cash", "Online", "Printers"];
// const PRIORITY_OPTIONS = ["HIGH", "MEDIUM", "LOW"];
// const STATUS_OPTIONS = ["CREATED", "IN_PROGRESS", "COMPLETED"];
// const GST_OPTIONS = [0, 5, 12, 18];
// const ORDER_STEPS = [
//   { key: "Media", label: "Media", orderStepName: "Printing" },
//   { key: "Lamination", label: "Lamination", orderStepName: "Lamination" },
//   { key: "Mounting", label: "Mounting", orderStepName: "Mounting" },
//   { key: "Framing", label: "Framing", orderStepName: "Framing" },
//   { key: "Installation", label: "Installation", orderStepName: "Installation" }
// ];

// function toInputDatetime(val) {
//   if (!val) return "";
//   if (val.length === 16) return val;
//   if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(val)) return val.slice(0, 16);
//   try {
//     const d = new Date(val);
//     if (!isNaN(d)) return d.toISOString().slice(0, 16);
//   } catch {}
//   return "";
// }
// function toApiDatetime(val) {
//   if (!val) return "";
//   if (val.length === 16) return val + ":00";
//   if (val.length === 19 && val[16] === ":") return val;
//   return val;
// }
// function nowDatetimeLocal() {
//   const d = new Date();
//   d.setSeconds(0, 0);
//   return d.toISOString().slice(0, 16);
// }

// const defaultClient = {
//   name: "",
//   email: "",
//   phone: "",
//   address: "",
//   GSTCertificate: "",
//   PAN: ""
// };

// const defaultOrder = {
//   priority: "HIGH",
//   createdAtDateTime: nowDatetimeLocal() + ":00",
//   orderType: "",
//   printType: "",
//   media: "",
//   unitPrice: 0,
//   qty: 1,
// //   budget: "",
//   gst: 0,
//   totalAmount: 0,
//   totalAmountWithGST: 0,
//   orderStartDateTime: "",
//   orderEndDateTime: "",
//   status: "CREATED",
//   steps: [],
//   images: []
// };

// export default function AddPostSalePage({ onSuccess }) {
//   // State
//   const [client, setClient] = useState({ ...defaultClient });
//   const [clientType, setClientType] = useState("Online");
//   const [postSalesdateTime, setPostSalesDateTime] = useState(nowDatetimeLocal());
//   const [remark, setRemark] = useState("");
//   const [orders, setOrders] = useState([{ ...defaultOrder }]);
//   const [orderImages, setOrderImages] = useState([[]]);
//   const [notified, setNotified] = useState(false);
//   const [status, setStatus] = useState("CREATED");
//   const [isOldClient, setIsOldClient] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [errMsg, setErrMsg] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");

//   // --- Handlers
//   const handleClientChange = (field, value) => setClient(c => ({ ...c, [field]: value }));

//   // Order fields
//   const handleOrderChange = (orderIdx, key, value) => {
//     setOrders(ords =>
//       ords.map((o, i) => (i === orderIdx ? { ...o, [key]: value } : o))
//     );
//   };

//   // Steps
//   const handleStepSelect = (orderIdx, stepKey, value) => {
//     setOrders(ords =>
//       ords.map((o, i) => {
//         if (i !== orderIdx) return o;
//         const stepList = o.steps.filter(s => s.orderStepName !== ORDER_STEPS.find(st => st.key === stepKey).orderStepName);
//         if (!value) return { ...o, steps: stepList };
//         // Add/replace step for this stepKey
//         return {
//           ...o,
//           steps: [
//             ...stepList,
//             {
//   stepName: ORDER_STEPS.find(st => st.key === stepKey).orderStepName,
//   stepValue: value,
//   status: "CREATED"
// }

//           ],
//           media: stepKey === "Media" ? value : o.media
//         };
//       })
//     );
//   };

//   // Order Image
//   const handleOrderImageChange = (orderIdx, files) => {
//     setOrderImages(imgs =>
//       imgs.map((imgArr, idx) => (idx === orderIdx ? Array.from(files) : imgArr))
//     );
//   };
//   const removeOrderImage = (orderIdx, imgIdx) => {
//     setOrderImages(imgs =>
//       imgs.map((imgArr, idx) =>
//         idx === orderIdx ? imgArr.filter((_, i) => i !== imgIdx) : imgArr
//       )
//     );
//   };

//   // Add/Remove Order
//   const addOrder = () => {
//     setOrders(ords => [...ords, { ...defaultOrder }]);
//     setOrderImages(imgs => [...imgs, []]);
//   };
//   const removeOrder = (idx) => {
//     setOrders(ords => ords.filter((_, i) => i !== idx));
//     setOrderImages(imgs => imgs.filter((_, i) => i !== idx));
//   };

//   // --- Price Calculation (per order, for UI)
//   function getOrderSummary(order) {
//     let unitPrice = 0;
//     // Find stepSelections
//     ORDER_STEPS.forEach(step => {
//       const sel = order.steps.find(s => s.orderStepName === step.orderStepName)?.measurement;
//       if (sel && order.orderType && order.printType) {
//         const clientTypesObj = PRINT_PRICES.clientTypes;
//         const orderTypesObj = clientTypesObj[clientType]?.orderTypes || {};
//         const printTypesObj = orderTypesObj[order.orderType]?.printTypes || {};
//         const stepOptionLists = printTypesObj[order.printType] || {};
//         const options = stepOptionLists[step.key] || [];
//         const found = options.find(o => o.name === sel);
//         if (found) {
//           if (typeof found.cost === "number") unitPrice += found.cost;
//           else if (typeof found.costCMYK === "number") unitPrice += found.costCMYK;
//         }
//       }
//     });
//     const qty = Number(order.qty) || 1;
//     const gstPercent = Number(order.gst) || 0;
//     const totalAmount = unitPrice * qty;
//     const gst = Math.round(totalAmount * gstPercent / 100);
//     const totalAmountWithGST = totalAmount + gst;
//     return { unitPrice, totalAmount, gst, totalAmountWithGST };
//   }

//   // --- Submit Handler ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setErrMsg("");
//     setSuccessMsg("");

//     // Build orders for API (with summary fields)
//     const ordersForAPI = orders.map((order, i) => {
//       const { unitPrice, totalAmount, gst, totalAmountWithGST } = getOrderSummary(order);
//       return {
//         ...order,
//         unitPrice,
//         totalAmount,
//         gst,
//         totalAmountWithGST,
//         createdAtDateTime: toApiDatetime(order.createdAtDateTime),
//         orderStartDateTime: toApiDatetime(order.orderStartDateTime),
//         orderEndDateTime: toApiDatetime(order.orderEndDateTime),
//         steps: order.steps,
//         media:
//           order.media ||
//           order.steps.find(s => s.orderStepName === "Printing")?.measurement ||
//           "",
//         images: []
//       };
//     });

//     // Main postSales object
//     const postSalesData = {
//       postSalesdateTime: toApiDatetime(postSalesdateTime),
//       client: { ...client },
//       clientType,
//       orders: ordersForAPI,
//       remark,
//       notified,
//       status
//     };

//     // FormData
//     const formData = new FormData();
//     formData.append("postSales", JSON.stringify(postSalesData));
//     formData.append("isOldClient", String(isOldClient));
//     orderImages.forEach((images, idx) => {
//       images.forEach((file) => {
//         formData.append(`orderImages[${idx}]`, file);
//       });
//     });

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         "http://localhost:8080/api/postsales/createpostsales",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       setSuccessMsg("PostSales created successfully!");
//       if (onSuccess) onSuccess();
//     } catch (err) {
//       setErrMsg(
//         err?.response?.data?.message ||
//         err?.message ||
//         "Failed to create post sales"
//       );
//     }
//     setSubmitting(false);
//   };

//   // UI for Orders
//   const clientTypesObj = PRINT_PRICES.clientTypes;
//   const orderTypesObj = clientTypesObj[clientType]?.orderTypes || {};

//   return (
//     <div className={styles.pageWrapper}>
//       <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
//         <h2 className={styles.heading}>Add PostSales</h2>

//         {/* --- Client Section --- */}
//         <div className={styles.section}>
//           <h4>Client Details</h4>
//           <div className={styles.row}>
//             <label>
//               <span>Name</span>
//               <input
//                 type="text"
//                 value={client.name}
//                 onChange={e => handleClientChange("name", e.target.value)}
//                 required
//               />
//             </label>
//             <label>
//               <span>Email</span>
//               <input
//                 type="email"
//                 value={client.email}
//                 onChange={e => handleClientChange("email", e.target.value)}
//                 required
//               />
//             </label>
//             <label>
//               <span>Phone</span>
//               <input
//                 type="text"
//                 value={client.phone}
//                 onChange={e => handleClientChange("phone", e.target.value)}
//                 required
//               />
//             </label>
//             <label>
//               <span>Address</span>
//               <input
//                 type="text"
//                 value={client.address}
//                 onChange={e => handleClientChange("address", e.target.value)}
//               />
//             </label>
//             <label>
//               <span>GST</span>
//               <input
//                 type="text"
//                 value={client.GSTCertificate}
//                 onChange={e => handleClientChange("GSTCertificate", e.target.value)}
//               />
//             </label>
//             <label>
//               <span>PAN</span>
//               <input
//                 type="text"
//                 value={client.PAN}
//                 onChange={e => handleClientChange("PAN", e.target.value)}
//               />
//             </label>
//           </div>
//           <label>
//             <span>Client Type</span>
//             <select
//               value={clientType}
//               onChange={e => setClientType(e.target.value)}
//               required
//             >
//               {CLIENT_TYPES.map(ct => <option key={ct} value={ct}>{ct}</option>)}
//             </select>
//           </label>
//           <label>
//             <span>Is Old Client?</span>
//             <input
//               type="checkbox"
//               checked={isOldClient}
//               onChange={e => setIsOldClient(e.target.checked)}
//             />
//           </label>
//         </div>

//         {/* --- Orders Section --- */}
//         <div className={styles.section}>
//           <h4>
//             Orders
//             <button type="button" className={styles.addOrderBtn} onClick={addOrder}>
//               <Plus size={18} /> Add Order
//             </button>
//           </h4>
//           {orders.map((order, idx) => {
//             // Option generators for this order
//             const printTypesObj = order.orderType ? orderTypesObj[order.orderType]?.printTypes || {} : {};
//             const stepOptionLists = order.printType
//               ? Object.entries(printTypesObj[order.printType] || {})
//                   .filter(([group]) => ORDER_STEPS.some(s => s.key === group))
//                   .reduce((acc, [group, opts]) => {
//                     acc[group] = opts;
//                     return acc;
//                   }, {})
//               : {};
//             const summary = getOrderSummary(order);

//             return (
//               <div key={idx} className={styles.orderBox}>
//                 <div className={styles.orderHeader}>
//                   <span>Order #{idx + 1}</span>
//                   {orders.length > 1 && (
//                     <button
//                       type="button"
//                       className={styles.removeOrderBtn}
//                       onClick={() => removeOrder(idx)}
//                     >
//                       <MinusCircle size={18} />
//                     </button>
//                   )}
//                 </div>
//                 <div className={styles.row}>
//                   <label>
//                     <span>Order Type</span>
//                     <select
//                       value={order.orderType}
//                       onChange={e => handleOrderChange(idx, "orderType", e.target.value)}
//                       required
//                     >
//                       <option value="">Select Order Type</option>
//                       {Object.keys(orderTypesObj).map(ot => (
//                         <option key={ot} value={ot}>{ot}</option>
//                       ))}
//                     </select>
//                   </label>
//                   <label>
//                     <span>Print Type</span>
//                     <div className={styles.optionsWrap}>
//                       {order.orderType &&
//                         Object.keys(printTypesObj).map(pt => (
//                           <button
//                             key={pt}
//                             type="button"
//                             className={`${styles.optionChip} ${order.printType === pt ? styles.selected : ""}`}
//                             onClick={() => handleOrderChange(idx, "printType", pt)}
//                           >{pt}</button>
//                         ))}
//                     </div>
//                   </label>
//                   <label>
//                     <span>Priority</span>
//                     <select
//                       value={order.priority}
//                       onChange={e => handleOrderChange(idx, "priority", e.target.value)}
//                     >
//                       {PRIORITY_OPTIONS.map(opt => (
//                         <option key={opt} value={opt}>{opt}</option>
//                       ))}
//                     </select>
//                   </label>
//                   <label>
//                     <span>Status</span>
//                     <select
//                       value={order.status}
//                       onChange={e => handleOrderChange(idx, "status", e.target.value)}
//                     >
//                       {STATUS_OPTIONS.map(opt => (
//                         <option key={opt} value={opt}>{opt}</option>
//                       ))}
//                     </select>
//                   </label>
//                 </div>
//                 {/* Steps */}
//                 <div className={styles.stepSection}>
//                   {ORDER_STEPS.map((step, stIdx) => (
//                     <div key={step.key} className={styles.stepGroup}>
//                       <div className={styles.groupTitle}>{step.label}</div>
//                       <div className={styles.optionsWrap}>
//                         {(stepOptionLists[step.key] || []).map(opt => (
//                           <button
//                             key={opt.name}
//                             type="button"
//                             className={`${styles.optionChip} ${order.steps.find(s => s.orderStepName === step.orderStepName)?.measurement === opt.name ? styles.selected : ""}`}
//                             onClick={() => handleStepSelect(idx, step.key, order.steps.find(s => s.orderStepName === step.orderStepName)?.measurement === opt.name ? "" : opt.name)}
//                           >
//                             {opt.name}
//                             {typeof opt.cost === "number"
//                               ? ` (${opt.cost})`
//                               : typeof opt.costCMYK === "number"
//                               ? ` (${opt.costCMYK})`
//                               : ""}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className={styles.row}>
//                   <label>
//                     <span>Media</span>
//                     <input
//                       type="text"
//                       value={order.media}
//                       onChange={e => handleOrderChange(idx, "media", e.target.value)}
//                       required
//                     />
//                   </label>
//                   <label>
//                     <span>Qty</span>
//                     <input
//                       type="number"
//                       min={1}
//                       value={order.qty}
//                       onChange={e => handleOrderChange(idx, "qty", Number(e.target.value))}
//                       required
//                     />
//                   </label>
//                   <label>
//                     <span>GST (%)</span>
//                     <select value={order.gst} onChange={e => handleOrderChange(idx, "gst", Number(e.target.value))}>
//                       {GST_OPTIONS.map(opt => (
//                         <option key={opt} value={opt}>{opt}%</option>
//                       ))}
//                     </select>
//                   </label>
//                   {/* <label>
//                     <span>Budget</span>
//                     <input
//                       type="number"
//                       value={order.budget}
//                       onChange={e => handleOrderChange(idx, "budget", e.target.value)}
//                     />
//                   </label> */}
//                 </div>
//                 <div className={styles.row}>
//                   <label>
//                     <span>Order Start</span>
//                     <input
//                       type="datetime-local"
//                       value={toInputDatetime(order.orderStartDateTime)}
//                       onChange={e => handleOrderChange(idx, "orderStartDateTime", toApiDatetime(e.target.value))}
//                     />
//                   </label>
//                   <label>
//                     <span>Order End</span>
//                     <input
//                       type="datetime-local"
//                       value={toInputDatetime(order.orderEndDateTime)}
//                       onChange={e => handleOrderChange(idx, "orderEndDateTime", toApiDatetime(e.target.value))}
//                     />
//                   </label>
//                 </div>
//                 {/* Order images */}
//                 <div className={styles.row}>
//                   <label className={styles.imageUploadLabel}>
//                     <Upload size={18} />
//                     Attach Images
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       style={{ display: "none" }}
//                       onChange={e => handleOrderImageChange(idx, e.target.files)}
//                     />
//                   </label>
//                   {orderImages[idx] && orderImages[idx].length > 0 && (
//                     <div className={styles.imagesPreview}>
//                       {orderImages[idx].map((img, imgIdx) => (
//                         <span key={imgIdx} className={styles.imgChip}>
//                           <img
//                             src={URL.createObjectURL(img)}
//                             alt={img.name}
//                             className={styles.thumb}
//                           />
//                           <span className={styles.imgName}>{img.name}</span>
//                           <button type="button" onClick={() => removeOrderImage(idx, imgIdx)} title="Remove Image">
//                             <Trash2 size={16} />
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 {/* Summary */}
//                 <div className={styles.calculationRow}>
//                   <div><strong>Unit Price: </strong>₹{summary.unitPrice}</div>
//                   <div><strong>Total: </strong>₹{summary.totalAmount}</div>
//                   <div><strong>GST Amt: </strong>₹{summary.gst}</div>
//                   <div><strong>Total (GST): </strong>₹{summary.totalAmountWithGST}</div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* --- Meta section --- */}
//         <div className={styles.section}>
//           <label>
//             <span>Remark</span>
//             <input
//               type="text"
//               value={remark}
//               onChange={e => setRemark(e.target.value)}
//             />
//           </label>
//           <label>
//             <span>Notified</span>
//             <input
//               type="checkbox"
//               checked={notified}
//               onChange={e => setNotified(e.target.checked)}
//             />
//           </label>
//           <label>
//             <span>Status</span>
//             <select value={status} onChange={e => setStatus(e.target.value)}>
//               {STATUS_OPTIONS.map(opt => (
//                 <option key={opt} value={opt}>{opt}</option>
//               ))}
//             </select>
//           </label>
//           <label>
//             <span>PostSales Date & Time</span>
//             <input
//               type="datetime-local"
//               value={toInputDatetime(postSalesdateTime)}
//               onChange={e => setPostSalesDateTime(e.target.value)}
//               required
//             />
//           </label>
//         </div>
//         {errMsg && <div className={styles.errorMsg}>{errMsg}</div>}
//         {successMsg && <div className={styles.successMsg}>{successMsg}</div>}
//         <div className={styles.submitRow}>
//           <button type="submit" className={styles.submitBtn} disabled={submitting}>
//             {submitting ? "Submitting..." : "Create PostSales"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import styles from "./AddPostSalePage.module.scss";
import PRINT_PRICES from "../../printprices";
import { Trash2, Upload, Plus, MinusCircle } from "lucide-react";

// --- Constants ---
const CLIENT_TYPES = ["Cash", "Online", "Printers"];
const PRIORITY_OPTIONS = ["HIGH", "MEDIUM", "LOW"];
const STATUS_OPTIONS = ["CREATED", "IN_PROGRESS", "COMPLETED"];
const GST_OPTIONS = [0, 5, 12, 18];
const FIXED_ORDER_STEPS = [
  { key: "Media",        label: "Media" },
  { key: "Lamination",   label: "Lamination" },
  { key: "Mounting",     label: "Mounting" },
  { key: "Framing",      label: "Framing" },
  { key: "Installation", label: "Installation" },
  { key: "Delivery",     label: "Delivery" }
];

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

const defaultClient = {
  name: "",
  email: "",
  phone: "",
  address: "",
  GSTCertificate: "",
  PAN: ""
};
const defaultOrder = {
  priority: "HIGH",
  createdAtDateTime: nowDatetimeLocal() + ":00",
  orderType: "",
  printType: "",
  media: "",
  unitPrice: 0,
  qty: 1,
  gst: 0,
  totalAmount: 0,
  totalAmountWithGST: 0,
  orderStartDateTime: "",
  orderEndDateTime: "",
  status: "CREATED",
  stepSelections: {}, // used ONLY IN FRONTEND
  images: []
};

// Build steps with correct backend fields: stepName, stepValue, status, stepNumber
function buildOrderSteps(selections) {
  return FIXED_ORDER_STEPS.map((step, idx) => ({
    stepNumber: idx + 1,
    stepName: step.key,
    stepValue: step.key === "Delivery" ? "To be delivered" : (selections[step.key] || ""),
    status: "CREATED"
  }));
}

function calculateOrderAmounts({ clientType, orderType, printType, stepSelections, qty, gstPercent }) {
  let unitPrice = 0;
  const clientTypesObj = PRINT_PRICES.clientTypes;
  const orderTypesObj = clientTypesObj[clientType]?.orderTypes || {};
  const printTypesObj = orderTypesObj[orderType]?.printTypes || {};
  const priceGroups = printTypesObj[printType] || {};
  for (const stepDef of FIXED_ORDER_STEPS) {
    if (stepDef.key === "Delivery") continue;
    const selected = stepSelections[stepDef.key];
    if (!selected) continue;
    const groupOptions = priceGroups[stepDef.key] || [];
    const found = groupOptions.find(opt => opt.name === selected);
    if (found) {
      if (typeof found.cost === "number") unitPrice += found.cost;
      else if (typeof found.costCMYK === "number") unitPrice += found.costCMYK;
    }
  }
  unitPrice = Number(unitPrice) || 0;
  qty = Number(qty) || 1;
  gstPercent = Number(gstPercent) || 0;
  const totalAmount = unitPrice * qty;
  const gst = Math.round(totalAmount * gstPercent / 100);
  const totalAmountWithGST = totalAmount + gst;
  return { unitPrice, totalAmount, gst, totalAmountWithGST };
}

export default function AddPostSalePage({ onSuccess }) {
  const [client, setClient] = useState({ ...defaultClient });
  const [clientType, setClientType] = useState("Online");
  const [postSalesdateTime, setPostSalesDateTime] = useState(nowDatetimeLocal());
  const [remark, setRemark] = useState("");
  const [orders, setOrders] = useState([{ ...defaultOrder }]);
  const [orderImages, setOrderImages] = useState([[]]);
  const [notified, setNotified] = useState(false);
  const [status, setStatus] = useState("CREATED");
  const [isOldClient, setIsOldClient] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // --- Handlers ---
  const handleClientChange = (field, value) => setClient(c => ({ ...c, [field]: value }));
  const handleOrderChange = (orderIdx, key, value) => {
    setOrders(ords =>
      ords.map((o, i) => (i === orderIdx ? { ...o, [key]: value } : o))
    );
  };
  const handleStepSelect = (orderIdx, stepKey, value) => {
    setOrders(ords =>
      ords.map((o, i) => {
        if (i !== orderIdx) return o;
        const nextStepSelections = { ...o.stepSelections, [stepKey]: value };
        return {
          ...o,
          stepSelections: nextStepSelections,
          media: stepKey === "Media" ? value : o.media
        };
      })
    );
  };
  const handleOrderImageChange = (orderIdx, files) => {
    setOrderImages(imgs =>
      imgs.map((imgArr, idx) => (idx === orderIdx ? Array.from(files) : imgArr))
    );
  };
  const removeOrderImage = (orderIdx, imgIdx) => {
    setOrderImages(imgs =>
      imgs.map((imgArr, idx) =>
        idx === orderIdx ? imgArr.filter((_, i) => i !== imgIdx) : imgArr
      )
    );
  };
  const addOrder = () => {
    setOrders(ords => [...ords, { ...defaultOrder }]);
    setOrderImages(imgs => [...imgs, []]);
  };
  const removeOrder = (idx) => {
    setOrders(ords => ords.filter((_, i) => i !== idx));
    setOrderImages(imgs => imgs.filter((_, i) => i !== idx));
  };

  function getOrderSummary(order) {
    return calculateOrderAmounts({
      clientType,
      orderType: order.orderType,
      printType: order.printType,
      stepSelections: order.stepSelections,
      qty: order.qty,
      gstPercent: order.gst
    });
  }

  // --- API Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrMsg("");
    setSuccessMsg("");
    // Prepare API payload: Only backend fields
    const ordersForAPI = orders.map((order) => {
      const summary = getOrderSummary(order);
      const { stepSelections, ...orderForBackend } = order;
      return {
        ...orderForBackend,
        unitPrice: summary.unitPrice,
        totalAmount: summary.totalAmount,
        gst: summary.gst,
        totalAmountWithGST: summary.totalAmountWithGST,
        createdAtDateTime: toApiDatetime(order.createdAtDateTime),
        orderStartDateTime: toApiDatetime(order.orderStartDateTime),
        orderEndDateTime: toApiDatetime(order.orderEndDateTime),
        media: order.media || order.stepSelections.Media || "",
        steps: buildOrderSteps(order.stepSelections),
        images: []
      };
    });

    const postSalesData = {
      postSalesdateTime: toApiDatetime(postSalesdateTime),
      client: { ...client },
      clientType,
      orders: ordersForAPI,
      remark,
      notified,
      status
    };

    // --- FormData ---
    const formData = new FormData();
    formData.append("postSales", JSON.stringify(postSalesData));
    formData.append("isOldClient", String(isOldClient));
    // Add images for each order as per your request:
    orderImages.forEach((images, index) => {
      images.forEach((file) => {
        formData.append(`orderImages[${index}]`, file);
      });
    });

    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "https://api.alankardigitalhub.in/api/postsales/createpostsales",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccessMsg("PostSales created successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrMsg(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create post sales"
      );
    }
    setSubmitting(false);
  };

  // UI for Orders
  const clientTypesObj = PRINT_PRICES.clientTypes;
  const orderTypesObj = clientTypesObj[clientType]?.orderTypes || {};

  return (
    <div className={styles.pageWrapper}>
      <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
        <h2 className={styles.heading}>Add PostSales</h2>
        {/* --- Client Section --- */}
        <div className={styles.section}>
          <div className={styles.flexRow}>
            <div>
              <span className={styles.label}>New Client</span>
              <input
                type="radio"
                checked={!isOldClient}
                onChange={() => setIsOldClient(false)}
              />
              <span className={styles.label}>Existing Client</span>
              <input
                type="radio"
                checked={isOldClient}
                onChange={() => setIsOldClient(true)}
              />
            </div>
            <div className={styles.clientTypeWrap}>
              {CLIENT_TYPES.map(ct => (
                <button
                  type="button"
                  key={ct}
                  className={`${styles.typeChip} ${clientType === ct ? styles.activeChip : ""}`}
                  onClick={() => setClientType(ct)}
                >
                  {ct}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.row}>
            <label>
              <span>Client Name</span>
              <input type="text" value={client.name} onChange={e => handleClientChange("name", e.target.value)} required />
            </label>
            <label>
              <span>Email address</span>
              <input type="email" value={client.email} onChange={e => handleClientChange("email", e.target.value)} required />
            </label>
          </div>
          <div className={styles.row}>
            <label>
              <span>Mobile Number</span>
              <input type="text" value={client.phone} onChange={e => handleClientChange("phone", e.target.value)} required />
            </label>
            <label>
              <span>Address</span>
              <input type="text" value={client.address} onChange={e => handleClientChange("address", e.target.value)} />
            </label>
          </div>
          <div className={styles.row}>
            <label>
              <span>GST</span>
              <input type="text" value={client.GSTCertificate} onChange={e => handleClientChange("GSTCertificate", e.target.value)} />
            </label>
            <label>
              <span>PAN</span>
              <input type="text" value={client.PAN} onChange={e => handleClientChange("PAN", e.target.value)} />
            </label>
          </div>
        </div>

        {/* --- Orders Section --- */}
        <div className={styles.section}>
          <div className={styles.ordersHeader}>
            <span>Order Details</span>
            <button type="button" className={styles.addOrderBtn} onClick={addOrder}>
              <Plus size={16} /> Add Order
            </button>
          </div>
          {orders.map((order, idx) => {
            const printTypesObj = order.orderType ? orderTypesObj[order.orderType]?.printTypes || {} : {};
            const stepOptionLists = order.printType
              ? Object.entries(printTypesObj[order.printType] || {})
                  .filter(([group]) => FIXED_ORDER_STEPS.some(s => s.key === group))
                  .reduce((acc, [group, opts]) => {
                    acc[group] = opts;
                    return acc;
                  }, {})
              : {};
            const summary = getOrderSummary(order);

            return (
              <div key={idx} className={styles.orderBox}>
                <div className={styles.orderHeader}>
                  <span>Order #{idx + 1}</span>
                  {orders.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeOrderBtn}
                      onClick={() => removeOrder(idx)}
                    >
                      <MinusCircle size={18} />
                    </button>
                  )}
                </div>
                <div className={styles.row}>
                  <label>
                    <span>Priority</span>
                    <select value={order.priority} onChange={e => handleOrderChange(idx, "priority", e.target.value)}>
                      {PRIORITY_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Order Type</span>
                    <select value={order.orderType} onChange={e => handleOrderChange(idx, "orderType", e.target.value)} required>
                      <option value="">Select Order Type</option>
                      {Object.keys(orderTypesObj).map(ot => (
                        <option key={ot} value={ot}>{ot}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Print Type</span>
                    <select value={order.printType} onChange={e => handleOrderChange(idx, "printType", e.target.value)} required>
                      <option value="">Select Print Type</option>
                      {order.orderType && Object.keys(printTypesObj).map(pt => (
                        <option key={pt} value={pt}>{pt}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Status</span>
                    <select value={order.status} onChange={e => handleOrderChange(idx, "status", e.target.value)}>
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className={styles.row}>
                  <label>
                    <span>Start Date</span>
                    <input
                      type="datetime-local"
                      value={toInputDatetime(order.orderStartDateTime)}
                      onChange={e => handleOrderChange(idx, "orderStartDateTime", toApiDatetime(e.target.value))}
                    />
                  </label>
                  <label>
                    <span>End Date</span>
                    <input
                      type="datetime-local"
                      value={toInputDatetime(order.orderEndDateTime)}
                      onChange={e => handleOrderChange(idx, "orderEndDateTime", toApiDatetime(e.target.value))}
                    />
                  </label>
                </div>
                {/* Step buttons */}
                <div className={styles.stepSection}>
                  {FIXED_ORDER_STEPS.filter(s => s.key !== "Delivery").map((step) => (
                    <div key={step.key} className={styles.stepGroup}>
                      <div className={styles.groupTitle}>{step.label}</div>
                      <div className={styles.optionsWrap}>
                        {(stepOptionLists[step.key] || []).map(opt => (
                          <button
                            key={opt.name}
                            type="button"
                            className={`${styles.optionChip} ${order.stepSelections[step.key] === opt.name ? styles.selected : ""}`}
                            onClick={() => handleStepSelect(idx, step.key, order.stepSelections[step.key] === opt.name ? "" : opt.name)}
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
                    </div>
                  ))}
                </div>
                <div className={styles.row}>
                  <label>
                    <span>Media</span>
                    <input
                      type="text"
                      value={order.media}
                      onChange={e => handleOrderChange(idx, "media", e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    <span>Qty</span>
                    <input
                      type="number"
                      min={1}
                      value={order.qty}
                      onChange={e => handleOrderChange(idx, "qty", Number(e.target.value))}
                      required
                    />
                  </label>
                  <label>
                    <span>GST (%)</span>
                    <select value={order.gst} onChange={e => handleOrderChange(idx, "gst", Number(e.target.value))}>
                      {GST_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}%</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className={styles.row}>
                  <label className={styles.imageUploadLabel}>
                    <Upload size={18} />
                    Upload Images
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={e => handleOrderImageChange(idx, e.target.files)}
                    />
                  </label>
                  {orderImages[idx] && orderImages[idx].length > 0 && (
                    <div className={styles.imagesPreview}>
                      {orderImages[idx].map((img, imgIdx) => (
                        <span key={imgIdx} className={styles.imgChip}>
                          <img
                            src={URL.createObjectURL(img)}
                            alt={img.name}
                            className={styles.thumb}
                          />
                          <span className={styles.imgName}>{img.name}</span>
                          <button type="button" onClick={() => removeOrderImage(idx, imgIdx)} title="Remove Image">
                            <Trash2 size={16} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {/* Summary */}
                <div className={styles.calculationRow}>
                  <div><strong>Unit Price: </strong>₹{summary.unitPrice}</div>
                  <div><strong>Total: </strong>₹{summary.totalAmount}</div>
                  <div><strong>GST Amt: </strong>₹{summary.gst}</div>
                  <div><strong>Total (GST): </strong>₹{summary.totalAmountWithGST}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- Meta section --- */}
        <div className={styles.section}>
          <label>
            <span>Remark</span>
            <input type="text" value={remark} onChange={e => setRemark(e.target.value)} />
          </label>
          <label>
            <span>Notified</span>
            <input type="checkbox" checked={notified} onChange={e => setNotified(e.target.checked)} />
          </label>
          <label>
            <span>Status</span>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label>
            <span>PostSales Date & Time</span>
            <input type="datetime-local" value={toInputDatetime(postSalesdateTime)} onChange={e => setPostSalesDateTime(e.target.value)} required />
          </label>
        </div>
        {errMsg && <div className={styles.errorMsg}>{errMsg}</div>}
        {successMsg && <div className={styles.successMsg}>{successMsg}</div>}
        <div className={styles.submitRow}>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? "Submitting..." : "Create PostSales"}
          </button>
        </div>
      </form>
    </div>
  );
}
