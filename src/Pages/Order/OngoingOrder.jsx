// import React, { useState, useMemo } from "react";
// import styles from "./ongoingOrders.module.scss";
// import Table from "../../Components/Table"; // adjust the path if needed
// import { useData } from "../../context/DataContext";
// import HeaderLinks from "../../Components/HeaderLinks";
// import ContentStructure from "../../Layout/ContentStructure";
// import { updateOrderStepStatus } from "../../store/ordersSlice.js";
// import { useDispatch } from "react-redux";
// // Pastel colors for steps/progress
// const STEP_COLORS = [
//   styles.stepBlue,
//   styles.stepRed,
//   styles.stepYellow,
//   styles.stepPurple,
//   styles.stepGreen,
//   styles.stepOrange,
//   styles.stepPink,
// ];
// const links = [
//   { to: "/orders/new", label: "Add New Order" },
//   { to: "/orders/ongoing", label: "On-goining Orders" },
//   { to: "/orders/history", label: "History & Details" },
// ];
// // Status and Priority chips
// const STATUS_COLORS = {
//   CREATED: styles.statusPending,
//   PENDING: styles.statusPending,
//   ONGOING: styles.statusOngoing,
//   IN_PROGRESS: styles.statusOngoing,
//   COMPLETED: styles.statusCompleted,
// };
// const PRIORITY_COLORS = {
//   HIGH: styles.priorityHigh,
//   MEDIUM: styles.priorityMedium,
//   LOW: styles.priorityLow,
// };
// const STATUS_OPTIONS = [
//   "CREATED",
//   "IN_PROGRESS",
//   "COMPLETED",
//   "CANCELLED",
//   "PENDING",
// ];
// function getStatusColor(status = "") {
//   return STATUS_COLORS[(status || "").toUpperCase()] || styles.statusPending;
// }
// function getPriorityColor(priority = "") {
//   return (
//     PRIORITY_COLORS[(priority || "").toUpperCase()] || styles.priorityMedium
//   );
// }
// function formatDate(dateStr) {
//   if (!dateStr) return "-";
//   const d = new Date(dateStr);
//   return d.toLocaleDateString("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }
// function formatDateRange(start, end) {
//   if (!start || !end) return "-";
//   const startStr = new Date(start).toLocaleDateString("en-IN", {
//     month: "short",
//     day: "numeric",
//   });
//   const endStr = new Date(end).toLocaleDateString("en-IN", {
//     month: "short",
//     day: "numeric",
//   });
//   return `${startStr} - ${endStr}`;
// }

// const OngoingOrders = () => {
//   const { orders } = useData();
//   const postSales=orders;
//   const dispatch = useDispatch();
//   const [updatingStepId, setUpdatingStepId] = useState(null);
// console.log(postSales);

//   // Orders: attach postSale context for details modal
//   const safeOrders = useMemo(
//     () =>
//       Array.isArray(postSales)
//         ? postSales.flatMap((ps) =>
//             Array.isArray(ps.orders)
//               ? ps.orders.map((order) => ({
//                   ...order,
//                   _postSale: {
//                     srNumber: ps.srNumber,
//                     clientType: ps.clientType,
//                     client: ps.client,
//                     invoice: ps.invoice,
//                     notified: ps.notified,
//                     postSalesdateTime: ps.postSalesdateTime,
//                     remark: ps.remark,
//                   },
//                 }))
//               : []
//           )
//         : [],
//     [postSales]
//   );

//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // Table columns definition
//   const columns = [
//     { key: "srNumber", label: "Sr No." },
//     // { key: "id", label: "Order ID" },
//     { key: "clientName", label: "Client Name" },
//     { key: "clientType", label: "Client Type" },
//     { key: "createdAtDateTime", label: "Created" },
//     // { key: "media", label: "Media" },
//     { key: "qty", label: "Qty" },
//     { key: "unitPrice", label: "Unit Price" },
//     { key: "totalAmount", label: "Total" },
//     { key: "status", label: "Status" },
//     { key: "priority", label: "Priority" },
//     // { key: "schedule", label: "Schedule" },
//     { key: "actions", label: "Actions" },
//   ];

//   // Prepare table rows with React elements
//   const data = safeOrders.map((order,i) => ({
//     srNumber:i+1,
//     id: <span className={styles.bold}>#{order.id}</span>,
//     clientName: order._postSale?.client?.name || "-",
//     clientType: order._postSale?.clientType || "-",
//     createdAtDateTime: formatDate(order.createdAtDateTime),
//     // media: order.media || "-",
//     qty: order.qty ?? "-",
//     unitPrice: order.unitPrice !== undefined ? `₹${order.unitPrice}` : "-",
//     totalAmount:
//       order.totalAmount !== undefined ? `₹${order.totalAmount}` : "-",
//     status: (
//       <span className={`${styles.statusChip} ${getStatusColor(order.status)}`}>
//         {order.status}
//       </span>
//     ),
//     priority: (
//       <span
//         className={`${styles.priorityChip} ${getPriorityColor(order.priority)}`}
//       >
//         {order.priority}
//       </span>
//     ),
//     // schedule: formatDateRange(order.orderStartDateTime, order.orderEndDateTime),
//     actions: (
//       <button
//         className={styles.actionBtn}
//         title="View Details"
//         onClick={() => setSelectedOrder(order)}
//       >
//         👁️
//       </button>
//     ),
//   }));

//   // Modal Step Color List (to sync color order everywhere)
//   function getStepColor(index) {
//     return STEP_COLORS[index % STEP_COLORS.length];
//   }

//   // Handle step status change (you can wire this to API if needed)
//   const handleStepStatusChange = async (stepId, status) => {
//     setUpdatingStepId(stepId);
//     try {
//       await dispatch(
//         updateOrderStepStatus({ orderStepId: stepId, status })
//       ).unwrap();
//     } catch (err) {
//       alert("Error updating step status.");
//     } finally {
//       setUpdatingStepId(null);
//       window.location.reload()
//     }
//   };
//   // Steps/progress for modal
//   const steps = selectedOrder?.steps || [];
//   const completedSteps = steps.filter((s) => s.status === "COMPLETED").length;


//     const [imagePreview, setImagePreview] = useState({
//     isOpen: false,
//     currentImage: null,
//     currentIndex: 0,
//     images: []
//   });
//   // Image preview functions
//   const openImagePreview = (imageUrl, index, images) => {
//     setImagePreview({
//       isOpen: true,
//       currentImage: imageUrl,
//       currentIndex: index,
//       images: images
//     });
//     document.body.style.overflow = 'hidden'; // Prevent background scroll
//   };

//   const closeImagePreview = () => {
//     setImagePreview({
//       isOpen: false,
//       currentImage: null,
//       currentIndex: 0,
//       images: []
//     });
//     document.body.style.overflow = 'unset';
//   };

//   const navigateImage = (direction) => {
//     const { images, currentIndex } = imagePreview;
//     let newIndex;
    
//     if (direction === 'next') {
//       newIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1;
//     } else {
//       newIndex = currentIndex <= 0 ? images.length - 1 : currentIndex - 1;
//     }
    
//     const newImage = images[newIndex]?.imageUrl || images[newIndex]?.url || images[newIndex];
//     setImagePreview(prev => ({
//       ...prev,
//       currentIndex: newIndex,
//       currentImage: newImage
//     }));
//   };

//   // Handle keyboard navigation
//   React.useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (imagePreview.isOpen) {
//         if (e.key === 'Escape') {
//           closeImagePreview();
//         } else if (e.key === 'ArrowLeft') {
//           navigateImage('prev');
//         } else if (e.key === 'ArrowRight') {
//           navigateImage('next');
//         }
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [imagePreview.isOpen, imagePreview.images, imagePreview.currentIndex]);

//   return (
//     <ContentStructure links={links}>
//       <Table columns={columns} data={data} />

//       {/* Details Modal */}
//       {selectedOrder && (
//         <div
//           className={styles.modalOverlay}
//           onClick={() => setSelectedOrder(null)}
//         >
//           <div
//             className={styles.modalContent}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className={styles.headerRow}>
              
//               <div className={styles.title}>Project Name</div>
//               {/* <button className={styles.saveBtn}>Save</button> */} <button
//                 className={styles.saveBtn}
//                 onClick={() => setSelectedOrder(null)}
//               >
//                 Close
//               </button>
//             </div>

//             <div className={styles.mainSection}>
//               <div className={styles.clientInfoCard}>
//                 <div>
//                   <strong>Client Name:</strong>{" "}
//                   {selectedOrder._postSale?.client?.name || "-"}
//                 </div>
//                 <div>
//                   <strong>E-mail :</strong>{" "}
//                   {selectedOrder._postSale?.client?.email || "-"}
//                 </div>

//                 <div>
//                   <strong>Mobile Number:</strong>{" "}
//                   {selectedOrder._postSale?.client?.phone || "-"}
//                 </div>
//                 <div>
//                   <strong>Address:</strong>{" "}
//                   {selectedOrder._postSale?.client?.address || "-"}
//                 </div>
//               </div>
//               {/* Project info */}
//               <div className={styles.projectInfo}>
//                 <h2>Project Name</h2>
//                 <div className={styles.projectGrid}>
//                   {console.log(selectedOrder)}
//                   {/* <div>
//                     <div className={styles.label}>Order ID:</div>
//                     <div className={styles.value}>#{selectedOrder.id}</div>
//                   </div> */}
//                   <div>
//                     <div className={styles.label}>Type:</div>
//                     <div className={styles.value}>
//                       {selectedOrder.orderType}
//                     </div>
//                   </div>
//                   <div>
//                     <div className={styles.label}>Status:</div>
//                     <span
//                       className={`${styles.statusChip} ${getStatusColor(
//                         selectedOrder.status
//                       )}`}
//                     >
//                       {selectedOrder.status}
//                     </span>
//                   </div>
//                   <div>
//                     <div className={styles.label}>Priority:</div>
//                     <span
//                       className={`${styles.priorityChip} ${getPriorityColor(
//                         selectedOrder.priority
//                       )}`}
//                     >
//                       {selectedOrder.priority}
//                     </span>
//                   </div>
//                   <div>
//                     <div className={styles.label}>Created at:</div>
//                     <div className={styles.value}>
//                       {formatDate(selectedOrder.createdAtDateTime)}
//                     </div>
//                   </div>
//                   <div>
//                     <div className={styles.label}>Start Date:</div>
//                     <div className={styles.value}>
//                       {formatDate(selectedOrder.orderStartDateTime)}
//                     </div>
//                   </div>
//                   <div>
//                     <div className={styles.label}>End Date:</div>
//                     <div className={styles.value}>
//                       {formatDate(selectedOrder.orderEndDateTime)}
//                     </div>
//                   </div>
//                   {console.log(selectedOrder)
//                   }
                  
//                    <div>
//                      <div className={styles.label}>height:</div>
//                     <div className={styles.value}>{selectedOrder.height || "-"}</div>
//                    </div>   <div>
//                      <div className={styles.label}>width:</div>
//                     <div className={styles.value}>{selectedOrder.width || "-"}</div>
             
//                   </div> 
//                 </div>
//               </div>
//               {/* Client Info */}

//               {/* Progress Bar */}
//               <div className={styles.progressBox}>
//                 <div className={styles.label}>Work Progress</div>
//                 <div className={styles.progressBar}>
//                   {steps.map((step, i) => (
//                     <div
//                       key={i}
//                       className={`
//                         ${styles.progressStep}
//                         ${getStepColor(i)}
//                         ${step.status === "COMPLETED" ? styles.completed : ""}
//                       `}
//                       style={{ width: `${100 / steps.length}%` }}
//                     />
//                   ))}
//                 </div>
               
//               </div> <div className={styles.progressBarCustom}>
//   <div
//     className={styles.progressBarFill}
//     style={{
//       width: steps.length
//         ? `${(completedSteps / steps.length) * 100}%`
//         : "0%",
//     }}
//   />
//   {/* Step markers */}
//   {steps.map((step, idx) => (
//     <div
//       key={idx}
//       className={`
//         ${styles.progressMarker}
//         ${step.status === "COMPLETED" ? styles.completed : ""}
//       `}
//       style={{
//         left: steps.length === 1
//           ? "50%"
//           : `calc(${(idx / (steps.length - 1)) * 100}% - 8px)`,
//       }}
//     >
//       <span className={styles.progressStepNum}>{idx + 1}</span>
//     </div>
//   ))}
// </div>
// <div className={styles.progressText}>
//   {completedSteps} of {steps.length} Steps Completed
// </div>

//               {/* Order Steps */}
//               <div className={styles.stepsSection}>
//                 <div className={styles.sectionTitle}>Order Steps</div>
//                 {steps.map((step, i) => (
//                   <div
//                     key={i}
//                     className={`${styles.stepCard} ${getStepColor(i)}`}
//                   >
//                     <div className={styles.stepHeader}>
//                       <span className={styles.stepCircle}>
//                         {String(i + 1).padStart(2, "0")}
//                       </span>
//                       <span className={styles.stepName}>
//                         {step.orderStepName}
//                       </span>
//                       <select
//                         value={step.status}
//                         onChange={(e) => {
//                           const newStatus = e.target.value;
//                           if (newStatus !== step.status) {
//                             handleStepStatusChange(step.id, newStatus);
//                           }
//                         }}
//                         disabled={updatingStepId === step.id}
//                       >
//                         {STATUS_OPTIONS.map((s) => (
//                           <option key={s} value={s}>
//                             {s}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className={styles.stepDetail}>
//                       <span className={styles.measureLabel}>Measurement:</span>{" "}
//                       <span className={styles.measureValue}>
//                         {step.measurement || "-"}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {/* Images */}
//                 {/* Images */}
//               <div className={styles.imagesSection}>
//                 <div className={styles.sectionTitle}>All Uploaded Images</div>
//                 <div className={styles.imagesGrid}>
//                   {selectedOrder.images && selectedOrder.images.length > 0 ? (
//                     selectedOrder.images.map((img, idx) => (
//                       <div 
//                         key={idx} 
//                         className={styles.imageCard}
//                         onClick={() => openImagePreview(
//                           img.imageUrl || img.url || img, 
//                           idx, 
//                           selectedOrder.images
//                         )}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         <img
//                           src={img.imageUrl || img.url || img}
//                           alt={`Order image ${idx + 1}`}
//                         />
//                       </div>
//                     ))
//                   ) : (
//                     <div>No Images</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Image Preview Modal */}
//       {imagePreview.isOpen && (
//         <div className={styles.imagePreviewOverlay} onClick={closeImagePreview}>
//           <div className={styles.imagePreviewContent} onClick={(e) => e.stopPropagation()}>
//             {/* Close button */}
//             <button 
//               className={styles.imagePreviewClose}
//               onClick={closeImagePreview}
//               aria-label="Close image preview"
//             >
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                 <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               </svg>
//             </button>

//             {/* Navigation arrows */}
//             {imagePreview.images.length > 1 && (
//               <>
//                 <button 
//                   className={`${styles.imageNavBtn} ${styles.prevBtn}`}
//                   onClick={() => navigateImage('prev')}
//                   aria-label="Previous image"
//                 >
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                 </button>
//                 <button 
//                   className={`${styles.imageNavBtn} ${styles.nextBtn}`}
//                   onClick={() => navigateImage('next')}
//                   aria-label="Next image"
//                 >
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                 </button>
//               </>
//             )}

//             {/* Main image */}
//             <img 
//               src={imagePreview.currentImage} 
//               alt={`Preview ${imagePreview.currentIndex + 1}`}
//               className={styles.imagePreviewImg}
//             />

//             {/* Image counter */}
//             {imagePreview.images.length > 1 && (
//               <div className={styles.imageCounter}>
//                 {imagePreview.currentIndex + 1} of {imagePreview.images.length}
//               </div>
//             )}
         
           
//           </div>
//         </div>
//       )}
//     </ContentStructure>
//   );
// };

// export default OngoingOrders;
import React, { useState, useMemo } from "react";
import styles from "./ongoingOrders.module.scss";
import Table from "../../Components/Table";
import { useData } from "../../context/DataContext";
import HeaderLinks from "../../Components/HeaderLinks";
import ContentStructure from "../../Layout/ContentStructure";
import { updateOrderStepStatus } from "../../store/ordersSlice.js";
import { useDispatch } from "react-redux";

// Pastel colors for steps/progress
const STEP_COLORS = [
  styles.stepBlue,
  styles.stepRed,
  styles.stepYellow,
  styles.stepPurple,
  styles.stepGreen,
  styles.stepOrange,
  styles.stepPink,
];

const links = [
  { to: "/orders/new", label: "Add New Order" },
  { to: "/orders/ongoing", label: "On-going Orders" },
  // { to: "/orders/history", label: "History & Details" },
];

// Status and Priority chips
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

const OngoingOrders = () => {
  const { orders } = useData();
  const dispatch = useDispatch();
  const [updatingStepId, setUpdatingStepId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  console.log("Raw orders from context:", orders);

  // Since your data is already a flat array of orders, just use it directly
  // No need for the complex flatMap logic
  const safeOrders = useMemo(() => {
    if (!Array.isArray(orders)) {
      console.log("Orders is not an array:", orders);
      return [];
    }
    console.log("Processing orders array with length:", orders.length);
    return orders;
  }, [orders]);

  console.log("Safe orders result:", safeOrders);

  // Table columns definition
  const columns = [
    { key: "srNumber", label: "Sr No." },
    { key: "clientName", label: "Client Name" },
    { key: "createdAtDateTime", label: "Created" },
    { key: "qty", label: "Qty" },
    { key: "unitPrice", label: "Unit Price" },
    { key: "totalAmount", label: "Total" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
    { key: "actions", label: "Actions" },
  ];

  // Prepare table rows with React elements - directly from flat orders array
  const data = safeOrders.map((order, i) => ({
    srNumber: i + 1,
    id: <span className={styles.bold}>#{order.id}</span>,
    clientName: order.client?.name || "-",
    createdAtDateTime: formatDate(order.createdAtDateTime),
    qty: order.qty ?? "-",
    unitPrice: order.unitPrice !== undefined ? `₹${order.unitPrice}` : "-",
    totalAmount:
      order.totalAmount !== undefined ? `₹${order.totalAmount}` : "-",
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

  console.log("Table data:", data);

  // Modal Step Color List (to sync color order everywhere)
  function getStepColor(index) {
    return STEP_COLORS[index % STEP_COLORS.length];
  }

  // Handle step status change (you can wire this to API if needed)
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

  // Steps/progress for modal
  const steps = selectedOrder?.steps || [];
  const completedSteps = steps.filter((s) => s.status === "COMPLETED").length;

  const [imagePreview, setImagePreview] = useState({
    isOpen: false,
    currentImage: null,
    currentIndex: 0,
    images: []
  });

  // Image preview functions
  const openImagePreview = (imageUrl, index, images) => {
    setImagePreview({
      isOpen: true,
      currentImage: imageUrl,
      currentIndex: index,
      images: images
    });
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeImagePreview = () => {
    setImagePreview({
      isOpen: false,
      currentImage: null,
      currentIndex: 0,
      images: []
    });
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction) => {
    const { images, currentIndex } = imagePreview;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex <= 0 ? images.length - 1 : currentIndex - 1;
    }
    
    const newImage = images[newIndex]?.imageUrl || images[newIndex]?.url || images[newIndex];
    setImagePreview(prev => ({
      ...prev,
      currentIndex: newIndex,
      currentImage: newImage
    }));
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (imagePreview.isOpen) {
        if (e.key === 'Escape') {
          closeImagePreview();
        } else if (e.key === 'ArrowLeft') {
          navigateImage('prev');
        } else if (e.key === 'ArrowRight') {
          navigateImage('next');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imagePreview.isOpen, imagePreview.images, imagePreview.currentIndex]);

  return (
    <ContentStructure links={links}>
      {/* Debug info - remove this after testing */}
      {/* <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px' }}>
        <strong>Debug:</strong> Found {safeOrders.length} orders, Data rows: {data.length}
      </div> */}
      
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
              <div className={styles.title}>{selectedOrder.orderType || "Project Name"}</div>
              <button
                className={styles.saveBtn}
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>

            <div className={styles.mainSection}>
              <div className={styles.clientInfoCard}>
                <div>
                  <strong>Client Name:</strong>{" "}
                  {selectedOrder.client?.name || "-"}
                </div>
                <div>
                  <strong>E-mail:</strong>{" "}
                  {selectedOrder.client?.email || "-"}
                </div>
                <div>
                  <strong>Mobile Number:</strong>{" "}
                  {selectedOrder.client?.phone || "-"}
                </div>
                <div>
                  <strong>Address:</strong>{" "}
                  {selectedOrder.client?.address || "-"}
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
                      className={`${styles.statusChip} ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <div className={styles.label}>Priority:</div>
                    <span
                      className={`${styles.priorityChip} ${getPriorityColor(
                        selectedOrder.priority
                      )}`}
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
                  <div>
                    <div className={styles.label}>Height:</div>
                    <div className={styles.value}>{selectedOrder.height || "-"}</div>
                  </div>
                  <div>
                    <div className={styles.label}>Width:</div>
                    <div className={styles.value}>{selectedOrder.width || "-"}</div>
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
                      <div 
                        key={idx} 
                        className={styles.imageCard}
                        onClick={() => openImagePreview(
                          img.imageUrl || img.url || img, 
                          idx, 
                          selectedOrder.images
                        )}
                        style={{ cursor: 'pointer' }}
                      >
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

      {/* Image Preview Modal */}
      {imagePreview.isOpen && (
        <div className={styles.imagePreviewOverlay} onClick={closeImagePreview}>
          <div className={styles.imagePreviewContent} onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button 
              className={styles.imagePreviewClose}
              onClick={closeImagePreview}
              aria-label="Close image preview"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Navigation arrows */}
            {imagePreview.images.length > 1 && (
              <>
                <button 
                  className={`${styles.imageNavBtn} ${styles.prevBtn}`}
                  onClick={() => navigateImage('prev')}
                  aria-label="Previous image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  className={`${styles.imageNavBtn} ${styles.nextBtn}`}
                  onClick={() => navigateImage('next')}
                  aria-label="Next image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}

            {/* Main image */}
            <img 
              src={imagePreview.currentImage} 
              alt={`Preview ${imagePreview.currentIndex + 1}`}
              className={styles.imagePreviewImg}
            />

            {/* Image counter */}
            {imagePreview.images.length > 1 && (
              <div className={styles.imageCounter}>
                {imagePreview.currentIndex + 1} of {imagePreview.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </ContentStructure>
  );
};

export default OngoingOrders;