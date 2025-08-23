// // // Table.jsx
// // import React from "react";
// // import styles from "./Table.module.scss";

// // const Table = ({ columns, data }) => {
// //   return (
// //     <div className={styles.tableWrapper}>
// //       <table className={styles.table}>
// //         <thead>
// //           <tr>
// //             {columns.map((col) => (
// //               <th key={col.key}>{col.label}</th>
// //             ))}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {data?.length === 0 ? (
// //             <tr>
// //               <td colSpan={columns.length} style={{ textAlign: "center" }}>
// //                 No data found
// //               </td>
// //             </tr>
// //           ) : (
// //             data.map((row, idx) => (
// //               <tr key={idx}>
// //                 {columns.map((col) => (
// //                   <td key={col.key}>
// //                     {/* Render cell value as-is, allowing React elements (buttons) */}
// //                     {row[col.key]}
// //                   </td>
// //                 ))}
// //               </tr>
// //             ))
// //           )}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default Table;

// // Table.jsx
// import React from "react";
// import styles from "./Table.module.scss";

// const Table = ({ columns, data, maxVisibleRows = 10 }) => {
//   return (
//     <div className={styles.tableWrapper}>
//       <div className={styles.tableContainer}>
//         <table className={styles.table}>
//           <thead className={styles.tableHead}>
//             <tr>
//               {columns.map((col) => (
//                 <th key={col.key} className={styles.tableCell}>
//                   {col.label}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//         </table>
//       </div>
      
//       <div className={styles.tableBodyWrapper}>
//         <table className={styles.table}>
//           <tbody>
//             {data?.length === 0 ? (
//               <tr>
//                 <td colSpan={columns.length} className={styles.noDataCell}>
//                   No data found
//                 </td>
//               </tr>
//             ) : (
//               data.map((row, idx) => (
//                 <tr key={idx}>
//                   {columns.map((col) => (
//                     <td key={col.key} className={styles.tableCell}>
//                       {/* Render cell value as-is, allowing React elements (buttons) */}
//                       {row[col.key]}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Table;

// Table.jsx
import React, { useRef, useEffect, useState } from "react";
import styles from "./Table.module.scss";

const Table = ({ columns, data, maxVisibleRows = 10 }) => {
  const [columnWidths, setColumnWidths] = useState([]);
  const hiddenTableRef = useRef(null);

  useEffect(() => {
    if (hiddenTableRef.current && data?.length > 0) {
      // Get the actual rendered widths from the hidden table
      const cells = hiddenTableRef.current.querySelectorAll('tbody tr:first-child td');
      const widths = Array.from(cells).map(cell => cell.offsetWidth);
      setColumnWidths(widths);
    }
  }, [data, columns]);

  return (
    <div className={styles.tableWrapper}>
      {/* Hidden table to calculate natural column widths */}
      <table ref={hiddenTableRef} className={styles.hiddenTable}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.tableCell}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 && (
            <tr>
              {columns.map((col) => (
                <td key={col.key} className={styles.tableCell}>
                  {data[0][col.key]}
                </td>
              ))}
            </tr>
          )}
          {/* Sample a few more rows to get better width calculation */}
          {data?.slice(1, 3).map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col.key} className={styles.tableCell}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Visible header table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              {columns.map((col, index) => (
                <th 
                  key={col.key} 
                  className={styles.tableCell}
                  style={{ width: columnWidths[index] || 'auto' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
      
      {/* Scrollable body table */}
      <div className={styles.tableBodyWrapper}>
        <table className={styles.table}>
          <tbody>
            {data?.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.noDataCell}>
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col, index) => (
                    <td 
                      key={col.key} 
                      className={styles.tableCell}
                      style={{ width: columnWidths[index] || 'auto' }}
                    >
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;