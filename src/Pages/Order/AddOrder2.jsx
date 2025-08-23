import React, { useState, useEffect } from "react";
import styles from "./NewJobcardForm.module.scss";
import { useData } from "../../context/DataContext";
import ContentStructure from "../../Layout/ContentStructure";
import PRINT_PRICES from "../../printprices";
import axios from "axios";
import { BASE_URL } from "../../api/constants.js";
import SmartDescriptionInput from "../../Components/SmartDescriptionInput";

const links = [
  { to: "/orders/new", label: "Add New Order" },
  { to: "/orders/ongoing", label: "On-goining Orders" },
  // { to: "/orders/history", label: "History & Details" },
];
const initialClient = { 
  id: "", 
  name: "", 
  email: "", 
  phone: "", 
  address: "", 
  GSTCertificate: "", 
  PAN: "" 
};

const initialJobItem = {
  description: "",
  status: "CREATED",
  priority: "HIGH",
  orderType: "",
  printType: "",
  media: "",
  lamination: "",
  mounting: "",
  framing: "",
  installation: "",
  unitPrice: 0,
  qty: 1,
  measurement: 0,
  height: 1,
  width: 1,
  totalAmount: 0,
  gst: 18,
  totalAmountWithGST: 0,
  steps: [],
  images: []
};

const initialJobcard = {
  clientType: "Cash",
  postSalesdateTime: new Date().toISOString().slice(0, 16),
  remark: "",
  notified: false,
  status: "CREATED",
  client: { ...initialClient },
  orders: [{ ...initialJobItem }]
};

const ORDER_STEPS = [
  // { key: "Media", label: "Media", stepName: "Media" },
  { key: "Lamination", label: "Lamination", stepName: "Lamination" },
  { key: "Mounting", label: "Mounting", stepName: "Mounting" },
  { key: "Framing", label: "Framing", stepName: "Framing" },
  { key: "Installation", label: "Installation", stepName: "Installation" }
];

const GST_OPTIONS = [0, 5, 12, 16, 18];

export default function NewJobcardForm() {
  const { clients } = useData();
  const [existingClient, setExistingClient] = useState(true);
  const [client, setClient] = useState({ ...initialClient });
  const [jobcard, setJobcard] = useState({ ...initialJobcard });
  const [orderImages, setOrderImages] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedOrderType, setSelectedOrderType] = useState('');
// inside NewJobcardForm component
const isFormDisabled = () => {
  // disable if no client is chosen
  return !client?.id && existingClient; 
};

  // Set default order type when clientType changes
  useEffect(() => {
    const orderTypes = Object.keys(
      PRINT_PRICES.clientTypes[jobcard.clientType]?.orderTypes || {}
    );
    if (orderTypes.length && !selectedOrderType) {
      setSelectedOrderType(orderTypes[0]);
      setJobcard((prev) => ({
        ...prev,
        orders: prev.orders.map((order) => ({ 
          ...order, 
          orderType: orderTypes[0],
          printType: '',
          media: '',
          lamination: '',
          mounting: '',
          framing: '',
          installation: '',
          steps: []
        }))
      }));
    }
  }, [jobcard.clientType, selectedOrderType]);

  // ---------- Dynamic options ----------
  const getOrderTypes = () => {
    if (!jobcard.clientType) return [];
    return Object.keys(
      PRINT_PRICES.clientTypes[jobcard.clientType]?.orderTypes || {}
    );
  };

  const getPrintTypes = (orderType) => {
    if (!jobcard.clientType || !orderType) return [];
    return Object.keys(
      PRINT_PRICES.clientTypes[jobcard.clientType].orderTypes[orderType]
        .printTypes || {}
    );
  };

  const getStepOptions = (orderType, printType, stepKey) => {
    if (!jobcard.clientType || !orderType || !printType) return [];
    return (
      PRINT_PRICES.clientTypes[jobcard.clientType].orderTypes[orderType]
        .printTypes[printType][stepKey] || []
    );
  };

  // ---------- Helper function to get cost from options ----------
  const getCostFromOption = (options, selectedValue) => {
    if (!options || !selectedValue) return 0;
    const option = options.find(opt => opt.name === selectedValue);
    if (!option) return 0;
    
    if (option.cost !== undefined) return option.cost;
    if (option.costCMYK !== undefined) return option.costCMYK;
    if (option.costCMYKW !== undefined) return option.costCMYKW;
    return 0;
  };

  // ---------- Calculate unit price from steps ----------
  const calculateUnitPrice = (order) => {
    let unitPrice = 0;
    if (order.steps && order.steps.length) {
      order.steps.forEach((step) => {
        const stepList = getStepOptions(order.orderType, order.printType, step.stepName);
        const found = stepList.find((opt) => opt.name === step.stepValue);
        if (found) {
          unitPrice += getCostFromOption([found], step.stepValue);
        }
      });
    }
    return unitPrice;
  };

  // ---------- Calculate order amounts ----------
  const calculateOrderAmounts = (order) => {
    const unitPrice = calculateUnitPrice(order);
    const area = (order.width || 0) * (order.height || 0);
    const qty = Number(order.qty) || 1;
    const totalAmount = unitPrice * area * qty;
    const gst = Number(order.gst) || 0;
    const totalAmountWithGST = totalAmount + (totalAmount * gst) / 100;
    return { unitPrice, area, qty, totalAmount, totalAmountWithGST };
  };

  const updateJobcard = (key, value) => {
    setJobcard((prev) => {
      if (key === "clientType") {
        // Reset order type when client type changes
        setSelectedOrderType('');
        return {
          ...prev,
          clientType: value,
          orders: prev.orders.map((o) => ({ 
            ...o, 
            clientType: value,
            orderType: '',
            printType: '',
            media: '',
            lamination: '',
            mounting: '',
            framing: '',
            installation: '',
            steps: []
          }))
        };
      }
      return { ...prev, [key]: value };
    });
  };

  const updateOrder = (index, key, value) => {
    setJobcard((prev) => {
      const orders = [...prev.orders];
      orders[index] = { ...orders[index], [key]: value };

      // Calculate area and measurement
      const area = (orders[index].width || 0) * (orders[index].height || 0);
      orders[index].measurement = area;

      // Recalculate amounts
      const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts(orders[index]);
      orders[index].unitPrice = unitPrice;
      orders[index].totalAmount = totalAmount;
      orders[index].totalAmountWithGST = totalAmountWithGST;

      return { ...prev, orders };
    });
  };

  const updateOrderSteps = (index, steps) => {
    setJobcard((prev) => {
      const orders = [...prev.orders];
      orders[index].steps = steps;
      
      const mediaStep = steps.find((s) => s.stepName === "Media");
      if (mediaStep) orders[index].media = mediaStep.stepValue;

      // Calculate area and measurement
      const area = (orders[index].width || 0) * (orders[index].height || 0);
      orders[index].measurement = area;

      // Recalculate amounts
      const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts(orders[index]);
      orders[index].unitPrice = unitPrice;
      orders[index].totalAmount = totalAmount;
      orders[index].totalAmountWithGST = totalAmountWithGST;

      return { ...prev, orders };
    });
  };

  const handleOrderTypeChange = (orderType) => {
    setSelectedOrderType(orderType);
  };

  const addOrder = () => {
    setJobcard((prev) => ({
      ...prev,
      orders: [...prev.orders, { 
        ...initialJobItem, 
        clientType: prev.clientType,
        orderType: selectedOrderType
      }],
    }));
  };

  const removeOrder = (index) => {
    if (jobcard.orders.length > 1) {
      setJobcard((prev) => ({
        ...prev,
        orders: prev.orders.filter((_, i) => i !== index),
      }));
      
      // Remove images for this order
      setOrderImages((imgs) => {
        const newImgs = { ...imgs };
        delete newImgs[index];
        return newImgs;
      });
    }
  };

  const handleImageChange = (index, files) => {
    setOrderImages((imgs) => ({
      ...imgs,
      [index]: Array.from(files)
    }));
    updateOrder(index, "images", Array.from(files).map(f => f.name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const ALLOWED_ORDER_FIELDS = [
        "priority", "unitPrice", "width", "printType", "orderType",
        "status", "images", "totalAmount", "media", "height", "gst", "qty",
        "totalAmountWithGST", "steps", "description", "measurement"
      ];

      const ordersToSend = jobcard.orders.map((order) => {
        const userSteps = (order.steps || []).filter(
          s => s.stepName !== "Printing" && s.stepName !== "Delivery"
        );

        const fullSteps = [
          {
            stepName: "Printing",
            stepValue: "Printing",
            status: "CREATED",
            stepNumber: 1
          },
          ...userSteps.map((s, idx) => ({
            ...s,
            stepNumber: idx + 2
          })),
          {
            stepName: "Delivery",
            stepValue: "Delivery",
            status: "CREATED",
            stepNumber: userSteps.length + 2
          }
        ];

        const apiOrder = {
          ...order,
          steps: fullSteps,
          images: []
        };

        return ALLOWED_ORDER_FIELDS.reduce((obj, key) => {
          if (apiOrder[key] !== undefined) obj[key] = apiOrder[key];
          return obj;
        }, {});
      });

      const reqBody = {
        ...jobcard,
        client: existingClient ? { id: client.id } : { ...client },
        orders: ordersToSend
      };

      const formData = new FormData();
      formData.append("postSales", JSON.stringify(reqBody));
      formData.append("isOldClient", String(existingClient));

      Object.entries(orderImages).forEach(([idx, files]) => {
        if (Array.isArray(files)) {
          files.forEach((file) => {
            formData.append(`orderImages[${idx}]`, file);
          });
        }
      });

      const token = sessionStorage.getItem('token');
      
      await axios.post(`${BASE_URL}/postsales/createpostsales`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      alert("Order Successfully added!");
      setResult({ success: true });
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setResult({ 
        success: false, 
        message: error?.response?.data?.message || "Failed to create order" 
      });
    }
    setSubmitting(false);
  };

  // Calculate totals for all orders
  const calculateTotals = () => {
    return jobcard.orders.reduce((totals, order) => {
      const { area, totalAmount } = calculateOrderAmounts(order);
      return {
        totalWidth: totals.totalWidth + (order.width || 0),
        totalHeight: totals.totalHeight + (order.height || 0),
        totalArea: totals.totalArea + area,
        totalQty: totals.totalQty + (order.qty || 0),
        grandTotal: totals.grandTotal + totalAmount
      };
    }, { totalWidth: 0, totalHeight: 0, totalArea: 0, totalQty: 0, grandTotal: 0 });
  };

  const totals = calculateTotals();

  return (
    <ContentStructure links={links}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>New Order</h1>
          <div className={styles.dateSection}>
            <span>Order Date</span>
            <input
              type="datetime-local"
              value={jobcard.postSalesdateTime}
              onChange={(e) => updateJobcard("postSalesdateTime", e.target.value)}
              className={styles.dateInput}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Top Controls */}
          <div className={styles.topControls}>
            <div className={styles.clientSection}>
              <label className={styles.label}>Select Client *</label>
              <div className={styles.clientControl}>
                {existingClient ? (
                  <select
                    value={client.id}
                    onChange={(e) => setClient((c) => ({ ...c, id: e.target.value }))}
                    required
                    className={styles.select}
                  >
                    <option value="">Select Customer</option>
                    {clients?.map((clientItem) => (
                      <option key={clientItem.id} value={clientItem.id}>
                        {clientItem.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={client.name}
                    onChange={(e) => setClient((c) => ({ ...c, name: e.target.value }))}
                    placeholder="Enter customer name"
                    required
                    className={styles.input}
                  />
                )}
                {/* <button 
                  type="button" 
                  className={styles.addBtn}
                  onClick={() => setExistingClient(!existingClient)}
                >
                  +
                </button> */}
              </div>
            </div>

            <div className={styles.clientTypeSection}>
              <label className={styles.label}>Select Client Type *</label>
              <div className={styles.clientTypeButtons}>
                {Object.keys(PRINT_PRICES.clientTypes).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`${styles.typeBtn} ${jobcard.clientType === type ? styles.selected : ''}`}
                    onClick={() => updateJobcard("clientType", type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Type Tabs */}
          <div className={styles.tabs}>
            {getOrderTypes().map((orderType) => (
              <button 
                key={orderType}
                type="button"
                className={`${styles.tab} ${selectedOrderType === orderType ? styles.active : ''}`}
                onClick={() => handleOrderTypeChange(orderType)}
              >
                {orderType}
                <span className={styles.badge}>
                  {jobcard.orders.filter(order => order.orderType === orderType).length}
                </span>
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>Order Type</th>
                  <th>Description</th>
                  <th>Print Type</th>
                  <th>Media</th>
                  <th>Lamination</th>
                  <th>Mounting</th>
                  <th>Framing</th>
                  <th>Installation</th>
                  <th>Width<br/>(Feet)</th>
                  <th>Height<br/>(Feet)</th>
                  <th>Area<br/>(Sq.Ft)</th>
                  <th>Qty</th>
                  <th>Rate<br/>(₹/Sq.Ft)</th>
                  <th>GST<br/>(%)</th>
                  <th>Amount<br/>(₹)</th>
                  <th>Images</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobcard.orders.map((order, index) => (
                  <OrderTableRow
                    key={`${index}-${order.orderType}`}
                    order={order}
                    index={index}
                    clientType={jobcard.clientType}
                    updateOrder={updateOrder}
                    updateOrderSteps={updateOrderSteps}
                    removeOrder={removeOrder}
                    canRemove={jobcard.orders.length > 1}
                    getOrderTypes={getOrderTypes}
                    getPrintTypes={getPrintTypes}
                    getStepOptions={getStepOptions}
                    calculateOrderAmounts={calculateOrderAmounts}
                    handleImageChange={handleImageChange}
                    orderImages={orderImages}   isDisabled={isFormDisabled()}   
                  />
                ))}
                
                {/* Total Row */}
                <tr className={styles.totalRow}>
                  <td><strong>Total</strong></td>
                  <td colSpan="7"></td>
                  <td><strong>{totals.totalWidth.toFixed(1)}</strong></td>
                  <td><strong>{totals.totalHeight.toFixed(1)}</strong></td>
                  <td><strong>{totals.totalArea.toFixed(2)}</strong></td>
                  <td><strong>{totals.totalQty}</strong></td>
                  <td></td>
                  <td></td>
                  <td><strong>₹{totals.grandTotal.toFixed(2)}</strong></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Add Item Button */}
          <div className={styles.addItemSection}>
            <button type="button" className={styles.addItemBtn} onClick={addOrder}>
              + Add Item
            </button>
          </div>

          {/* Submit Section */}
          <div className={styles.submitSection}>
            <button type="submit" className={styles.saveBtn} disabled={submitting}>
              {submitting ? "Saving..." : "SAVE"}
            </button>
            <button type="button" className={styles.cancelBtn}>
              CANCEL
            </button>
          </div>

          {result && (
            <div className={result.success ? styles.successMsg : styles.errorMsg}>
              {result.success ? "Order saved successfully!" : result.message}
            </div>
          )}
        </form>
      </div>
    </ContentStructure>
  );
}

// Order Table Row Component
function OrderTableRow({
  order,
  index,
  clientType,
  updateOrder,
  updateOrderSteps,
  removeOrder,
  canRemove,
  getOrderTypes,
  getPrintTypes,
  getStepOptions,
  calculateOrderAmounts,
  handleImageChange,
  orderImages ,isDisabled
}) {
  // Initialize step selections based on current order values
  const [stepSelections, setStepSelections] = useState(() => ({
    Media: order.media || "",
    Lamination: order.lamination || "",
    Mounting: order.mounting || "",
    Framing: order.framing || "",
    Installation: order.installation || ""
  }));

  // Update step selections when order changes
  useEffect(() => {
    setStepSelections({
      Media: order.media || "",
      Lamination: order.lamination || "",
      Mounting: order.mounting || "",
      Framing: order.framing || "",
      Installation: order.installation || ""
    });
  }, [order.media, order.lamination, order.mounting, order.framing, order.installation]);

  const handleStepSelect = (stepKey, value) => {
    const next = { ...stepSelections, [stepKey]: value };
    setStepSelections(next);
    
    const steps = Object.entries(next)
      .filter(([key, val]) => val && val !== "")
      .map(([key, val]) => ({
        stepName: key,
        stepValue: val,
        status: "CREATED"
      }));
    
    updateOrderSteps(index, steps);
    updateOrder(index, stepKey.toLowerCase(), value);
  };

  const handlePrintTypeChange = (value) => {
    updateOrder(index, "printType", value);
    // Reset step selections when print type changes
    const resetSteps = {
      Media: "",
      Lamination: "",
      Mounting: "",
      Framing: "",
      Installation: ""
    };
    setStepSelections(resetSteps);
    updateOrderSteps(index, []);
    // Reset individual step values
    updateOrder(index, "media", "");
    updateOrder(index, "lamination", "");
    updateOrder(index, "mounting", "");
    updateOrder(index, "framing", "");
    updateOrder(index, "installation", "");
  };

  const { unitPrice, area, totalAmount } = calculateOrderAmounts(order);

  return (
    <tr className={styles.orderRow}>
      <td>
      <select style={{width:"100px"}}
  value={order.orderType || ""}
  onChange={(e) => updateOrder(index, "orderType", e.target.value)}
  className={styles.tableSelect}
  disabled={isDisabled}
>
  <option value="">Select Order Type</option>
  {getOrderTypes().map((type) => {
    const abbreviation = type
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();

    return (
      <option key={type} value={type}>
        {abbreviation}
      </option>
    );
  })}
</select>

      </td>
      <td>
        {/* <input
          type="text"
          value={order.description}
          onChange={(e) => updateOrder(index, "description", e.target.value)}
          className={styles.tableInput}
          placeholder="Enter description"
        /> */}
    
  <SmartDescriptionInput
    value={order.description}
    onChange={(value) => updateOrder(index, "description", value)}
    order={order}
    placeholder="Enter description or select from suggestions"
    className={styles.tableInput}
  />

      </td>
      <td>
        <select
          value={order.printType || ""}
          onChange={(e) => handlePrintTypeChange(e.target.value)}
          className={styles.tableSelect}  disabled={isDisabled}  
        >
          <option value="">Select Print Type</option>
          {order.orderType && getPrintTypes(order.orderType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </td>
      <td>
        <select
          value={stepSelections.Media}
          onChange={(e) => handleStepSelect("Media", e.target.value)}
          className={styles.tableSelect}  disabled={isDisabled} 
        >
          <option value="">Select Media</option>
          {order.printType && getStepOptions(order.orderType, order.printType, "Media").map((opt) => (
            <option key={opt.name} value={opt.name}>
              {opt.name} - ₹{opt.cost || opt.costCMYK || 0}
            </option>
          ))}
        </select>
      </td>
      <td>
        <select
          value={stepSelections.Lamination}
          onChange={(e) => handleStepSelect("Lamination", e.target.value)}
          className={styles.tableSelect}  disabled={isDisabled} 
        >
          <option value="">Select Lamination</option>
          {order.printType && getStepOptions(order.orderType, order.printType, "Lamination").map((opt) => (
            <option key={opt.name} value={opt.name}>
              {opt.name} - ₹{opt.cost || 0}
            </option>
          ))}
        </select>
      </td>
      <td>
        <select
          value={stepSelections.Mounting}
          onChange={(e) => handleStepSelect("Mounting", e.target.value)}
          className={styles.tableSelect}  disabled={isDisabled} 
        >
          <option value="">Select Mounting</option>
          {order.printType && getStepOptions(order.orderType, order.printType, "Mounting").map((opt) => (
            <option key={opt.name} value={opt.name}>
              {opt.name} - ₹{opt.cost || 0}
            </option>
          ))}
        </select>
      </td>
      <td>
        <select
          value={stepSelections.Framing}
          onChange={(e) => handleStepSelect("Framing", e.target.value)}
          className={styles.tableSelect}  disabled={isDisabled} 
        >
          <option value="">Select Framing</option>
          {order.printType && getStepOptions(order.orderType, order.printType, "Framing").map((opt) => (
            <option key={opt.name} value={opt.name}>
              {opt.name} - ₹{opt.cost || 0}
            </option>
          ))}
        </select>
      </td>
      <td>
        <select
          value={stepSelections.Installation}
          onChange={(e) => handleStepSelect("Installation", e.target.value)}
          className={styles.tableSelect}  disabled={isDisabled} 
        >
          <option value="">Select Installation</option>
          {order.printType && getStepOptions(order.orderType, order.printType, "Installation").map((opt) => (
            <option key={opt.name} value={opt.name}>
              {opt.name} - ₹{opt.cost || 0}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          type="number"
          value={order.width || 0}
          onChange={(e) => updateOrder(index, "width", Number(e.target.value))}
          className={styles.tableInput}
         disabled={isDisabled} 
          step="0.1"
        />
      </td>
      <td>
        <input
          type="number"
          value={order.height || 0}
          onChange={(e) => updateOrder(index, "height", Number(e.target.value))}
          className={styles.tableInput}
         disabled={isDisabled} 
          step="0.1"
        />
      </td>
      <td className={styles.calculated}>
        {area.toFixed(2)}
      </td>
      <td>
        <input
          type="number"
          value={order.qty }
          onChange={(e) => updateOrder(index, "qty", Number(e.target.value))}
          className={styles.tableInput} 
       disabled={isDisabled} 
        />
      </td>
      <td className={styles.calculated}>
        {unitPrice.toFixed(2)}
      </td>
      <td>
        {/* <select
          value={order.gst || 0}
          onChange={(e) => updateOrder(index, "gst", Number(e.target.value))}
          className={styles.tableSelect}
        >
          {GST_OPTIONS.map((gst) => (
            <option key={gst} value={gst}>{gst}%</option>
          ))}
        </select> */}
           {/* <select  
          value={clientType === "Cash" ? 0 : order.gst}
          onChange={(e) => updateOrder(index, "gst", Number(e.target.value))}
          className={styles.tableSelect}
          disabled={ clientType === "Cash"} // disable if submitting OR client is Cash
        >
          {GST_OPTIONS.map((gst) => (
            <option key={gst} value={gst}>
              {gst}%
            </option>
          ))}
        </select> */}
        <select
  value={clientType === "Cash" || clientType === "Printers" ? 0 : order.gst}
  onChange={(e) => updateOrder(index, "gst", Number(e.target.value))}
  className={styles.tableSelect}
  disabled={clientType === "Cash" || clientType === "Printers"} // disable if Cash or Printer
>
  {GST_OPTIONS.map((gst) => (
    <option key={gst} value={gst}>
      {gst}%
    </option>
  ))}
</select>

      </td>
      <td className={styles.calculated}>
        ₹{totalAmount.toFixed(2)}
      </td>
      <td>
        <div className={styles.imageUpload}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageChange(index, e.target.files)}
            className={styles.fileInput}
            id={`images-${index}`}  disabled={isDisabled} 
          />
          <label htmlFor={`images-${index}`} className={styles.fileLabel}>
            📷 {orderImages[index]?.length || 0}
          </label>
        </div>
      </td>
      <td>
        <button 
          type="button" 
          className={styles.deleteBtn}
          onClick={() => removeOrder(index)}
          disabled={!canRemove}
          title="Remove order" 
        >
          ×
        </button>
      </td>
    </tr>
  );
}