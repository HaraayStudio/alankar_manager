// // import React, { useState } from "react";
// // import styles from "./AddOrdersPopup.module.scss";
// // import PRINT_PRICES from "../../printprices";
// // import { X } from "lucide-react";

// // const CLIENT_TYPES = ["Cash", "Online", "Printers"];
// // const ORDER_STEPS = [
// //   { key: "Media", label: "Media", stepName: "Printing" },
// //   { key: "Lamination", label: "Lamination", stepName: "Lamination" },
// //   { key: "Mounting", label: "Mounting", stepName: "Mounting" },
// //   { key: "Framing", label: "Framing", stepName: "Framing" },
// //   { key: "Installation", label: "Installation", stepName: "Installation" }
// // ];
// // const GST_OPTIONS = [0, 5, 12, 18];

// // // Initial order structure (no client)
// // const initialOrder = {
// //   clientType: "",
// //   orderType: "",
// //   printType: "",
// //   media: "",
// //   qty: 1,
// //   budget: "",
// //   gst: 0,
// //   orderStartDateTime: "",
// //   orderEndDateTime: "",
// //   preSalesOrderSteps: [],
// // };

// // export default function AddOrderPopup({ onClose, onSave }) {
// //   const [order, setOrder] = useState({ ...initialOrder });
// //   const [stepSelections, setStepSelections] = useState({});
// //   const [submitting, setSubmitting] = useState(false);

// //   // --- Options logic ---
// //   const clientType = order.clientType;
// //   const clientTypesObj = PRINT_PRICES.clientTypes;
// //   const orderTypesObj = clientType
// //     ? clientTypesObj[clientType]?.orderTypes || {}
// //     : {};
// //   const printTypesObj = order.orderType
// //     ? orderTypesObj[order.orderType]?.printTypes || {}
// //     : {};
// //   const stepOptionLists = order.printType
// //     ? Object.entries(printTypesObj[order.printType] || {})
// //         .filter(([group]) => ORDER_STEPS.some(s => s.key === group))
// //         .reduce((acc, [group, opts]) => {
// //           acc[group] = opts;
// //           return acc;
// //         }, {})
// //     : {};

// //   // --- Handlers ---
// //   function handleClientType(val) {
// //     setOrder(o => ({
// //       ...o,
// //       clientType: val,
// //       orderType: "",
// //       printType: "",
// //       preSalesOrderSteps: [],
// //       media: "",
// //     }));
// //     setStepSelections({});
// //   }
// //   function handleOrderType(val) {
// //     setOrder(o => ({
// //       ...o,
// //       orderType: val,
// //       printType: "",
// //       preSalesOrderSteps: [],
// //       media: "",
// //     }));
// //     setStepSelections({});
// //   }
// //   function handlePrintType(val) {
// //     setOrder(o => ({
// //       ...o,
// //       printType: val,
// //       preSalesOrderSteps: [],
// //       media: "",
// //     }));
// //     setStepSelections({});
// //   }
// //   function handleStepSelect(group, value) {
// //     const next = { ...stepSelections, [group]: value };
// //     setStepSelections(next);
// //     // Compose steps array for calculation
// //     const steps = ORDER_STEPS
// //       .map((step, idx) =>
// //         next[step.key]
// //           ? {
// //               stepNumber: idx + 1,
// //               stepName: step.stepName,
// //               stepValue: next[step.key],
// //               status: "CREATED"
// //             }
// //           : null
// //       )
// //       .filter(Boolean);
// //     setOrder(o => ({
// //       ...o,
// //       preSalesOrderSteps: steps,
// //       media: group === "Media" ? value : o.media
// //     }));
// //   }

// //   // --- Calculation logic ---
// //   const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts(order);

// //   // --- Form fields handlers ---
// //   function handleField(key, value) {
// //     setOrder(o => ({
// //       ...o,
// //       [key]: value
// //     }));
// //   }

// //   async function handleSubmit(e) {
// //     e.preventDefault();
// //     setSubmitting(true);
// //     // Compose final structure (stepNumbers, media assignment, etc)
// //     const orderToSend = {
// //       ...order,
// //       unitPrice,
// //       totalAmount,
// //       totalAmountWithGST,
// //       media:
// //         order.media ||
// //         (order.preSalesOrderSteps.find(s => s.stepName === "Printing")?.stepValue || ""),
// //       preSalesOrderSteps: order.preSalesOrderSteps.map((s, i) => ({
// //         ...s,
// //         stepNumber: i + 1
// //       })),
// //     };
// //     onSave(orderToSend);
// //     setSubmitting(false);
// //   }

// //   // --- UI ---
// //   return (
// //     <div className={styles.popupOverlay}>
// //       <div className={styles.popupBox}>
// //         <button className={styles.closeBtn} onClick={onClose} title="Close">
// //           <X size={24} />
// //         </button>
// //         <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
// //           <h2 className={styles.heading}>Add New Order</h2>
// //           <p className={styles.subHeading}>Fill all details for new order.</p>
// //           {/* --- Client Type --- */}
// //           <div className={styles.row}>
// //             <label>
// //               <span>Client Type</span>
// //               <div className={styles.optionsWrap}>
// //                 {CLIENT_TYPES.map(ct => (
// //                   <button
// //                     type="button"
// //                     key={ct}
// //                     className={`${styles.optionChip} ${clientType === ct ? styles.selected : ""}`}
// //                     onClick={() => handleClientType(ct)}
// //                   >{ct}</button>
// //                 ))}
// //               </div>
// //             </label>
// //           </div>
// //           {/* --- Order / Print / Steps --- */}
// //           <div className={styles.row}>
// //             <label>
// //               <span>Order Type</span>
// //               <select
// //                 value={order.orderType}
// //                 onChange={e => handleOrderType(e.target.value)}
// //                 required
// //               >
// //                 <option value="">Select Order Type</option>
// //                 {clientType &&
// //                   Object.keys(clientTypesObj[clientType]?.orderTypes || {}).map(ot => (
// //                     <option key={ot} value={ot}>{ot}</option>
// //                   ))}
// //               </select>
// //             </label>
// //             <label>
// //               <span>Print Type</span>
// //               <div className={styles.optionsWrap}>
// //                 {order.orderType &&
// //                   Object.keys(printTypesObj).map(pt => (
// //                     <button
// //                       key={pt}
// //                       type="button"
// //                       className={`${styles.optionChip} ${order.printType === pt ? styles.selected : ""}`}
// //                       onClick={() => handlePrintType(pt)}
// //                     >{pt}</button>
// //                   ))}
// //               </div>
// //             </label>
// //           </div>
// //           {/* --- Step Options --- */}
// //           {order.printType && (
// //             <div className={styles.optionsSection}>
// //               {ORDER_STEPS.map(step => (
// //                 <div key={step.key} className={styles.optionGroup}>
// //                   <div className={styles.groupTitle}>{step.label}</div>
// //                   <div className={styles.optionsWrap}>
// //                     {(stepOptionLists[step.key] || []).map(opt => (
// //                       <button
// //                         key={opt.name}
// //                         type="button"
// //                         className={`${styles.optionChip} ${stepSelections[step.key] === opt.name ? styles.selected : ""}`}
// //                         onClick={() =>
// //                           handleStepSelect(step.key,
// //                             stepSelections[step.key] === opt.name ? "" : opt.name
// //                           )
// //                         }
// //                       >
// //                         {opt.name}
// //                         {typeof opt.cost === "number"
// //                           ? ` (${opt.cost})`
// //                           : typeof opt.costCMYK === "number"
// //                           ? ` (${opt.costCMYK})`
// //                           : ""}
// //                       </button>
// //                     ))}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //           {/* --- Qty, GST, Budget, Dates --- */}
// //           <div className={styles.row}>
// //             <label>
// //               <span>Qty</span>
// //               <input
// //                 type="number"
// //                 value={order.qty || 1}
// //                 min={1}
// //                 onChange={e => handleField("qty", Number(e.target.value))}
// //               />
// //             </label>
// //             <label>
// //               <span>GST (%)</span>
// //               <select
// //                 value={order.gst}
// //                 onChange={e => handleField("gst", Number(e.target.value))}
// //               >
// //                 {GST_OPTIONS.map(opt => (
// //                   <option key={opt} value={opt}>{opt}%</option>
// //                 ))}
// //               </select>
// //             </label>
// //             <label>
// //               <span>Budget</span>
// //               <input
// //                 type="number"
// //                 value={order.budget || ""}
// //                 onChange={e => handleField("budget", e.target.value)}
// //               />
// //             </label>
// //           </div>
// //           <div className={styles.row}>
// //             <label>
// //               <span>Order Start</span>
// //               <input
// //                 type="datetime-local"
// //                 value={order.orderStartDateTime || ""}
// //                 onChange={e => handleField("orderStartDateTime", e.target.value)}
// //               />
// //             </label>
// //             <label>
// //               <span>Order End</span>
// //               <input
// //                 type="datetime-local"
// //                 value={order.orderEndDateTime || ""}
// //                 onChange={e => handleField("orderEndDateTime", e.target.value)}
// //               />
// //             </label>
// //           </div>
// //           {/* --- Calculations --- */}
// //           <div className={styles.calculationRow}>
// //             <div><strong>Unit Price: </strong>₹{unitPrice}</div>
// //             <div><strong>Total: </strong>₹{totalAmount}</div>
// //             <div><strong>Total (GST): </strong>₹{totalAmountWithGST.toFixed(2)}</div>
// //           </div>
// //           {/* --- Actions --- */}
// //           <div className={styles.submitRow}>
// //             <button type="submit" className={styles.submitBtn} disabled={submitting}>
// //               {submitting ? "Saving..." : "Save"}
// //             </button>
// //             <button type="button" className={styles.cancelBtn} onClick={onClose}>
// //               Cancel
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // // --- Helper: Calculate prices ---
// // function calculateOrderAmounts(order) {
// //   let unitPrice = 0;
// //   if (order.preSalesOrderSteps && order.preSalesOrderSteps.length) {
// //     order.preSalesOrderSteps.forEach(step => {
// //       const stepList = PRINT_PRICES.clientTypes?.[order.clientType]?.orderTypes?.[order.orderType]?.printTypes?.[order.printType]?.[step.stepName === "Printing" ? "Media" : step.stepName] || [];
// //       const found = stepList.find(opt => opt.name === step.stepValue);
// //       if (found) {
// //         if (typeof found.cost === "number") unitPrice += found.cost;
// //         else if (typeof found.costCMYK === "number") unitPrice += found.costCMYK;
// //       }
// //     });
// //   }
// //   const qty = Number(order.qty) || 1;
// //   const gst = Number(order.gst) || 0;
// //   const totalAmount = unitPrice * qty;
// //   const totalAmountWithGST = totalAmount + (totalAmount * gst) / 100;
// //   return { unitPrice, totalAmount, totalAmountWithGST };
// // }

// import React, { useState, useEffect } from "react";
// import styles from "./AddOrdersPopup.module.scss";
// import PRINT_PRICES from "../../printprices";
// import { X } from "lucide-react";

// const ORDER_STEPS = [
//   { key: "Media", label: "Media", stepName: "Printing" },
//   { key: "Lamination", label: "Lamination", stepName: "Lamination" },
//   { key: "Mounting", label: "Mounting", stepName: "Mounting" },
//   { key: "Framing", label: "Framing", stepName: "Framing" },
//   { key: "Installation", label: "Installation", stepName: "Installation" }
// ];
// const GST_OPTIONS = [0, 5, 12, 18];

// // Initial order structure (no client)
// const initialOrder = {
//   clientType: "",
//   orderType: "",
//   printType: "",
//   media: "",
//   height: null,
//   width: null,
//   qty: 1,
//   budget: "",
//   gst: 0,
//   orderStartDateTime: "",
//   orderEndDateTime: "",
//   preSalesOrderSteps: [],
// };

// export default function AddOrderPopup({ clientType, onClose, onSave }) {
//   // Set clientType on mount
//   const [order, setOrder] = useState({ ...initialOrder, clientType: clientType || "" });
//   const [stepSelections, setStepSelections] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     // Always ensure clientType is set and up to date
//     setOrder(o => ({ ...o, clientType: clientType || "" }));
//   }, [clientType]);

//   // --- Options logic ---
//   const clientTypesObj = PRINT_PRICES.clientTypes;
//   const orderTypesObj = order.clientType
//     ? clientTypesObj[order.clientType]?.orderTypes || {}
//     : {};
//   const printTypesObj = order.orderType
//     ? orderTypesObj[order.orderType]?.printTypes || {}
//     : {};
//   const stepOptionLists = order.printType
//     ? Object.entries(printTypesObj[order.printType] || {})
//         .filter(([group]) => ORDER_STEPS.some(s => s.key === group))
//         .reduce((acc, [group, opts]) => {
//           acc[group] = opts;
//           return acc;
//         }, {})
//     : {};

//   // --- Handlers ---
//   function handleOrderType(val) {
//     setOrder(o => ({
//       ...o,
//       orderType: val,
//       printType: "",
//       preSalesOrderSteps: [],
//       media: "",
//     }));
//     setStepSelections({});
//   }
//   function handlePrintType(val) {
//     setOrder(o => ({
//       ...o,
//       printType: val,
//       preSalesOrderSteps: [],
//       media: "",
//     }));
//     setStepSelections({});
//   }
//   function handleStepSelect(group, value) {
//     const next = { ...stepSelections, [group]: value };
//     setStepSelections(next);
//     // Compose steps array for calculation
//     const steps = ORDER_STEPS
//       .map((step, idx) =>
//         next[step.key]
//           ? {
//               stepNumber: idx + 1,
//               stepName: step.stepName,
//               stepValue: next[step.key],
//               status: "CREATED"
//             }
//           : null
//       )
//       .filter(Boolean);
//     setOrder(o => ({
//       ...o,
//       preSalesOrderSteps: steps,
//       media: group === "Media" ? value : o.media
//     }));
//   }
//   // --- Calculation logic ---
//   const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts(order);

//   // --- Form fields handlers ---
//   function handleField(key, value) {
//     setOrder(o => ({
//       ...o,
//       [key]: value
//     }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setSubmitting(true);
//     // Compose final structure (stepNumbers, media assignment, etc)
//     const orderToSend = {
//       ...order,
//       unitPrice,
//       totalAmount,
//       totalAmountWithGST,
//       media:
//         order.media ||
//         (order.preSalesOrderSteps.find(s => s.stepName === "Printing")?.stepValue || ""),
//       preSalesOrderSteps: order.preSalesOrderSteps.map((s, i) => ({
//         ...s,
//         stepNumber: i + 1
//       })),
//     };
//     onSave(orderToSend); // pass to parent for API
//     setSubmitting(false);
//   }

//   // --- UI ---
//   return (
//     <div className={styles.popupOverlay}>
//       <div className={styles.popupBox}>
//         <button className={styles.closeBtn} onClick={onClose} title="Close">
//           <X size={24} />
//         </button>
//         <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
//           <h2 className={styles.heading}>Add New Order</h2>
//           {/* <p className={styles.subHeading}>Fill all details for new order.</p> */}
//           {/* --- Client Type (auto, hidden) --- */}
//           <input type="hidden" value={order.clientType} />
//           {/* --- Order / Print / Steps --- */}
//           <div className={styles.row}>
//             <label>
//               <span>Order Type</span>
//               <select
//                 value={order.orderType}
//                 onChange={e => handleOrderType(e.target.value)}
//                 required
//               >
//                 <option value="">Select Order Type</option>
//                 {order.clientType &&
//                   Object.keys(clientTypesObj[order.clientType]?.orderTypes || {}).map(ot => (
//                     <option key={ot} value={ot}>{ot}</option>
//                   ))}
//               </select>
//             </label>
//             </div>   <div className={styles.row}>
//             <label>
//               <span>Print Type</span>
//               <div className={styles.optionsWrap}>
//                 {order.orderType &&
//                   Object.keys(printTypesObj).map(pt => (
//                     <button
//                       key={pt}
//                       type="button"
//                       className={`${styles.optionChip} ${order.printType === pt ? styles.selected : ""}`}
//                       onClick={() => handlePrintType(pt)}
//                     >{pt}</button>
//                   ))}
//               </div>
//             </label>
//           </div>
//           {/* --- Step Options --- */}
//           {order.printType && (
//             <div className={styles.optionsSection}>
//               {ORDER_STEPS.map(step => (
//                 <div key={step.key} className={styles.optionGroup}>
//                   <div className={styles.groupTitle}>{step.label}</div>
//                   <div className={styles.optionsWrap}>
//                     {(stepOptionLists[step.key] || []).map(opt => (
//                       <button
//                         key={opt.name}
//                         type="button"
//                         className={`${styles.optionChip} ${stepSelections[step.key] === opt.name ? styles.selected : ""}`}
//                         onClick={() =>
//                           handleStepSelect(step.key,
//                             stepSelections[step.key] === opt.name ? "" : opt.name
//                           )
//                         }
//                       >
//                         {opt.name}
//                         {typeof opt.cost === "number"
//                           ? ` (${opt.cost})`
//                           : typeof opt.costCMYK === "number"
//                           ? ` (${opt.costCMYK})`
//                           : ""}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//           {/* --- Qty, GST, Budget, Height, Width, Dates --- */}
//           <div className={styles.row}>
//                   <div className={styles.row}>
//               <label>
//                 <span>Height (ft)</span>
//                 <input
//                   type="number"
//                   value={order.height || 1}
//                   min={1}
//                   onChange={e => updateOrderField("height", Number(e.target.value))}
//                 />
//               </label>
//               <label>
//                 <span>Width (ft)</span>
//                 <input
//                   type="number"
//                   value={order.width || 1}
//                   min={1}
//                   onChange={e => updateOrderField("width", Number(e.target.value))}
//                 />
//               </label>
//             </div>
//             <div className={styles.row}>
//               {/* <label>
//                 <span> Measurement</span>
//                 <input
//                   type="number"
//                   value={order.qty || 1}
//                   min={1}
//                   onChange={e => updateOrderField("qty", Number(e.target.value))}
//                 />
//               </label> */}
//               <label>
//               <span>Measurement (sqft)</span>
//               <input
//                 type="number"
//                 value={(order.height || 1) * (order.width || 1)}
//                 min={1}
//                 // disabled // Make it read-only
//                 style={{ background: "#f6f9fe", color: "#2253c9", fontWeight: 600 }}
//               />
//             </label> 
//             </div>
//             {/* <label>
//               <span>Qty</span>
//               <input
//                 type="number"
//                 value={order.qty || 1}
//                 min={1}
//                 onChange={e => handleField("qty", Number(e.target.value))}
//               />
//             </label> */}
//             <label>
//               <span>GST (%)</span>
//               <select
//                 value={order.gst}
//                 onChange={e => handleField("gst", Number(e.target.value))}
//               >
//                 {GST_OPTIONS.map(opt => (
//                   <option key={opt} value={opt}>{opt}%</option>
//                 ))}
//               </select>
//             </label>
//             <label>
//               <span>Budget</span>
//               <input
//                 type="number"
//                 value={order.budget || ""}
//                 onChange={e => handleField("budget", e.target.value)}
//               />
//             </label>
//           </div>
//           <div className={styles.row}>
//             <label>
//               <span>Height</span>
//               <input
//                 type="number"
//                 value={order.height || ""}
//                 min={0}
//                 onChange={e => handleField("height", e.target.value)}
//               />
//             </label>
//             <label>
//               <span>Width</span>
//               <input
//                 type="number"
//                 value={order.width || ""}
//                 min={0}
//                 onChange={e => handleField("width", e.target.value)}
//               />
//             </label>
//           </div>
//           <div className={styles.row}>
//             <label>
//               <span>Order Start</span>
//               <input
//                 type="datetime-local"
//                 value={order.orderStartDateTime || ""}
//                 onChange={e => handleField("orderStartDateTime", e.target.value)}
//               />
//             </label>
//             <label>
//               <span>Order End</span>
//               <input
//                 type="datetime-local"
//                 value={order.orderEndDateTime || ""}
//                 onChange={e => handleField("orderEndDateTime", e.target.value)}
//               />
//             </label>
//           </div>
//           {/* --- Calculations --- */}
//           <div className={styles.calculationRow}>
//             <div><strong>Unit Price: </strong>₹{unitPrice}</div>
//             <div><strong>Total: </strong>₹{totalAmount}</div>
//             <div><strong>Total (GST): </strong>₹{totalAmountWithGST.toFixed(2)}</div>
//           </div>
//           {/* --- Actions --- */}
//           <div className={styles.submitRow}>
//             <button type="submit" className={styles.submitBtn} disabled={submitting}>
//               {submitting ? "Saving..." : "Save"}
//             </button>
//             <button type="button" className={styles.cancelBtn} onClick={onClose}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // --- Helper: Calculate prices ---
// function calculateOrderAmounts(order) {
//   let unitPrice = 0;
//   if (order.preSalesOrderSteps && order.preSalesOrderSteps.length) {
//     order.preSalesOrderSteps.forEach(step => {
//       const stepList = PRINT_PRICES.clientTypes?.[order.clientType]?.orderTypes?.[order.orderType]?.printTypes?.[order.printType]?.[step.stepName === "Printing" ? "Media" : step.stepName] || [];
//       const found = stepList.find(opt => opt.name === step.stepValue);
//       if (found) {
//         if (typeof found.cost === "number") unitPrice += found.cost;
//         else if (typeof found.costCMYK === "number") unitPrice += found.costCMYK;
//       }
//     });
//   }
//   const qty = Number(order.qty) || 1;
//   const gst = Number(order.gst) || 0;
//   const totalAmount = unitPrice * qty;
//   const totalAmountWithGST = totalAmount + (totalAmount * gst) / 100;
//   return { unitPrice, totalAmount, totalAmountWithGST };
// }
import React, { useState, useEffect } from "react";
import styles from "./AddOrdersPopup.module.scss";
import PRINT_PRICES from "../../printprices";
import { X } from "lucide-react";

const ORDER_STEPS = [
  { key: "Media", label: "Media", stepName: "Printing" },
  { key: "Lamination", label: "Lamination", stepName: "Lamination" },
  { key: "Mounting", label: "Mounting", stepName: "Mounting" },
  { key: "Framing", label: "Framing", stepName: "Framing" },
  { key: "Installation", label: "Installation", stepName: "Installation" }
];
const GST_OPTIONS = [0, 5, 12, 18];

// Initial order structure (no client)
const initialOrder = {
  clientType: "",
  orderType: "",
  printType: "",
  media: "",
  height: 1,
  width: 1,
  qty: 1,
  budget: "",
  gst: 0,
  orderStartDateTime: "",
  orderEndDateTime: "",
  preSalesOrderSteps: [],
};

export default function AddOrderPopup({ clientType, onClose, onSave }) {
  // Set clientType on mount
  const [order, setOrder] = useState({ ...initialOrder, clientType: clientType || "" });
  const [stepSelections, setStepSelections] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Always ensure clientType is set and up to date
    setOrder(o => ({ ...o, clientType: clientType || "" }));
  }, [clientType]);

  // --- Options logic ---
  const clientTypesObj = PRINT_PRICES.clientTypes;
  const orderTypesObj = order.clientType
    ? clientTypesObj[order.clientType]?.orderTypes || {}
    : {};
  const printTypesObj = order.orderType
    ? orderTypesObj[order.orderType]?.printTypes || {}
    : {};
  const stepOptionLists = order.printType
    ? Object.entries(printTypesObj[order.printType] || {})
        .filter(([group]) => ORDER_STEPS.some(s => s.key === group))
        .reduce((acc, [group, opts]) => {
          acc[group] = opts;
          return acc;
        }, {})
    : {};

  // --- Handlers ---
  function handleOrderType(val) {
    setOrder(o => ({
      ...o,
      orderType: val,
      printType: "",
      preSalesOrderSteps: [],
      media: "",
    }));
    setStepSelections({});
  }
  function handlePrintType(val) {
    setOrder(o => ({
      ...o,
      printType: val,
      preSalesOrderSteps: [],
      media: "",
    }));
    setStepSelections({});
  }
  function handleStepSelect(group, value) {
    const next = { ...stepSelections, [group]: value };
    setStepSelections(next);
    // Compose steps array for calculation
    const steps = ORDER_STEPS
      .map((step, idx) =>
        next[step.key]
          ? {
              stepNumber: idx + 1,
              stepName: step.stepName,
              stepValue: next[step.key],
              status: "CREATED"
            }
          : null
      )
      .filter(Boolean);
    setOrder(o => ({
      ...o,
      preSalesOrderSteps: steps,
      media: group === "Media" ? value : o.media
    }));
  }

  // ---- Main Field Handler: Keeps qty synced to sqft
  function updateOrderField(key, value) {
    setOrder(prev => {
      const updated = { ...prev, [key]: value };
      if (key === "height" || key === "width") {
        const h = key === "height" ? value : Number(prev.height) || 1;
        const w = key === "width" ? value : Number(prev.width) || 1;
        // Always round to two decimals for measurement
        updated.qty = Math.round(Number(h) * Number(w) * 100) / 100;
      }
      return updated;
    });
  }

  // --- Calculation logic ---
  const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts(order);

  // --- Form fields handlers (for other fields like gst, budget) ---
  function handleField(key, value) {
    setOrder(o => ({
      ...o,
      [key]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    // Compose final structure (stepNumbers, media assignment, etc)
    const orderToSend = {
      ...order,
      unitPrice,
      totalAmount,
      totalAmountWithGST,
      media:
        order.media ||
        (order.preSalesOrderSteps.find(s => s.stepName === "Printing")?.stepValue || ""),
      preSalesOrderSteps: order.preSalesOrderSteps.map((s, i) => ({
        ...s,
        stepNumber: i + 1
      })),
    };
    onSave(orderToSend); // pass to parent for API
    setSubmitting(false);
  }

  // --- UI ---
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupBox}>
        <button className={styles.closeBtn} onClick={onClose} title="Close">
          <X size={24} />
        </button>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <h2 className={styles.heading}>Add New Order</h2>
          {/* --- Client Type (auto, hidden) --- */}
          <input type="hidden" value={order.clientType} />
          {/* --- Order / Print / Steps --- */}
          <div className={styles.row}>
            <label>
              <span>Order Type</span>
              <select
                value={order.orderType}
                onChange={e => handleOrderType(e.target.value)}
                required
              >
                <option value="">Select Order Type</option>
                {order.clientType &&
                  Object.keys(clientTypesObj[order.clientType]?.orderTypes || {}).map(ot => (
                    <option key={ot} value={ot}>{ot}</option>
                  ))}
              </select>
            </label>
          </div>
          <div className={styles.row}>
            <label>
              <span>Print Type</span>
              <div className={styles.optionsWrap}>
                {order.orderType &&
                  Object.keys(printTypesObj).map(pt => (
                    <button
                      key={pt}
                      type="button"
                      className={`${styles.optionChip} ${order.printType === pt ? styles.selected : ""}`}
                      onClick={() => handlePrintType(pt)}
                    >{pt}</button>
                  ))}
              </div>
            </label>
          </div>
          {/* --- Step Options --- */}
          {order.printType && (
            <div className={styles.optionsSection}>
              {ORDER_STEPS.map(step => (
                <div key={step.key} className={styles.optionGroup}>
                  <div className={styles.groupTitle}>{step.label}</div>
                  <div className={styles.optionsWrap}>
                    {(stepOptionLists[step.key] || []).map(opt => (
                      <button
                        key={opt.name}
                        type="button"
                        className={`${styles.optionChip} ${stepSelections[step.key] === opt.name ? styles.selected : ""}`}
                        onClick={() =>
                          handleStepSelect(step.key,
                            stepSelections[step.key] === opt.name ? "" : opt.name
                          )
                        }
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
          )}

          {/* --- Height, Width, Measurement (sqft) --- */}
          <div className={styles.row}>
            <label>
              <span>Height (ft)</span>
              <input
                type="number"
                value={order.height || 1}
                min={1}
                onChange={e => updateOrderField("height", Number(e.target.value))}
              />
            </label>
            <label>
              <span>Width (ft)</span>
              <input
                type="number"
                value={order.width || 1}
                min={1}
                onChange={e => updateOrderField("width", Number(e.target.value))}
              />
            </label>
            <label>
              <span>Measurement (sqft)</span>
              <input
                type="number"
                value={order.qty || 1}
                min={1}
                  onChange={e => updateOrderField("qty", Number(e.target.value))}
                style={{ background: "#f6f9fe", color: "#2253c9", fontWeight: 600 }}
              />
            </label>
          </div>

          {/* --- GST and Budget --- */}
          <div className={styles.row}>
            <label>
              <span>GST (%)</span>
              <select
                value={order.gst}
                onChange={e => handleField("gst", Number(e.target.value))}
              >
                {GST_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}%</option>
                ))}
              </select>
            </label>
            <label>
              <span>Budget</span>
              <input
                type="number"
                value={order.budget || ""}
                onChange={e => handleField("budget", e.target.value)}
              />
            </label>
          </div>

          {/* --- Dates --- */}
          <div className={styles.row}>
            <label>
              <span>Order Start</span>
              <input
                type="datetime-local"
                value={order.orderStartDateTime || ""}
                onChange={e => handleField("orderStartDateTime", e.target.value)}
              />
            </label>
            <label>
              <span>Order End</span>
              <input
                type="datetime-local"
                value={order.orderEndDateTime || ""}
                onChange={e => handleField("orderEndDateTime", e.target.value)}
              />
            </label>
          </div>

          {/* --- Calculations --- */}
          <div className={styles.calculationRow}>
            <div><strong>Unit Price: </strong>₹{unitPrice}</div>
            <div><strong>Total: </strong>₹{totalAmount}</div>
            <div><strong>Total (GST): </strong>₹{totalAmountWithGST.toFixed(2)}</div>
          </div>

          {/* --- Actions --- */}
          <div className={styles.submitRow}>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Helper: Calculate prices ---
function calculateOrderAmounts(order) {
  let unitPrice = 0;
  if (order.preSalesOrderSteps && order.preSalesOrderSteps.length) {
    order.preSalesOrderSteps.forEach(step => {
      const stepList =
        PRINT_PRICES.clientTypes?.[order.clientType]?.orderTypes?.[order.orderType]?.printTypes?.[order.printType]?.[step.stepName === "Printing" ? "Media" : step.stepName] || [];
      const found = stepList.find(opt => opt.name === step.stepValue);
      if (found) {
        if (typeof found.cost === "number") unitPrice += found.cost;
        else if (typeof found.costCMYK === "number") unitPrice += found.costCMYK;
      }
    });
  }
  const qty = Number(order.qty) || 1;
  const gst = Number(order.gst) || 0;
  const totalAmount = unitPrice * qty;
  const totalAmountWithGST = totalAmount + (totalAmount * gst) / 100;
  return { unitPrice, totalAmount, totalAmountWithGST };
}
