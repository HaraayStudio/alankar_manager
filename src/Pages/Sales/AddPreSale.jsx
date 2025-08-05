// // import React, { useState ,useEffect} from "react";
// // import styles from "./AddPreSalePopup.module.scss";
// // import axios from "axios";
// // import PRINT_PRICES from "../../printprices";
// // import { useData } from "../../context/DataContext";
// // // --- Constants ---
// // const CLIENT_TYPES = ["Cash", "Online", "Printers"];
// // const ORDER_STEPS = [
// //   { key: "Media", label: "Media", stepName: "Printing" },
// //   { key: "Lamination", label: "Lamination", stepName: "Lamination" },
// //   { key: "Mounting", label: "Mounting", stepName: "Mounting" },
// //   { key: "Framing", label: "Framing", stepName: "Framing" },
// //   { key: "Installation", label: "Installation", stepName: "Installation" }
// // ];
// // const GST_OPTIONS = [0, 5, 12, 18];

// // const initialClient = { id: "", name: "", company: "", email: "", phone: "" };
// // const initialPreSalesOrder = {
// //   clientType: "",
// //   orderType: "",
// //   printType: "",
// //   media: "",
// //   height:1,
// //   width:1,
// //   qty: 1,
// //   budget: "",
// //   totalAmount:"",
// //   totalAmountWithGST:"",
// //   unitPrice:"",

// //   gst: 0,
// //   orderStartDateTime: "",
// //   orderEndDateTime: "",
// //   preSalesOrderSteps: []
// // };
// // const initialPreSales = {
// //   clientType: "",
// //   personName: "",
// //   approachedVia: "",
// //   preSalesOrders: [{ ...initialPreSalesOrder }],
// //   status: "",
// //   conclusion: ""
// // };



// // export default function AddPreSale({ onClose }) {  const {
// //  clients
// //   } = useData();
// // // NEW: Keep calculated values always in order state

// //   const [existingClient, setExistingClient] = useState(true);
// //   const [client, setClient] = useState({ ...initialClient });
// //   const [preSales, setPreSales] = useState({ ...initialPreSales });
// //   const [submitting, setSubmitting] = useState(false);
// //   const [result, setResult] = useState(null);
// // const token = localStorage.getItem('token');
// //   // Update main presale field
// //   function updatePreSalesField(key, value) {
// //     setPreSales(ps => ({ ...ps, [key]: value }));
// //   }

// //   // Update order field (by index)
// //   function updateOrderField(idx, key, val) {
// //     setPreSales(prev => {
// //       const orders = [...prev.preSalesOrders];
// //       orders[idx] = { ...orders[idx], [key]: val };
// //       return { ...prev, preSalesOrders: orders };
// //     });
// //   }
// //   function updateOrderSteps(idx, steps) {
// //     setPreSales(prev => {
// //       const orders = [...prev.preSalesOrders];
// //       orders[idx].preSalesOrderSteps = steps;
// //       return { ...prev, preSalesOrders: orders };
// //     });
// //   }
// //   function handleAddOrder() {
// //     setPreSales(ps => ({
// //       ...ps,
// //       preSalesOrders: [...ps.preSalesOrders, { ...initialPreSalesOrder, preSalesOrderSteps: [] }]
// //     }));
// //   }
// //   function handleRemoveOrder(idx) {
// //     setPreSales(ps => {
// //       const arr = ps.preSalesOrders.slice();
// //       arr.splice(idx, 1);
// //       return { ...ps, preSalesOrders: arr.length ? arr : [{ ...initialPreSalesOrder, preSalesOrderSteps: [] }] };
// //     });
// //   }

// //   // ----------- FORM SUBMIT -----------
// //   async function handleSubmit(e) {
// //     e.preventDefault();
// //     setSubmitting(true);
// //     setResult(null);

// //     // Calculate order prices before send (to match your structure)
// //     const ordersToSend = preSales.preSalesOrders.map(order => {
// //       const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts(order);
// //       return {
// //         ...order,
// //         unitPrice,
// //         totalAmount,
// //         totalAmountWithGST,
// //         media: order.media || (order.preSalesOrderSteps.find(s => s.orderStepName === "Printing")?.measurement || ""),
// //         preSalesOrderSteps: order.preSalesOrderSteps.map((s, i) => ({
// //           ...s,
// //           stepNumber: i + 1
// //         }))
// //       };
// //     });

// //     const requestBody = {
// //       ...preSales,
// //       client: existingClient ? { id: client.id } : { ...client },
// //       preSalesOrders: ordersToSend
// //     };
// //     try {
// //       const res = await axios.post(
// //         `http://localhost:8080/api/presales/createpresales?existingClient=${existingClient}`,
// //         requestBody,
// //         {
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`,    }
// //         }
// //       );
// //       alert("SucessFully Added Presale")
// //       setResult({ success: true, data: res.data });

// //     } catch (err) {
// //       setResult({
// //         success: false,
// //         message: err?.response?.data?.message || "Error",
// //       });
// //     }
// //     setSubmitting(false);
// //     window.location.reload();

// //   }
// // useEffect(() => {
// //   if (
// //     order.unitPrice !== unitPrice ||
// //     order.totalAmount !== totalAmount ||
// //     order.totalAmountWithGST !== totalAmountWithGST
// //   ) {
// //     updateOrderField("unitPrice", unitPrice);
// //     updateOrderField("totalAmount", totalAmount);
// //     updateOrderField("totalAmountWithGST", totalAmountWithGST);
// //   }
// //   // eslint-disable-next-line
// // }, [unitPrice, totalAmount, totalAmountWithGST]);

// //   return (
// //     <div className={styles.popupOverlay}>
// //       <div className={styles.popupBox}>
// //         <button className={styles.closeBtn} onClick={onClose} title="Close">&times;</button>
// //         <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
// //           <h2 className={styles.heading}>Add Pre-Sale Entry</h2>
// //           <p className={styles.subHeading}>Fill in all required fields to register a new pre-sale.</p>
// //           {/* --- Client Type Toggle --- */}
// //           <div className={styles.clientTypeToggle}>
// //             <span>Client Type:</span>
// //             <label className={existingClient ? styles.selected : ""}>
// //               <input
// //                 type="radio"
// //                 checked={existingClient}
// //                 onChange={() => setExistingClient(true)}
// //               /> Existing Client
// //             </label>
// //             <label className={!existingClient ? styles.selected : ""}>
// //               <input
// //                 type="radio"
// //                 checked={!existingClient}
// //                 onChange={() => setExistingClient(false)}
// //               /> New Client
// //             </label>
// //           </div>
// //           <div className={styles.divider} />
// //           {/* --- Client Fields --- */}
// //           <div className={styles.section}>
// //             <h3 className={styles.sectionTitle}>Client Information</h3>
// //             {existingClient ? (
// //               <div className={styles.row}>
// //                 {/* <label>
// //                   <span>Client ID <span className={styles.required}>*</span></span>
// //                   <input
// //                     type="text"
// //                     name="id"
// //                     value={client.id}
// //                     onChange={e => setClient(c => ({ ...c, id: e.target.value }))}
// //                     required
// //                     placeholder="Enter Client ID"
// //                   />
// //                 </label> */}
// //                 <label>
// //   <span>
// //     Client <span className={styles.required}>*</span>
// //   </span>
// //   <select
// //     name="id"
// //     value={client.id || ""}
// //     onChange={e => setClient(c => ({ ...c, id: e.target.value }))}
// //     required
// //     className={styles.dropdown}
// //   >
// //     <option value="">Select client</option>
// //     {clients.map(c => (
// //     <option key={c.id} value={c.id}>
// //   {c.name} ({c.email})
// // </option>

// //     ))}
// //   </select>
// // </label>

// //               </div>
// //             ) : (
// //               <>
// //                 <div className={styles.row}>
// //                   <label>
// //                     <span>Full Name <span className={styles.required}>*</span></span>
// //                     <input
// //                       type="text"
// //                       name="name"
// //                       value={client.name}
// //                       onChange={e => setClient(c => ({ ...c, name: e.target.value }))}
// //                       required
// //                       placeholder="Client Name"
// //                     />
// //                   </label>
// //                   <label>
// //                     <span>Company</span>
// //                     <input
// //                       type="text"
// //                       name="company"
// //                       value={client.company}
// //                       onChange={e => setClient(c => ({ ...c, company: e.target.value }))}
// //                       placeholder="Company Name"
// //                     />
// //                   </label>
// //                 </div>
// //                 <div className={styles.row}>
// //                   <label>
// //                     <span>Email</span>
// //                     <input
// //                       type="email"
// //                       name="email"
// //                       value={client.email}
// //                       onChange={e => setClient(c => ({ ...c, email: e.target.value }))}
// //                       placeholder="Email"
// //                     />
// //                   </label>
// //                   <label>
// //                     <span>Phone</span>
// //                     <input
// //                       type="text"
// //                       name="phone"
// //                       value={client.phone}
// //                       onChange={e => setClient(c => ({ ...c, phone: e.target.value }))}
// //                       placeholder="Phone Number"
// //                     />
// //                   </label>
// //                 </div>
// //               </>
// //             )}
// //           </div>
// //           <div className={styles.divider} />
// //           {/* --- PreSales Root Fields --- */}
// //           <div className={styles.section}>
// //             <h3 className={styles.sectionTitle}>Pre-Sale Details</h3>
// //             <div className={styles.row}>
// //               {/* <label>
// //                 <span>Client Type</span>
// //                 <select
// //                   value={preSales.clientType}
// //                   onChange={e => updatePreSalesField("clientType", e.target.value)}
// //                   required
// //                 >
// //                   <option value="">Select</option>
// //                   {CLIENT_TYPES.map(ct => <option key={ct} value={ct}>{ct}</option>)}
// //                 </select>
// //               </label> */}
// //               <label>
// //                 <span>Contact Person</span>
// //                 <input
// //                   type="text"
// //                   name="personName"
// //                   value={preSales.personName}
// //                   onChange={e => updatePreSalesField("personName", e.target.value)}
// //                   placeholder="Contact Person"
// //                 />
// //               </label>
// //            <label>
// //   <span>Approached Via</span>
// //   <select
// //     name="approachedVia"
// //     value={preSales.approachedVia}
// //     onChange={e => updatePreSalesField("approachedVia", e.target.value)}
// //   >
// //     <option value="">Select</option>
// //     <option value="WhatsApp">WhatsApp</option>
// //     <option value="Email">Email</option>
// //     <option value="Phone">Phone</option>
// //   </select>
// // </label>

// //             </div>
// //             {/* <div className={styles.row}>
// //               <label>
// //                 <span>Status</span>
// //                 <input
// //                   type="text"
// //                   name="status"
// //                   value={preSales.status}
// //                   onChange={e => updatePreSalesField("status", e.target.value)}
// //                   placeholder="Onboarded / Not Onboarded"
// //                 />
// //               </label>
// //               <label>
// //                 <span>Conclusion</span>
// //                 <input
// //                   type="text"
// //                   name="conclusion"
// //                   value={preSales.conclusion}
// //                   onChange={e => updatePreSalesField("conclusion", e.target.value)}
// //                   placeholder="Conclusion/Reason"
// //                 />
// //               </label>
// //             </div> */}
// //           </div>
// //           <div className={styles.divider} />
// //           {/* --- PreSales Orders (advanced form per order) --- */}
// //           <div className={styles.section}>
// //             <h3 className={styles.sectionTitle}>Orders</h3>
// //             {preSales.preSalesOrders.map((order, idx) => (
// //               <OrderConfigurator
// //                 key={idx}
// //                 index={idx}
// //                 parentClientType={preSales.clientType}
// //                 order={order}
// //                 updateOrderField={(key, val) => updateOrderField(idx, key, val)}
// //                 updateOrderSteps={steps => updateOrderSteps(idx, steps)}
// //                 onRemoveOrder={() => handleRemoveOrder(idx)}
// //                 disableRemove={preSales.preSalesOrders.length === 1}
// //               />
// //             ))}
// //             <button type="button" className={styles.addBtn} onClick={handleAddOrder}>+ Add Order</button>
// //           </div>
// //           {/* --- Submit Row --- */}
// //           <div className={styles.submitRow}>
// //             <button type="submit" className={styles.submitBtn} disabled={submitting}>
// //               {submitting ? "Submitting..." : "Submit"}
// //             </button>
// //             {result && (
// //               <span className={result.success ? styles.successMsg : styles.errorMsg}>
// //                 {result.success ? "Saved Successfully!" : result.message}
// //               </span>
// //             )}
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // // --------------- ORDER CONFIGURATOR COMPONENT -----------------
// // function OrderConfigurator({
// //   index, parentClientType, order, updateOrderField, updateOrderSteps, onRemoveOrder, disableRemove
// // }) {
// //   const [stepSelections, setStepSelections] = useState({});

// //   // --- Options ---
// //   const clientType = order.clientType || parentClientType || "";
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
// //     updateOrderField("clientType", val);
// //     updateOrderField("orderType", "");
// //     updateOrderField("printType", "");
// //     setStepSelections({});
// //     updateOrderSteps([]);
// //   }
// //   function handleOrderType(val) {
// //     updateOrderField("orderType", val);
// //     updateOrderField("printType", "");
// //     setStepSelections({});
// //     updateOrderSteps([]);
// //   }
// //   function handlePrintType(val) {
// //     updateOrderField("printType", val);
// //     setStepSelections({});
// //     updateOrderSteps([]);
// //   }
// //   function handleStepSelect(group, value) {
// //     const next = { ...stepSelections, [group]: value };
// //     setStepSelections(next);
// //     // Build preSalesOrderSteps array
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
// //     updateOrderSteps(steps);
// //     // Also update media field for main order
// //     if (group === "Media") updateOrderField("media", value);
// //   }

// //   // --- Calculations for this order ---
// //   const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts({
// //     ...order,
// //     preSalesOrderSteps: order.preSalesOrderSteps.length
// //       ? order.preSalesOrderSteps
// //       : ORDER_STEPS.map((step, idx) =>
// //           stepSelections[step.key]
// //             ? {
// //                 stepNumber: idx + 1,
// //                 stepName: step.stepName,
// //                 stepValue: stepSelections[step.key],
// //                 status: "CREATED"
// //               }
// //             : null
// //         ).filter(Boolean)
// //   });

// //   // --- UI ---
// //   return (
// //     <div className={styles.orderCard}>
// //       <div className={styles.row}>
// //         <label>
// //           <span>Client Type</span>
// //           <div className={styles.optionsWrap}>
// //             {CLIENT_TYPES.map(ct => (
// //               <button
// //                 type="button"
// //                 key={ct}
// //                 className={`${styles.optionChip} ${clientType === ct ? styles.selected : ""}`}
// //                 onClick={() => handleClientType(ct)}   onChange={e => updatePreSalesField("clientType", e.target.value)}
// //                   required
// //               >{ct}</button>
// //             ))}
// //           </div>
// //         </label>
// //         <label>
// //           <span>Order Type</span>
// //           <select
// //             value={order.orderType}
// //             onChange={e => handleOrderType(e.target.value)}
// //             required
// //           >
// //             <option value="">Select Order Type</option>
// //             {clientType &&
// //               Object.keys(clientTypesObj[clientType]?.orderTypes || {}).map(ot => (
// //                 <option key={ot} value={ot}>{ot}</option>
// //               ))}
// //           </select>
// //         </label>
// //         <label>
// //           <span>Print Type</span>
// //           <div className={styles.optionsWrap}>
// //             {order.orderType &&
// //               Object.keys(printTypesObj).map(pt => (
// //                 <button
// //                   key={pt}
// //                   type="button"
// //                   className={`${styles.optionChip} ${order.printType === pt ? styles.selected : ""}`}
// //                   onClick={() => handlePrintType(pt)}
// //                 >{pt}</button>
// //               ))}
// //           </div>
// //         </label>
// //       </div>
// //       {/* ---- Step Options ---- */}
// //       {order.printType && (
// //         <div className={styles.optionsSection}>
// //           {ORDER_STEPS.map(step => (
// //             <div key={step.key} className={styles.optionGroup}>
// //               <div className={styles.groupTitle}>{step.label}</div>
// //               <div className={styles.optionsWrap}>
// //                 {(stepOptionLists[step.key] || []).map(opt => (
// //                   <button
// //                     key={opt.name}
// //                     type="button"
// //                     className={`${styles.optionChip} ${stepSelections[step.key] === opt.name ? styles.selected : ""}`}
// //                     onClick={() => handleStepSelect(
// //                       step.key,
// //                       stepSelections[step.key] === opt.name ? "" : opt.name
// //                     )}
// //                   >
// //                     {opt.name}
// //                     {typeof opt.cost === "number"
// //                       ? ` (${opt.cost})`
// //                       : typeof opt.costCMYK === "number"
// //                       ? ` (${opt.costCMYK})`
// //                       : ""}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //          <div className={styles.row}>
// //         <label>
// //           <span>Height</span>
// //           <input
// //             type="number"
// //             value={order.height || 1}
// //             min={1}
// //             onChange={e => updateOrderField("height", Number(e.target.value))}
// //           />
// //         </label>  <label>
// //           <span>Width</span>
// //           <input
// //             type="number"
// //             value={order.width || 1}
// //             min={1}
// //             onChange={e => updateOrderField("width", Number(e.target.value))}
// //           />
// //         </label>
// //         </div>
// //       {/* ---- Qty, GST, Dates, Price fields ---- */}
// //       <div className={styles.row}>
// //         <label>
// //           <span>Qty</span>
// //           <input
// //             type="number"
// //             value={order.qty || 1}
// //             min={1}
// //             onChange={e => updateOrderField("qty", Number(e.target.value))}
// //           />
// //         </label>
// //         <label>
// //           <span>GST (%)</span>
// //           <select
// //             value={order.gst}
// //             onChange={e => updateOrderField("gst", Number(e.target.value))}
// //           >
// //             {GST_OPTIONS.map(opt => (
// //               <option key={opt} value={opt}>{opt}%</option>
// //             ))}
// //           </select>
// //         </label>
// //         <label>
// //           <span>Budget</span>
// //           <input
// //             type="number"
// //             value={order.budget || ""}
// //             onChange={e => updateOrderField("budget", e.target.value)}
// //           />
// //         </label>
// //       </div>
// //       <div className={styles.row}>
// //         <label>
// //           <span>Order Start</span>
// //           <input
// //             type="datetime-local"
// //             value={order.orderStartDateTime || ""}
// //             onChange={e => updateOrderField("orderStartDateTime", e.target.value)}
// //           />
// //         </label>
// //         <label>
// //           <span>Order End</span>
// //           <input
// //             type="datetime-local"
// //             value={order.orderEndDateTime || ""}
// //             onChange={e => updateOrderField("orderEndDateTime", e.target.value)}
// //           />
// //         </label>
// //       </div>
// //       {/* --- Calculation summary --- */}
// //       <div className={styles.calculationRow}>
// //         <div><strong>Unit Price: </strong>₹{unitPrice}</div>
// //         <div><strong>Total: </strong>₹{totalAmount}</div>
// //         <div><strong>Total (GST): </strong>₹{totalAmountWithGST.toFixed(2)}</div>
// //       </div>
// //       <button
// //         type="button"
// //         className={styles.removeBtn}
// //         onClick={onRemoveOrder}
// //         disabled={disableRemove}
// //       >
// //         Remove Order
// //       </button>
// //     </div>
// //   );
// // }

// // // --- Helper: Calculate prices ---
// // function calculateOrderAmounts(order) {
// //   let unitPrice = 0;
// //   if (order.preSalesOrderSteps && order.preSalesOrderSteps.length) {
// //     order.preSalesOrderSteps.forEach(step => {
// //       const stepList = PRINT_PRICES.clientTypes?.[order.clientType]?.orderTypes?.[order.orderType]?.printTypes?.[order.printType]?.[step.stepName === "Printing" ? "Media" : step.stepName] || [];
// //       const found = stepList.find(opt =>
// //         opt.name === step.stepValue
// //       );
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
// // import React, { useState ,useEffect} from "react";
// // import styles from "./AddPreSalePopup.module.scss";
// // import axios from "axios";
// // import PRINT_PRICES from "../../printprices";
// // import { useData } from "../../context/DataContext";

// // // --- Constants ---
// // const CLIENT_TYPES = ["Cash", "Online", "Printers"];
// // const ORDER_STEPS = [
// //   { key: "Media", label: "Media", stepName: "Printing" },
// //   { key: "Lamination", label: "Lamination", stepName: "Lamination" },
// //   { key: "Mounting", label: "Mounting", stepName: "Mounting" },
// //   { key: "Framing", label: "Framing", stepName: "Framing" },
// //   { key: "Installation", label: "Installation", stepName: "Installation" }
// // ];
// // const GST_OPTIONS = [0, 5, 12, 18];

// // const initialClient = { id: "", name: "", company: "", email: "", phone: "" };
// // const initialPreSalesOrder = {
// //   clientType: "",
// //   orderType: "",
// //   printType: "",
// //   media: "",
// //   height: 1,
// //   width: 1,
// //   qty: 1,
// //   budget: "",
// //   totalAmount: "",
// //   totalAmountWithGST: "",
// //   unitPrice: "",
// //   gst: 0,
// //   orderStartDateTime: "",
// //   orderEndDateTime: "",
// //   preSalesOrderSteps: []
// // };
// // const initialPreSales = {
// //   clientType: "",
// //   personName: "",
// //   approachedVia: "",
// //   preSalesOrders: [{ ...initialPreSalesOrder }],
// //   status: "",
// //   conclusion: ""
// // };

// // // --- MAIN COMPONENT ---
// // export default function AddPreSale({ onClose }) {
// //   const { clients } = useData();
// //   const [existingClient, setExistingClient] = useState(true);
// //   const [client, setClient] = useState({ ...initialClient });
// //   const [preSales, setPreSales] = useState({ ...initialPreSales });
// //   const [submitting, setSubmitting] = useState(false);
// //   const [result, setResult] = useState(null);
// //   const token = localStorage.getItem("token");

// //   function updatePreSalesField(key, value) {
// //     setPreSales((ps) => ({ ...ps, [key]: value }));
// //   }

// //   function updateOrderField(idx, key, val) {
// //     setPreSales((prev) => {
// //       const orders = [...prev.preSalesOrders];
// //       orders[idx] = { ...orders[idx], [key]: val };
// //       return { ...prev, preSalesOrders: orders };
// //     });
// //   }

// //   function updateOrderSteps(idx, steps) {
// //     setPreSales((prev) => {
// //       const orders = [...prev.preSalesOrders];
// //       orders[idx].preSalesOrderSteps = steps;
// //       return { ...prev, preSalesOrders: orders };
// //     });
// //   }

// //   function handleAddOrder() {
// //     setPreSales((ps) => ({
// //       ...ps,
// //       preSalesOrders: [
// //         ...ps.preSalesOrders,
// //         { ...initialPreSalesOrder, preSalesOrderSteps: [] }
// //       ]
// //     }));
// //   }
// // function handleAddOrder() {
// //   setPreSales((ps) => ({
// //     ...ps,
// //     preSalesOrders: [
// //       ...ps.preSalesOrders,
// //       { ...initialPreSalesOrder, preSalesOrderSteps: [], clientType: ps.clientType }
// //     ]
// //   }));
// // }

// //   function handleRemoveOrder(idx) {
// //     setPreSales((ps) => {
// //       const arr = ps.preSalesOrders.slice();
// //       arr.splice(idx, 1);
// //       return {
// //         ...ps,
// //         preSalesOrders: arr.length
// //           ? arr
// //           : [{ ...initialPreSalesOrder, preSalesOrderSteps: [] }]
// //       };
// //     });
// //   }

// //   // ----------- FORM SUBMIT -----------
// //   async function handleSubmit(e) {
// //     e.preventDefault();
// //     setSubmitting(true);
// //     setResult(null);

// //     // Calculate order prices before send (to match your structure)
// //     const ordersToSend = preSales.preSalesOrders.map((order) => {
// //       const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts(order);
// //       return {
// //         ...order,
// //         unitPrice,
// //         totalAmount,
// //         totalAmountWithGST,
// //         media:
// //           order.media ||
// //           (order.preSalesOrderSteps.find((s) => s.orderStepName === "Printing")?.measurement || ""),
// //         preSalesOrderSteps: order.preSalesOrderSteps.map((s, i) => ({
// //           ...s,
// //           stepNumber: i + 1
// //         }))
// //       };
// //     });

// //     const requestBody = {
// //       ...preSales,
// //       client: existingClient ? { id: client.id } : { ...client },
// //       preSalesOrders: ordersToSend
// //     };
// // console.log(requestBody)
// //     try {
// //       const res = await axios.post(
// //         `http://localhost:8080/api/presales/createpresales?existingClient=${existingClient}`,
// //         requestBody,
// //         {
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`
// //           }
// //         }
// //       );
// //       alert("Successfully Added Presale");
// //       setResult({ success: true, data: res.data });
// //     } catch (err) {
// //       setResult({
// //         success: false,
// //         message: err?.response?.data?.message || "Error"
// //       });
// //     }
// //     setSubmitting(false);
// //     window.location.reload();
// //   }

// //   return (
// //     <div className={styles.popupOverlay}>
// //       <div className={styles.popupBox}>
// //         <button className={styles.closeBtn} onClick={onClose} title="Close">
// //           &times;
// //         </button>
// //         <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
// //           <h2 className={styles.heading}>Add Pre-Sale Entry</h2>
// //           <p className={styles.subHeading}>
// //             Fill in all required fields to register a new pre-sale.
// //           </p>
// //           {/* --- Client Type Toggle --- */}
// //           <div className={styles.clientTypeToggle}>
// //             <span>Client Type:</span>
// //             <label className={existingClient ? styles.selected : ""}>
// //               <input
// //                 type="radio"
// //                 checked={existingClient}
// //                 onChange={() => setExistingClient(true)}
// //               />{" "}
// //               Existing Client
// //             </label>
// //             <label className={!existingClient ? styles.selected : ""}>
// //               <input
// //                 type="radio"
// //                 checked={!existingClient}
// //                 onChange={() => setExistingClient(false)}
// //               />{" "}
// //               New Client
// //             </label>
// //           </div>
// //           <div className={styles.divider} />
// //           {/* --- Client Fields --- */}
// //           <div className={styles.section}>
// //             <h3 className={styles.sectionTitle}>Client Information</h3>
// //             {existingClient ? (
// //               <div className={styles.row}>
// //                 <label>
// //                   <span>
// //                     Client <span className={styles.required}>*</span>
// //                   </span>
// //                   <select
// //                     name="id"
// //                     value={client.id || ""}
// //                     onChange={(e) => setClient((c) => ({ ...c, id: e.target.value }))}
// //                     required
// //                     className={styles.dropdown}
// //                   >
// //                     <option value="">Select client</option>
// //                     {clients.map((c) => (
// //                       <option key={c.id} value={c.id}>
// //                         {c.name} ({c.email})
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </label>
// //               </div>
// //             ) : (
// //               <>
// //                 <div className={styles.row}>
// //                   <label>
// //                     <span>
// //                       Full Name <span className={styles.required}>*</span>
// //                     </span>
// //                     <input
// //                       type="text"
// //                       name="name"
// //                       value={client.name}
// //                       onChange={(e) => setClient((c) => ({ ...c, name: e.target.value }))}
// //                       required
// //                       placeholder="Client Name"
// //                     />
// //                   </label>
// //                   <label>
// //                     <span>Company</span>
// //                     <input
// //                       type="text"
// //                       name="company"
// //                       value={client.company}
// //                       onChange={(e) => setClient((c) => ({ ...c, company: e.target.value }))}
// //                       placeholder="Company Name"
// //                     />
// //                   </label>
// //                 </div>
// //                 <div className={styles.row}>
// //                   <label>
// //                     <span>Email</span>
// //                     <input
// //                       type="email"
// //                       name="email"
// //                       value={client.email}
// //                       onChange={(e) => setClient((c) => ({ ...c, email: e.target.value }))}
// //                       placeholder="Email"
// //                     />
// //                   </label>
// //                   <label>
// //                     <span>Phone</span>
// //                     <input
// //                       type="text"
// //                       name="phone"
// //                       value={client.phone}
// //                       onChange={(e) => setClient((c) => ({ ...c, phone: e.target.value }))}
// //                       placeholder="Phone Number"
// //                     />
// //                   </label>
// //                 </div>
// //               </>
// //             )}
// //           </div>
// //           <div className={styles.divider} />
// //           {/* --- PreSales Root Fields --- */}
// //           <div className={styles.section}>
// //             <h3 className={styles.sectionTitle}>Pre-Sale Details</h3>
// //             <div className={styles.row}>
// //               <label>
// //                 <span>Contact Person</span>
// //                 <input
// //                   type="text"
// //                   name="personName"
// //                   value={preSales.personName}
// //                   onChange={(e) => updatePreSalesField("personName", e.target.value)}
// //                   placeholder="Contact Person"
// //                 />
// //               </label>
// //               <label>
// //                 <span>Approached Via</span>
// //                 <select
// //                   name="approachedVia"
// //                   value={preSales.approachedVia}
// //                   onChange={(e) => updatePreSalesField("approachedVia", e.target.value)}
// //                 >
// //                   <option value="">Select</option>
// //                   <option value="WhatsApp">WhatsApp</option>
// //                   <option value="Email">Email</option>
// //                   <option value="Phone">Phone</option>
// //                 </select>
// //               </label>
// //             </div>
// //           </div>
// //           <div className={styles.divider} />
// //           {/* --- PreSales Orders --- */}
// //           <div className={styles.section}>
// //             <h3 className={styles.sectionTitle}>Orders</h3>
// //             {preSales.preSalesOrders.map((order, idx) => (
// //               <OrderConfigurator
// //                 key={idx}
// //                 index={idx}
// //                 parentClientType={preSales.clientType}
// //                 order={order}
// //                 updateOrderField={(key, val) => updateOrderField(idx, key, val)}
// //                 updateOrderSteps={(steps) => updateOrderSteps(idx, steps)}
// //                 onRemoveOrder={() => handleRemoveOrder(idx)}
// //                 disableRemove={preSales.preSalesOrders.length === 1}
// //               />
// //             ))}
// //             <button
// //               type="button"
// //               className={styles.addBtn}
// //               onClick={handleAddOrder}
// //             >
// //               + Add Order
// //             </button>
// //           </div>
// //           {/* --- Submit Row --- */}
// //           <div className={styles.submitRow}>
// //             <button type="submit" className={styles.submitBtn} disabled={submitting}>
// //               {submitting ? "Submitting..." : "Submit"}
// //             </button>
// //             {result && (
// //               <span className={result.success ? styles.successMsg : styles.errorMsg}>
// //                 {result.success ? "Saved Successfully!" : result.message}
// //               </span>
// //             )}
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // // -------- ORDER CONFIGURATOR COMPONENT --------
// // function OrderConfigurator({
// //   index,
// //   parentClientType,
// //   order,
// //   updateOrderField,
// //   updateOrderSteps,
// //   onRemoveOrder,
// //   disableRemove
// // }) {
// //   const [stepSelections, setStepSelections] = useState({});

// //   // --- Options ---
// //   const clientType = order.clientType || parentClientType || "";
// //   const clientTypesObj = PRINT_PRICES.clientTypes;
// //   const orderTypesObj = clientType ? clientTypesObj[clientType]?.orderTypes || {} : {};
// //   const printTypesObj = order.orderType ? orderTypesObj[order.orderType]?.printTypes || {} : {};
// //   const stepOptionLists = order.printType
// //     ? Object.entries(printTypesObj[order.printType] || {})
// //         .filter(([group]) => ORDER_STEPS.some((s) => s.key === group))
// //         .reduce((acc, [group, opts]) => {
// //           acc[group] = opts;
// //           return acc;
// //         }, {})
// //     : {};

// //   // --- Step Selections logic ---
// //   function handleClientType(val) {
// //     updateOrderField("clientType", val);
// //     updateOrderField("orderType", "");
// //     updateOrderField("printType", "");
// //     setStepSelections({});
// //     updateOrderSteps([]);
// //   }
// //   function handleOrderType(val) {
// //     updateOrderField("orderType", val);
// //     updateOrderField("printType", "");
// //     setStepSelections({});
// //     updateOrderSteps([]);
// //   }
// //   function handlePrintType(val) {
// //     updateOrderField("printType", val);
// //     setStepSelections({});
// //     updateOrderSteps([]);
// //   }
// //   function handleStepSelect(group, value) {
// //     const next = { ...stepSelections, [group]: value };
// //     setStepSelections(next);
// //     // Build preSalesOrderSteps array
// //     const steps = ORDER_STEPS.map((step, idx) =>
// //       next[step.key]
// //         ? {
// //             stepNumber: idx + 1,
// //             stepName: step.stepName,
// //             stepValue: next[step.key],
// //             status: "CREATED"
// //           }
// //         : null
// //     ).filter(Boolean);
// //     updateOrderSteps(steps);
// //     if (group === "Media") updateOrderField("media", value);
// //   }

// //   // --- Calculations for this order ---
// //   const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts({
// //     ...order,
// //     preSalesOrderSteps: order.preSalesOrderSteps.length
// //       ? order.preSalesOrderSteps
// //       : ORDER_STEPS.map((step, idx) =>
// //           stepSelections[step.key]
// //             ? {
// //                 stepNumber: idx + 1,
// //                 stepName: step.stepName,
// //                 stepValue: stepSelections[step.key],
// //                 status: "CREATED"
// //               }
// //             : null
// //         ).filter(Boolean)
// //   });

// //   // --- Keep calculated values in sync with order ---
// //   useEffect(() => {
// //     if (
// //       order.unitPrice !== unitPrice ||
// //       order.totalAmount !== totalAmount ||
// //       order.totalAmountWithGST !== totalAmountWithGST
// //     ) {
// //       updateOrderField("unitPrice", unitPrice);
// //       updateOrderField("totalAmount", totalAmount);
// //       updateOrderField("totalAmountWithGST", totalAmountWithGST);
// //     }
// //     // eslint-disable-next-line
// //   }, [unitPrice, totalAmount, totalAmountWithGST]);

// //   // --- UI ---
// //   return (
// //     <div className={styles.orderCard}>
// //       <div className={styles.row}>
// //         {/* <label>
// //           <span>Client Type</span>
// //           <div className={styles.optionsWrap}>
// //             {CLIENT_TYPES.map((ct) => (
// //               <button
// //                 type="button"
// //                 key={ct}
// //                 className={`${styles.optionChip} ${clientType === ct ? styles.selected : ""}`}
// //                 onClick={() => handleClientType(ct)}

                
// //               >
// //                 {ct}
// //               </button>
// //             ))}
// //           </div>
// //         </label> */}
      
// // <div className={styles.clientTypeToggle}>
// //   <span>Client Type:</span>
// //   <div className={styles.optionsWrap}>
// //     {CLIENT_TYPES.map((ct) => (
// //       <button
// //         key={ct}
// //         type="button"
// //         // className={`${styles.optionChip} ${preSales.clientType === ct ? styles.selected : ""}`}
// //         onClick={() => updatePreSalesField("clientType", ct)}
// //       >
// //         {ct}
// //       </button>
// //     ))}
// //   </div>
// // </div>

// //         <label>
// //           <span>Order Type</span>
// //           <select value={order.orderType} onChange={(e) => handleOrderType(e.target.value)} required>
// //             <option value="">Select Order Type</option>
// //             {clientType &&
// //               Object.keys(clientTypesObj[clientType]?.orderTypes || {}).map((ot) => (
// //                 <option key={ot} value={ot}>
// //                   {ot}
// //                 </option>
// //               ))}
// //           </select>
// //         </label>
// //         <label>
// //           <span>Print Type</span>
// //           <div className={styles.optionsWrap}>
// //             {order.orderType &&
// //               Object.keys(printTypesObj).map((pt) => (
// //                 <button
// //                   key={pt}
// //                   type="button"
// //                   className={`${styles.optionChip} ${order.printType === pt ? styles.selected : ""}`}
// //                   onClick={() => handlePrintType(pt)}
// //                 >
// //                   {pt}
// //                 </button>
// //               ))}
// //           </div>
// //         </label>
// //       </div>
// //       {/* ---- Step Options ---- */}
// //       {order.printType && (
// //         <div className={styles.optionsSection}>
// //           {ORDER_STEPS.map((step) => (
// //             <div key={step.key} className={styles.optionGroup}>
// //               <div className={styles.groupTitle}>{step.label}</div>
// //               <div className={styles.optionsWrap}>
// //                 {(stepOptionLists[step.key] || []).map((opt) => (
// //                   <button
// //                     key={opt.name}
// //                     type="button"
// //                     className={`${styles.optionChip} ${
// //                       stepSelections[step.key] === opt.name ? styles.selected : ""
// //                     }`}
// //                     onClick={() =>
// //                       handleStepSelect(step.key, stepSelections[step.key] === opt.name ? "" : opt.name)
// //                     }
// //                   >
// //                     {opt.name}
// //                     {typeof opt.cost === "number"
// //                       ? ` (${opt.cost})`
// //                       : typeof opt.costCMYK === "number"
// //                       ? ` (${opt.costCMYK})`
// //                       : ""}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //       <div className={styles.row}>
// //         <label>
// //           <span>Height</span>
// //           <input
// //             type="number"
// //             value={order.height || 1}
// //             min={1}
// //             onChange={(e) => updateOrderField("height", Number(e.target.value))}
// //           />
// //         </label>
// //         <label>
// //           <span>Width</span>
// //           <input
// //             type="number"
// //             value={order.width || 1}
// //             min={1}
// //             onChange={(e) => updateOrderField("width", Number(e.target.value))}
// //           />
// //         </label>
// //       </div>
// //       <div className={styles.row}>
// //         <label>
// //           <span>Qty</span>
// //           <input
// //             type="number"
// //             value={order.qty || 1}
// //             min={1}
// //             onChange={(e) => updateOrderField("qty", Number(e.target.value))}
// //           />
// //         </label>
// //         <label>
// //           <span>GST (%)</span>
// //           <select value={order.gst} onChange={(e) => updateOrderField("gst", Number(e.target.value))}>
// //             {GST_OPTIONS.map((opt) => (
// //               <option key={opt} value={opt}>
// //                 {opt}%
// //               </option>
// //             ))}
// //           </select>
// //         </label>
// //         <label>
// //           <span>Budget</span>
// //           <input
// //             type="number"
// //             value={order.budget || ""}
// //             onChange={(e) => updateOrderField("budget", e.target.value)}
// //           />
// //         </label>
// //       </div>
// //       <div className={styles.row}>
// //         <label>
// //           <span>Order Start</span>
// //           <input
// //             type="datetime-local"
// //             value={order.orderStartDateTime || ""}
// //             onChange={(e) => updateOrderField("orderStartDateTime", e.target.value)}
// //           />
// //         </label>
// //         <label>
// //           <span>Order End</span>
// //           <input
// //             type="datetime-local"
// //             value={order.orderEndDateTime || ""}
// //             onChange={(e) => updateOrderField("orderEndDateTime", e.target.value)}
// //           />
// //         </label>
// //       </div>
// //       <div className={styles.calculationRow}>
// //         <div>
// //           <strong>Unit Price: </strong>₹{unitPrice}
// //         </div>
// //         <div>
// //           <strong>Total: </strong>₹{totalAmount}
// //         </div>
// //         <div>
// //           <strong>Total (GST): </strong>₹{totalAmountWithGST.toFixed(2)}
// //         </div>
// //       </div>
// //       <button
// //         type="button"
// //         className={styles.removeBtn}
// //         onClick={onRemoveOrder}
// //         disabled={disableRemove}
// //       >
// //         Remove Order
// //       </button>
// //     </div>
// //   );
// // }

// // // --- Helper: Calculate prices ---
// // function calculateOrderAmounts(order) {
// //   let unitPrice = 0;
// //   if (order.preSalesOrderSteps && order.preSalesOrderSteps.length) {
// //     order.preSalesOrderSteps.forEach((step) => {
// //       const stepList =
// //         PRINT_PRICES.clientTypes?.[order.clientType]?.orderTypes?.[order.orderType]?.printTypes?.[
// //           order.printType
// //         ]?.[step.stepName === "Printing" ? "Media" : step.stepName] || [];
// //       const found = stepList.find((opt) => opt.name === step.stepValue);
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
// import styles from "./AddPreSalePopup.module.scss";
// import axios from "axios";
// import PRINT_PRICES from "../../printprices";
// import { useData } from "../../context/DataContext";

// // --- Constants ---
// const CLIENT_TYPES = ["Cash", "Online", "Printers"];
// const ORDER_STEPS = [
//   { key: "Media", label: "Media", stepName: "Printing" },
//   { key: "Lamination", label: "Lamination", stepName: "Lamination" },
//   { key: "Mounting", label: "Mounting", stepName: "Mounting" },
//   { key: "Framing", label: "Framing", stepName: "Framing" },
//   { key: "Installation", label: "Installation", stepName: "Installation" }
// ];
// const GST_OPTIONS = [0, 5, 12, 18];

// const initialClient = { id: "", name: "", company: "", email: "", phone: "" };
// const initialPreSalesOrder = {
//   clientType: "",
//   orderType: "",
//   printType: "",
//   media: "",
//   height: 1,
//   width: 1,
//   qty: 1,
//   budget: "",
//   totalAmount: "",
//   totalAmountWithGST: "",
//   unitPrice: "",
//   gst: 0,
//   orderStartDateTime: "",
//   orderEndDateTime: "",
//   preSalesOrderSteps: []
// };
// const initialPreSales = {
//   clientType: "",
//   personName: "",
//   approachedVia: "",
//   preSalesOrders: [{ ...initialPreSalesOrder }],
//   status: "",
//   conclusion: ""
// };

// // --- MAIN COMPONENT ---
// export default function AddPreSale({ onClose }) {
//   const { clients } = useData();
//   const [existingClient, setExistingClient] = useState(true);
//   const [client, setClient] = useState({ ...initialClient });
//   const [preSales, setPreSales] = useState({ ...initialPreSales });
//   const [submitting, setSubmitting] = useState(false);
//   const [result, setResult] = useState(null);
//   const token = localStorage.getItem("token");

//   // --- Helpers ---
//  function updatePreSalesField(key, value) {
//   setPreSales((ps) => {
//     // If changing clientType, update all orders too
//     if (key === "clientType") {
//       const updatedOrders = ps.preSalesOrders.map(order => ({
//         ...order,
//         clientType: value
//       }));
//       return { ...ps, clientType: value, preSalesOrders: updatedOrders };
//     }
//     return { ...ps, [key]: value };
//   });
// }


//   function updateOrderField(idx, key, val) {
//     setPreSales((prev) => {
//       const orders = [...prev.preSalesOrders];
//       orders[idx] = { ...orders[idx], [key]: val };
//       return { ...prev, preSalesOrders: orders };
//     });
//   }

//   function updateOrderSteps(idx, steps) {
//     setPreSales((prev) => {
//       const orders = [...prev.preSalesOrders];
//       orders[idx].preSalesOrderSteps = steps;
//       return { ...prev, preSalesOrders: orders };
//     });
//   }

// function handleAddOrder() {
//   setPreSales((ps) => ({
//     ...ps,
//     preSalesOrders: [
//       ...ps.preSalesOrders,
//       { ...initialPreSalesOrder, preSalesOrderSteps: [], clientType: ps.clientType }
//     ]
//   }));
// }


//   function handleRemoveOrder(idx) {
//   setPreSales((ps) => {
//     const arr = ps.preSalesOrders.slice();
//     arr.splice(idx, 1);
//     return {
//       ...ps,
//       preSalesOrders: arr.length
//         ? arr
//         : [{ ...initialPreSalesOrder, preSalesOrderSteps: [], clientType: ps.clientType }]
//     };
//   });
// }


//   // ----------- FORM SUBMIT -----------
//  async function handleSubmit(e) {
//   e.preventDefault();
//   setSubmitting(true);
//   setResult(null);

//   const ordersToSend = preSales.preSalesOrders.map((order) => {
//     // This makes sure ALL order fields (including height, width, etc) are passed along!
//     const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts(order);
//     return {
//       ...order, // all fields: height, width, etc
//       unitPrice,
//       totalAmount,
//       totalAmountWithGST,
//       media:
//         order.media ||
//         (order.preSalesOrderSteps.find((s) => s.orderStepName === "Printing")?.measurement || ""),
//       preSalesOrderSteps: order.preSalesOrderSteps.map((s, i) => ({
//         ...s,
//         stepNumber: i + 1
//       }))
//     };
//   });

//   const requestBody = {
//     ...preSales,
//     client: existingClient ? { id: client.id } : { ...client },
//     preSalesOrders: ordersToSend
//   };
// console.log(requestBody)
//   try {
//     const res = await axios.post(
//       `http://localhost:8080/api/presales/createpresales?existingClient=${existingClient}`,
//       requestBody,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );
//     alert("Successfully Added Presale");
//     setResult({ success: true, data: res.data });
//   } catch (err) {
//     setResult({
//       success: false,
//       message: err?.response?.data?.message || "Error"
//     });
//   }
//   setSubmitting(false);
//   // window.location.reload();
// }


//   // --- UI ---
//   return (
//     <div className={styles.popupOverlay}>
//       <div className={styles.popupBox}>
//         <button className={styles.closeBtn} onClick={onClose} title="Close">
//           &times;
//         </button>
//         <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
//           <h2 className={styles.heading}>Add Pre-Sale Entry</h2>
//           <p className={styles.subHeading}>
//             Fill in all required fields to register a new pre-sale.
//           </p>
//           {/* --- Client Type Chip Selector at ROOT --- */}
         
//           {/* Existing/New Client Toggle */}
//           <div className={styles.toggleRow}>
//             <label className={existingClient ? styles.selected : ""}>
//               <input
//                 type="radio"
//                 checked={existingClient}
//                 onChange={() => setExistingClient(true)}
//               />
//               Existing Client
//             </label>
//             <label className={!existingClient ? styles.selected : ""}>
//               <input
//                 type="radio"
//                 checked={!existingClient}
//                 onChange={() => setExistingClient(false)}
//               />
//               New Client
//             </label>
//           </div>
//           <div className={styles.divider} />
//           {/* --- Client Fields --- */}
//           <div className={styles.section}>
//             <h3 className={styles.sectionTitle}>Client Information</h3>
//             {existingClient ? (
//               <div className={styles.row}>
//                 <label>
//                   <span>
//                     Client <span className={styles.required}>*</span>
//                   </span>
//                   <select
//                     name="id"
//                     value={client.id || ""}
//                     onChange={(e) => setClient((c) => ({ ...c, id: e.target.value }))}
//                     required
//                     className={styles.dropdown}
//                   >
//                     <option value="">Select client</option>
//                     {clients.map((c) => (
//                       <option key={c.id} value={c.id}>
//                         {c.name} ({c.email})
//                       </option>
//                     ))}
//                   </select>
//                 </label>
//               </div>
//             ) : (
//               <>
//                 <div className={styles.row}>
//                   <label>
//                     <span>
//                       Full Name <span className={styles.required}>*</span>
//                     </span>
//                     <input
//                       type="text"
//                       name="name"
//                       value={client.name}
//                       onChange={(e) => setClient((c) => ({ ...c, name: e.target.value }))}
//                       required
//                       placeholder="Client Name"
//                     />
//                   </label>
//                   <label>
//                     <span>Company</span>
//                     <input
//                       type="text"
//                       name="company"
//                       value={client.company}
//                       onChange={(e) => setClient((c) => ({ ...c, company: e.target.value }))}
//                       placeholder="Company Name"
//                     />
//                   </label>
//                 </div>
//                 <div className={styles.row}>
//                   <label>
//                     <span>Email</span>
//                     <input
//                       type="email"
//                       name="email"
//                       value={client.email}
//                       onChange={(e) => setClient((c) => ({ ...c, email: e.target.value }))}
//                       placeholder="Email"
//                     />
//                   </label>
//                   <label>
//                     <span>Phone</span>
//                     <input
//                       type="text"
//                       name="phone"
//                       value={client.phone}
//                       onChange={(e) => setClient((c) => ({ ...c, phone: e.target.value }))}
//                       placeholder="Phone Number"
//                     />
//                   </label>
//                 </div>
//               </>
//             )}
//           </div>
//           <div className={styles.divider} />
//           {/* --- PreSales Root Fields --- */}
//           <div className={styles.section}>
//             <h3 className={styles.sectionTitle}>Pre-Sale Details</h3>
//             <div className={styles.row}>
//               <label>
//                 <span>Contact Person</span>
//                 <input
//                   type="text"
//                   name="personName"
//                   value={preSales.personName}
//                   onChange={(e) => updatePreSalesField("personName", e.target.value)}
//                   placeholder="Contact Person"
//                 />
//               </label>
//               <label>
//                 <span>Approached Via</span>
//                 <select
//                   name="approachedVia"
//                   value={preSales.approachedVia}
//                   onChange={(e) => updatePreSalesField("approachedVia", e.target.value)}
//                 >
//                   <option value="">Select</option>
//                   <option value="WhatsApp">WhatsApp</option>
//                   <option value="Email">Email</option>
//                   <option value="Phone">Phone</option>
//                 </select>
//               </label>
//             </div>
//           </div>
//           <div className={styles.divider} />
//           {/* --- PreSales Orders --- */}
//           <div className={styles.section}>
//             <h3 className={styles.sectionTitle}>Orders</h3>
//             {preSales.preSalesOrders.map((order, idx) => (
//               <OrderConfigurator
//                 key={idx}
//                 index={idx}
//                 parentClientType={preSales.clientType}
//                 order={order}
//                 updateOrderField={(key, val) => updateOrderField(idx, key, val)}
//                 updateOrderSteps={(steps) => updateOrderSteps(idx, steps)}
//                 onRemoveOrder={() => handleRemoveOrder(idx)}
//                 disableRemove={preSales.preSalesOrders.length === 1}
//               />
//             ))}
//             <button
//               type="button"
//               className={styles.addBtn}
//               onClick={handleAddOrder}
//             >
//               + Add Order
//             </button>
//           </div>
//           {/* --- Submit Row --- */}
//           <div className={styles.submitRow}>
//             <button type="submit" className={styles.submitBtn} disabled={submitting}>
//               {submitting ? "Submitting..." : "Submit"}
//             </button>
//             {result && (
//               <span className={result.success ? styles.successMsg : styles.errorMsg}>
//                 {result.success ? "Saved Successfully!" : result.message}
//               </span>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // -------- ORDER CONFIGURATOR COMPONENT --------
// function OrderConfigurator({
//   index,
//   parentClientType,
//   order,
//   updateOrderField,
//   updateOrderSteps,
//   onRemoveOrder,
//   disableRemove
// }) {
//   const [stepSelections, setStepSelections] = useState({});
//   // --- Options ---
//   const clientType = order.clientType || parentClientType || "";
//   const clientTypesObj = PRINT_PRICES.clientTypes;
//   const orderTypesObj = clientType ? clientTypesObj[clientType]?.orderTypes || {} : {};
//   const printTypesObj = order.orderType ? orderTypesObj[order.orderType]?.printTypes || {} : {};
//   const stepOptionLists = order.printType
//     ? Object.entries(printTypesObj[order.printType] || {})
//         .filter(([group]) => ORDER_STEPS.some((s) => s.key === group))
//         .reduce((acc, [group, opts]) => {
//           acc[group] = opts;
//           return acc;
//         }, {})
//     : {};

//   // --- Step Selections logic ---
//   function handleClientType(val) {
//     updateOrderField("clientType", val);
//     updateOrderField("orderType", "");
//     updateOrderField("printType", "");
//     setStepSelections({});
//     updateOrderSteps([]);
//   }
//   function handleOrderType(val) {
//     updateOrderField("orderType", val);
//     updateOrderField("printType", "");
//     setStepSelections({});
//     updateOrderSteps([]);
//   }
//   function handlePrintType(val) {
//     updateOrderField("printType", val);
//     setStepSelections({});
//     updateOrderSteps([]);
//   }
//   function handleStepSelect(group, value) {
//     const next = { ...stepSelections, [group]: value };
//     setStepSelections(next);
//     // Build preSalesOrderSteps array
//     const steps = ORDER_STEPS.map((step, idx) =>
//       next[step.key]
//         ? {
//             stepNumber: idx + 1,
//             stepName: step.stepName,
//             stepValue: next[step.key],
//             status: "CREATED"
//           }
//         : null
//     ).filter(Boolean);
//     updateOrderSteps(steps);
//     if (group === "Media") updateOrderField("media", value);
//   }

//   // --- Calculations for this order ---
//   const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts({
//     ...order,
//     preSalesOrderSteps: order.preSalesOrderSteps.length
//       ? order.preSalesOrderSteps
//       : ORDER_STEPS.map((step, idx) =>
//           stepSelections[step.key]
//             ? {
//                 stepNumber: idx + 1,
//                 stepName: step.stepName,
//                 stepValue: stepSelections[step.key],
//                 status: "CREATED"
//               }
//             : null
//         ).filter(Boolean)
//   });

//   // --- Keep calculated values in sync with order ---
//   useEffect(() => {
//     if (
//       order.unitPrice !== unitPrice ||
//       order.totalAmount !== totalAmount ||
//       order.totalAmountWithGST !== totalAmountWithGST
//     ) {
//       updateOrderField("unitPrice", unitPrice);
//       updateOrderField("totalAmount", totalAmount);
//       updateOrderField("totalAmountWithGST", totalAmountWithGST);
//     }
//     // eslint-disable-next-line
//   }, [unitPrice, totalAmount, totalAmountWithGST]);

//   // --- UI ---
//   return (
//     <div className={styles.orderCard}>
//       <div className={styles.row}>
//         {/* Order-level client type chips */}
//         <label>
//           <span>Client Type</span>
//           <div className={styles.optionsWrap}>
//             {CLIENT_TYPES.map((ct) => (
//               <button
//                 type="button"
//                 key={ct}
//                 className={`${styles.optionChip} ${clientType === ct ? styles.selected : ""}`}
//                 onClick={() => handleClientType(ct)}
                
//               >
//                 {ct}
//               </button>
//             ))}
//           </div>
//         </label> 
//         <br/>
//         <label>
//           <span>Order Type</span>
//           <select value={order.orderType} onChange={(e) => handleOrderType(e.target.value)} required>
//             <option value="">Select Order Type</option>
//             {clientType &&
//               Object.keys(clientTypesObj[clientType]?.orderTypes || {}).map((ot) => (
//                 <option key={ot} value={ot}>
//                   {ot}
//                 </option>
//               ))}
//           </select>
//         </label> <br />
//         <label>
//           <span>Print Type</span>
//           <div className={styles.optionsWrap}>
//             {order.orderType &&
//               Object.keys(printTypesObj).map((pt) => (
//                 <button
//                   key={pt}
//                   type="button"
//                   className={`${styles.optionChip} ${order.printType === pt ? styles.selected : ""}`}
//                   onClick={() => handlePrintType(pt)}
//                 >
//                   {pt}
//                 </button>
//               ))}
//           </div>
//         </label>
//       </div>
//       {/* ---- Step Options ---- */}
//       {order.printType && (
//         <div className={styles.optionsSection}>
//           {ORDER_STEPS.map((step) => (
//             <div key={step.key} className={styles.optionGroup}>
//               <div className={styles.groupTitle}>{step.label}</div>
//               <div className={styles.optionsWrap}>
//                 {(stepOptionLists[step.key] || []).map((opt) => (
//                   <button
//                     key={opt.name}
//                     type="button"
//                     className={`${styles.optionChip} ${
//                       stepSelections[step.key] === opt.name ? styles.selected : ""
//                     }`}
//                     onClick={() =>
//                       handleStepSelect(step.key, stepSelections[step.key] === opt.name ? "" : opt.name)
//                     }
//                   >
//                     {opt.name}
//                     {typeof opt.cost === "number"
//                       ? ` (${opt.cost})`
//                       : typeof opt.costCMYK === "number"
//                       ? ` (${opt.costCMYK})`
//                       : ""}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       <div className={styles.row}>
//         <label>
//           <span>Height</span>
//           <input
//             type="number"
//             value={order.height || 1}
//             min={1}
//             onChange={(e) => updateOrderField("height", Number(e.target.value))}
//           />
//         </label>
//         <label>
//           <span>Width</span>
//           <input
//             type="number"
//             value={order.width || 1}
//             min={1}
//             onChange={(e) => updateOrderField("width", Number(e.target.value))}
//           />
//         </label>
//       </div>
//       <div className={styles.row}>
//         <label>
//           <span>Qty</span>
//           <input
//             type="number"
//             value={order.qty || 1}
//             min={1}
//             onChange={(e) => updateOrderField("qty", Number(e.target.value))}
//           />
//         </label>
//         <label>
//           <span>GST (%)</span>
//           <select value={order.gst} onChange={(e) => updateOrderField("gst", Number(e.target.value))}>
//             {GST_OPTIONS.map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt}%
//               </option>
//             ))}
//           </select>
//         </label>
//         <label>
//           <span>Budget</span>
//           <input
//             type="number"
//             value={order.budget || ""}
//             onChange={(e) => updateOrderField("budget", e.target.value)}
//           />
//         </label>
//       </div>
//       <div className={styles.row}>
//         <label>
//           <span>Order Start</span>
//           <input
//             type="datetime-local"
//             value={order.orderStartDateTime || ""}
//             onChange={(e) => updateOrderField("orderStartDateTime", e.target.value)}
//           />
//         </label>
//         <label>
//           <span>Order End</span>
//           <input
//             type="datetime-local"
//             value={order.orderEndDateTime || ""}
//             onChange={(e) => updateOrderField("orderEndDateTime", e.target.value)}
//           />
//         </label>
//       </div>
//       <div className={styles.calculationRow}>
//         <div>
//           <strong>Unit Price: </strong>₹{unitPrice}
//         </div>
//         <div>
//           <strong>Total: </strong>₹{totalAmount}
//         </div>
//         <div>
//           <strong>Total (GST): </strong>₹{totalAmountWithGST.toFixed(2)}
//         </div>
//       </div>
//       <button
//         type="button"
//         className={styles.removeBtn}
//         onClick={onRemoveOrder}
//         disabled={disableRemove}
//       >
//         Remove Order
//       </button>
//     </div>
//   );
// }

// // --- Helper: Calculate prices ---
// function calculateOrderAmounts(order) {
//   let unitPrice = 0;
//   if (order.preSalesOrderSteps && order.preSalesOrderSteps.length) {
//     order.preSalesOrderSteps.forEach((step) => {
//       const stepList =
//         PRINT_PRICES.clientTypes?.[order.clientType]?.orderTypes?.[order.orderType]?.printTypes?.[
//           order.printType
//         ]?.[step.stepName === "Printing" ? "Media" : step.stepName] || [];
//       const found = stepList.find((opt) => opt.name === step.stepValue);
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
// import React, { useState, useEffect } from "react";
// import styles from "./AddPreSalePopup.module.scss";
// import axios from "axios";
// import PRINT_PRICES from "../../printprices";
// import { useData } from "../../context/DataContext";

// // --- Constants ---
// const CLIENT_TYPES = ["Cash", "Online", "Printers"];
// const ORDER_STEPS = [
//   { key: "Media", label: "Media", stepName: "Printing" },
//   { key: "Lamination", label: "Lamination", stepName: "Lamination" },
//   { key: "Mounting", label: "Mounting", stepName: "Mounting" },
//   { key: "Framing", label: "Framing", stepName: "Framing" },
//   { key: "Installation", label: "Installation", stepName: "Installation" }
// ];
// const GST_OPTIONS = [0, 5, 12, 18];

// const initialClient = { id: "", name: "", company: "", email: "", phone: "" };
// const initialPreSalesOrder = {
//   clientType: "",
//   orderType: "",
//   printType: "",
//   media: "",
//   height: 1,
//   width: 1,
//   qty: 1,
//   budget: "",
//   totalAmount: "",
//   totalAmountWithGST: "",
//   unitPrice: "",
//   gst: 0,
//   orderStartDateTime: "",
//   orderEndDateTime: "",
//   preSalesOrderSteps: []
// };
// const initialPreSales = {
//   clientType: "",
//   personName: "",
//   approachedVia: "",
//   preSalesOrders: [{ ...initialPreSalesOrder }],
//   status: "",
//   conclusion: ""
// };

// export default function AddPreSale({ onClose }) {
//   const { clients } = useData();
//   const [existingClient, setExistingClient] = useState(true);
//   const [client, setClient] = useState({ ...initialClient });
//   const [preSales, setPreSales] = useState({ ...initialPreSales });
//   const [submitting, setSubmitting] = useState(false);
//   const [result, setResult] = useState(null);
//   const token = localStorage.getItem("token");

//   // --- Helpers ---

//   // This keeps root clientType and all orders in sync!
//   function updatePreSalesField(key, value) {
//     setPreSales((ps) => {
//       if (key === "clientType") {
//         // update root AND all orders
//         const updatedOrders = ps.preSalesOrders.map((order) => ({
//           ...order,
//           clientType: value
//         }));
//         return { ...ps, clientType: value, preSalesOrders: updatedOrders };
//       }
//       return { ...ps, [key]: value };
//     });
//   }

//   function updateOrderField(idx, key, val) {
//     setPreSales((prev) => {
//       const orders = [...prev.preSalesOrders];
//       orders[idx] = { ...orders[idx], [key]: val };
//       // If clientType changes at order, update root + all orders
//       if (key === "clientType") {
//         return {
//           ...prev,
//           clientType: val,
//           preSalesOrders: orders.map((order) => ({ ...order, clientType: val }))
//         };
//       }
//       return { ...prev, preSalesOrders: orders };
//     });
//   }

//   function updateOrderSteps(idx, steps) {
//     setPreSales((prev) => {
//       const orders = [...prev.preSalesOrders];
//       orders[idx].preSalesOrderSteps = steps;
//       return { ...prev, preSalesOrders: orders };
//     });
//   }

//   function handleAddOrder() {
//     setPreSales((ps) => ({
//       ...ps,
//       preSalesOrders: [
//         ...ps.preSalesOrders,
//         { ...initialPreSalesOrder, preSalesOrderSteps: [], clientType: ps.clientType }
//       ]
//     }));
//   }

//   function handleRemoveOrder(idx) {
//     setPreSales((ps) => {
//       const arr = ps.preSalesOrders.slice();
//       arr.splice(idx, 1);
//       return {
//         ...ps,
//         preSalesOrders: arr.length
//           ? arr
//           : [{ ...initialPreSalesOrder, preSalesOrderSteps: [], clientType: ps.clientType }]
//       };
//     });
//   }

//   // ----------- FORM SUBMIT -----------
//   async function handleSubmit(e) {
//     e.preventDefault();
//     setSubmitting(true);
//     setResult(null);

//     const ordersToSend = preSales.preSalesOrders.map((order) => {
//       const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts(order);
//       return {
//         ...order,
//         unitPrice,
//         totalAmount,
//         totalAmountWithGST,
//         media:
//           order.media ||
//           (order.preSalesOrderSteps.find((s) => s.stepName === "Printing")?.stepValue || ""),
//         preSalesOrderSteps: order.preSalesOrderSteps.map((s, i) => ({
//           ...s,
//           stepNumber: i + 1
//         }))
//       };
//     });

//     const requestBody = {
//       ...preSales,
//       client: existingClient ? { id: client.id } : { ...client },
//       preSalesOrders: ordersToSend
//     };

//     try {
//       // const res = await axios.post(
//       //   `http://localhost:8080/api/presales/createpresales?existingClient=${existingClient}`,
//       //   requestBody,
//       //   {
//       //     headers: {
//       //       "Content-Type": "application/json",
//       //       Authorization: `Bearer ${token}`
//       //     }
//       //   }
//       // );
//        await handleCreatePresale(requestBody, existingClient);
//       alert("Successfully Added Presale");
//       setResult({ success: true, data: res.data });
//     } catch (err) {
//       setResult({
//         success: false,
//         message: err?.response?.data?.message || "Error"
//       });
//     }
//     setSubmitting(false);
//   }

//   // --- UI ---
//   return (
//     <div className={styles.popupOverlay}>
//       <div className={styles.popupBox}>
//         <button className={styles.closeBtn} onClick={onClose} title="Close">
//           &times;
//         </button>
//         <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
//           <h2 className={styles.heading}>Add Pre-Sale Entry</h2>
//           <p className={styles.subHeading}>
//             Fill in all required fields to register a new pre-sale.
//           </p>
//           {/* --- Client Type Chip Selector at ROOT --- */}
//           <div className={styles.row}>
//             <label>
//               <span>Client Type</span>
//               <div className={styles.optionsWrap}>
//                 {CLIENT_TYPES.map((ct) => (
//                   <button
//                     key={ct}
//                     type="button"
//                     className={`${styles.optionChip} ${preSales.clientType === ct ? styles.selected : ""}`}
//                     onClick={() => updatePreSalesField("clientType", ct)}
//                   >
//                     {ct}
//                   </button>
//                 ))}
//               </div>
//             </label>
//           </div>

//           {/* Existing/New Client Toggle */}
//           <div className={styles.toggleRow}>
//             <label className={existingClient ? styles.selected : ""}>
//               <input
//                 type="radio"
//                 checked={existingClient}
//                 onChange={() => setExistingClient(true)}
//               />
//               Existing Client
//             </label>
//             <label className={!existingClient ? styles.selected : ""}>
//               <input
//                 type="radio"
//                 checked={!existingClient}
//                 onChange={() => setExistingClient(false)}
//               />
//               New Client
//             </label>
//           </div>
//           <div className={styles.divider} />

//           {/* --- Client Fields --- */}
//           <div className={styles.section}>
//             <h3 className={styles.sectionTitle}>Client Information</h3>
//             {existingClient ? (
//               <div className={styles.row}>
//                 <label>
//                   <span>
//                     Client <span className={styles.required}>*</span>
//                   </span>
//                   <select
//                     name="id"
//                     value={client.id || ""}
//                     onChange={(e) => setClient((c) => ({ ...c, id: e.target.value }))}
//                     required
//                     className={styles.dropdown}
//                   >
//                     <option value="">Select client</option>
//                     {clients.map((c) => (
//                       <option key={c.id} value={c.id}>
//                         {c.name} ({c.email})
//                       </option>
//                     ))}
//                   </select>
//                 </label>
//               </div>
//             ) : (
//               <>
//                 <div className={styles.row}>
//                   <label>
//                     <span>
//                       Full Name <span className={styles.required}>*</span>
//                     </span>
//                     <input
//                       type="text"
//                       name="name"
//                       value={client.name}
//                       onChange={(e) => setClient((c) => ({ ...c, name: e.target.value }))}
//                       required
//                       placeholder="Client Name"
//                     />
//                   </label>
//                   <label>
//                     <span>Company</span>
//                     <input
//                       type="text"
//                       name="company"
//                       value={client.company}
//                       onChange={(e) => setClient((c) => ({ ...c, company: e.target.value }))}
//                       placeholder="Company Name"
//                     />
//                   </label>
//                 </div>
//                 <div className={styles.row}>
//                   <label>
//                     <span>Email</span>
//                     <input
//                       type="email"
//                       name="email"
//                       value={client.email}
//                       onChange={(e) => setClient((c) => ({ ...c, email: e.target.value }))}
//                       placeholder="Email"
//                     />
//                   </label>
//                   <label>
//                     <span>Phone</span>
//                     <input
//                       type="text"
//                       name="phone"
//                       value={client.phone}
//                       onChange={(e) => setClient((c) => ({ ...c, phone: e.target.value }))}
//                       placeholder="Phone Number"
//                     />
//                   </label>
//                 </div>
//               </>
//             )}
//           </div>
//           <div className={styles.divider} />

//           {/* --- PreSales Root Fields --- */}
//           <div className={styles.section}>
//             <h3 className={styles.sectionTitle}>Pre-Sale Details</h3>
//             <div className={styles.row}>
//               <label>
//                 <span>Contact Person</span>
//                 <input
//                   type="text"
//                   name="personName"
//                   value={preSales.personName}
//                   onChange={(e) => updatePreSalesField("personName", e.target.value)}
//                   placeholder="Contact Person"
//                 />
//               </label>
//               <label>
//                 <span>Approached Via</span>
//                 <select
//                   name="approachedVia"
//                   value={preSales.approachedVia}
//                   onChange={(e) => updatePreSalesField("approachedVia", e.target.value)}
//                 >
//                   <option value="">Select</option>
//                   <option value="WhatsApp">WhatsApp</option>
//                   <option value="Email">Email</option>
//                   <option value="Phone">Phone</option>
//                 </select>
//               </label>
//             </div>
//           </div>
//           <div className={styles.divider} />

//           {/* --- PreSales Orders --- */}
//           <div className={styles.section}>
//             <h3 className={styles.sectionTitle}>Orders</h3>
//             {preSales.preSalesOrders.map((order, idx) => (
//               <OrderConfigurator
//                 key={idx}
//                 index={idx}
//                 parentClientType={preSales.clientType}
//                 order={order}
//                 updateOrderField={(key, val) => updateOrderField(idx, key, val)}
//                 updateOrderSteps={(steps) => updateOrderSteps(idx, steps)}
//                 onRemoveOrder={() => handleRemoveOrder(idx)}
//                 disableRemove={preSales.preSalesOrders.length === 1}
//                 updatePreSalesField={updatePreSalesField}
//               />
//             ))}
//             <button
//               type="button"
//               className={styles.addBtn}
//               onClick={handleAddOrder}
//             >
//               + Add Order
//             </button>
//           </div>
//           {/* --- Submit Row --- */}
//           <div className={styles.submitRow}>
//             <button type="submit" className={styles.submitBtn} disabled={submitting}>
//               {submitting ? "Submitting..." : "Submit"}
//             </button>
//             {result && (
//               <span className={result.success ? styles.successMsg : styles.errorMsg}>
//                 {result.success ? "Saved Successfully!" : result.message}
//               </span>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // -------- ORDER CONFIGURATOR COMPONENT --------
// function OrderConfigurator({
//   index,
//   parentClientType,
//   order,
//   updateOrderField,
//   updateOrderSteps,
//   onRemoveOrder,
//   disableRemove,
//   updatePreSalesField
// }) {
//   const [stepSelections, setStepSelections] = useState({});

//   const clientType = order.clientType || parentClientType || "";

//   const clientTypesObj = PRINT_PRICES?.clientTypes || {};
//   const orderTypesObj = clientType && clientTypesObj[clientType]
//     ? clientTypesObj[clientType].orderTypes || {}
//     : {};
//   const printTypesObj = order.orderType && orderTypesObj[order.orderType]
//     ? orderTypesObj[order.orderType].printTypes || {}
//     : {};

//   const stepOptionLists = order.printType && printTypesObj[order.printType]
//     ? Object.entries(printTypesObj[order.printType])
//         .filter(([group]) => ORDER_STEPS.some((s) => s.key === group))
//         .reduce((acc, [group, opts]) => {
//           acc[group] = opts;
//           return acc;
//         }, {})
//     : {};

//   function handleClientType(val) {
//     // This updates BOTH root and all orders!
//     updatePreSalesField("clientType", val);
//     setStepSelections({});
//     updateOrderSteps([]);
//     updateOrderField("clientType", val); // sync this order too
//     updateOrderField("orderType", "");
//     updateOrderField("printType", "");
//   }

//   function handleOrderType(val) {
//     updateOrderField("orderType", val);
//     setStepSelections({});
//     updateOrderSteps([]);
//     updateOrderField("printType", "");
//   }

//   function handlePrintType(val) {
//     updateOrderField("printType", val);
//     setStepSelections({});
//     updateOrderSteps([]);
//   }

//   function handleStepSelect(group, value) {
//     const next = { ...stepSelections, [group]: value };
//     setStepSelections(next);
//     const steps = ORDER_STEPS.map((step, idx) =>
//       next[step.key]
//         ? {
//             stepNumber: idx + 1,
//             stepName: step.stepName,
//             stepValue: next[step.key],
//             status: "CREATED"
//           }
//         : null
//     ).filter(Boolean);
//     updateOrderSteps(steps);
//     if (group === "Media") updateOrderField("media", value);
//   }

//   const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts({
//     ...order,
//     preSalesOrderSteps: order.preSalesOrderSteps.length
//       ? order.preSalesOrderSteps
//       : ORDER_STEPS.map((step, idx) =>
//           stepSelections[step.key]
//             ? {
//                 stepNumber: idx + 1,
//                 stepName: step.stepName,
//                 stepValue: stepSelections[step.key],
//                 status: "CREATED"
//               }
//             : null
//         ).filter(Boolean)
//   });

//   useEffect(() => {
//     if (
//       order.unitPrice !== unitPrice ||
//       order.totalAmount !== totalAmount ||
//       order.totalAmountWithGST !== totalAmountWithGST
//     ) {
//       updateOrderField("unitPrice", unitPrice);
//       updateOrderField("totalAmount", totalAmount);
//       updateOrderField("totalAmountWithGST", totalAmountWithGST);
//     }
//     // eslint-disable-next-line
//   }, [unitPrice, totalAmount, totalAmountWithGST]);

//   return (
//     <div className={styles.orderCard}>
//       <div className={styles.row}>
//         <label>
//           <span>Client Type</span>
//           <div className={styles.optionsWrap}>
//             {CLIENT_TYPES.map((ct) => (
//               <button
//                 key={ct}
//                 type="button"
//                 className={`${styles.optionChip} ${clientType === ct ? styles.selected : ""}`}
//                 onClick={() => handleClientType(ct)}
//               >
//                 {ct}
//               </button>
//             ))}
//           </div>
//         </label>
//         <br />
//         <label>
//           <span>Order Type</span>
//           <select value={order.orderType || ""} onChange={(e) => handleOrderType(e.target.value)} required>
//             <option value="">Select Order Type</option>
//             {clientType &&
//               Object.keys(orderTypesObj).map((ot) => (
//                 <option key={ot} value={ot}>
//                   {ot}
//                 </option>
//               ))}
//           </select>
//         </label>
//         <br />
//         <label>
//           <span>Print Type</span>
//           <div className={styles.optionsWrap}>
//             {order.orderType && Object.keys(printTypesObj).length > 0 &&
//               Object.keys(printTypesObj).map((pt) => (
//                 <button
//                   key={pt}
//                   type="button"
//                   className={`${styles.optionChip} ${order.printType === pt ? styles.selected : ""}`}
//                   onClick={() => handlePrintType(pt)}
//                 >
//                   {pt}
//                 </button>
//               ))}
//           </div>
//           {order.orderType && Object.keys(printTypesObj).length === 0 && (
//             <div style={{ color: "red", fontSize: "12px" }}>
//               No print types available for selected order type
//             </div>
//           )}
//         </label>
//       </div>
//       {order.printType && (
//         <div className={styles.optionsSection}>
//           {ORDER_STEPS.map((step) => (
//             <div key={step.key} className={styles.optionGroup}>
//               <div className={styles.groupTitle}>{step.label}</div>
//               <div className={styles.optionsWrap}>
//                 {(stepOptionLists[step.key] || []).map((opt) => (
//                   <button
//                     key={opt.name}
//                     type="button"
//                     className={`${styles.optionChip} ${
//                       stepSelections[step.key] === opt.name ? styles.selected : ""
//                     }`}
//                     onClick={() =>
//                       handleStepSelect(step.key, stepSelections[step.key] === opt.name ? "" : opt.name)
//                     }
//                   >
//                     {opt.name}
//                     {typeof opt.cost === "number"
//                       ? ` (${opt.cost})`
//                       : typeof opt.costCMYK === "number"
//                       ? ` (${opt.costCMYK})`
//                       : ""}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       <div className={styles.row}>
//         <label>
//           <span>Height</span>
//           <input
//             type="number"
//             value={order.height || 1}
//             min={1}
//             onChange={(e) => updateOrderField("height", Number(e.target.value))}
//           />
//         </label>
//         <label>
//           <span>Width</span>
//           <input
//             type="number"
//             value={order.width || 1}
//             min={1}
//             onChange={(e) => updateOrderField("width", Number(e.target.value))}
//           />
//         </label>
//       </div>
//       <div className={styles.row}>
//         <label>
//           <span>Qty</span>
//           <input
//             type="number"
//             value={order.qty || 1}
//             min={1}
//             onChange={(e) => updateOrderField("qty", Number(e.target.value))}
//           />
//         </label>
//         <label>
//           <span>GST (%)</span>
//           <select value={order.gst || 0} onChange={(e) => updateOrderField("gst", Number(e.target.value))}>
//             {GST_OPTIONS.map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt}%
//               </option>
//             ))}
//           </select>
//         </label>
//         <label>
//           <span>Budget</span>
//           <input
//             type="number"
//             value={order.budget || ""}
//             onChange={(e) => updateOrderField("budget", e.target.value)}
//           />
//         </label>
//       </div>
//       <div className={styles.row}>
//         <label>
//           <span>Order Start</span>
//           <input
//             type="datetime-local"
//             value={order.orderStartDateTime || ""}
//             onChange={(e) => updateOrderField("orderStartDateTime", e.target.value)}
//           />
//         </label>
//         <label>
//           <span>Order End</span>
//           <input
//             type="datetime-local"
//             value={order.orderEndDateTime || ""}
//             onChange={(e) => updateOrderField("orderEndDateTime", e.target.value)}
//           />
//         </label>
//       </div>
//       <div className={styles.calculationRow}>
//         <div>
//           <strong>Unit Price: </strong>₹{unitPrice}
//         </div>
//         <div>
//           <strong>Total: </strong>₹{totalAmount}
//         </div>
//         <div>
//           <strong>Total (GST): </strong>₹{totalAmountWithGST.toFixed(2)}
//         </div>
//       </div>
//       <button
//         type="button"
//         className={styles.removeBtn}
//         onClick={onRemoveOrder}
//         disabled={disableRemove}
//       >
//         Remove Order
//       </button>
//     </div>
//   );
// }

// // --- Helper: Calculate prices ---
// function calculateOrderAmounts(order) {
//   let unitPrice = 0;
//   if (order.preSalesOrderSteps && order.preSalesOrderSteps.length) {
//     order.preSalesOrderSteps.forEach((step) => {
//       const stepList =
//         PRINT_PRICES.clientTypes?.[order.clientType]?.orderTypes?.[order.orderType]?.printTypes?.[
//           order.printType
//         ]?.[step.stepName === "Printing" ? "Media" : step.stepName] || [];
//       const found = stepList.find((opt) => opt.name === step.stepValue);
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
import React, { useState } from "react";
import styles from "./AddPreSalePopup.module.scss";
import PRINT_PRICES from "../../printprices";
import { useData } from "../../context/DataContext";

// --- Constants ---
const CLIENT_TYPES = ["Cash", "Online", "Printers"];
const ORDER_STEPS = [
  { key: "Media", label: "Media", stepName: "Printing" },
  { key: "Lamination", label: "Lamination", stepName: "Lamination" },
  { key: "Mounting", label: "Mounting", stepName: "Mounting" },
  { key: "Framing", label: "Framing", stepName: "Framing" },
  { key: "Installation", label: "Installation", stepName: "Installation" }
];
const GST_OPTIONS = [0, 5, 12, 18];

const initialClient = { id: "", name: "", company: "", email: "", phone: "" };
const initialPreSalesOrder = {
  clientType: "",
  orderType: "",
  printType: "",
  media: "",
  height: 1,
  width: 1,
  qty: 1,
  budget: "",
  totalAmount: "",
  totalAmountWithGST: "",
  unitPrice: "",
  gst: 0,
  orderStartDateTime: "",
  orderEndDateTime: "",
  preSalesOrderSteps: []
};
const initialPreSales = {
  clientType: "",
  personName: "",
  approachedVia: "",
  preSalesOrders: [{ ...initialPreSalesOrder }],
  status: "Created",
  conclusion: ""
};

export default function AddPreSale({ onClose }) {
  const { clients, handleCreatePresale } = useData();
  const [existingClient, setExistingClient] = useState(true);
  const [client, setClient] = useState({ ...initialClient });
  const [preSales, setPreSales] = useState({ ...initialPreSales });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // --- Helpers ---
  function updatePreSalesField(key, value) {
    setPreSales((ps) => {
      if (key === "clientType") {
        const updatedOrders = ps.preSalesOrders.map((order) => ({
          ...order,
          clientType: value
        }));
        return { ...ps, clientType: value, preSalesOrders: updatedOrders };
      }
      return { ...ps, [key]: value };
    });
  }

  function updateOrderField(idx, key, val) {
    setPreSales((prev) => {
      const orders = [...prev.preSalesOrders];
      orders[idx] = { ...orders[idx], [key]: val };
      // If clientType changes at order, update root + all orders
      if (key === "clientType") {
        return {
          ...prev,
          clientType: val,
          preSalesOrders: orders.map((order) => ({ ...order, clientType: val }))
        };
      }
      return { ...prev, preSalesOrders: orders };
    });
  }

  function updateOrderSteps(idx, steps) {
    setPreSales((prev) => {
      const orders = [...prev.preSalesOrders];
      orders[idx].preSalesOrderSteps = steps;
      return { ...prev, preSalesOrders: orders };
    });
  }

  function handleAddOrder() {
    setPreSales((ps) => ({
      ...ps,
      preSalesOrders: [
        ...ps.preSalesOrders,
        { ...initialPreSalesOrder, preSalesOrderSteps: [], clientType: ps.clientType }
      ]
    }));
  }

  function handleRemoveOrder(idx) {
    setPreSales((ps) => {
      const arr = ps.preSalesOrders.slice();
      arr.splice(idx, 1);
      return {
        ...ps,
        preSalesOrders: arr.length
          ? arr
          : [{ ...initialPreSalesOrder, preSalesOrderSteps: [], clientType: ps.clientType }]
      };
    });
  }

  // --- Submit handler using context ---
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const ordersToSend = preSales.preSalesOrders.map((order) => {
      const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts(order);
      return {
        ...order,
        unitPrice,
        totalAmount,
        totalAmountWithGST,
        media:
          order.media ||
          (order.preSalesOrderSteps.find((s) => s.stepName === "Printing")?.stepValue || ""),
        preSalesOrderSteps: order.preSalesOrderSteps.map((s, i) => ({
          ...s,
          stepNumber: i + 1
        }))
      };
    });

    const requestBody = {
      ...preSales,
      client: existingClient ? { id: client.id } : { ...client },
      preSalesOrders: ordersToSend
    };

    try {
      await handleCreatePresale(requestBody, existingClient);
      console.log(requestBody);
      
      setResult({ success: true, data: "Created" });
      setTimeout(() => onClose && onClose(), 1000);
    } catch (err) {
      setResult({ success: false, message: "Failed to create pre-sale" });
    }
    setSubmitting(false);
  }

  // --- UI ---
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupBox}>
        <button className={styles.closeBtn} onClick={onClose} title="Close">
          &times;
        </button>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <h2 className={styles.heading}>Add Pre-Sale Entry</h2>
          <p className={styles.subHeading}>
            Fill in all required fields to register a new pre-sale.
          </p>
          {/* --- Client Type Chip Selector --- */}
          <div className={styles.row}>
            <label>
              <span>Client Type</span>
              <div className={styles.optionsWrap}>
                {CLIENT_TYPES.map((ct) => (
                  <button
                    key={ct}
                    type="button"
                    className={`${styles.optionChip} ${preSales.clientType === ct ? styles.selected : ""}`}
                    onClick={() => updatePreSalesField("clientType", ct)}
                  >
                    {ct}
                  </button>
                ))}
              </div>
            </label>
          </div>
          {/* Existing/New Client Toggle */}
          <div className={styles.toggleRow}>
            <label className={existingClient ? styles.selected : ""}>
              <input
                type="radio"
                checked={existingClient}
                onChange={() => setExistingClient(true)}
              />
              Existing Client
            </label>
            <label className={!existingClient ? styles.selected : ""}>
              <input
                type="radio"
                checked={!existingClient}
                onChange={() => setExistingClient(false)}
              />
              New Client
            </label>
          </div>
          <div className={styles.divider} />

          {/* --- Client Fields --- */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Client Information</h3>
            {existingClient ? (
              <div className={styles.row}>
                <label>
                  <span>
                    Client <span className={styles.required}>*</span>
                  </span>
                  <select
                    name="id"
                    value={client.id || ""}
                    onChange={(e) => setClient((c) => ({ ...c, id: e.target.value }))}
                    required
                    className={styles.dropdown}
                  >
                    <option value="">Select client</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : (
              <>
                <div className={styles.row}>
                  <label>
                    <span>
                      Full Name <span className={styles.required}>*</span>
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={client.name}
                      onChange={(e) => setClient((c) => ({ ...c, name: e.target.value }))}
                      required
                      placeholder="Client Name"
                    />
                  </label>
                  <label>
                    <span>Company</span>
                    <input
                      type="text"
                      name="company"
                      value={client.company}
                      onChange={(e) => setClient((c) => ({ ...c, company: e.target.value }))}
                      placeholder="Company Name"
                    />
                  </label>
                </div>
                <div className={styles.row}>
                  <label>
                    <span>Email</span>
                    <input
                      type="email"
                      name="email"
                      value={client.email}
                      onChange={(e) => setClient((c) => ({ ...c, email: e.target.value }))}
                      placeholder="Email"
                    />
                  </label>
                  <label>
                    <span>Phone</span>
                    <input
                      type="text"
                      name="phone"
                      value={client.phone}
                      onChange={(e) => setClient((c) => ({ ...c, phone: e.target.value }))}
                      placeholder="Phone Number"
                    />
                  </label>
                </div>
              </>
            )}
          </div>
          <div className={styles.divider} />

          {/* --- PreSales Root Fields --- */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Pre-Sale Details</h3>
            <div className={styles.row}>
              <label>
                <span>Contact Person</span>
                <input
                  type="text"
                  name="personName"
                  value={preSales.personName}
                  onChange={(e) => updatePreSalesField("personName", e.target.value)}
                  placeholder="Contact Person"
                />
              </label>
              <label>
                <span>Approached Via</span>
                <select
                  name="approachedVia"
                  value={preSales.approachedVia}
                  onChange={(e) => updatePreSalesField("approachedVia", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                </select>
              </label>
            </div>
          </div>
          <div className={styles.divider} />

          {/* --- PreSales Orders --- */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Orders</h3>
            {preSales.preSalesOrders.map((order, idx) => (
              <OrderConfigurator
                key={idx}
                index={idx}
                parentClientType={preSales.clientType}
                order={order}
                updateOrderField={(key, val) => updateOrderField(idx, key, val)}
                updateOrderSteps={(steps) => updateOrderSteps(idx, steps)}
                onRemoveOrder={() => handleRemoveOrder(idx)}
                disableRemove={preSales.preSalesOrders.length === 1}
                updatePreSalesField={updatePreSalesField}
              />
            ))}
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleAddOrder}
            >
              + Add Order
            </button>
          </div>
          {/* --- Submit Row --- */}
          <div className={styles.submitRow}>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
            {result && (
              <span className={result.success ? styles.successMsg : styles.errorMsg}>
                {result.success ? "Saved Successfully!" : result.message}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// -------- ORDER CONFIGURATOR COMPONENT --------
function OrderConfigurator({
  index,
  parentClientType,
  order,
  updateOrderField,
  updateOrderSteps,
  onRemoveOrder,
  disableRemove,
  updatePreSalesField
}) {
  const [stepSelections, setStepSelections] = useState({});
React.useEffect(() => {
  const interval = setInterval(() => {
    const calcQty = (order.height || 1) * (order.width || 1);
    if (order.qty !== calcQty) {
      updateOrderField("qty", calcQty);
    }
  }, 1000); // Every 5 seconds

  return () => clearInterval(interval); // Clean up on unmount
}, [order.height, order.width]); // Run whenever height or width changes

  const clientType = order.clientType || parentClientType || "";

  const clientTypesObj = PRINT_PRICES?.clientTypes || {};
  const orderTypesObj = clientType && clientTypesObj[clientType]
    ? clientTypesObj[clientType].orderTypes || {}
    : {};
  const printTypesObj = order.orderType && orderTypesObj[order.orderType]
    ? orderTypesObj[order.orderType].printTypes || {}
    : {};

  const stepOptionLists = order.printType && printTypesObj[order.printType]
    ? Object.entries(printTypesObj[order.printType])
        .filter(([group]) => ORDER_STEPS.some((s) => s.key === group))
        .reduce((acc, [group, opts]) => {
          acc[group] = opts;
          return acc;
        }, {})
    : {};

  function handleClientType(val) {
    updatePreSalesField("clientType", val);
    setStepSelections({});
    updateOrderSteps([]);
    updateOrderField("clientType", val);
    updateOrderField("orderType", "");
    updateOrderField("printType", "");
  }

  function handleOrderType(val) {
    updateOrderField("orderType", val);
    setStepSelections({});
    updateOrderSteps([]);
    updateOrderField("printType", "");
  }

  function handlePrintType(val) {
    updateOrderField("printType", val);
    setStepSelections({});
    updateOrderSteps([]);
  }

  function handleStepSelect(group, value) {
    const next = { ...stepSelections, [group]: value };
    setStepSelections(next);
    const steps = ORDER_STEPS.map((step, idx) =>
      next[step.key]
        ? {
            stepNumber: idx + 1,
            stepName: step.stepName,
            stepValue: next[step.key],
            status: "CREATED"
          }
        : null
    ).filter(Boolean);
    updateOrderSteps(steps);
    if (group === "Media") updateOrderField("media", value);
  }

  const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts({
    ...order,
    preSalesOrderSteps: order.preSalesOrderSteps.length
      ? order.preSalesOrderSteps
      : ORDER_STEPS.map((step, idx) =>
          stepSelections[step.key]
            ? {
                stepNumber: idx + 1,
                stepName: step.stepName,
                stepValue: stepSelections[step.key],
                status: "CREATED"
              }
            : null
        ).filter(Boolean)
  });

  React.useEffect(() => {
    if (
      order.unitPrice !== unitPrice ||
      order.totalAmount !== totalAmount ||
      order.totalAmountWithGST !== totalAmountWithGST
    ) {
      updateOrderField("unitPrice", unitPrice);
      updateOrderField("totalAmount", totalAmount);
      updateOrderField("totalAmountWithGST", totalAmountWithGST);
    }
    // eslint-disable-next-line
  }, [unitPrice, totalAmount, totalAmountWithGST]);

  return (
    <div className={styles.orderCard}>
      <div className={styles.row}>
        <label style={{display:"none"}}>
          <span>Client Type</span>
          <div className={styles.optionsWrap} style={{display:"none"}}>
            {CLIENT_TYPES.map((ct) => (
              <button
                key={ct}
                type="button"
                className={`${styles.optionChip} ${clientType === ct ? styles.selected : ""}`}
                onClick={() => handleClientType(ct)}
              >
                {ct}
              </button>
            ))}
          </div>
        </label>
        <br />
        <label>
          <span>Order Type</span>
          <select value={order.orderType || ""} onChange={(e) => handleOrderType(e.target.value)} required>
            <option value="">Select Order Type</option>
            {clientType &&
              Object.keys(orderTypesObj).map((ot) => (
                <option key={ot} value={ot}>
                  {ot}
                </option>
              ))}
          </select>
        </label>
    </div>  <br /> <div className={styles.row}>
        <label>
          <span>Print Type</span>
          <div className={styles.optionsWrap}>
            {order.orderType && Object.keys(printTypesObj).length > 0 &&
              Object.keys(printTypesObj).map((pt) => (
                <button
                  key={pt}
                  type="button"
                  className={`${styles.optionChip} ${order.printType === pt ? styles.selected : ""}`}
                  onClick={() => handlePrintType(pt)}
                >
                  {pt}
                </button>
              ))}
          </div>
          {order.orderType && Object.keys(printTypesObj).length === 0 && (
            <div style={{ color: "red", fontSize: "12px" }}>
              No print types available for selected order type
            </div>
          )}
        </label>
      </div>
      {order.printType && (
        <div className={styles.optionsSection}>
          {ORDER_STEPS.map((step) => (
            <div key={step.key} className={styles.optionGroup}>
              <div className={styles.groupTitle}>{step.label}</div>
              <div className={styles.optionsWrap}>
                {(stepOptionLists[step.key] || []).map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    className={`${styles.optionChip} ${
                      stepSelections[step.key] === opt.name ? styles.selected : ""
                    }`}
                    onClick={() =>
                      handleStepSelect(step.key, stepSelections[step.key] === opt.name ? "" : opt.name)
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
      </div>
      <div className={styles.row}>
        <label>
         <span>Measurement (sqft)</span>
       <input
  type="number"
  value={order.qty}
  min={1}
  onChange={(e) => updateOrderField("qty", Number(e.target.value))}
/>

        </label>
        <label>
          <span>GST (%)</span>
          <select value={order.gst || 0} onChange={(e) => updateOrderField("gst", Number(e.target.value))}>
            {GST_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}%
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Budget</span>
          <input
            type="number"
            value={order.budget || ""}
            onChange={(e) => updateOrderField("budget", e.target.value)}
          />
        </label>
      </div>
      <div className={styles.row}>
        <label>
          <span>Order Start</span>
          <input
            type="datetime-local"
            value={order.orderStartDateTime || ""}
            onChange={(e) => updateOrderField("orderStartDateTime", e.target.value)}
          />
        </label>
        <label>
          <span>Order End</span>
          <input
            type="datetime-local"
            value={order.orderEndDateTime || ""}
            onChange={(e) => updateOrderField("orderEndDateTime", e.target.value)}
          />
        </label>
      </div>
      <div className={styles.calculationRow}>
        <div>
          <strong>Unit Price: </strong>₹{unitPrice}
        </div>
        <div>
          <strong>Total: </strong>₹{totalAmount}
        </div>
        <div>
          <strong>Total (GST): </strong>₹{totalAmountWithGST.toFixed(2)}
        </div>
      </div>
      <button
        type="button"
        className={styles.removeBtn}
        onClick={onRemoveOrder}
        disabled={disableRemove}
      >
        Remove Order
      </button>
    </div>
  );
}

// --- Helper: Calculate prices ---
function calculateOrderAmounts(order) {
  let unitPrice = 0;
  if (order.preSalesOrderSteps && order.preSalesOrderSteps.length) {
    order.preSalesOrderSteps.forEach((step) => {
      const stepList =
        PRINT_PRICES.clientTypes?.[order.clientType]?.orderTypes?.[order.orderType]?.printTypes?.[
          order.printType
        ]?.[step.stepName === "Printing" ? "Media" : step.stepName] || [];
      const found = stepList.find((opt) => opt.name === step.stepValue);
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
