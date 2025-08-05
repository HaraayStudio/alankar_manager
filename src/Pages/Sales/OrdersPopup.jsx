// import React from "react";
// import styles from "./OrdersPopup.module.scss";
// import { X, Plus } from "lucide-react";
// import Table from "../../Components/Table.jsx";           // <-- import your Table component
// import AddOrderPopup from "./AddOrderPopup.jsx";

// const formatDateTime = (dt) => dt ? dt.slice(0, 16).replace("T", " ") : "-";

// export default function OrdersPopup({ orders = [], srNumber, onClose, onAddOrder }) {
//   const [showAdd, setShowAdd] = React.useState(false);
// console.log(orders);

//   // Define columns for the Table component
//   const columns = [
//     { key: "orderType", label: "Order Type" },
//     { key: "printType", label: "Print Type" },
//     { key: "media", label: "Media" },
//     { key: "qty", label: "Qty" },
//     { key: "unitPrice", label: "Unit Price" },
//     { key: "totalAmount", label: "Total" },
//     { key: "gst", label: "GST (%)" },
//     { key: "totalAmountWithGST", label: "Total (GST)" },
//     { key: "budget", label: "Budget" },
//     { key: "orderStartDateTime", label: "Start" },
//     { key: "orderEndDateTime", label: "End" },
//     { key: "steps", label: "Steps" },
//   ];

//   // Map orders to data rows for the Table component
//   const data = orders.map(order => ({
//     orderType: order.orderType,
//     printType: order.printType,
//     media: order.media,
//     qty: order.qty,
//     unitPrice: order.unitPrice ? `₹${order.unitPrice.toLocaleString()}` : "-",
//     totalAmount: order.totalAmount ? `₹${order.totalAmount.toLocaleString()}` : "-",
//     gst: order.gst ? `${order.gst}%` : "-",
//     totalAmountWithGST: order.totalAmountWithGST ? `₹${order.totalAmountWithGST.toLocaleString()}` : "-",
//     budget: order.budget ? `₹${order.budget.toLocaleString()}` : "-",
//     orderStartDateTime: formatDateTime(order.orderStartDateTime),
//     orderEndDateTime: formatDateTime(order.orderEndDateTime),
//     steps: (
//       <div>
//         {order.preSalesOrderSteps?.map(step =>
//           <div key={step.id || step.stepNumber} className={styles.stepItem}>
//             <b>{step.stepName}</b>: {step.stepValue}
//           </div>
//         )}
//       </div>
//     ),
//   }));

//   return (
//     <div className={styles.overlay}>
//       <div className={styles.popup}>
//         <button className={styles.closeBtn} onClick={onClose} title="Close">&times;</button>
//         <h2 className={styles.heading}>Orders – PreSale #{srNumber}</h2>
//         <div className={styles.tableWrap}>
//           <Table columns={columns} data={data} />
//         </div>
//         <button
//           className={styles.addOrderBtn}
//           onClick={() => setShowAdd(true)}
//           type="button"
//         >
//           <Plus size={18} /> Add New Order
//         </button>
//       </div>
//       {showAdd && (
//         <AddOrderPopup
//           onClose={() => setShowAdd(false)}
//           onSave={order => {
//             onAddOrder(order);
//             setShowAdd(false);
//           }}
//         />
//       )}
//     </div>
//   );
// }
import React from "react";
import styles from "./OrdersPopup.module.scss";
import { X, Plus } from "lucide-react";
import Table from "../../Components/Table.jsx";
import AddOrderPopup from "./AddOrderPopup.jsx";
import { useData } from "../../context/DataContext.jsx";

const formatDateTime = (dt) => dt ? dt.slice(0, 16).replace("T", " ") : "-";

export default function OrdersPopup({ orders = [], srNumber, onClose, clientType }) {
  const [showAdd, setShowAdd] = React.useState(false);
  const { handleAddOrderInPresales, fetchAllData } = useData();

  const columns = [
    { key: "orderType", label: "Order Type" },
    { key: "printType", label: "Print Type" },
    { key: "media", label: "Media" },
    { key: "qty", label: "Qty" },
    { key: "unitPrice", label: "Unit Price" },
    { key: "totalAmount", label: "Total" },
    { key: "gst", label: "GST (%)" },
    { key: "totalAmountWithGST", label: "Total (GST)" },
    { key: "budget", label: "Budget" },
    { key: "orderStartDateTime", label: "Start" },
    { key: "orderEndDateTime", label: "End" },
    { key: "steps", label: "Steps" },
  ];

  const data = orders.map(order => ({
    orderType: order.orderType,
    printType: order.printType,
    media: order.media,
    qty: order.qty,
    unitPrice: order.unitPrice ? `₹${order.unitPrice.toLocaleString()}` : "-",
    totalAmount: order.totalAmount ? `₹${order.totalAmount.toLocaleString()}` : "-",
    gst: order.gst ? `${order.gst}%` : "-",
    totalAmountWithGST: order.totalAmountWithGST ? `₹${order.totalAmountWithGST.toLocaleString()}` : "-",
    budget: order.budget ? `₹${order.budget.toLocaleString()}` : "-",
    orderStartDateTime: formatDateTime(order.orderStartDateTime),
    orderEndDateTime: formatDateTime(order.orderEndDateTime),
    steps: (
      <div className={styles.stepsCell}>
        {order.preSalesOrderSteps?.map(step =>
          <div key={step.id || step.stepNumber} className={styles.stepItem}>
            <span className={styles.stepLabel}>{step.stepName}:</span>
            <span className={styles.stepValue}>{step.stepValue}</span>
          </div>
        )}
      </div>
    ),
  }));

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeBtn} onClick={onClose} title="Close">&times;</button>
        <h2 className={styles.heading}>Orders – PreSale #{srNumber}</h2>
        <div className={styles.tableWrap}>
          <Table columns={columns} data={data} />
        </div>
        <button
          className={styles.addOrderBtn}
          onClick={() => setShowAdd(true)}
          type="button"
        >
          <Plus size={18} /> Add New Order
        </button>
      </div>
      {showAdd && (
        <AddOrderPopup
          clientType={clientType}
          onClose={() => setShowAdd(false)}
          onSave={async (order) => {
            // Here, use srNumber and clientType from props
            await handleAddOrderInPresales(srNumber, order);
            await fetchAllData();
            setShowAdd(false);
          }}
        />
      )}
    </div>
  );
}
