import React, { useState } from "react";
import styles from "./AddPostSaleOrder.module.scss";
import PRINT_PRICES from "../../printprices";
import axios from "axios";
import { useData } from "../../context/DataContext";
import HeaderLinks from "../../Components/HeaderLinks";
// import { BASE_URL } from "../../api/constants"; // Adjust path as needed
import ContentStructure from "../../Layout/ContentStructure";
// ---- Constants ----
const BASE_URL = "https://api.alankardigitalhub.in/api";
const links = [
  { to: "/orders/new", label: "Add New Order" },
  { to: "/orders/ongoing", label: "On-goining Orders" },
  { to: "/orders/history", label: "History & Details" },
];

const CLIENT_TYPES = ["Cash", "Online", "Printers"];
const ORDER_STEPS = [
  // { key: "Media", label: "Media", stepName: "Media" },
  { key: "Lamination", label: "Lamination", stepName: "Lamination" },
  { key: "Mounting", label: "Mounting", stepName: "Mounting" },
  { key: "Framing", label: "Framing", stepName: "Framing" },
  { key: "Installation", label: "Installation", stepName: "Installation" },
];
const GST_OPTIONS = [0, 5, 12, 18];
const PRIORITY_OPTIONS = ["HIGH", "MEDIUM", "LOW"];

const initialClient = {
  id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  GSTCertificate: "",
  PAN: "",
};
const initialOrder = {
  status: "CREATED",
  priority: "HIGH",
  createdAtDateTime: "",
  orderStartDateTime: "",
  orderEndDateTime: "",
  orderType: "",
  printType: "",
  media: "",
  unitPrice: 0,
  qty: 1,
  height: 1,
  width: 1,
  totalAmount: 0,
  gst: 0,
  totalAmountWithGST: 0,
  steps: [],
  images: [],
};

const initialPostSales = {
  clientType: "",
  postSalesdateTime: "",
  remark: "",
  notified: false,
  status: "CREATED",
  client: { ...initialClient },
  orders: [{ ...initialOrder }],
};

export default function AddPostSale({ onClose }) {
  const { clients } = useData();
  const [existingClient, setExistingClient] = useState(true);
  const [client, setClient] = useState({ ...initialClient });
  const [postSales, setPostSales] = useState({ ...initialPostSales });
  const [orderImages, setOrderImages] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  function updateField(key, value) {
    setPostSales((ps) => {
      if (key === "clientType") {
        return {
          ...ps,
          clientType: value,
          orders: ps.orders.map((o) => ({ ...o, clientType: value })),
        };
      }
      return { ...ps, [key]: value };
    });
  }

  function updateOrder(idx, key, val) {
    setPostSales((prev) => {
      const arr = prev.orders.slice();
      arr[idx] = { ...arr[idx], [key]: val };
      return { ...prev, orders: arr };
    });
  }
  function updateOrderSteps(idx, steps) {
    setPostSales((prev) => {
      const arr = prev.orders.slice();
      arr[idx].steps = steps;
      const mediaStep = steps.find((s) => s.stepName === "Media");
      if (mediaStep) arr[idx].media = mediaStep.stepValue;
      return { ...prev, orders: arr };
    });
  }
  function handleAddOrder() {
    setPostSales((ps) => ({
      ...ps,
      orders: [...ps.orders, { ...initialOrder, clientType: ps.clientType }],
    }));
  }
  function handleRemoveOrder(idx) {
    setPostSales((ps) => {
      const arr = ps.orders.slice();
      arr.splice(idx, 1);
      return {
        ...ps,
        orders: arr.length
          ? arr
          : [{ ...initialOrder, clientType: ps.clientType }],
      };
    });
    setOrderImages((img) => {
      const cpy = { ...img };
      delete cpy[idx];
      return cpy;
    });
  }
  function handleImageChange(idx, files) {
    setOrderImages((imgs) => ({
      ...imgs,
      [idx]: Array.from(files),
    }));
    updateOrder(
      idx,
      "images",
      Array.from(files).map((f) => f.name)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    // Only allowed keys
    const ALLOWED_ORDER_FIELDS = [
      "priority",
      "unitPrice",
      "width",
      "printType",
      "orderType",
      "orderStartDateTime",
      "status",
      "createdAtDateTime",
      "images",
      "id",
      "totalAmount",
      "media",
      "height",
      "gst",
      "qty",
      "totalAmountWithGST",
      "orderEndDateTime",
      "steps",
    ];

    const ordersToSend = postSales.orders.map((order) => {
      const { unitPrice, totalAmount, totalAmountWithGST } =
        calculateOrderAmounts(order);

      // Filter user steps (not Printing or Delivery)
      const userSteps = (order.steps || []).filter(
        (s) => s.stepName !== "Printing" && s.stepName !== "Delivery"
      );

      // Always add Printing first and Delivery last
      const fullSteps = [
        {
          stepName: "Printing",
          stepValue: "Printing",
          status: "CREATED",
          stepNumber: 1,
        },
        ...userSteps.map((s, idx) => ({
          ...s,
          stepNumber: idx + 2,
        })),
        {
          stepName: "Delivery",
          stepValue: "Delivery",
          status: "CREATED",
          stepNumber: userSteps.length + 2,
        },
      ];

      const apiOrder = {
        ...order,
        unitPrice,
        totalAmount,
        totalAmountWithGST,
        steps: fullSteps,
        images: [],
      };

      return ALLOWED_ORDER_FIELDS.reduce((obj, key) => {
        if (apiOrder[key] !== undefined) obj[key] = apiOrder[key];
        return obj;
      }, {});
    });

    const reqBody = {
      ...postSales,
      client: existingClient ? { id: client.id } : { ...client },
      orders: ordersToSend,
    };

    const formData = new FormData();
    formData.append("postSales", JSON.stringify(reqBody));
    formData.append("isOldClient", String(existingClient));

    Object.entries(orderImages).forEach(([idx, files]) => {
      if (Array.isArray(files)) {
        files.forEach((file) => {
          formData.append(`orderImages[${idx}]`, file); // Fixed: Added backticks
        });
      }
    });
    console.log(reqBody);
    const token = sessionStorage.getItem("token");
    try {
      await axios.post(`${BASE_URL}/postsales/createpostsales`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Order Sucessfully added !");
      setResult({ success: true });
    } catch (err) {
      setResult({
        success: false,
        message: err?.response?.data?.message || "Failed to create post-sale",
      });
    }
    setSubmitting(false);
  }

  // ---- UI ----
  return (
    <ContentStructure links={links}>
      {/* <button className={styles.closeBtn} onClick={onClose} title="Close">&times;</button> */}
      <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
        <h2 className={styles.heading}>Add Post-Sale Order</h2>
        {/* --- Client Type Chip Selector --- */}
        <div className={styles.row}>
          <label>
            <span>Client Type</span>
            <div className={styles.optionsWrap}>
              {CLIENT_TYPES.map((ct) => (
                <button
                  key={ct}
                  type="button"
                  className={`${styles.optionChip} ${
                    postSales.clientType === ct ? styles.selected : ""
                  }`}
                  onClick={() => updateField("clientType", ct)}
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
            />{" "}
            Existing Client
          </label>
          <label className={!existingClient ? styles.selected : ""}>
            <input
              type="radio"
              checked={!existingClient}
              onChange={() => setExistingClient(false)}
            />{" "}
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
                  onChange={(e) =>
                    setClient((c) => ({ ...c, id: e.target.value }))
                  }
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
                    value={client.name}
                    onChange={(e) =>
                      setClient((c) => ({ ...c, name: e.target.value }))
                    }
                    required
                    placeholder="Client Name"
                  />
                </label>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={client.email}
                    onChange={(e) =>
                      setClient((c) => ({ ...c, email: e.target.value }))
                    }
                    placeholder="Email"
                  />
                </label>
              </div>
              <div className={styles.row}>
                <label>
                  <span>Phone</span>
                  <input
                    type="text"
                    value={client.phone}
                    onChange={(e) =>
                      setClient((c) => ({ ...c, phone: e.target.value }))
                    }
                    placeholder="Phone Number"
                  />
                </label>
                <label>
                  <span>Address</span>
                  <input
                    type="text"
                    value={client.address}
                    onChange={(e) =>
                      setClient((c) => ({ ...c, address: e.target.value }))
                    }
                    placeholder="Address"
                  />
                </label>
              </div>
              <div className={styles.row}>
                <label>
                  <span>GST Certificate</span>
                  <input
                    type="text"
                    value={client.GSTCertificate}
                    onChange={(e) =>
                      setClient((c) => ({
                        ...c,
                        GSTCertificate: e.target.value,
                      }))
                    }
                    placeholder="GST Certificate Number"
                  />
                </label>
                <label>
                  <span>PAN</span>
                  <input
                    type="text"
                    value={client.PAN}
                    onChange={(e) =>
                      setClient((c) => ({ ...c, PAN: e.target.value }))
                    }
                    placeholder="PAN"
                  />
                </label>
              </div>
            </>
          )}
        </div>
        <div className={styles.divider} />
        {/* --- PostSale Main Fields --- */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Order Details</h3>
          <div className={styles.row}>
            <label>
              <span>Date & Time</span>
              <input
                type="datetime-local"
                value={postSales.postSalesdateTime}
                onChange={(e) =>
                  updateField("postSalesdateTime", e.target.value)
                }
              />
            </label>
            <label>
              <span>Status</span>
              <select
                value={postSales.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
                <option value="CREATED">CREATED</option>
                <option value="NOTIFIED">NOTIFIED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </label>
            <label>
              <span>Notified</span>
              <input
                type="checkbox"
                checked={postSales.notified}
                onChange={(e) => updateField("notified", e.target.checked)}
                style={{ width: 20 }}
              />
            </label>
          </div>
          <div className={styles.row}>
            <label style={{ flex: 1 }}>
              <span>Remark</span>
              <input
                type="text"
                value={postSales.remark}
                onChange={(e) => updateField("remark", e.target.value)}
                placeholder="Remark"
              />
            </label>
          </div>
        </div>
        <div className={styles.divider} />
        {/* --- Orders --- */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Orders</h3>
          {postSales.orders.map((order, idx) => (
            <OrderConfigurator
              key={idx}
              index={idx}
              parentClientType={postSales.clientType}
              order={order}
              updateOrderField={(key, val) => updateOrder(idx, key, val)}
              updateOrderSteps={(steps) => updateOrderSteps(idx, steps)}
              onRemoveOrder={() => handleRemoveOrder(idx)}
              disableRemove={postSales.orders.length === 1}
              onImageChange={handleImageChange}
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
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          {result && (
            <span
              className={result.success ? styles.successMsg : styles.errorMsg}
            >
              {result.success ? "Saved Successfully!" : result.message}
            </span>
          )}
        </div>
      </form>
    </ContentStructure>
  );
}

// -------- ORDER CONFIGURATOR COMPONENT --------
// function OrderConfigurator({
//   index,
//   parentClientType,
//   order,
//   updateOrderField,
//   updateOrderSteps,
//   onRemoveOrder,
//   disableRemove,
//   onImageChange,
// }) {
//   const [stepSelections, setStepSelections] = useState({});
//   const clientType = order.clientType || parentClientType || "";
//   const clientTypesObj = PRINT_PRICES?.clientTypes || {};
//   const orderTypesObj =
//     clientType && clientTypesObj[clientType]
//       ? clientTypesObj[clientType].orderTypes || {}
//       : {};
//   const printTypesObj =
//     order.orderType && orderTypesObj[order.orderType]
//       ? orderTypesObj[order.orderType].printTypes || {}
//       : {};
//   const stepOptionLists =
//     order.printType && printTypesObj[order.printType]
//       ? Object.entries(printTypesObj[order.printType])
//           .filter(([group]) => ORDER_STEPS.some((s) => s.key === group))
//           .reduce((acc, [group, opts]) => {
//             acc[group] = opts;
//             return acc;
//           }, {})
//       : {};

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
//     const steps = ORDER_STEPS.map((step) =>
//       next[step.key]
//         ? {
//             stepName: step.stepName,
//             stepValue: next[step.key],
//             status: "CREATED",
//           }
//         : null
//     ).filter(Boolean);
//     updateOrderSteps(steps);
//     if (group === "Media") updateOrderField("media", value);
//   }

//   const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts({
//     ...order,
//     steps: order.steps.length
//       ? order.steps
//       : ORDER_STEPS.map((step) =>
//           stepSelections[step.key]
//             ? {
//                 stepName: step.stepName,
//                 stepValue: stepSelections[step.key],
//                 status: "CREATED",
//               }
//             : null
//         ).filter(Boolean),
//   });

//   React.useEffect(() => {
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
//           <span>Order Type</span>
//           <select
//             value={order.orderType || ""}
//             onChange={(e) => handleOrderType(e.target.value)}
//             required
//           >
//             <option value="">Select Order Type</option>
//             {clientType &&
//               Object.keys(orderTypesObj).map((ot) => (
//                 <option key={ot} value={ot}>
//                   {ot}
//                 </option>
//               ))}
//           </select>
//         </label>
//       </div>
//       <div className={styles.row}>
//         <label>
//           <span>Print Type</span>
//           <div className={styles.optionsWrap}>
//             {order.orderType &&
//               Object.keys(printTypesObj).length > 0 &&
//               Object.keys(printTypesObj).map((pt) => (
//                 <button
//                   key={pt}
//                   type="button"
//                   className={`${styles.optionChip} ${
//                     order.printType === pt ? styles.selected : ""
//                   }`}
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
//                       stepSelections[step.key] === opt.name
//                         ? styles.selected
//                         : ""
//                     }`}
//                     onClick={() =>
//                       handleStepSelect(
//                         step.key,
//                         stepSelections[step.key] === opt.name ? "" : opt.name
//                       )
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
//           <span>Priority</span>
//           <select
//             value={order.priority}
//             onChange={(e) => updateOrderField("priority", e.target.value)}
//           >
//             {PRIORITY_OPTIONS.map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt}
//               </option>
//             ))}
//           </select>
//         </label>
//         <label>
//           <span>Status</span>
//           <select
//             value={order.status}
//             onChange={(e) => updateOrderField("status", e.target.value)}
//           >
//             <option value="CREATED">CREATED</option>
//             <option value="IN_PROGRESS">IN_PROGRESS</option>
//             <option value="COMPLETED">COMPLETED</option>
//           </select>
//         </label>
//       </div>
//       <div className={styles.row}>
//         <label>
//           <span>Start</span>
//           <input
//             type="datetime-local"
//             value={order.orderStartDateTime || ""}
//             onChange={(e) =>
//               updateOrderField("orderStartDateTime", e.target.value)
//             }
//           />
//         </label>
//         <label>
//           <span>End</span>
//           <input
//             type="datetime-local"
//             value={order.orderEndDateTime || ""}
//             onChange={(e) =>
//               updateOrderField("orderEndDateTime", e.target.value)
//             }
//           />
//         </label>
//       </div>
//       <div className={styles.row}>
//         <label>
//           <span>Height (ft)</span>
//           <input
//             type="number"
//             min={1}
//             value={order.height || 1}
//             onChange={(e) => {
//               const newHeight = Number(e.target.value);
//               updateOrderField("height", newHeight);
//               updateOrderField("qty", (newHeight || 1) * (order.width || 1));
//             }}
//           />
//         </label>
//         <label>
//           <span>Width (ft)</span>
//           <input
//             type="number"
//             min={1}
//             value={order.width || 1}
//             onChange={(e) => {
//               const newWidth = Number(e.target.value);
//               updateOrderField("width", newWidth);
//               updateOrderField("qty", (order.height || 1) * (newWidth || 1));
//             }}
//           />
//         </label>
//         <label>
//           <span>Measurement (sqft)</span>
//           <input
//             type="number"
//             min={1}
//             value={order.qty || 1}
//             onChange={(e) => updateOrderField("qty", Number(e.target.value))}
//           />
//         </label>
//       </div>
//       <div className={styles.row}>
//         <label>
//           <span>GST (%)</span>
//           <select
//             value={order.gst}
//             onChange={(e) => updateOrderField("gst", Number(e.target.value))}
//           >
//             {GST_OPTIONS.map((g) => (
//               <option key={g} value={g}>
//                 {g}%
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
//       {/* <div className={styles.calculationRow}>
//         <div>
       
//           <strong>Unit Price:</strong> ₹{unitPrice}
//         </div>
//         <div>
//           <strong>Total:</strong> ₹{totalAmount}
//         </div>
//         <div>
//           <strong>Total (GST):</strong> ₹{totalAmountWithGST.toFixed(2)}
//         </div>
//       </div> */}
//       <br />
//       <div className={styles.calculationRow}>
//         <div>
//           <strong>Unit Price:</strong>
//           <input
//             type="number"
//             min={0}
//             value={
//               order.unitPrice !== undefined &&
//               order.unitPrice !== null &&
//               order.unitPrice !== 0
//                 ? order.unitPrice
//                 : unitPrice
//             }
//             onChange={(e) => {
//               const value = Number(e.target.value);
//               updateOrderField("unitPrice", value);
//             }}
//             className={styles.inputCalc}
//             placeholder={`Auto: ${unitPrice}`}
//           />
//         </div>
//         <div>
//           <strong>Total:</strong>
//           <input
//             type="number"
//             min={0}
//             value={
//               order.totalAmount !== undefined &&
//               order.totalAmount !== null &&
//               order.totalAmount !== 0
//                 ? order.totalAmount
//                 : totalAmount
//             }
//             onChange={(e) => {
//               const value = Number(e.target.value);
//               updateOrderField("totalAmount", value);
//             }}
//             className={styles.inputCalc}
//             placeholder={`Auto: ${totalAmount}`}
//           />
//         </div>
//         <div>
//           <strong>Total (GST):</strong>
//           <input
//             type="number"
//             min={0}
//             value={
//               order.totalAmountWithGST !== undefined &&
//               order.totalAmountWithGST !== null &&
//               order.totalAmountWithGST !== 0
//                 ? order.totalAmountWithGST
//                 : totalAmountWithGST.toFixed(2)
//             }
//             onChange={(e) => {
//               const value = Number(e.target.value);
//               updateOrderField("totalAmountWithGST", value);
//             }}
//             className={styles.inputCalc}
//             placeholder={`Auto: ${totalAmountWithGST.toFixed(2)}`}
//           />
//         </div>
//       </div>{" "}
//       <br />
//       {/* ---- Image upload ---- */}
//       <div className={styles.row}>
//         <label>
//           <span>Order Images</span>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={(e) => onImageChange(index, e.target.files)}
//           />
//         </label>
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
// Replace your OrderConfigurator component with this compact version

function OrderConfigurator({
  index,
  parentClientType,
  order,
  updateOrderField,
  updateOrderSteps,
  onRemoveOrder,
  disableRemove,
  onImageChange,
}) {
  const [stepSelections, setStepSelections] = useState({});
  const clientType = order.clientType || parentClientType || "";
  const clientTypesObj = PRINT_PRICES?.clientTypes || {};
  const orderTypesObj =
    clientType && clientTypesObj[clientType]
      ? clientTypesObj[clientType].orderTypes || {}
      : {};
  const printTypesObj =
    order.orderType && orderTypesObj[order.orderType]
      ? orderTypesObj[order.orderType].printTypes || {}
      : {};
  const stepOptionLists =
    order.printType && printTypesObj[order.printType]
      ? Object.entries(printTypesObj[order.printType])
          .filter(([group]) => ORDER_STEPS.some((s) => s.key === group))
          .reduce((acc, [group, opts]) => {
            acc[group] = opts;
            return acc;
          }, {})
      : {};

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
    const steps = ORDER_STEPS.map((step) =>
      next[step.key]
        ? {
            stepName: step.stepName,
            stepValue: next[step.key],
            status: "CREATED",
          }
        : null
    ).filter(Boolean);
    updateOrderSteps(steps);
    if (group === "Media") updateOrderField("media", value);
  }

  const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts({
    ...order,
    steps: order.steps.length
      ? order.steps
      : ORDER_STEPS.map((step) =>
          stepSelections[step.key]
            ? {
                stepName: step.stepName,
                stepValue: stepSelections[step.key],
                status: "CREATED",
              }
            : null
        ).filter(Boolean),
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
  }, [unitPrice, totalAmount, totalAmountWithGST]);

  return (
    <div className={styles.compactOrderCard}>
      {/* Order Header */}
      <div className={styles.orderHeader}>
        <h4 className={styles.orderTitle}>Order #{index + 1}</h4>
        <button
          type="button"
          className={styles.removeBtn}
          onClick={onRemoveOrder}
          disabled={disableRemove}
          title="Remove Order"
        >
          ✕
        </button>
      </div>

      {/* Row 1: Order Type, Print Type, and Steps */}
      <div className={styles.orderRow1}>
        {/* Order Type */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Order Type</label>
          <select
            value={order.orderType || ""}
            onChange={(e) => handleOrderType(e.target.value)}
            required
            className={styles.compactSelect}
          >
            <option value="">Select Type</option>
            {clientType &&
              Object.keys(orderTypesObj).map((ot) => (
                <option key={ot} value={ot}>
                  {ot}
                </option>
              ))}
          </select>
        </div>

        {/* Print Type */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Print Type</label>
          <div className={styles.compactChips}>
            {order.orderType &&
              Object.keys(printTypesObj).length > 0 &&
              Object.keys(printTypesObj).map((pt) => (
                <button
                  key={pt}
                  type="button"
                  className={`${styles.compactChip} ${
                    order.printType === pt ? styles.selected : ""
                  }`}
                  onClick={() => handlePrintType(pt)}
                >
                  {pt}
                </button>
              ))}
          </div>
        </div>

        {/* Steps (Media, Lamination, etc.) */}
        {order.printType && (
          <div className={styles.stepsContainer}>
            {ORDER_STEPS.map((step) => (
              <div key={step.key} className={styles.stepField}>
                <label className={styles.fieldLabel}>{step.label}</label>
                <select
                  value={stepSelections[step.key] || ""}
                  onChange={(e) => handleStepSelect(step.key, e.target.value)}
                  className={styles.compactSelect}
                >
                  <option value="">None</option>
                  {(stepOptionLists[step.key] || []).map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.name}
                      {typeof opt.cost === "number"
                        ? ` (₹${opt.cost})`
                        : typeof opt.costCMYK === "number"
                        ? ` (₹${opt.costCMYK})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Row 2: Dimensions, Quantities, Pricing, and Controls */}
      <div className={styles.orderRow2}>
        {/* Dimensions Group */}
        <div className={styles.dimensionsGroup}>
          <label className={styles.groupLabel}>Dimensions</label>
          <div className={styles.dimensionFields}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>H (ft)</label>
              <input
                type="number"
                min={1}
                value={order.height || 1}
                onChange={(e) => {
                  const newHeight = Number(e.target.value);
                  updateOrderField("height", newHeight);
                  updateOrderField("qty", (newHeight || 1) * (order.width || 1));
                }}
                className={styles.compactInput}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>W (ft)</label>
              <input
                type="number"
                min={1}
                value={order.width || 1}
                onChange={(e) => {
                  const newWidth = Number(e.target.value);
                  updateOrderField("width", newWidth);
                  updateOrderField("qty", (order.height || 1) * (newWidth || 1));
                }}
                className={styles.compactInput}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Area (sqft)</label>
              <input
                type="number"
                min={1}
                value={order.qty || 1}
                onChange={(e) => updateOrderField("qty", Number(e.target.value))}
                className={styles.compactInput}
              />
            </div>
          </div>
        </div>

        {/* Pricing Group */}
        <div className={styles.pricingGroup}>
          <label className={styles.groupLabel}>Pricing</label>
          <div className={styles.pricingFields}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>GST (%)</label>
              <select
                value={order.gst}
                onChange={(e) => updateOrderField("gst", Number(e.target.value))}
                className={styles.compactSelect}
              >
                {GST_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}%
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Unit Price (₹)</label>
              <input
                type="number"
                min={0}
                value={
                  order.unitPrice !== undefined &&
                  order.unitPrice !== null &&
                  order.unitPrice !== 0
                    ? order.unitPrice
                    : unitPrice
                }
                onChange={(e) => {
                  const value = Number(e.target.value);
                  updateOrderField("unitPrice", value);
                }}
                className={styles.compactInput}
                placeholder={`Auto: ${unitPrice}`}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Total (₹)</label>
              <input
                type="number"
                min={0}
                value={
                  order.totalAmount !== undefined &&
                  order.totalAmount !== null &&
                  order.totalAmount !== 0
                    ? order.totalAmount
                    : totalAmount
                }
                onChange={(e) => {
                  const value = Number(e.target.value);
                  updateOrderField("totalAmount", value);
                }}
                className={styles.compactInput}
                placeholder={`Auto: ${totalAmount}`}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>With GST (₹)</label>
              <input
                type="number"
                min={0}
                value={
                  order.totalAmountWithGST !== undefined &&
                  order.totalAmountWithGST !== null &&
                  order.totalAmountWithGST !== 0
                    ? order.totalAmountWithGST
                    : totalAmountWithGST.toFixed(2)
                }
                onChange={(e) => {
                  const value = Number(e.target.value);
                  updateOrderField("totalAmountWithGST", value);
                }}
                className={styles.compactInput}
                placeholder={`Auto: ${totalAmountWithGST.toFixed(2)}`}
              />
            </div>
          </div>
        </div>

        {/* Status & Dates Group */}
        <div className={styles.statusGroup}>
          <label className={styles.groupLabel}>Status & Schedule</label>
          <div className={styles.statusFields}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Priority</label>
              <select
                value={order.priority}
                onChange={(e) => updateOrderField("priority", e.target.value)}
                className={styles.compactSelect}
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Status</label>
              <select
                value={order.status}
                onChange={(e) => updateOrderField("status", e.target.value)}
                className={styles.compactSelect}
              >
                <option value="CREATED">CREATED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Start Date</label>
              <input
                type="datetime-local"
                value={order.orderStartDateTime || ""}
                onChange={(e) =>
                  updateOrderField("orderStartDateTime", e.target.value)
                }
                className={styles.compactInput}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>End Date</label>
              <input
                type="datetime-local"
                value={order.orderEndDateTime || ""}
                onChange={(e) =>
                  updateOrderField("orderEndDateTime", e.target.value)
                }
                className={styles.compactInput}
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className={styles.imageGroup}>
          <label className={styles.groupLabel}>Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onImageChange(index, e.target.files)}
            className={styles.compactFileInput}
          />
        </div>
      </div>
    </div>
  );
}
// --- Helper: Calculate prices ---
function calculateOrderAmounts(order) {
  let unitPrice = 0;
  if (order.steps && order.steps.length) {
    order.steps.forEach((step) => {
      const stepList =
        PRINT_PRICES.clientTypes?.[order.clientType]?.orderTypes?.[
          order.orderType
        ]?.printTypes?.[order.printType]?.[
          step.stepName === "Media" ? "Media" : step.stepName
        ] || [];
      const found = stepList.find((opt) => opt.name === step.stepValue);
      if (found) {
        if (typeof found.cost === "number") unitPrice += found.cost;
        else if (typeof found.costCMYK === "number")
          unitPrice += found.costCMYK;
      }
    });
  }
  const qty = Number(order.qty) || 1;
  const gst = Number(order.gst) || 0;
  const totalAmount = unitPrice * qty;
  const totalAmountWithGST = totalAmount + (totalAmount * gst) / 100;
  return { unitPrice, totalAmount, totalAmountWithGST };
}
