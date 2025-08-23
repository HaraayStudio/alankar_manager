// // import React, { useState, useEffect } from "react";
// // import styles from "./UpdateOrderPopup.module.scss";
// // import { X, Plus, Trash2, Upload, Save, AlertCircle } from "lucide-react";
// // import PRINT_PRICES from "../../printprices";
// // import api from "../../api/axiosConfig";

// // const GST_OPTIONS = [0, 5, 12, 16, 18];

// // const statusColors = {
// //   CREATED: styles.statusCreated,
// //   COMPLETED: styles.statusCompleted,
// //   PENDING: styles.statusPending,
// //   IN_PROGRESS: styles.statusInProgress,
// // };

// // const StatusBadge = ({ status }) => (
// //   <span className={`${styles.statusBadge} ${statusColors[status] || styles.statusPending}`}>
// //     {status || "PENDING"}
// //   </span>
// // );

// // export default function UpdateOrderPopup({
// //   postSaleData,
// //   onClose,
// //   onSuccess
// // }) {
// //   const [formData, setFormData] = useState({
// //     srNumber: "",
// //     postSalesdateTime: "",
// //     clientType: "Cash",
// //     client: {
// //       id: "",
// //       name: "",
// //       email: "",
// //       phone: "",
// //       address: "",
// //       pan: "",
// //       gstcertificate: ""
// //     },
// //     orders: [],
// //     remark: "",
// //     notified: false,
// //     status: "CREATED"
// //   });
  
// //   const [orderImages, setOrderImages] = useState({});
// //   const [selectedOrderType, setSelectedOrderType] = useState('');
// //   const [submitting, setSubmitting] = useState(false);
// //   const [result, setResult] = useState(null);
// //   const [changedOrders, setChangedOrders] = useState(new Set());
// //   const [newOrders, setNewOrders] = useState(new Set());
// //   const [deletingOrders, setDeletingOrders] = useState(new Set());

// //   // Initialize form data when postSaleData is provided
// //   useEffect(() => {
// //     if (postSaleData) {
// //       setFormData({
// //         srNumber: postSaleData.srNumber || "",
// //         postSalesdateTime: postSaleData.postSalesdateTime || "",
// //         clientType: postSaleData.clientType || "Cash",
// //         client: {
// //           id: postSaleData.client?.id || "",
// //           name: postSaleData.client?.name || "",
// //           email: postSaleData.client?.email || "",
// //           phone: postSaleData.client?.phone || "",
// //           address: postSaleData.client?.address || "",
// //           pan: postSaleData.client?.pan || "",
// //           gstcertificate: postSaleData.client?.gstcertificate || ""
// //         },
// //         orders: postSaleData.orders?.map(order => {
// //           // Extract step values from the steps array
// //           const stepValues = {};
// //           if (order.steps) {
// //             order.steps.forEach(step => {
// //               if (step.orderStepName && step.measurement) {
// //                 stepValues[step.orderStepName] = step.measurement;
// //               }
// //             });
// //           }

// //           return {
// //             id: order.id,
// //             description: order.description || "",
// //             status: order.status || "CREATED",
// //             priority: order.priority || "HIGH",
// //             orderType: order.orderType || "",
// //             printType: order.printType || "",
// //             media: stepValues.Media || order.media || "",
// //             lamination: stepValues.Lamination || order.lamination || "",
// //             mounting: stepValues.Mounting || order.mounting || "",
// //             framing: stepValues.Framing || order.framing || "",
// //             installation: stepValues.Installation || order.installation || "",
// //             unitPrice: order.unitPrice || 0,
// //             qty: order.qty || 1,
// //             measurement: order.measurement || 0,
// //             height: order.height || 1,
// //             width: order.width || 1,
// //             totalAmount: order.totalAmount || 0,
// //             gst: order.gst || 18,
// //             totalAmountWithGST: order.totalAmountWithGST || 0,
// //             steps: order.steps?.filter(step => 
// //               step.orderStepName !== "Printing" && 
// //               step.orderStepName !== "Delivery"
// //             ).map(step => ({
// //               id: step.id,
// //               stepName: step.orderStepName,
// //               stepValue: step.measurement,
// //               status: step.status
// //             })) || [],
// //             images: order.images || [],
// //             originalData: JSON.stringify(order) // Store original data for comparison
// //           };
// //         }) || [],
// //         remark: postSaleData.remark || "",
// //         notified: postSaleData.notified || false,
// //         status: postSaleData.status || "CREATED"
// //       });

// //       // Set initial selected order type
// //       if (postSaleData.orders && postSaleData.orders.length > 0) {
// //         const orderTypes = getOrderTypes(postSaleData.clientType);
// //         setSelectedOrderType(orderTypes[0] || '');
// //       }
// //     }
// //   }, [postSaleData]);

// //   // ---------- Dynamic options ----------
// //   const getOrderTypes = (clientType = formData.clientType) => {
// //     if (!clientType) return [];
// //     return Object.keys(
// //       PRINT_PRICES.clientTypes[clientType]?.orderTypes || {}
// //     );
// //   };

// //   const getPrintTypes = (orderType) => {
// //     if (!formData.clientType || !orderType) return [];
// //     return Object.keys(
// //       PRINT_PRICES.clientTypes[formData.clientType].orderTypes[orderType]
// //         .printTypes || {}
// //     );
// //   };

// //   const getStepOptions = (orderType, printType, stepKey) => {
// //     if (!formData.clientType || !orderType || !printType) return [];
// //     return (
// //       PRINT_PRICES.clientTypes[formData.clientType].orderTypes[orderType]
// //         .printTypes[printType][stepKey] || []
// //     );
// //   };

// //   // ---------- Helper function to get cost from options ----------
// //   const getCostFromOption = (options, selectedValue) => {
// //     if (!options || !selectedValue) return 0;
// //     const option = options.find(opt => opt.name === selectedValue);
// //     if (!option) return 0;
    
// //     if (option.cost !== undefined) return option.cost;
// //     if (option.costCMYK !== undefined) return option.costCMYK;
// //     if (option.costCMYKW !== undefined) return option.costCMYKW;
// //     return 0;
// //   };

// //   // ---------- Calculate unit price from steps ----------
// //   const calculateUnitPrice = (order) => {
// //     let unitPrice = 0;
// //     if (order.steps && order.steps.length) {
// //       order.steps.forEach((step) => {
// //         const stepList = getStepOptions(order.orderType, order.printType, step.stepName);
// //         const found = stepList.find((opt) => opt.name === step.stepValue);
// //         if (found) {
// //           unitPrice += getCostFromOption([found], step.stepValue);
// //         }
// //       });
// //     }
// //     return unitPrice;
// //   };

// //   // ---------- Calculate order amounts ----------
// //   const calculateOrderAmounts = (order) => {
// //     const unitPrice = calculateUnitPrice(order);
// //     const area = (order.width || 0) * (order.height || 0);
// //     const qty = Number(order.qty) || 1;
// //     const totalAmount = unitPrice * area * qty;
// //     const gst = Number(order.gst) || 0;
// //     const totalAmountWithGST = totalAmount + (totalAmount * gst) / 100;
// //     return { unitPrice, area, qty, totalAmount, totalAmountWithGST };
// //   };

// //   // Check if order has changed
// //   const hasOrderChanged = (order, index) => {
// //     if (newOrders.has(index)) return false; // New orders don't need change detection
    
// //     const currentData = JSON.stringify({
// //       description: order.description,
// //       orderType: order.orderType,
// //       printType: order.printType,
// //       media: order.media,
// //       lamination: order.lamination,
// //       mounting: order.mounting,
// //       framing: order.framing,
// //       installation: order.installation,
// //       width: order.width,
// //       height: order.height,
// //       qty: order.qty,
// //       gst: order.gst
// //     });
    
// //     return order.originalData && currentData !== JSON.stringify({
// //       description: JSON.parse(order.originalData).description,
// //       orderType: JSON.parse(order.originalData).orderType,
// //       printType: JSON.parse(order.originalData).printType,
// //       media: JSON.parse(order.originalData).media || "",
// //       lamination: JSON.parse(order.originalData).lamination || "",
// //       mounting: JSON.parse(order.originalData).mounting || "",
// //       framing: JSON.parse(order.originalData).framing || "",
// //       installation: JSON.parse(order.originalData).installation || "",
// //       width: JSON.parse(order.originalData).width,
// //       height: JSON.parse(order.originalData).height,
// //       qty: JSON.parse(order.originalData).qty,
// //       gst: JSON.parse(order.originalData).gst
// //     });
// //   };

// //   const updateOrder = (index, key, value) => {
// //     setFormData(prev => {
// //       const orders = [...prev.orders];
// //       orders[index] = { ...orders[index], [key]: value };

// //       // Calculate area and measurement
// //       const area = (orders[index].width || 0) * (orders[index].height || 0);
// //       orders[index].measurement = area;

// //       // Recalculate amounts
// //       const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts(orders[index]);
// //       orders[index].unitPrice = unitPrice;
// //       orders[index].totalAmount = totalAmount;
// //       orders[index].totalAmountWithGST = totalAmountWithGST;

// //       // Mark as changed if it's an existing order
// //       if (!newOrders.has(index) && hasOrderChanged(orders[index], index)) {
// //         setChangedOrders(prev => new Set([...prev, index]));
// //       }

// //       return { ...prev, orders };
// //     });
// //   };

// //   const updateOrderSteps = (index, steps) => {
// //     setFormData(prev => {
// //       const orders = [...prev.orders];
// //       orders[index].steps = steps;
      
// //       const mediaStep = steps.find((s) => s.stepName === "Media");
// //       if (mediaStep) orders[index].media = mediaStep.stepValue;

// //       // Calculate area and measurement
// //       const area = (orders[index].width || 0) * (orders[index].height || 0);
// //       orders[index].measurement = area;

// //       // Recalculate amounts
// //       const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts(orders[index]);
// //       orders[index].unitPrice = unitPrice;
// //       orders[index].totalAmount = totalAmount;
// //       orders[index].totalAmountWithGST = totalAmountWithGST;

// //       // Mark as changed if it's an existing order
// //       if (!newOrders.has(index) && hasOrderChanged(orders[index], index)) {
// //         setChangedOrders(prev => new Set([...prev, index]));
// //       }

// //       return { ...prev, orders };
// //     });
// //   };

// //   const addOrder = () => {
// //     const newOrder = {
// //       description: "",
// //       status: "CREATED",
// //       priority: "HIGH",
// //       orderType: selectedOrderType,
// //       printType: "",
// //       media: "",
// //       lamination: "",
// //       mounting: "",
// //       framing: "",
// //       installation: "",
// //       unitPrice: 0,
// //       qty: 1,
// //       measurement: 0,
// //       height: 1,
// //       width: 1,
// //       totalAmount: 0,
// //       gst: 18,
// //       totalAmountWithGST: 0,
// //       steps: [],
// //       images: [],
// //       isNew: true
// //     };

// //     setFormData(prev => {
// //       const newIndex = prev.orders.length;
// //       setNewOrders(prevNew => new Set([...prevNew, newIndex]));
// //       return {
// //         ...prev,
// //         orders: [...prev.orders, newOrder]
// //       };
// //     });
// //   };

// //   const removeOrder = async (index) => {
// //     const order = formData.orders[index];
    
// //     if (order.id && !newOrders.has(index)) {
// //       // Existing order - call delete API
// //       try {
// //         setDeletingOrders(prev => new Set([...prev, index]));
// //         const token = sessionStorage.getItem('token');
        
// //         await api.delete(`/orders/deleteorder?id=${order.id}`, {
// //           headers: {
// //             Authorization: `Bearer ${token}`
// //           }
// //         });
// // console.log(token);
// // console.log(order.id);


// //         // Remove from formData after successful deletion
// //         setFormData(prev => ({
// //           ...prev,
// //           orders: prev.orders.filter((_, i) => i !== index)
// //         }));

// //         // Clean up tracking sets
// //         setChangedOrders(prev => {
// //           const newSet = new Set(prev);
// //           newSet.delete(index);
// //           return newSet;
// //         });
// //         setNewOrders(prev => {
// //           const newSet = new Set(prev);
// //           newSet.delete(index);
// //           return newSet;
// //         });
// //         setDeletingOrders(prev => {
// //           const newSet = new Set(prev);
// //           newSet.delete(index);
// //           return newSet;
// //         });

// //         // Remove images for this order
// //         setOrderImages(imgs => {
// //           const newImgs = { ...imgs };
// //           delete newImgs[index];
// //           return newImgs;
// //         });
  
// //         setResult({ success: true, message: "Order deleted successfully!" });
       
      

// //         // Call onSuccess to refresh parent data
// //         // if (onSuccess) onSuccess();

// //       } catch (error) {
// //         setDeletingOrders(prev => {
// //           const newSet = new Set(prev);
// //           newSet.delete(index);
// //           return newSet;
// //         });
        
// //         console.error('Error deleting order:', error);
// //         console.error('Error response:', error.response);
        
// //         let errorMessage = "Failed to delete order";
// //         if (error.response?.data?.message) {
// //           errorMessage = error.response.data.message;
// //         } else if (error.response?.data?.error) {
// //           errorMessage = error.response.data.error;
// //         } else if (error.message) {
// //           errorMessage = error.message;
// //         }
        
// //         setResult({ 
// //           success: false, 
// //           message: errorMessage
// //         });
// //         setTimeout(() => setResult(null), 5000);
// //       }
// //     } else {
// //       // New order - just remove from state
// //       setFormData(prev => ({
// //         ...prev,
// //         orders: prev.orders.filter((_, i) => i !== index)
// //       }));
      
// //       setNewOrders(prev => {
// //         const newSet = new Set(prev);
// //         newSet.delete(index);
// //         return newSet;
// //       });
      
// //       setOrderImages(imgs => {
// //         const newImgs = { ...imgs };
// //         delete newImgs[index];
// //         return newImgs;
// //       });
// //     }
// //   };

// //   const handleImageChange = (index, files) => {
// //     setOrderImages(imgs => ({
// //       ...imgs,
// //       [index]: Array.from(files)
// //     }));
// //   };

// //   const handleOrderTypeChange = (orderType) => {
// //     setSelectedOrderType(orderType);
// //   };

// //   // Save individual existing order
// //   const saveOrder = async (index) => {
// //     const order = formData.orders[index];
    
// //     try {
// //       setSubmitting(true);
      
// //       // Build steps array based on the backend OrderStep model
// //       const existingSteps = (postSaleData.orders?.find(o => o.id === order.id)?.steps || []);
// //       const steps = [];
// //       let stepNumber = 1;
      
// //       // Add Printing step (preserve existing ID if available)
// //       const printingStep = existingSteps.find(s => s.orderStepName === "Printing");
// //       steps.push({
// //         id: printingStep?.id,
// //         stepName: "Printing",
// //         stepValue: "Printing",
// //         status: printingStep?.status || "CREATED",
// //         stepNumber: stepNumber++
// //       });
      
// //       // Add user-selected steps (preserve existing IDs if available)
// //       if (order.media) {
// //         const mediaStep = existingSteps.find(s => s.orderStepName === "Media");
// //         steps.push({
// //           id: mediaStep?.id,
// //           stepName: "Media",
// //           stepValue: order.media,
// //           status: mediaStep?.status || "CREATED",
// //           stepNumber: stepNumber++
// //         });
// //       }
      
// //       if (order.lamination) {
// //         const laminationStep = existingSteps.find(s => s.orderStepName === "Lamination");
// //         steps.push({
// //           id: laminationStep?.id,
// //           stepName: "Lamination",
// //           stepValue: order.lamination,
// //           status: laminationStep?.status || "CREATED",
// //           stepNumber: stepNumber++
// //         });
// //       }
      
// //       if (order.mounting) {
// //         const mountingStep = existingSteps.find(s => s.orderStepName === "Mounting");
// //         steps.push({
// //           id: mountingStep?.id,
// //           stepName: "Mounting",
// //           stepValue: order.mounting,
// //           status: mountingStep?.status || "CREATED",
// //           stepNumber: stepNumber++
// //         });
// //       }
      
// //       if (order.framing) {
// //         const framingStep = existingSteps.find(s => s.orderStepName === "Framing");
// //         steps.push({
// //           id: framingStep?.id,
// //           stepName: "Framing",
// //           stepValue: order.framing,
// //           status: framingStep?.status || "CREATED",
// //           stepNumber: stepNumber++
// //         });
// //       }
      
// //       if (order.installation) {
// //         const installationStep = existingSteps.find(s => s.orderStepName === "Installation");
// //         steps.push({
// //           id: installationStep?.id,
// //           stepName: "Installation",
// //           stepValue: order.installation,
// //           status: installationStep?.status || "CREATED",
// //           stepNumber: stepNumber++
// //         });
// //       }
      
// //       // Add Delivery step (preserve existing ID if available)
// //       const deliveryStep = existingSteps.find(s => s.orderStepName === "Delivery");
// //       steps.push({
// //         id: deliveryStep?.id,
// //         stepName: "Delivery",
// //         stepValue: "Delivery",
// //         status: deliveryStep?.status || "CREATED",
// //         stepNumber: stepNumber++
// //       });
      
// //       // Create order object matching backend Order model
// //       const orderToSend = {
// //         id: order.id,
// //         description: order.description || "",
// //         status: order.status,
// //         priority: order.priority,
// //         orderType: order.orderType,
// //         printType: order.printType,
// //         media: order.media,
// //         unitPrice: order.unitPrice,
// //         height: order.height,
// //         width: order.width,
// //         qty: order.qty,
// //         measurement: order.measurement,
// //         totalAmount: order.totalAmount,
// //         gst: order.gst,
// //         totalAmountWithGST: order.totalAmountWithGST,
// //         steps: steps
// //       };

// //       const token = sessionStorage.getItem('token');
      
// //       console.log('Updating order data:', orderToSend);
      
// //       await api.put(`/orders/updateorder?id=${order.id}`, orderToSend, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`
// //         }
// //       });

// //       // Remove from changed orders
// //       setChangedOrders(prev => {
// //         const newSet = new Set(prev);
// //         newSet.delete(index);
// //         return newSet;
// //       });

// //       // Update original data
// //       setFormData(prev => ({
// //         ...prev,
// //         orders: prev.orders.map((o, i) => 
// //           i === index ? { ...o, originalData: JSON.stringify(order) } : o
// //         )
// //       }));
// //   //  window.location.reload();
// //       setResult({ success: true, message: "Order updated successfully!" });
// //   //     setTimeout(() => setResult(null), 3000);
// //   //  setTimeout(() => {
// //   //       window.location.reload();
// //   //     }, 1000);

// //       // Call onSuccess to refresh parent data
// //       if (onSuccess) onSuccess();

// //     } catch (error) {
// //       console.error('Error updating order:', error);
// //       console.error('Error response:', error.response);
      
// //       let errorMessage = "Failed to update order";
// //       if (error.response?.data?.message) {
// //         errorMessage = error.response.data.message;
// //       } else if (error.response?.data?.error) {
// //         errorMessage = error.response.data.error;
// //       } else if (error.message) {
// //         errorMessage = error.message;
// //       }
      
// //       setResult({ 
// //         success: false, 
// //         message: errorMessage
// //       });
// //       setTimeout(() => setResult(null), 5000);
// //     }
// //     setSubmitting(false);
// //   };

// //   // Save new order
// //   const saveNewOrder = async (index) => {
// //     const order = formData.orders[index];
    
// //     try {
// //       setSubmitting(true);
      
// //       // Build steps array based on the backend OrderStep model
// //       const steps = [];
// //       let stepNumber = 1;
      
// //       // Add Printing step (always first)
// //       steps.push({
// //         stepName: "Printing",
// //         stepValue: "Printing",
// //         status: "CREATED",
// //         stepNumber: stepNumber++
// //       });
      
// //       // Add user-selected steps
// //       if (order.media) {
// //         steps.push({
// //           stepName: "Media",
// //           stepValue: order.media,
// //           status: "CREATED",
// //           stepNumber: stepNumber++
// //         });
// //       }
      
// //       if (order.lamination) {
// //         steps.push({
// //           stepName: "Lamination",
// //           stepValue: order.lamination,
// //           status: "CREATED",
// //           stepNumber: stepNumber++
// //         });
// //       }
      
// //       if (order.mounting) {
// //         steps.push({
// //           stepName: "Mounting",
// //           stepValue: order.mounting,
// //           status: "CREATED",
// //           stepNumber: stepNumber++
// //         });
// //       }
      
// //       if (order.framing) {
// //         steps.push({
// //           stepName: "Framing",
// //           stepValue: order.framing,
// //           status: "CREATED",
// //           stepNumber: stepNumber++
// //         });
// //       }
      
// //       if (order.installation) {
// //         steps.push({
// //           stepName: "Installation",
// //           stepValue: order.installation,
// //           status: "CREATED",
// //           stepNumber: stepNumber++
// //         });
// //       }
      
// //       // Add Delivery step (always last)
// //       steps.push({
// //         stepName: "Delivery",
// //         stepValue: "Delivery",
// //         status: "CREATED",
// //         stepNumber: stepNumber++
// //       });
      
// //       // Create order object matching backend Order model
// //       const orderToSend = {
// //         description: order.description || "",
// //         status: "CREATED",
// //         priority: "HIGH",
// //         orderType: order.orderType,
// //         printType: order.printType,
// //         media: order.media,
// //         unitPrice: order.unitPrice,
// //         height: order.height,
// //         width: order.width,
// //         qty: order.qty,
// //         measurement: order.measurement,
// //         totalAmount: order.totalAmount,
// //         gst: order.gst,
// //         totalAmountWithGST: order.totalAmountWithGST,
// //         steps: steps
// //       };

// //       const formDataToSubmit = new FormData();
      
// //       // Add srNumber as RequestPart
// //       formDataToSubmit.append('srNumber', formData.srNumber.toString());
      
// //       // Add order JSON as RequestPart
// //       formDataToSubmit.append('order', JSON.stringify(orderToSend));
      
// //       // Add images as RequestPart if available
// //       if (orderImages[index] && orderImages[index].length > 0) {
// //         orderImages[index].forEach(file => {
// //           formDataToSubmit.append('images', file);
// //         });
// //       }

// //       const token = sessionStorage.getItem('token');
      
// //       console.log('Sending order data:', orderToSend);
      
// //       const response = await api.post(`/postsales/addorderinpostsales`, formDataToSubmit, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //           Authorization: `Bearer ${token}`
// //         }
// //       });

// //       // Update order with returned ID
// //       const newOrderData = response.data.data;
// //       setFormData(prev => ({
// //         ...prev,
// //         orders: prev.orders.map((o, i) => 
// //           i === index ? { 
// //             ...o, 
// //             id: newOrderData.id,
// //             originalData: JSON.stringify(newOrderData),
// //             isNew: false
// //           } : o
// //         )
// //       }));

// //       // Remove from new orders
// //       setNewOrders(prev => {
// //         const newSet = new Set(prev);
// //         newSet.delete(index);
// //         return newSet;
// //       });

// //       setResult({ success: true, message: "New order added successfully!" });
         
// //       setTimeout(() => setResult(null), 500);
 

// //       // Call onSuccess to refresh parent data
// //       if (onSuccess) onSuccess();

// //     } catch (error) {
// //       console.error('Error adding new order:', error);
// //       console.error('Error response:', error.response);
      
// //       let errorMessage = "Failed to add order";
// //       if (error.response?.data?.message) {
// //         errorMessage = error.response.data.message;
// //       } else if (error.response?.data?.error) {
// //         errorMessage = error.response.data.error;
// //       } else if (error.message) {
// //         errorMessage = error.message;
// //       }
      
// //       setResult({ 
// //         success: false, 
// //         message: errorMessage
// //       });
// //       setTimeout(() => setResult(null), 5000);
// //     }
// //     setSubmitting(false);
// //   };

// //   // Calculate totals for all orders
// //   const calculateTotals = () => {
// //     return formData.orders.reduce((totals, order) => {
// //       const { area, totalAmount } = calculateOrderAmounts(order);
// //       return {
// //         totalWidth: totals.totalWidth + (order.width || 0),
// //         totalHeight: totals.totalHeight + (order.height || 0),
// //         totalArea: totals.totalArea + area,
// //         totalQty: totals.totalQty + (order.qty || 0),
// //         grandTotal: totals.grandTotal + totalAmount
// //       };
// //     }, { totalWidth: 0, totalHeight: 0, totalArea: 0, totalQty: 0, grandTotal: 0 });
// //   };

// //   const totals = calculateTotals();

// //   if (!postSaleData) return null;

// //   return (
// //     <div className={styles.modalOverlay}>
// //       <div className={styles.bigModalBox}>
// //         {/* Header */}
// //         <div className={styles.modalHeader}>
// //           <h2>Manage Orders - {formData.client.name}</h2>
// //           <button className={styles.closeBtn} onClick={onClose}>
// //             <X size={20} />
// //           </button>
// //         </div>

// //         <div className={styles.form}>
// //           {/* Order Info Display */}
// //           <div className={styles.section}>
// //             <h3>Order Information</h3>
// //             <div className={styles.infoDisplay}>
// //               <div className={styles.infoItem}>
// //                 <span className={styles.infoLabel}>Order #:</span>
// //                 <span className={styles.infoValue}>{formData.srNumber}</span>
// //               </div>
// //               <div className={styles.infoItem}>
// //                 <span className={styles.infoLabel}>Date:</span>
// //                 <span className={styles.infoValue}>
// //                   {new Date(formData.postSalesdateTime).toLocaleString()}
// //                 </span>
// //               </div>
// //               <div className={styles.infoItem}>
// //                 <span className={styles.infoLabel}>Status:</span>
// //                 <StatusBadge status={formData.status} />
// //               </div>
// //               <div className={styles.infoItem}>
// //                 <span className={styles.infoLabel}>Client Type:</span>
// //                 <span className={styles.infoValue}>{formData.clientType}</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Client Info Display */}
// //           <div className={styles.section}>
// //             <h3>Client Information</h3>
// //             <div className={styles.infoDisplay}>
// //               <div className={styles.infoItem}>
// //                 <span className={styles.infoLabel}>Name:</span>
// //                 <span className={styles.infoValue}>{formData.client.name}</span>
// //               </div>
// //               <div className={styles.infoItem}>
// //                 <span className={styles.infoLabel}>Email:</span>
// //                 <span className={styles.infoValue}>{formData.client.email}</span>
// //               </div>
// //               <div className={styles.infoItem}>
// //                 <span className={styles.infoLabel}>Phone:</span>
// //                 <span className={styles.infoValue}>{formData.client.phone}</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Order Type Tabs */}
// //           <div className={styles.section}>
// //             <h3>Orders ({formData.orders.length})</h3>
// //             <div className={styles.tabs}>
// //               {getOrderTypes().map((orderType) => (
// //                 <button 
// //                   key={orderType}
// //                   type="button"
// //                   className={`${styles.tab} ${selectedOrderType === orderType ? styles.active : ''}`}
// //                   onClick={() => handleOrderTypeChange(orderType)}
// //                 >
// //                   {orderType}
// //                   <span className={styles.badge}>
// //                     {formData.orders.filter(order => order.orderType === orderType).length}
// //                   </span>
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Orders Table */}
// //           <div className={styles.tableWrapper1}>
// //             <table className={styles.ordersTable}>
// //               <thead>
// //                 <tr>
// //                   <th>Order Type</th>
// //                   <th>Description</th>
// //                   <th>Print Type</th>
// //                   <th>Media</th>
// //                   <th>Lamination</th>
// //                   <th>Mounting</th>
// //                   <th>Framing</th>
// //                   <th>Installation</th>
// //                   <th>Width<br/>(Feet)</th>
// //                   <th>Height<br/>(Feet)</th>
// //                   <th>Area<br/>(Sq.Ft)</th>
// //                   <th>Qty</th>
// //                   <th>Rate<br/>(₹/Sq.Ft)</th>
// //                   <th>GST<br/>(%)</th>
// //                   <th>Amount<br/>(₹)</th>
// //                   <th>Images</th>
// //                   <th>Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {formData.orders.map((order, index) => (
// //                   <UpdateOrderTableRow
// //                     key={`${index}-${order.orderType}-${order.id}`}
// //                     order={order}
// //                     index={index}
// //                     clientType={formData.clientType}
// //                     updateOrder={updateOrder}
// //                     updateOrderSteps={updateOrderSteps}
// //                     removeOrder={removeOrder}
// //                     saveOrder={saveOrder}
// //                     saveNewOrder={saveNewOrder}
// //                     getOrderTypes={getOrderTypes}
// //                     getPrintTypes={getPrintTypes}
// //                     getStepOptions={getStepOptions}
// //                     calculateOrderAmounts={calculateOrderAmounts}
// //                     handleImageChange={handleImageChange}
// //                     orderImages={orderImages}
// //                     hasChanged={hasOrderChanged(order, index)}
// //                     isNew={newOrders.has(index)}
// //                     isDeleting={deletingOrders.has(index)}
// //                     submitting={submitting}
// //                   />
// //                 ))}
                
// //                 {/* Total Row */}
// //                 <tr className={styles.totalRow}>
// //                   <td><strong>Total</strong></td>
// //                   <td colSpan="7"></td>
// //                   <td><strong>{totals.totalWidth.toFixed(1)}</strong></td>
// //                   <td><strong>{totals.totalHeight.toFixed(1)}</strong></td>
// //                   <td><strong>{totals.totalArea.toFixed(2)}</strong></td>
// //                   <td><strong>{totals.totalQty}</strong></td>
// //                   <td></td>
// //                   <td></td>
// //                   <td><strong>₹{totals.grandTotal.toFixed(2)}</strong></td>
// //                   <td></td>
// //                   <td></td>
// //                 </tr>
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Add Item Button */}
// //           <div className={styles.addItemSection}>
// //             <button type="button" className={styles.addItemBtn} onClick={addOrder}>
// //               <Plus size={16} /> Add New Order
// //             </button>
// //           </div>

// //           {result && (
// //             <div className={result.success ? styles.successMsg : styles.errorMsg}>
// //               {result.message}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Update Order Table Row Component
// // function UpdateOrderTableRow({
// //   order,
// //   index,
// //   clientType,
// //   updateOrder,
// //   updateOrderSteps,
// //   removeOrder,
// //   saveOrder,
// //   saveNewOrder,
// //   getOrderTypes,
// //   getPrintTypes,
// //   getStepOptions,
// //   calculateOrderAmounts,
// //   handleImageChange,
// //   orderImages,
// //   hasChanged,
// //   isNew,
// //   isDeleting,
// //   submitting
// // }) {
// //   // Initialize step selections based on current order values and steps
// //   const [stepSelections, setStepSelections] = useState(() => {
// //     const initialSteps = {
// //       Media: order.media || "",
// //       Lamination: order.lamination || "",
// //       Mounting: order.mounting || "",
// //       Framing: order.framing || "",
// //       Installation: order.installation || ""
// //     };

// //     // Override with values from steps if available
// //     if (order.steps && order.steps.length > 0) {
// //       order.steps.forEach(step => {
// //         if (step.stepName && step.stepValue) {
// //           initialSteps[step.stepName] = step.stepValue;
// //         }
// //       });
// //     }

// //     return initialSteps;
// //   });

// //   // Update step selections when order changes
// //   useEffect(() => {
// //     const updatedSteps = {
// //       Media: order.media || "",
// //       Lamination: order.lamination || "",
// //       Mounting: order.mounting || "",
// //       Framing: order.framing || "",
// //       Installation: order.installation || ""
// //     };

// //     // Override with values from steps if available
// //     if (order.steps && order.steps.length > 0) {
// //       order.steps.forEach(step => {
// //         if (step.stepName && step.stepValue) {
// //           updatedSteps[step.stepName] = step.stepValue;
// //         }
// //       });
// //     }

// //     setStepSelections(updatedSteps);
// //   }, [order.media, order.lamination, order.mounting, order.framing, order.installation, order.steps]);

// //   const handleStepSelect = (stepKey, value) => {
// //     const next = { ...stepSelections, [stepKey]: value };
// //     setStepSelections(next);
    
// //     const steps = Object.entries(next)
// //       .filter(([key, val]) => val && val !== "")
// //       .map(([key, val]) => ({
// //         stepName: key,
// //         stepValue: val,
// //         status: "CREATED"
// //       }));
    
// //     updateOrderSteps(index, steps);
// //     updateOrder(index, stepKey.toLowerCase(), value);
// //   };

// //   const handlePrintTypeChange = (value) => {
// //     updateOrder(index, "printType", value);
// //     // Reset step selections when print type changes
// //     const resetSteps = {
// //       Media: "",
// //       Lamination: "",
// //       Mounting: "",
// //       Framing: "",
// //       Installation: ""
// //     };
// //     setStepSelections(resetSteps);
// //     updateOrderSteps(index, []);
// //     // Reset individual step values
// //     updateOrder(index, "media", "");
// //     updateOrder(index, "lamination", "");
// //     updateOrder(index, "mounting", "");
// //     updateOrder(index, "framing", "");
// //     updateOrder(index, "installation", "");
// //   };

// //   const { unitPrice, area, totalAmount } = calculateOrderAmounts(order);

// //   return (
// //     <tr className={`${styles.orderRow} ${isNew ? styles.newOrder : ''} ${hasChanged ? styles.changedOrder : ''}`}>
// //       <td>
// //         <select
// //           value={order.orderType || ""}
// //           onChange={(e) => updateOrder(index, "orderType", e.target.value)}
// //           className={styles.tableSelect}
// //         >
// //           <option value="">Select Order Type</option>
// //           {getOrderTypes().map((type) => (
// //             <option key={type} value={type}>{type}</option>
// //           ))}
// //         </select>
// //       </td>
// //       <td>
// //         <input
// //           type="text"
// //           value={order.description}
// //           onChange={(e) => updateOrder(index, "description", e.target.value)}
// //           className={styles.tableInput}
// //           placeholder="Enter description"
// //         />
// //       </td>
// //       <td>
// //         <select
// //           value={order.printType || ""}
// //           onChange={(e) => handlePrintTypeChange(e.target.value)}
// //           className={styles.tableSelect}
// //         >
// //           <option value="">Select Print Type</option>
// //           {order.orderType && getPrintTypes(order.orderType).map((type) => (
// //             <option key={type} value={type}>{type}</option>
// //           ))}
// //         </select>
// //       </td>
// //       <td>
// //         <select
// //           value={stepSelections.Media}
// //           onChange={(e) => handleStepSelect("Media", e.target.value)}
// //           className={styles.tableSelect}
// //         >
// //           <option value="">Select Media</option>
// //           {order.printType && getStepOptions(order.orderType, order.printType, "Media").map((opt) => (
// //             <option key={opt.name} value={opt.name}>
// //               {opt.name} - ₹{opt.cost || opt.costCMYK || 0}
// //             </option>
// //           ))}
// //         </select>
// //       </td>
// //       <td>
// //         <select
// //           value={stepSelections.Lamination}
// //           onChange={(e) => handleStepSelect("Lamination", e.target.value)}
// //           className={styles.tableSelect}
// //         >
// //           <option value="">Select Lamination</option>
// //           {order.printType && getStepOptions(order.orderType, order.printType, "Lamination").map((opt) => (
// //             <option key={opt.name} value={opt.name}>
// //               {opt.name} - ₹{opt.cost || 0}
// //             </option>
// //           ))}
// //         </select>
// //       </td>
// //       <td>
// //         <select
// //           value={stepSelections.Mounting}
// //           onChange={(e) => handleStepSelect("Mounting", e.target.value)}
// //           className={styles.tableSelect}
// //         >
// //           <option value="">Select Mounting</option>
// //           {order.printType && getStepOptions(order.orderType, order.printType, "Mounting").map((opt) => (
// //             <option key={opt.name} value={opt.name}>
// //               {opt.name} - ₹{opt.cost || 0}
// //             </option>
// //           ))}
// //         </select>
// //       </td>
// //       <td>
// //         <select
// //           value={stepSelections.Framing}
// //           onChange={(e) => handleStepSelect("Framing", e.target.value)}
// //           className={styles.tableSelect}
// //         >
// //           <option value="">Select Framing</option>
// //           {order.printType && getStepOptions(order.orderType, order.printType, "Framing").map((opt) => (
// //             <option key={opt.name} value={opt.name}>
// //               {opt.name} - ₹{opt.cost || 0}
// //             </option>
// //           ))}
// //         </select>
// //       </td>
// //       <td>
// //         <select
// //           value={stepSelections.Installation}
// //           onChange={(e) => handleStepSelect("Installation", e.target.value)}
// //           className={styles.tableSelect}
// //         >
// //           <option value="">Select Installation</option>
// //           {order.printType && getStepOptions(order.orderType, order.printType, "Installation").map((opt) => (
// //             <option key={opt.name} value={opt.name}>
// //               {opt.name} - ₹{opt.cost || 0}
// //             </option>
// //           ))}
// //         </select>
// //       </td>
// //       <td>
// //         <input
// //           type="number"
// //           value={order.width || 0}
// //           onChange={(e) => updateOrder(index, "width", Number(e.target.value))}
// //           className={styles.tableInput}
// //           min="0"
// //           step="0.1"
// //         />
// //       </td>
// //       <td>
// //         <input
// //           type="number"
// //           value={order.height || 0}
// //           onChange={(e) => updateOrder(index, "height", Number(e.target.value))}
// //           className={styles.tableInput}
// //           min="0"
// //           step="0.1"
// //         />
// //       </td>
// //       <td className={styles.calculated}>
// //         {area.toFixed(2)}
// //       </td>
// //       <td>
// //         <input
// //           type="number"
// //           value={order.qty || 1}
// //           onChange={(e) => updateOrder(index, "qty", Number(e.target.value))}
// //           className={styles.tableInput}
// //           min="1"
// //         />
// //       </td>
// //       <td className={styles.calculated}>
// //         {unitPrice.toFixed(2)}
// //       </td>
// //       <td>
// //         <select
// //           value={order.gst || 18}
// //           onChange={(e) => updateOrder(index, "gst", Number(e.target.value))}
// //           className={styles.tableSelect}
// //         >
// //           {GST_OPTIONS.map((gst) => (
// //             <option key={gst} value={gst}>{gst}%</option>
// //           ))}
// //         </select>
// //       </td>
// //       <td className={styles.calculated}>
// //         ₹{totalAmount.toFixed(2)}
// //       </td>
// //       <td>
// //         <div className={styles.imageUpload}>
// //           <input
// //             type="file"
// //             multiple
// //             accept="image/*"
// //             onChange={(e) => handleImageChange(index, e.target.files)}
// //             className={styles.fileInput}
// //             id={`images-${index}`}
// //           />
// //           <label htmlFor={`images-${index}`} className={styles.fileLabel}>
// //             <Upload size={14} />
// //             {orderImages[index]?.length || order.images?.length || 0}
// //           </label>
// //           {order.images && order.images.length > 0 && (
// //             <div className={styles.existingImages}>
// //               {order.images.map((img, imgIndex) => (
// //                 <a
// //                   key={imgIndex}
// //                   href={img.imageUrl}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   className={styles.imageLink}
// //                   title="View existing image"
// //                 >
// //                   🖼️
// //                 </a>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </td>
// //       <td>
// //         <div className={styles.actionButtons}>
// //           {isNew ? (
// //             <button 
// //               type="button" 
// //               className={`${styles.actionBtn} ${styles.saveNewBtn}`}
// //               onClick={() => saveNewOrder(index)}
// //               disabled={submitting}
// //               title="Save new order"
// //             >
// //               <Save size={14} />
// //               {submitting ? "..." : "Save"}
// //             </button>
// //           ) : hasChanged ? (
// //             <button 
// //               type="button" 
// //               className={`${styles.actionBtn} ${styles.saveBtn}`}
// //               onClick={() => saveOrder(index)}
// //               disabled={submitting}
// //               title="Save changes"
// //             >
// //               <Save size={14} />
// //               {submitting ? "..." : "Update"}
// //             </button>
// //           ) : null}
          
// //           <button 
// //             type="button" 
// //             className={`${styles.actionBtn} ${styles.deleteBtn}`}
// //             onClick={() => removeOrder(index)}
// //             disabled={isDeleting || submitting}
// //             title={isNew ? "Remove order" : "Delete order"}
// //           >
// //             {isDeleting ? (
// //               <AlertCircle size={14} />
// //             ) : (
// //               <Trash2 size={14} />
// //             )}
// //           </button>
// //         </div>
// //       </td>
// //     </tr>
// //   );
// // }
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import styles from "./UpdateOrderPopup.module.scss";
// import { X, Plus, Trash2, Upload, Save, AlertCircle } from "lucide-react";
// import PRINT_PRICES from "../../printprices";

// // Redux actions
// import {
//   updateOrderThunk,
//   deleteOrderThunk,
//   addOrderToPostSalesThunk,
//   clearError,
// } from "../../store/slices/orderSlice";

// const GST_OPTIONS = [0, 5, 12, 16, 18];

// const statusColors = {
//   CREATED: styles.statusCreated,
//   COMPLETED: styles.statusCompleted,
//   PENDING: styles.statusPending,
//   IN_PROGRESS: styles.statusInProgress,
// };

// const StatusBadge = ({ status }) => (
//   <span className={`${styles.statusBadge} ${statusColors[status] || styles.statusPending}`}>
//     {status || "PENDING"}
//   </span>
// );

// export default function UpdateOrderPopup({
//   postSaleData,
//   onClose,
//   onSuccess
// }) {
//   const dispatch = useDispatch();
  
//   // Redux state
//   const { operationLoading, error } = useSelector((state) => state.orders);
  
//   const [formData, setFormData] = useState({
//     srNumber: "",
//     postSalesdateTime: "",
//     clientType: "Cash",
//     client: {
//       id: "",
//       name: "",
//       email: "",
//       phone: "",
//       address: "",
//       pan: "",
//       gstcertificate: ""
//     },
//     orders: [],
//     remark: "",
//     notified: false,
//     status: "CREATED"
//   });
  
//   const [orderImages, setOrderImages] = useState({});
//   const [selectedOrderType, setSelectedOrderType] = useState('');
//   const [result, setResult] = useState(null);
//   const [changedOrders, setChangedOrders] = useState(new Set());
//   const [newOrders, setNewOrders] = useState(new Set());
//   const [deletingOrders, setDeletingOrders] = useState(new Set());

//   // Clear Redux error on mount
//   useEffect(() => {
//     dispatch(clearError());
//     return () => {
//       dispatch(clearError());
//     };
//   }, [dispatch]);

//   // Initialize form data when postSaleData is provided
//   useEffect(() => {
//     if (postSaleData) {
//       console.log("🔄 Initializing UpdateOrderPopup with data:", postSaleData);
      
//       setFormData({
//         srNumber: postSaleData.srNumber || "",
//         postSalesdateTime: postSaleData.postSalesdateTime || "",
//         clientType: postSaleData.clientType || "Cash",
//         client: {
//           id: postSaleData.client?.id || "",
//           name: postSaleData.client?.name || "",
//           email: postSaleData.client?.email || "",
//           phone: postSaleData.client?.phone || "",
//           address: postSaleData.client?.address || "",
//           pan: postSaleData.client?.pan || "",
//           gstcertificate: postSaleData.client?.gstcertificate || ""
//         },
//         orders: postSaleData.orders?.map(order => {
//           // Extract step values from the steps array
//           const stepValues = {};
//           if (order.steps) {
//             order.steps.forEach(step => {
//               if (step.orderStepName && step.measurement) {
//                 stepValues[step.orderStepName] = step.measurement;
//               }
//             });
//           }

//           return {
//             id: order.id,
//             description: order.description || "",
//             status: order.status || "CREATED",
//             priority: order.priority || "HIGH",
//             orderType: order.orderType || "",
//             printType: order.printType || "",
//             media: stepValues.Media || order.media || "",
//             lamination: stepValues.Lamination || order.lamination || "",
//             mounting: stepValues.Mounting || order.mounting || "",
//             framing: stepValues.Framing || order.framing || "",
//             installation: stepValues.Installation || order.installation || "",
//             unitPrice: order.unitPrice || 0,
//             qty: order.qty || 1,
//             measurement: order.measurement || 0,
//             height: order.height || 1,
//             width: order.width || 1,
//             totalAmount: order.totalAmount || 0,
//             gst: order.gst || 18,
//             totalAmountWithGST: order.totalAmountWithGST || 0,
//             steps: order.steps?.filter(step => 
//               step.orderStepName !== "Printing" && 
//               step.orderStepName !== "Delivery"
//             ).map(step => ({
//               id: step.id,
//               stepName: step.orderStepName,
//               stepValue: step.measurement,
//               status: step.status
//             })) || [],
//             images: order.images || [],
//             originalData: JSON.stringify(order) // Store original data for comparison
//           };
//         }) || [],
//         remark: postSaleData.remark || "",
//         notified: postSaleData.notified || false,
//         status: postSaleData.status || "CREATED"
//       });

//       // Set initial selected order type
//       if (postSaleData.orders && postSaleData.orders.length > 0) {
//         const orderTypes = getOrderTypes(postSaleData.clientType);
//         setSelectedOrderType(orderTypes[0] || '');
//       }
//     }
//   }, [postSaleData]);

//   // ---------- Dynamic options ----------
//   const getOrderTypes = (clientType = formData.clientType) => {
//     if (!clientType) return [];
//     return Object.keys(
//       PRINT_PRICES.clientTypes[clientType]?.orderTypes || {}
//     );
//   };

//   const getPrintTypes = (orderType) => {
//     if (!formData.clientType || !orderType) return [];
//     return Object.keys(
//       PRINT_PRICES.clientTypes[formData.clientType].orderTypes[orderType]
//         .printTypes || {}
//     );
//   };

//   const getStepOptions = (orderType, printType, stepKey) => {
//     if (!formData.clientType || !orderType || !printType) return [];
//     return (
//       PRINT_PRICES.clientTypes[formData.clientType].orderTypes[orderType]
//         .printTypes[printType][stepKey] || []
//     );
//   };

//   // ---------- Helper function to get cost from options ----------
//   const getCostFromOption = (options, selectedValue) => {
//     if (!options || !selectedValue) return 0;
//     const option = options.find(opt => opt.name === selectedValue);
//     if (!option) return 0;
    
//     if (option.cost !== undefined) return option.cost;
//     if (option.costCMYK !== undefined) return option.costCMYK;
//     if (option.costCMYKW !== undefined) return option.costCMYKW;
//     return 0;
//   };

//   // ---------- Calculate unit price from steps ----------
//   const calculateUnitPrice = (order) => {
//     let unitPrice = 0;
//     if (order.steps && order.steps.length) {
//       order.steps.forEach((step) => {
//         const stepList = getStepOptions(order.orderType, order.printType, step.stepName);
//         const found = stepList.find((opt) => opt.name === step.stepValue);
//         if (found) {
//           unitPrice += getCostFromOption([found], step.stepValue);
//         }
//       });
//     }
//     return unitPrice;
//   };

//   // ---------- Calculate order amounts ----------
//   const calculateOrderAmounts = (order) => {
//     const unitPrice = calculateUnitPrice(order);
//     const area = (order.width || 0) * (order.height || 0);
//     const qty = Number(order.qty) || 1;
//     const totalAmount = unitPrice * area * qty;
//     const gst = Number(order.gst) || 0;
//     const totalAmountWithGST = totalAmount + (totalAmount * gst) / 100;
//     return { unitPrice, area, qty, totalAmount, totalAmountWithGST };
//   };

//   // Check if order has changed
//   const hasOrderChanged = (order, index) => {
//     if (newOrders.has(index)) return false; // New orders don't need change detection
    
//     try {
//       const currentData = {
//         description: order.description,
//         orderType: order.orderType,
//         printType: order.printType,
//         media: order.media,
//         lamination: order.lamination,
//         mounting: order.mounting,
//         framing: order.framing,
//         installation: order.installation,
//         width: order.width,
//         height: order.height,
//         qty: order.qty,
//         gst: order.gst
//       };
      
//       if (!order.originalData) return false;
      
//       const originalData = JSON.parse(order.originalData);
//       const originalComparison = {
//         description: originalData.description,
//         orderType: originalData.orderType,
//         printType: originalData.printType,
//         media: originalData.media || "",
//         lamination: originalData.lamination || "",
//         mounting: originalData.mounting || "",
//         framing: originalData.framing || "",
//         installation: originalData.installation || "",
//         width: originalData.width,
//         height: originalData.height,
//         qty: originalData.qty,
//         gst: originalData.gst
//       };
      
//       return JSON.stringify(currentData) !== JSON.stringify(originalComparison);
//     } catch (e) {
//       console.error("Error comparing order data:", e);
//       return false;
//     }
//   };

//   const updateOrder = (index, key, value) => {
//     setFormData(prev => {
//       const orders = [...prev.orders];
//       orders[index] = { ...orders[index], [key]: value };

//       // Calculate area and measurement
//       const area = (orders[index].width || 0) * (orders[index].height || 0);
//       orders[index].measurement = area;

//       // Recalculate amounts
//       const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts(orders[index]);
//       orders[index].unitPrice = unitPrice;
//       orders[index].totalAmount = totalAmount;
//       orders[index].totalAmountWithGST = totalAmountWithGST;

//       // Mark as changed if it's an existing order
//       if (!newOrders.has(index) && hasOrderChanged(orders[index], index)) {
//         setChangedOrders(prev => new Set([...prev, index]));
//       }

//       return { ...prev, orders };
//     });
//   };

//   const updateOrderSteps = (index, steps) => {
//     setFormData(prev => {
//       const orders = [...prev.orders];
//       orders[index].steps = steps;
      
//       const mediaStep = steps.find((s) => s.stepName === "Media");
//       if (mediaStep) orders[index].media = mediaStep.stepValue;

//       // Calculate area and measurement
//       const area = (orders[index].width || 0) * (orders[index].height || 0);
//       orders[index].measurement = area;

//       // Recalculate amounts
//       const { unitPrice, totalAmount, totalAmountWithGST } = calculateOrderAmounts(orders[index]);
//       orders[index].unitPrice = unitPrice;
//       orders[index].totalAmount = totalAmount;
//       orders[index].totalAmountWithGST = totalAmountWithGST;

//       // Mark as changed if it's an existing order
//       if (!newOrders.has(index) && hasOrderChanged(orders[index], index)) {
//         setChangedOrders(prev => new Set([...prev, index]));
//       }

//       return { ...prev, orders };
//     });
//   };

//   const addOrder = () => {
//     const newOrder = {
//       description: "",
//       status: "CREATED",
//       priority: "HIGH",
//       orderType: selectedOrderType,
//       printType: "",
//       media: "",
//       lamination: "",
//       mounting: "",
//       framing: "",
//       installation: "",
//       unitPrice: 0,
//       qty: 1,
//       measurement: 0,
//       height: 1,
//       width: 1,
//       totalAmount: 0,
//       gst: 18,
//       totalAmountWithGST: 0,
//       steps: [],
//       images: [],
//       isNew: true
//     };

//     setFormData(prev => {
//       const newIndex = prev.orders.length;
//       setNewOrders(prevNew => new Set([...prevNew, newIndex]));
//       return {
//         ...prev,
//         orders: [...prev.orders, newOrder]
//       };
//     });
//   };

//   // Remove order - uses Redux for existing orders
//   const removeOrder = async (index) => {
//     const order = formData.orders[index];
    
//     if (order.id && !newOrders.has(index)) {
//       // Existing order - use Redux action
//       try {
//         setDeletingOrders(prev => new Set([...prev, index]));
        
//         console.log("🗑️ Deleting order via Redux:", order.id);
//         await dispatch(deleteOrderThunk(order.id)).unwrap();

//         // Remove from formData after successful deletion
//         setFormData(prev => ({
//           ...prev,
//           orders: prev.orders.filter((_, i) => i !== index)
//         }));

//         // Clean up tracking sets
//         setChangedOrders(prev => {
//           const newSet = new Set(prev);
//           newSet.delete(index);
//           return newSet;
//         });
//         setNewOrders(prev => {
//           const newSet = new Set(prev);
//           newSet.delete(index);
//           return newSet;
//         });
//         setDeletingOrders(prev => {
//           const newSet = new Set(prev);
//           newSet.delete(index);
//           return newSet;
//         });

//         // Remove images for this order
//         setOrderImages(imgs => {
//           const newImgs = { ...imgs };
//           delete newImgs[index];
//           return newImgs;
//         });
  
//         setResult({ success: true, message: "Order deleted successfully!" });
//         setTimeout(() => setResult(null), 3000);

//         // Call onSuccess to refresh parent data
//         if (onSuccess) onSuccess();

//       } catch (error) {
//         setDeletingOrders(prev => {
//           const newSet = new Set(prev);
//           newSet.delete(index);
//           return newSet;
//         });
        
//         console.error('❌ Redux delete error:', error);
//         setResult({ 
//           success: false, 
//           message: error || "Failed to delete order"
//         });
//         setTimeout(() => setResult(null), 5000);
//       }
//     } else {
//       // New order - just remove from state
//       setFormData(prev => ({
//         ...prev,
//         orders: prev.orders.filter((_, i) => i !== index)
//       }));
      
//       setNewOrders(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(index);
//         return newSet;
//       });
      
//       setOrderImages(imgs => {
//         const newImgs = { ...imgs };
//         delete newImgs[index];
//         return newImgs;
//       });
//     }
//   };

//   const handleImageChange = (index, files) => {
//     setOrderImages(imgs => ({
//       ...imgs,
//       [index]: Array.from(files)
//     }));
//   };

//   const handleOrderTypeChange = (orderType) => {
//     setSelectedOrderType(orderType);
//   };

//   // Save individual existing order using Redux
//   const saveOrder = async (index) => {
//     const order = formData.orders[index];
    
//     try {
//       // Build steps array based on the backend OrderStep model
//       const existingSteps = (postSaleData.orders?.find(o => o.id === order.id)?.steps || []);
//       const steps = [];
//       let stepNumber = 1;
      
//       // Add Printing step (preserve existing ID if available)
//       const printingStep = existingSteps.find(s => s.orderStepName === "Printing");
//       steps.push({
//         id: printingStep?.id,
//         stepName: "Printing",
//         stepValue: "Printing",
//         status: printingStep?.status || "CREATED",
//         stepNumber: stepNumber++
//       });
      
//       // Add user-selected steps (preserve existing IDs if available)
//       if (order.media) {
//         const mediaStep = existingSteps.find(s => s.orderStepName === "Media");
//         steps.push({
//           id: mediaStep?.id,
//           stepName: "Media",
//           stepValue: order.media,
//           status: mediaStep?.status || "CREATED",
//           stepNumber: stepNumber++
//         });
//       }
      
//       if (order.lamination) {
//         const laminationStep = existingSteps.find(s => s.orderStepName === "Lamination");
//         steps.push({
//           id: laminationStep?.id,
//           stepName: "Lamination",
//           stepValue: order.lamination,
//           status: laminationStep?.status || "CREATED",
//           stepNumber: stepNumber++
//         });
//       }
      
//       if (order.mounting) {
//         const mountingStep = existingSteps.find(s => s.orderStepName === "Mounting");
//         steps.push({
//           id: mountingStep?.id,
//           stepName: "Mounting",
//           stepValue: order.mounting,
//           status: mountingStep?.status || "CREATED",
//           stepNumber: stepNumber++
//         });
//       }
      
//       if (order.framing) {
//         const framingStep = existingSteps.find(s => s.orderStepName === "Framing");
//         steps.push({
//           id: framingStep?.id,
//           stepName: "Framing",
//           stepValue: order.framing,
//           status: framingStep?.status || "CREATED",
//           stepNumber: stepNumber++
//         });
//       }
      
//       if (order.installation) {
//         const installationStep = existingSteps.find(s => s.orderStepName === "Installation");
//         steps.push({
//           id: installationStep?.id,
//           stepName: "Installation",
//           stepValue: order.installation,
//           status: installationStep?.status || "CREATED",
//           stepNumber: stepNumber++
//         });
//       }
      
//       // Add Delivery step (preserve existing ID if available)
//       const deliveryStep = existingSteps.find(s => s.orderStepName === "Delivery");
//       steps.push({
//         id: deliveryStep?.id,
//         stepName: "Delivery",
//         stepValue: "Delivery",
//         status: deliveryStep?.status || "CREATED",
//         stepNumber: stepNumber++
//       });
      
//       // Create order object matching backend Order model
//       const orderToSend = {
//         id: order.id,
//         description: order.description || "",
//         status: order.status,
//         priority: order.priority,
//         orderType: order.orderType,
//         printType: order.printType,
//         media: order.media,
//         unitPrice: order.unitPrice,
//         height: order.height,
//         width: order.width,
//         qty: order.qty,
//         measurement: order.measurement,
//         totalAmount: order.totalAmount,
//         gst: order.gst,
//         totalAmountWithGST: order.totalAmountWithGST,
//         steps: steps
//       };

//       console.log('🔧 Updating order via Redux:', orderToSend);
      
//       // Use Redux action to update order
//       await dispatch(updateOrderThunk({ 
//         id: order.id, 
//         data: orderToSend 
//       })).unwrap();

//       // Remove from changed orders
//       setChangedOrders(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(index);
//         return newSet;
//       });

//       // Update original data
//       setFormData(prev => ({
//         ...prev,
//         orders: prev.orders.map((o, i) => 
//           i === index ? { ...o, originalData: JSON.stringify(order) } : o
//         )
//       }));

//       setResult({ success: true, message: "Order updated successfully!" });
//       setTimeout(() => setResult(null), 3000);

//       // Call onSuccess to refresh parent data
//       if (onSuccess) onSuccess();

//     } catch (error) {
//       console.error('❌ Redux update error:', error);
//       setResult({ 
//         success: false, 
//         message: error || "Failed to update order"
//       });
//       setTimeout(() => setResult(null), 5000);
//     }
//   };

//   // Save new order using Redux
//   const saveNewOrder = async (index) => {
//     const order = formData.orders[index];
    
//     try {
//       // Build steps array based on the backend OrderStep model
//       const steps = [];
//       let stepNumber = 1;
      
//       // Add Printing step (always first)
//       steps.push({
//         stepName: "Printing",
//         stepValue: "Printing",
//         status: "CREATED",
//         stepNumber: stepNumber++
//       });
      
//       // Add user-selected steps
//       if (order.media) {
//         steps.push({
//           stepName: "Media",
//           stepValue: order.media,
//           status: "CREATED",
//           stepNumber: stepNumber++
//         });
//       }
      
//       if (order.lamination) {
//         steps.push({
//           stepName: "Lamination",
//           stepValue: order.lamination,
//           status: "CREATED",
//           stepNumber: stepNumber++
//         });
//       }
      
//       if (order.mounting) {
//         steps.push({
//           stepName: "Mounting",
//           stepValue: order.mounting,
//           status: "CREATED",
//           stepNumber: stepNumber++
//         });
//       }
      
//       if (order.framing) {
//         steps.push({
//           stepName: "Framing",
//           stepValue: order.framing,
//           status: "CREATED",
//           stepNumber: stepNumber++
//         });
//       }
      
//       if (order.installation) {
//         steps.push({
//           stepName: "Installation",
//           stepValue: order.installation,
//           status: "CREATED",
//           stepNumber: stepNumber++
//         });
//       }
      
//       // Add Delivery step (always last)
//       steps.push({
//         stepName: "Delivery",
//         stepValue: "Delivery",
//         status: "CREATED",
//         stepNumber: stepNumber++
//       });
      
//       // Create order object matching backend Order model
//       const orderToSend = {
//         description: order.description || "",
//         status: "CREATED",
//         priority: "HIGH",
//         orderType: order.orderType,
//         printType: order.printType,
//         media: order.media,
//         unitPrice: order.unitPrice,
//         height: order.height,
//         width: order.width,
//         qty: order.qty,
//         measurement: order.measurement,
//         totalAmount: order.totalAmount,
//         gst: order.gst,
//         totalAmountWithGST: order.totalAmountWithGST,
//         steps: steps
//       };

//       console.log('➕ Adding new order via Redux:', orderToSend);
      
//       const images = orderImages[index] || [];
      
//       // Use Redux action to add order to PostSales
//       const result = await dispatch(addOrderToPostSalesThunk({ 
//         srNumber: formData.srNumber, 
//         order: orderToSend, 
//         images 
//       })).unwrap();

//       // Update order with returned data
//       const newOrderData = result;
//       setFormData(prev => ({
//         ...prev,
//         orders: prev.orders.map((o, i) => 
//           i === index ? { 
//             ...o, 
//             id: newOrderData.id,
//             originalData: JSON.stringify(newOrderData),
//             isNew: false
//           } : o
//         )
//       }));

//       // Remove from new orders
//       setNewOrders(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(index);
//         return newSet;
//       });

//       setResult({ success: true, message: "New order added successfully!" });
//       setTimeout(() => setResult(null), 3000);

//       // Call onSuccess to refresh parent data
//       if (onSuccess) onSuccess();

//     } catch (error) {
//       console.error('❌ Redux add order error:', error);
//       setResult({ 
//         success: false, 
//         message: error || "Failed to add order"
//       });
//       setTimeout(() => setResult(null), 5000);
//     }
//   };

//   // Calculate totals for all orders
//   const calculateTotals = () => {
//     return formData.orders.reduce((totals, order) => {
//       const { area, totalAmount } = calculateOrderAmounts(order);
//       return {
//         totalWidth: totals.totalWidth + (order.width || 0),
//         totalHeight: totals.totalHeight + (order.height || 0),
//         totalArea: totals.totalArea + area,
//         totalQty: totals.totalQty + (order.qty || 0),
//         grandTotal: totals.grandTotal + totalAmount
//       };
//     }, { totalWidth: 0, totalHeight: 0, totalArea: 0, totalQty: 0, grandTotal: 0 });
//   };

//   const totals = calculateTotals();

//   if (!postSaleData) return null;

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.bigModalBox}>
//         {/* Header */}
//         <div className={styles.modalHeader}>
//           <h2>Manage Orders - {formData.client.name}</h2>
//           <button className={styles.closeBtn} onClick={onClose}>
//             <X size={20} />
//           </button>
//         </div>

//         <div className={styles.form}>
//           {/* Order Info Display */}
//           <div className={styles.section}>
//             <h3>Order Information</h3>
//             <div className={styles.infoDisplay}>
//               <div className={styles.infoItem}>
//                 <span className={styles.infoLabel}>Order #:</span>
//                 <span className={styles.infoValue}>{formData.srNumber}</span>
//               </div>
//               <div className={styles.infoItem}>
//                 <span className={styles.infoLabel}>Date:</span>
//                 <span className={styles.infoValue}>
//                   {new Date(formData.postSalesdateTime).toLocaleString()}
//                 </span>
//               </div>
//               <div className={styles.infoItem}>
//                 <span className={styles.infoLabel}>Status:</span>
//                 <StatusBadge status={formData.status} />
//               </div>
//               <div className={styles.infoItem}>
//                 <span className={styles.infoLabel}>Client Type:</span>
//                 <span className={styles.infoValue}>{formData.clientType}</span>
//               </div>
//             </div>
//           </div>

//           {/* Client Info Display */}
//           <div className={styles.section}>
//             <h3>Client Information</h3>
//             <div className={styles.infoDisplay}>
//               <div className={styles.infoItem}>
//                 <span className={styles.infoLabel}>Name:</span>
//                 <span className={styles.infoValue}>{formData.client.name}</span>
//               </div>
//               <div className={styles.infoItem}>
//                 <span className={styles.infoLabel}>Email:</span>
//                 <span className={styles.infoValue}>{formData.client.email}</span>
//               </div>
//               <div className={styles.infoItem}>
//                 <span className={styles.infoLabel}>Phone:</span>
//                 <span className={styles.infoValue}>{formData.client.phone}</span>
//               </div>
//             </div>
//           </div>

//           {/* Order Type Tabs */}
//           <div className={styles.section}>
//             <h3>Orders ({formData.orders.length})</h3>
//             <div className={styles.tabs}>
//               {getOrderTypes().map((orderType) => (
//                 <button 
//                   key={orderType}
//                   type="button"
//                   className={`${styles.tab} ${selectedOrderType === orderType ? styles.active : ''}`}
//                   onClick={() => handleOrderTypeChange(orderType)}
//                 >
//                   {orderType}
//                   <span className={styles.badge}>
//                     {formData.orders.filter(order => order.orderType === orderType).length}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Global Loading Indicator */}
//           {operationLoading && (
//             <div className={styles.globalLoading}>
//               <AlertCircle size={16} />
//               Processing operation...
//             </div>
//           )}

//           {/* Redux Error Display */}
//           {error && (
//             <div className={styles.reduxError}>
//               <AlertCircle size={16} />
//               {error}
//               <button 
//                 className={styles.clearErrorBtn}
//                 onClick={() => dispatch(clearError())}
//               >
//                 ✕
//               </button>
//             </div>
//           )}

//           {/* Orders Table */}
//           <div className={styles.tableWrapper1}>
//             <table className={styles.ordersTable}>
//               <thead>
//                 <tr>
//                   <th>Order Type</th>
//                   <th>Description</th>
//                   <th>Print Type</th>
//                   <th>Media</th>
//                   <th>Lamination</th>
//                   <th>Mounting</th>
//                   <th>Framing</th>
//                   <th>Installation</th>
//                   <th>Width<br/>(Feet)</th>
//                   <th>Height<br/>(Feet)</th>
//                   <th>Area<br/>(Sq.Ft)</th>
//                   <th>Qty</th>
//                   <th>Rate<br/>(₹/Sq.Ft)</th>
//                   <th>GST<br/>(%)</th>
//                   <th>Amount<br/>(₹)</th>
//                   <th>Images</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {formData.orders.map((order, index) => (
//                   <UpdateOrderTableRow
//                     key={`${index}-${order.orderType}-${order.id}`}
//                     order={order}
//                     index={index}
//                     clientType={formData.clientType}
//                     updateOrder={updateOrder}
//                     updateOrderSteps={updateOrderSteps}
//                     removeOrder={removeOrder}
//                     saveOrder={saveOrder}
//                     saveNewOrder={saveNewOrder}
//                     getOrderTypes={getOrderTypes}
//                     getPrintTypes={getPrintTypes}
//                     getStepOptions={getStepOptions}
//                     calculateOrderAmounts={calculateOrderAmounts}
//                     handleImageChange={handleImageChange}
//                     orderImages={orderImages}
//                     hasChanged={hasOrderChanged(order, index)}
//                     isNew={newOrders.has(index)}
//                     isDeleting={deletingOrders.has(index)}
//                     submitting={operationLoading}
//                   />
//                 ))}
                
//                 {/* Total Row */}
//                 <tr className={styles.totalRow}>
//                   <td><strong>Total</strong></td>
//                   <td colSpan="7"></td>
//                   <td><strong>{totals.totalWidth.toFixed(1)}</strong></td>
//                   <td><strong>{totals.totalHeight.toFixed(1)}</strong></td>
//                   <td><strong>{totals.totalArea.toFixed(2)}</strong></td>
//                   <td><strong>{totals.totalQty}</strong></td>
//                   <td></td>
//                   <td></td>
//                   <td><strong>₹{totals.grandTotal.toFixed(2)}</strong></td>
//                   <td></td>
//                   <td></td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {/* Add Item Button */}
//           <div className={styles.addItemSection}>
//             <button 
//               type="button" 
//               className={styles.addItemBtn} 
//               onClick={addOrder}
//               disabled={operationLoading}
//             >
//               <Plus size={16} /> Add New Order
//             </button>
//           </div>

//           {/* Local Result Messages */}
//           {result && (
//             <div className={result.success ? styles.successMsg : styles.errorMsg}>
//               {result.message}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Update Order Table Row Component
// function UpdateOrderTableRow({
//   order,
//   index,
//   clientType,
//   updateOrder,
//   updateOrderSteps,
//   removeOrder,
//   saveOrder,
//   saveNewOrder,
//   getOrderTypes,
//   getPrintTypes,
//   getStepOptions,
//   calculateOrderAmounts,
//   handleImageChange,
//   orderImages,
//   hasChanged,
//   isNew,
//   isDeleting,
//   submitting
// }) {
//   // Initialize step selections based on current order values and steps
//   const [stepSelections, setStepSelections] = useState(() => {
//     const initialSteps = {
//       Media: order.media || "",
//       Lamination: order.lamination || "",
//       Mounting: order.mounting || "",
//       Framing: order.framing || "",
//       Installation: order.installation || ""
//     };

//     // Override with values from steps if available
//     if (order.steps && order.steps.length > 0) {
//       order.steps.forEach(step => {
//         if (step.stepName && step.stepValue) {
//           initialSteps[step.stepName] = step.stepValue;
//         }
//       });
//     }

//     return initialSteps;
//   });

//   // Update step selections when order changes
//   useEffect(() => {
//     const updatedSteps = {
//       Media: order.media || "",
//       Lamination: order.lamination || "",
//       Mounting: order.mounting || "",
//       Framing: order.framing || "",
//       Installation: order.installation || ""
//     };

//     // Override with values from steps if available
//     if (order.steps && order.steps.length > 0) {
//       order.steps.forEach(step => {
//         if (step.stepName && step.stepValue) {
//           updatedSteps[step.stepName] = step.stepValue;
//         }
//       });
//     }

//     setStepSelections(updatedSteps);
//   }, [order.media, order.lamination, order.mounting, order.framing, order.installation, order.steps]);

//   const handleStepSelect = (stepKey, value) => {
//     const next = { ...stepSelections, [stepKey]: value };
//     setStepSelections(next);
    
//     const steps = Object.entries(next)
//       .filter(([key, val]) => val && val !== "")
//       .map(([key, val]) => ({
//         stepName: key,
//         stepValue: val,
//         status: "CREATED"
//       }));
    
//     updateOrderSteps(index, steps);
//     updateOrder(index, stepKey.toLowerCase(), value);
//   };

//   const handlePrintTypeChange = (value) => {
//     updateOrder(index, "printType", value);
//     // Reset step selections when print type changes
//     const resetSteps = {
//       Media: "",
//       Lamination: "",
//       Mounting: "",
//       Framing: "",
//       Installation: ""
//     };
//     setStepSelections(resetSteps);
//     updateOrderSteps(index, []);
//     // Reset individual step values
//     updateOrder(index, "media", "");
//     updateOrder(index, "lamination", "");
//     updateOrder(index, "mounting", "");
//     updateOrder(index, "framing", "");
//     updateOrder(index, "installation", "");
//   };

//   const { unitPrice, area, totalAmount } = calculateOrderAmounts(order);

//   return (
//     <tr className={`${styles.orderRow} ${isNew ? styles.newOrder : ''} ${hasChanged ? styles.changedOrder : ''}`}>
//       <td>
//         <select
//           value={order.orderType || ""}
//           onChange={(e) => updateOrder(index, "orderType", e.target.value)}
//           className={styles.tableSelect}
//           disabled={submitting}
//         >
//           <option value="">Select Order Type</option>
//           {getOrderTypes().map((type) => (
//             <option key={type} value={type}>{type}</option>
//           ))}
//         </select>
//       </td>
//       <td>
//         <input
//           type="text"
//           value={order.description}
//           onChange={(e) => updateOrder(index, "description", e.target.value)}
//           className={styles.tableInput}
//           placeholder="Enter description"
//           disabled={submitting}
//         />
//       </td>
//       <td>
//         <select
//           value={order.printType || ""}
//           onChange={(e) => handlePrintTypeChange(e.target.value)}
//           className={styles.tableSelect}
//           disabled={submitting}
//         >
//           <option value="">Select Print Type</option>
//           {order.orderType && getPrintTypes(order.orderType).map((type) => (
//             <option key={type} value={type}>{type}</option>
//           ))}
//         </select>
//       </td>
//       <td>
//         <select
//           value={stepSelections.Media}
//           onChange={(e) => handleStepSelect("Media", e.target.value)}
//           className={styles.tableSelect}
//           disabled={submitting}
//         >
//           <option value="">Select Media</option>
//           {order.printType && getStepOptions(order.orderType, order.printType, "Media").map((opt) => (
//             <option key={opt.name} value={opt.name}>
//               {opt.name} - ₹{opt.cost || opt.costCMYK || 0}
//             </option>
//           ))}
//         </select>
//       </td>
//       <td>
//         <select
//           value={stepSelections.Lamination}
//           onChange={(e) => handleStepSelect("Lamination", e.target.value)}
//           className={styles.tableSelect}
//           disabled={submitting}
//         >
//           <option value="">Select Lamination</option>
//           {order.printType && getStepOptions(order.orderType, order.printType, "Lamination").map((opt) => (
//             <option key={opt.name} value={opt.name}>
//               {opt.name} - ₹{opt.cost || 0}
//             </option>
//           ))}
//         </select>
//       </td>
//       <td>
//         <select
//           value={stepSelections.Mounting}
//           onChange={(e) => handleStepSelect("Mounting", e.target.value)}
//           className={styles.tableSelect}
//           disabled={submitting}
//         >
//           <option value="">Select Mounting</option>
//           {order.printType && getStepOptions(order.orderType, order.printType, "Mounting").map((opt) => (
//             <option key={opt.name} value={opt.name}>
//               {opt.name} - ₹{opt.cost || 0}
//             </option>
//           ))}
//         </select>
//       </td>
//       <td>
//         <select
//           value={stepSelections.Framing}
//           onChange={(e) => handleStepSelect("Framing", e.target.value)}
//           className={styles.tableSelect}
//           disabled={submitting}
//         >
//           <option value="">Select Framing</option>
//           {order.printType && getStepOptions(order.orderType, order.printType, "Framing").map((opt) => (
//             <option key={opt.name} value={opt.name}>
//               {opt.name} - ₹{opt.cost || 0}
//             </option>
//           ))}
//         </select>
//       </td>
//       <td>
//         <select
//           value={stepSelections.Installation}
//           onChange={(e) => handleStepSelect("Installation", e.target.value)}
//           className={styles.tableSelect}
//           disabled={submitting}
//         >
//           <option value="">Select Installation</option>
//           {order.printType && getStepOptions(order.orderType, order.printType, "Installation").map((opt) => (
//             <option key={opt.name} value={opt.name}>
//               {opt.name} - ₹{opt.cost || 0}
//             </option>
//           ))}
//         </select>
//       </td>
//       <td>
//         <input
//           type="number"
//           value={order.width || 0}
//           onChange={(e) => updateOrder(index, "width", Number(e.target.value))}
//           className={styles.tableInput}
//           min="0"
//           step="0.1"
//           disabled={submitting}
//         />
//       </td>
//       <td>
//         <input
//           type="number"
//           value={order.height || 0}
//           onChange={(e) => updateOrder(index, "height", Number(e.target.value))}
//           className={styles.tableInput}
//           min="0"
//           step="0.1"
//           disabled={submitting}
//         />
//       </td>
//       <td className={styles.calculated}>
//         {area.toFixed(2)}
//       </td>
//       <td>
//         <input
//           type="number"
//           value={order.qty || 1}
//           onChange={(e) => updateOrder(index, "qty", Number(e.target.value))}
//           className={styles.tableInput}
//           min="1"
//           disabled={submitting}
//         />
//       </td>
//       <td className={styles.calculated}>
//         {unitPrice.toFixed(2)}
//       </td>
//       <td>
//         <select
//           value={order.gst || 18}
//           onChange={(e) => updateOrder(index, "gst", Number(e.target.value))}
//           className={styles.tableSelect}
//           disabled={submitting}
//         >
//           {GST_OPTIONS.map((gst) => (
//             <option key={gst} value={gst}>{gst}%</option>
//           ))}
//         </select>
//       </td>
//       <td className={styles.calculated}>
//         ₹{totalAmount.toFixed(2)}
//       </td>
//       <td>
//         <div className={styles.imageUpload}>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={(e) => handleImageChange(index, e.target.files)}
//             className={styles.fileInput}
//             id={`images-${index}`}
//             disabled={submitting}
//           />
//           <label htmlFor={`images-${index}`} className={styles.fileLabel}>
//             <Upload size={14} />
//             {orderImages[index]?.length || order.images?.length || 0}
//           </label>
//           {order.images && order.images.length > 0 && (
//             <div className={styles.existingImages}>
//               {order.images.map((img, imgIndex) => (
//                 <a
//                   key={imgIndex}
//                   href={img.imageUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className={styles.imageLink}
//                   title="View existing image"
//                 >
//                   🖼️
//                 </a>
//               ))}
//             </div>
//           )}
//         </div>
//       </td>
//       <td>
//         <div className={styles.actionButtons}>
//           {isNew ? (
//             <button 
//               type="button" 
//               className={`${styles.actionBtn} ${styles.saveNewBtn}`}
//               onClick={() => saveNewOrder(index)}
//               disabled={submitting}
//               title="Save new order"
//             >
//               <Save size={14} />
//               {submitting ? "..." : "Save"}
//             </button>
//           ) : hasChanged ? (
//             <button 
//               type="button" 
//               className={`${styles.actionBtn} ${styles.saveBtn}`}
//               onClick={() => saveOrder(index)}
//               disabled={submitting}
//               title="Save changes"
//             >
//               <Save size={14} />
//               {submitting ? "..." : "Update"}
//             </button>
//           ) : null}
          
//           <button 
//             type="button" 
//             className={`${styles.actionBtn} ${styles.deleteBtn}`}
//             onClick={() => removeOrder(index)}
//             disabled={isDeleting || submitting}
//             title={isNew ? "Remove order" : "Delete order"}
//           >
//             {isDeleting ? (
//               <AlertCircle size={14} />
//             ) : (
//               <Trash2 size={14} />
//             )}
//           </button>
//         </div>
//       </td>
//     </tr>
//   );
// }
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./UpdateOrderPopup.module.scss";
import { X, Plus, Trash2, Upload, Save, AlertCircle } from "lucide-react";
import PRINT_PRICES from "../../printprices";
import ImageManagementPopup from "./ImageManagementPopup";

// Redux actions - Import from both slices
import {
  updateOrderThunk,
  deleteOrderThunk,
  addOrderToPostSalesThunk,
  clearError,
} from "../../store/slices/orderSlice";

import {
  updateOrderInPostSale,
  addOrderToPostSale,
  removeOrderFromPostSale,
  addOrderInPostSalesThunk,
} from "../../store/slices/postsaleSlice";

const GST_OPTIONS = [0, 5, 12, 16, 18];

const statusColors = {
  CREATED: styles.statusCreated,
  COMPLETED: styles.statusCompleted,
  PENDING: styles.statusPending,
  IN_PROGRESS: styles.statusInProgress,
};

const StatusBadge = ({ status }) => (
  <span className={`${styles.statusBadge} ${statusColors[status] || styles.statusPending}`}>
    {status || "PENDING"}
  </span>
);

export default function UpdateOrderPopup({
  postSaleData,
  onClose,
  onSuccess
}) {
  const dispatch = useDispatch();
  
  // Image Management States
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const [selectedOrderForImages, setSelectedOrderForImages] = useState(null);

  // Redux state from both slices
  const { operationLoading, error } = useSelector((state) => state.orders);
  const { operationLoading: postSaleOperationLoading } = useSelector((state) => state.postsales);
  
  const [formData, setFormData] = useState({
    srNumber: "",
    postSalesdateTime: "",
    clientType: "Cash",
    client: {
      id: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      pan: "",
      gstcertificate: ""
    },
    orders: [],
    remark: "",
    notified: false,
    status: "CREATED"
  });
  
  const [orderImages, setOrderImages] = useState({});
  const [selectedOrderType, setSelectedOrderType] = useState('');
  const [result, setResult] = useState(null);
  const [changedOrders, setChangedOrders] = useState(new Set());
  const [newOrders, setNewOrders] = useState(new Set());
  const [deletingOrders, setDeletingOrders] = useState(new Set());

  // Image Management Functions
  const openImagePopup = (order, index) => {
    setSelectedOrderForImages({ ...order, index });
    setImagePopupOpen(true);
  };

  const closeImagePopup = () => {
    setImagePopupOpen(false);
    setSelectedOrderForImages(null);
  };

  const handleImagesUpdated = (updatedImages) => {
    if (selectedOrderForImages && selectedOrderForImages.index !== undefined) {
      setFormData(prev => ({
        ...prev,
        orders: prev.orders.map((order, i) => 
          i === selectedOrderForImages.index 
            ? { ...order, images: updatedImages }
            : order
        )
      }));

      // Also call onSuccess to refresh parent data if needed
      if (onSuccess) onSuccess();
    }
  };

  // Clear Redux error on mount
  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Initialize form data when postSaleData is provided
  useEffect(() => {
    if (postSaleData) {
      console.log("🔄 Initializing UpdateOrderPopup with data:", postSaleData);
      
      setFormData({
        srNumber: postSaleData.srNumber || "",
        postSalesdateTime: postSaleData.postSalesdateTime || "",
        clientType: postSaleData.clientType || "Cash",
        client: {
          id: postSaleData.client?.id || "",
          name: postSaleData.client?.name || "",
          email: postSaleData.client?.email || "",
          phone: postSaleData.client?.phone || "",
          address: postSaleData.client?.address || "",
          pan: postSaleData.client?.pan || "",
          gstcertificate: postSaleData.client?.gstcertificate || ""
        },
        orders: postSaleData.orders?.map(order => {
          // Extract step values from the steps array
          const stepValues = {};
          if (order.steps) {
            order.steps.forEach(step => {
              if (step.orderStepName && step.measurement) {
                stepValues[step.orderStepName] = step.measurement;
              }
            });
          }

          return {
            id: order.id,
            description: order.description || "",
            status: order.status || "CREATED",
            priority: order.priority || "HIGH",
            orderType: order.orderType || "",
            printType: order.printType || "",
            media: stepValues.Media || order.media || "",
            lamination: stepValues.Lamination || order.lamination || "",
            mounting: stepValues.Mounting || order.mounting || "",
            framing: stepValues.Framing || order.framing || "",
            installation: stepValues.Installation || order.installation || "",
            unitPrice: order.unitPrice || 0,
            qty: order.qty || 1,
            measurement: order.measurement || 0,
            height: order.height || 1,
            width: order.width || 1,
            totalAmount: order.totalAmount || 0,
            gst: order.gst || 18,
            totalAmountWithGST: order.totalAmountWithGST || 0,
            steps: order.steps?.filter(step => 
              step.orderStepName !== "Printing" && 
              step.orderStepName !== "Delivery"
            ).map(step => ({
              id: step.id,
              stepName: step.orderStepName,
              stepValue: step.measurement,
              status: step.status
            })) || [],
            images: order.images || [],
            originalData: JSON.stringify(order) // Store original data for comparison
          };
        }) || [],
        remark: postSaleData.remark || "",
        notified: postSaleData.notified || false,
        status: postSaleData.status || "CREATED"
      });

      // Set initial selected order type
      if (postSaleData.orders && postSaleData.orders.length > 0) {
        const orderTypes = getOrderTypes(postSaleData.clientType);
        setSelectedOrderType(orderTypes[0] || '');
      }
    }
  }, [postSaleData]);

  // ---------- Dynamic options ----------
  const getOrderTypes = (clientType = formData.clientType) => {
    if (!clientType) return [];
    return Object.keys(
      PRINT_PRICES.clientTypes[clientType]?.orderTypes || {}
    );
  };

  const getPrintTypes = (orderType) => {
    if (!formData.clientType || !orderType) return [];
    return Object.keys(
      PRINT_PRICES.clientTypes[formData.clientType].orderTypes[orderType]
        .printTypes || {}
    );
  };

  const getStepOptions = (orderType, printType, stepKey) => {
    if (!formData.clientType || !orderType || !printType) return [];
    return (
      PRINT_PRICES.clientTypes[formData.clientType].orderTypes[orderType]
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

  // Check if order has changed
  const hasOrderChanged = (order, index) => {
    if (newOrders.has(index)) return false; // New orders don't need change detection
    
    try {
      const currentData = {
        description: order.description,
        orderType: order.orderType,
        printType: order.printType,
        media: order.media,
        lamination: order.lamination,
        mounting: order.mounting,
        framing: order.framing,
        installation: order.installation,
        width: order.width,
        height: order.height,
        qty: order.qty,
        gst: order.gst
      };
      
      if (!order.originalData) return false;
      
      const originalData = JSON.parse(order.originalData);
      const originalComparison = {
        description: originalData.description,
        orderType: originalData.orderType,
        printType: originalData.printType,
        media: originalData.media || "",
        lamination: originalData.lamination || "",
        mounting: originalData.mounting || "",
        framing: originalData.framing || "",
        installation: originalData.installation || "",
        width: originalData.width,
        height: originalData.height,
        qty: originalData.qty,
        gst: originalData.gst
      };
      
      return JSON.stringify(currentData) !== JSON.stringify(originalComparison);
    } catch (e) {
      console.error("Error comparing order data:", e);
      return false;
    }
  };

  const updateOrder = (index, key, value) => {
    setFormData(prev => {
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

      // Mark as changed if it's an existing order
      if (!newOrders.has(index) && hasOrderChanged(orders[index], index)) {
        setChangedOrders(prev => new Set([...prev, index]));
      }

      return { ...prev, orders };
    });
  };

  const updateOrderSteps = (index, steps) => {
    setFormData(prev => {
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

      // Mark as changed if it's an existing order
      if (!newOrders.has(index) && hasOrderChanged(orders[index], index)) {
        setChangedOrders(prev => new Set([...prev, index]));
      }

      return { ...prev, orders };
    });
  };

  const addOrder = () => {
    const newOrder = {
      description: "",
      status: "CREATED",
      priority: "HIGH",
      orderType: selectedOrderType,
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
      images: [],
      isNew: true
    };

    setFormData(prev => {
      const newIndex = prev.orders.length;
      setNewOrders(prevNew => new Set([...prevNew, newIndex]));
      return {
        ...prev,
        orders: [...prev.orders, newOrder]
      };
    });
  };

  // Remove order - uses Redux for existing orders with proper synchronization
  const removeOrder = async (index) => {
    const order = formData.orders[index];
    
    if (order.id && !newOrders.has(index)) {
      // Existing order - use Redux action and sync with PostSale slice
      try {
        setDeletingOrders(prev => new Set([...prev, index]));
        
        console.log("🗑️ Deleting order via Redux:", order.id);
        await dispatch(deleteOrderThunk(order.id)).unwrap();

        // Sync with PostSale slice - remove order from postsale
        dispatch(removeOrderFromPostSale({
          srNumber: formData.srNumber,
          orderId: order.id
        }));

        // Remove from formData after successful deletion
        setFormData(prev => ({
          ...prev,
          orders: prev.orders.filter((_, i) => i !== index)
        }));

        // Clean up tracking sets with proper index adjustment
        const ordersBelowDeleted = Array.from(changedOrders).filter(i => i > index).map(i => i - 1);
        const newOrdersBelowDeleted = Array.from(newOrders).filter(i => i > index).map(i => i - 1);
        
        setChangedOrders(new Set(ordersBelowDeleted));
        setNewOrders(new Set(newOrdersBelowDeleted));
        setDeletingOrders(new Set());

        // Remove images for this order and adjust indices
        setOrderImages(imgs => {
          const newImgs = {};
          Object.entries(imgs).forEach(([key, value]) => {
            const keyIndex = parseInt(key);
            if (keyIndex < index) {
              newImgs[key] = value;
            } else if (keyIndex > index) {
              newImgs[keyIndex - 1] = value;
            }
          });
          return newImgs;
        });
  
        setResult({ success: true, message: "Order deleted successfully!" });

        // Call onSuccess to refresh parent data
        if (onSuccess) onSuccess();

      } catch (error) {
        setDeletingOrders(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
        
        console.error('❌ Redux delete error:', error);
        setResult({ 
          success: false, 
          message: error || "Failed to delete order"
        });
      }
    } else {
      // New order - just remove from state
      setFormData(prev => ({
        ...prev,
        orders: prev.orders.filter((_, i) => i !== index)
      }));
      
      // Clean up tracking sets with proper index adjustment
      const ordersBelowDeleted = Array.from(changedOrders).filter(i => i > index).map(i => i - 1);
      const newOrdersBelowDeleted = Array.from(newOrders).filter(i => i > index).map(i => i - 1);
      
      setChangedOrders(new Set(ordersBelowDeleted));
      setNewOrders(new Set(newOrdersBelowDeleted));
      
      // Remove images for this order and adjust indices
      setOrderImages(imgs => {
        const newImgs = {};
        Object.entries(imgs).forEach(([key, value]) => {
          const keyIndex = parseInt(key);
          if (keyIndex < index) {
            newImgs[key] = value;
          } else if (keyIndex > index) {
            newImgs[keyIndex - 1] = value;
          }
        });
        return newImgs;
      });
    }
  };

  const handleImageChange = (index, files) => {
    setOrderImages(imgs => ({
      ...imgs,
      [index]: Array.from(files)
    }));
  };

  const handleOrderTypeChange = (orderType) => {
    setSelectedOrderType(orderType);
  };

  // Save individual existing order using Redux with proper synchronization
  const saveOrder = async (index) => {
    const order = formData.orders[index];
    
    try {
      // Build steps array based on the backend OrderStep model
      const existingSteps = (postSaleData.orders?.find(o => o.id === order.id)?.steps || []);
      const steps = [];
      let stepNumber = 1;
      
      // Add Printing step (preserve existing ID if available)
      const printingStep = existingSteps.find(s => s.orderStepName === "Printing");
      steps.push({
        id: printingStep?.id,
        stepName: "Printing",
        stepValue: "Printing",
        status: printingStep?.status || "CREATED",
        stepNumber: stepNumber++
      });
      
      // Add user-selected steps (preserve existing IDs if available)
      if (order.media) {
        const mediaStep = existingSteps.find(s => s.orderStepName === "Media");
        steps.push({
          id: mediaStep?.id,
          stepName: "Media",
          stepValue: order.media,
          status: mediaStep?.status || "CREATED",
          stepNumber: stepNumber++
        });
      }
      
      if (order.lamination) {
        const laminationStep = existingSteps.find(s => s.orderStepName === "Lamination");
        steps.push({
          id: laminationStep?.id,
          stepName: "Lamination",
          stepValue: order.lamination,
          status: laminationStep?.status || "CREATED",
          stepNumber: stepNumber++
        });
      }
      
      if (order.mounting) {
        const mountingStep = existingSteps.find(s => s.orderStepName === "Mounting");
        steps.push({
          id: mountingStep?.id,
          stepName: "Mounting",
          stepValue: order.mounting,
          status: mountingStep?.status || "CREATED",
          stepNumber: stepNumber++
        });
      }
      
      if (order.framing) {
        const framingStep = existingSteps.find(s => s.orderStepName === "Framing");
        steps.push({
          id: framingStep?.id,
          stepName: "Framing",
          stepValue: order.framing,
          status: framingStep?.status || "CREATED",
          stepNumber: stepNumber++
        });
      }
      
      if (order.installation) {
        const installationStep = existingSteps.find(s => s.orderStepName === "Installation");
        steps.push({
          id: installationStep?.id,
          stepName: "Installation",
          stepValue: order.installation,
          status: installationStep?.status || "CREATED",
          stepNumber: stepNumber++
        });
      }
      
      // Add Delivery step (preserve existing ID if available)
      const deliveryStep = existingSteps.find(s => s.orderStepName === "Delivery");
      steps.push({
        id: deliveryStep?.id,
        stepName: "Delivery",
        stepValue: "Delivery",
        status: deliveryStep?.status || "CREATED",
        stepNumber: stepNumber++
      });
      
      // Create order object matching backend Order model
      const orderToSend = {
        id: order.id,
        description: order.description || "",
        status: order.status,
        priority: order.priority,
        orderType: order.orderType,
        printType: order.printType,
        media: order.media,
        unitPrice: order.unitPrice,
        height: order.height,
        width: order.width,
        qty: order.qty,
        measurement: order.measurement,
        totalAmount: order.totalAmount,
        gst: order.gst,
        totalAmountWithGST: order.totalAmountWithGST,
        steps: steps
      };

      console.log('🔧 Updating order via Redux:', orderToSend);
      
      // Use Redux action to update order
      const updatedOrderResult = await dispatch(updateOrderThunk({ 
        id: order.id, 
        data: orderToSend 
      })).unwrap();

      // Get the updated order data
      const updatedOrder = updatedOrderResult.updatedData || orderToSend;

      // Sync with PostSale slice - update order in postsale
      dispatch(updateOrderInPostSale({
        srNumber: formData.srNumber,
        orderId: order.id,
        updatedOrder: updatedOrder
      }));

      // Remove from changed orders
      setChangedOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });

      // Update original data
      setFormData(prev => ({
        ...prev,
        orders: prev.orders.map((o, i) => 
          i === index ? { 
            ...o, 
            ...updatedOrder,
            originalData: JSON.stringify(updatedOrder) 
          } : o
        )
      }));

      setResult({ success: true, message: "Order updated successfully!" });

      // Call onSuccess to refresh parent data
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('❌ Redux update error:', error);
      setResult({ 
        success: false, 
        message: error || "Failed to update order"
      });
    }
  };

  // Save new order using Redux with proper synchronization
  const saveNewOrder = async (index) => {
    const order = formData.orders[index];
    
    try {
      // Build steps array based on the backend OrderStep model
      const steps = [];
      let stepNumber = 1;
      
      // Add Printing step (always first)
      steps.push({
        stepName: "Printing",
        stepValue: "Printing",
        status: "CREATED",
        stepNumber: stepNumber++
      });
      
      // Add user-selected steps
      if (order.media) {
        steps.push({
          stepName: "Media",
          stepValue: order.media,
          status: "CREATED",
          stepNumber: stepNumber++
        });
      }
      
      if (order.lamination) {
        steps.push({
          stepName: "Lamination",
          stepValue: order.lamination,
          status: "CREATED",
          stepNumber: stepNumber++
        });
      }
      
      if (order.mounting) {
        steps.push({
          stepName: "Mounting",
          stepValue: order.mounting,
          status: "CREATED",
          stepNumber: stepNumber++
        });
      }
      
      if (order.framing) {
        steps.push({
          stepName: "Framing",
          stepValue: order.framing,
          status: "CREATED",
          stepNumber: stepNumber++
        });
      }
      
      if (order.installation) {
        steps.push({
          stepName: "Installation",
          stepValue: order.installation,
          status: "CREATED",
          stepNumber: stepNumber++
        });
      }
      
      // Add Delivery step (always last)
      steps.push({
        stepName: "Delivery",
        stepValue: "Delivery",
        status: "CREATED",
        stepNumber: stepNumber++
      });
      
      // Create order object matching backend Order model
      const orderToSend = {
        description: order.description || "",
        status: "CREATED",
        priority: "HIGH",
        orderType: order.orderType,
        printType: order.printType,
        media: order.media,
        unitPrice: order.unitPrice,
        height: order.height,
        width: order.width,
        qty: order.qty,
        measurement: order.measurement,
        totalAmount: order.totalAmount,
        gst: order.gst,
        totalAmountWithGST: order.totalAmountWithGST,
        steps: steps
      };

      console.log('➕ Adding new order via Redux:', orderToSend);
      
      const images = orderImages[index] || [];
      
      // Use Redux action to add order to PostSales (this uses the postsale slice action)
      const result = await dispatch(addOrderInPostSalesThunk({ 
        srNumber: formData.srNumber, 
        order: orderToSend, 
        images 
      })).unwrap();

      // Get the new order data
      const newOrderData = result.order || result;

      // Also sync with PostSale slice using the manual action
      dispatch(addOrderToPostSale({
        srNumber: formData.srNumber,
        newOrder: newOrderData
      }));

      // Update order with returned data
      setFormData(prev => ({
        ...prev,
        orders: prev.orders.map((o, i) => 
          i === index ? { 
            ...o, 
            id: newOrderData.id,
            ...newOrderData,
            originalData: JSON.stringify(newOrderData),
            isNew: false
          } : o
        )
      }));

      // Remove from new orders
      setNewOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });

      setResult({ success: true, message: "New order added successfully!" });

      // Call onSuccess to refresh parent data
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('❌ Redux add order error:', error);
      setResult({ 
        success: false, 
        message: error || "Failed to add order"
      });
    }
  };

  // Calculate totals for all orders
  const calculateTotals = () => {
    return formData.orders.reduce((totals, order) => {
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

  if (!postSaleData) return null;

  // Check if any operation is loading
  const isLoading = operationLoading || postSaleOperationLoading;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.bigModalBox}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>Manage Orders - {formData.client.name}</h2>
          <button className={styles.closeBtn} onClick={onClose} disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.form}>
          {/* Order Info Display */}
          <div className={styles.section}>
            <h3>Order Information</h3>
            <div className={styles.infoDisplay}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Order #:</span>
                <span className={styles.infoValue}>{formData.srNumber}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Date:</span>
                <span className={styles.infoValue}>
                  {new Date(formData.postSalesdateTime).toLocaleString()}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Status:</span>
                <StatusBadge status={formData.status} />
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Client Type:</span>
                <span className={styles.infoValue}>{formData.clientType}</span>
              </div>
            </div>
          </div>

          {/* Client Info Display */}
          <div className={styles.section}>
            <h3>Client Information</h3>
            <div className={styles.infoDisplay}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Name:</span>
                <span className={styles.infoValue}>{formData.client.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{formData.client.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phone:</span>
                <span className={styles.infoValue}>{formData.client.phone}</span>
              </div>
            </div>
          </div>

          {/* Order Type Tabs */}
          <div className={styles.section}>
            <h3>Orders ({formData.orders.length})</h3>
            <div className={styles.tabs}>
              {getOrderTypes().map((orderType) => (
                <button 
                  key={orderType}
                  type="button"
                  className={`${styles.tab} ${selectedOrderType === orderType ? styles.active : ''}`}
                  onClick={() => handleOrderTypeChange(orderType)}
                  disabled={isLoading}
                >
                  {orderType}
                  <span className={styles.badge}>
                    {formData.orders.filter(order => order.orderType === orderType).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Global Loading Indicator */}
          {isLoading && (
            <div className={styles.globalLoading}>
              <AlertCircle size={16} />
              Processing operation...
            </div>
          )}

          {/* Redux Error Display */}
          {error && (
            <div className={styles.reduxError}>
              <AlertCircle size={16} />
              {error}
              <button 
                className={styles.clearErrorBtn}
                onClick={() => dispatch(clearError())}
              >
                ✕
              </button>
            </div>
          )}

          {/* Orders Table */}
          <div className={styles.tableWrapper1}>
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
                {formData.orders.map((order, index) => (
                  <UpdateOrderTableRow
                    key={`${index}-${order.orderType}-${order.id}`}
                    order={order}
                    index={index}
                    clientType={formData.clientType}
                    updateOrder={updateOrder}
                    updateOrderSteps={updateOrderSteps}
                    removeOrder={removeOrder}
                    saveOrder={saveOrder}
                    saveNewOrder={saveNewOrder}
                    getOrderTypes={getOrderTypes}
                    getPrintTypes={getPrintTypes}
                    getStepOptions={getStepOptions}
                    calculateOrderAmounts={calculateOrderAmounts}
                    handleImageChange={handleImageChange}
                    orderImages={orderImages}
                    hasChanged={hasOrderChanged(order, index)}
                    isNew={newOrders.has(index)}
                    isDeleting={deletingOrders.has(index)}
                    submitting={isLoading}
                    openImagePopup={openImagePopup}
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
            <button 
              type="button" 
              className={styles.addItemBtn} 
              onClick={addOrder}
              disabled={isLoading}
            >
              <Plus size={16} /> Add New Order
            </button>
          </div>

          {/* Local Result Messages */}
          {result && (
            <div className={result.success ? styles.successMsg : styles.errorMsg}>
              {result.message}
            </div>
          )}
        </div>
      </div>

      {/* Image Management Popup */}
      {imagePopupOpen && selectedOrderForImages && (
        <ImageManagementPopup
          isOpen={imagePopupOpen}
          onClose={closeImagePopup}
          order={selectedOrderForImages}
          onImagesUpdated={handleImagesUpdated}
        />
      )}
    </div>
  );
}

// Update Order Table Row Component
function UpdateOrderTableRow({
  order,
  index,
  clientType,
  updateOrder,
  updateOrderSteps,
  removeOrder,
  saveOrder,
  saveNewOrder,
  getOrderTypes,
  getPrintTypes,
  getStepOptions,
  calculateOrderAmounts,
  handleImageChange,
  orderImages,
  hasChanged,
  isNew,
  isDeleting,
  submitting,
  openImagePopup
}) {
  // Initialize step selections based on current order values and steps
  const [stepSelections, setStepSelections] = useState(() => {
    const initialSteps = {
      Media: order.media || "",
      Lamination: order.lamination || "",
      Mounting: order.mounting || "",
      Framing: order.framing || "",
      Installation: order.installation || ""
    };

    // Override with values from steps if available
    if (order.steps && order.steps.length > 0) {
      order.steps.forEach(step => {
        if (step.stepName && step.stepValue) {
          initialSteps[step.stepName] = step.stepValue;
        }
      });
    }

    return initialSteps;
  });

  // Update step selections when order changes
  useEffect(() => {
    const updatedSteps = {
      Media: order.media || "",
      Lamination: order.lamination || "",
      Mounting: order.mounting || "",
      Framing: order.framing || "",
      Installation: order.installation || ""
    };

    // Override with values from steps if available
    if (order.steps && order.steps.length > 0) {
      order.steps.forEach(step => {
        if (step.stepName && step.stepValue) {
          updatedSteps[step.stepName] = step.stepValue;
        }
      });
    }

    setStepSelections(updatedSteps);
  }, [order.media, order.lamination, order.mounting, order.framing, order.installation, order.steps]);

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
    <tr className={`${styles.orderRow} ${isNew ? styles.newOrder : ''} ${hasChanged ? styles.changedOrder : ''}`}>
      <td>
        <select
          value={order.orderType || ""}
          onChange={(e) => updateOrder(index, "orderType", e.target.value)}
          className={styles.tableSelect}
          disabled={submitting}
        >
          <option value="">Select Order Type</option>
          {getOrderTypes().map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </td>
      <td>
        <input
          type="text"
          value={order.description}
          onChange={(e) => updateOrder(index, "description", e.target.value)}
          className={styles.tableInput}
          placeholder="Enter description"
          disabled={submitting}
        />
      </td>
      <td>
        <select
          value={order.printType || ""}
          onChange={(e) => handlePrintTypeChange(e.target.value)}
          className={styles.tableSelect}
          disabled={submitting}
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
          className={styles.tableSelect}
          disabled={submitting}
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
          className={styles.tableSelect}
          disabled={submitting}
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
          className={styles.tableSelect}
          disabled={submitting}
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
          className={styles.tableSelect}
          disabled={submitting}
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
          className={styles.tableSelect}
          disabled={submitting}
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
          min="0"
          step="0.1"
          disabled={submitting}
        />
      </td>
      <td>
        <input
          type="number"
          value={order.height || 0}
          onChange={(e) => updateOrder(index, "height", Number(e.target.value))}
          className={styles.tableInput}
          min="0"
          step="0.1"
          disabled={submitting}
        />
      </td>
      <td className={styles.calculated}>
        {area.toFixed(2)}
      </td>
      <td>
        <input
          type="number"
          value={order.qty || 1}
          onChange={(e) => updateOrder(index, "qty", Number(e.target.value))}
          className={styles.tableInput}
          min="1"
          disabled={submitting}
        />
      </td>
      <td className={styles.calculated}>
        {unitPrice.toFixed(2)}
      </td>
      <td> 
      
      <select  
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
</select>

      </td>
      <td className={styles.calculated}>
        ₹{totalAmount.toFixed(2)}
      </td>
      <td>
        <div className={styles.imageUpload}>
          <button
            type="button"
            className={styles.imageManageBtn}
            onClick={() => openImagePopup(order, index)}
            disabled={submitting}
            title="Manage images"
          >
            <Upload size={14} />
            <span className={styles.imageCount}>
              {order.images?.length || 0}
            </span>
          </button>
          
          {order.images && order.images.length > 0 && (
            <div className={styles.imagePreview}>
              <img 
                src={order.images[0].imageUrl} 
                alt="Preview"
                className={styles.previewImage}
                onClick={() => openImagePopup(order, index)}
              />
              {order.images.length > 1 && (
                <span className={styles.moreIndicator}>
                  +{order.images.length - 1}
                </span>
              )}
            </div>
          )}
        </div>
      </td>
      <td>
        <div className={styles.actionButtons}>
          {isNew ? (
            <button 
              type="button" 
              className={`${styles.actionBtn} ${styles.saveNewBtn}`}
              onClick={() => saveNewOrder(index)}
              disabled={submitting}
              title="Save new order"
            >
              <Save size={14} />
              {submitting ? "..." : "Save"}
            </button>
          ) : hasChanged ? (
            <button 
              type="button" 
              className={`${styles.actionBtn} ${styles.saveBtn}`}
              onClick={() => saveOrder(index)}
              disabled={submitting}
              title="Save changes"
            >
              <Save size={14} />
              {submitting ? "..." : "Update"}
            </button>
          ) : null}
          
          <button 
            type="button" 
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={() => removeOrder(index)}
            disabled={isDeleting || submitting}
            title={isNew ? "Remove order" : "Delete order"}
          >
            {isDeleting ? (
              <AlertCircle size={14} />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}