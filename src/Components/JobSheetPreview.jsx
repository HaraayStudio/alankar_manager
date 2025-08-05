// import React, { useState } from "react";
// import styles from "./JobSheetPreview.module.scss";
// import logo from "../assets/logo_white.png";

// const formatDate = (str) =>
//   str
//     ? new Date(str).toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       })
//     : "--";

// // Schematic component (fully responsive, draws lines/arrows, shows width/height with values)
// function SizeSchematic({ lHeight, rHeight, tWidth, bWidth, jobNum }) {
//   const leftHeightText = lHeight ? String(lHeight) : "L";
//   const rightHeightText = rHeight ? String(rHeight) : "R";
//   const topWidthText = tWidth ? String(tWidth) : "T";
//   const bottomWidthText = bWidth ? String(bWidth) : "B";

//   return (
//     <div
//       style={{
//         width: "220px",
//         height: "350px",
//         maxWidth: "97vw",
//         margin: "0 auto",
//       }}
//     >
//       <svg
//         viewBox="0 0 220 350"
//         width="100%"
//         height="100%"
//         style={{ display: "block", background: "#e7e9ed", borderRadius: 16 }}
//       >
//         {/* Sheet rectangle */}
//         <rect
//           x="24"
//           y="28"
//           width="172"
//           height="294"
//           rx="8"
//           fill="#f7f7fa"
//           stroke="#ccc"
//           strokeWidth="2"
//         />

//         {/* Horizontal arrows (widths) */}
//         <line
//           x1="36"
//           y1="85"
//           x2="184"
//           y2="85"
//           stroke="#444"
//           strokeWidth="2"
//           markerStart="url(#arrow)"
//           markerEnd="url(#arrow)"
//         />
//         <line
//           x1="36"
//           y1="265"
//           x2="184"
//           y2="265"
//           stroke="#444"
//           strokeWidth="2"
//           markerStart="url(#arrow)"
//           markerEnd="url(#arrow)"
//         />

//         {/* Vertical arrows (heights) */}
//         <line
//           x1="56"
//           y1="55"
//           x2="56"
//           y2="295"
//           stroke="#444"
//           strokeWidth="2"
//           markerStart="url(#arrow)"
//           markerEnd="url(#arrow)"
//         />
//         <line
//           x1="164"
//           y1="55"
//           x2="164"
//           y2="295"
//           stroke="#444"
//           strokeWidth="2"
//           markerStart="url(#arrow)"
//           markerEnd="url(#arrow)"
//         />

//         {/* Width labels */}
//         <rect
//           x="80"
//           y="68"
//           width="60"
//           height="23"
//           rx="5"
//           fill="#fff"
//           stroke="#aaa"
//         />
//         <text
//           x="110"
//           y="85"
//           textAnchor="middle"
//           fontSize="15"
//           fontWeight="bold"
//           fill="#222"
//         >
//           {topWidthText}
//         </text>
//         <rect
//           x="80"
//           y="247"
//           width="60"
//           height="23"
//           rx="5"
//           fill="#fff"
//           stroke="#aaa"
//         />
//         <text
//           x="110"
//           y="264"
//           textAnchor="middle"
//           fontSize="15"
//           fontWeight="bold"
//           fill="#222"
//         >
//           {bottomWidthText}
//         </text>

//         {/* Height labels */}
//         <rect
//           x="27"
//           y="167"
//           width="43"
//           height="23"
//           rx="5"
//           fill="#fff"
//           stroke="#aaa"
//         />
//         <text
//           x="48.5"
//           y="183"
//           textAnchor="middle"
//           fontSize="15"
//           fontWeight="bold"
//           fill="#222"
//         >
//           {leftHeightText}
//         </text>
//         <rect
//           x="150"
//           y="167"
//           width="43"
//           height="23"
//           rx="5"
//           fill="#fff"
//           stroke="#aaa"
//         />
//         <text
//           x="171.5"
//           y="183"
//           textAnchor="middle"
//           fontSize="15"
//           fontWeight="bold"
//           fill="#222"
//         >
//           {rightHeightText}
//         </text>

//         {/* Job number in center */}
//         <text
//           x="110"
//           y="200"
//           textAnchor="middle"
//           fontSize="48"
//           fontWeight="bold"
//           fill="#c5c9d6"
//           opacity="0.65"
//         >
//           {jobNum ? String(jobNum).padStart(2, "0") : "01"}
//         </text>

//         {/* Arrow marker definition */}
//         <defs>
//           <marker
//             id="arrow"
//             markerWidth="8"
//             markerHeight="8"
//             refX="7"
//             refY="4"
//             orient="auto"
//             markerUnits="strokeWidth"
//           >
//             <path d="M0,1.5 L7,4 L0,6.5" fill="#444" />
//           </marker>
//         </defs>
//       </svg>
//     </div>
//   );
// }

// export default function JobSheetPreview({ open, jobSheet, onClose }) {
//   const [previewImg, setPreviewImg] = useState(null);
// console.log(jobSheet);

//   if (!open || !jobSheet) return null;

//   const {
//     client,
//     contactPerson,
//     srNumber,
//     date,
//     jobs,
//     instructions,
//   } = jobSheet;

//   // Ensure jobs is always an array
//   const safeJobs = Array.isArray(jobs) ? jobs : [];

//   return (
//     <div
//       className={styles.backdrop}
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className={styles.previewBox}>
//         <button className={styles.closeBtn} onClick={onClose}>
//           ×
//         </button>
//         {/* HEADER */}
//         <div className={styles.header}>
//           <div className={styles.sheetTitle}>JOB SHEET</div>
//           <img src={logo} alt="Alankar Logo" className={styles.logo} />
//         </div>
//         {/* TOP INFO */}
//         <div className={styles.infoGrid}>
//           <div>
//             <div>
//               <b>CLIENT NAME :</b> <span>{client?.name || "--"}</span>
//             </div>
//             <div>
//               <b>CONTACT PERSON :</b> <span>{contactPerson || "--"}</span>
//             </div>
//           </div>
//           <div>
//             <div>
//               <b>DATE :</b> <span>{formatDate(date)}</span>
//             </div>
//           </div>
//         </div>
//         {/* JOBS */}
//         <div className={styles.jobsArea}>
//           {safeJobs.length === 0 && (
//             <div style={{ color: "#777", padding: "2rem" }}>No jobs found.</div>
//           )}
//           {safeJobs.map((job, idx) => (
//             <div className={styles.jobRow} key={idx}>
//               {/* LEFT - schematic/size/material */}
//               <div className={styles.leftCol}>
//                 <SizeSchematic
//                   lHeight={job.lHeight}
//                   rHeight={job.rHeight}
//                   tWidth={job.tWidth}
//                   bWidth={job.bWidth}
//                   jobNum={idx + 1}
//                 />
//                 <div className={styles.matRow}>
//                   <span>
//                     <b>Material:</b> {job.material || "--"}
//                   </span>
//                 </div>
//               </div>
//               {/* RIGHT - image, desc, remark */}
//               <div className={styles.rightCol}>
//                 <div className={styles.imgBox}>
//                   {job.images && Array.isArray(job.images) && job.images.length > 0 ? (
//                     job.images.map((img, i) => (
//                       <img
//                         key={i}
//                         src={img?.base64 || img} // Handle both {base64: "..."} and direct base64 string formats
//                         alt={`Job Image ${i + 1}`}
//                         className={styles.jobImage}
//                         onClick={() => setPreviewImg(img?.base64 || img)}
//                         style={{ cursor: "pointer" }}
//                       />
//                     ))
//                   ) : (
//                     <div className={styles.noImg}>No Image</div>
//                   )}
//                 </div>
//                 <div className={styles.descRow}>
//                   <b>Description:</b> {job.description || "--"}
//                 </div>
//                 {job.remark && (
//                   <div className={styles.remarkRow}>
//                     <b>Remark:</b> {job.remark}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* SHEET REMARKS */}
//         {instructions && (
//           <div className={styles.remarksSection}>
//             <b>Remarks:</b>
//             <div>{instructions}</div>
//           </div>
//         )}

//         {/* IMAGE PREVIEW MODAL */}
//         {previewImg && (
//           <div
//             className={styles.imagePreviewBackdrop}
//             onClick={() => setPreviewImg(null)}
//           >
//             <img
//               src={previewImg}
//               alt="Job Full Size"
//               className={styles.imagePreviewBig}
//               onClick={(e) => e.stopPropagation()}
//             />
//             <button
//               className={styles.closeBtn}
//               style={{ top: 12, right: 20 }}
//               onClick={() => setPreviewImg(null)}
//             >
//               ×
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import styles from "./JobSheetPreview.module.scss";
import logo from "../assets/logo_white.png";

const formatDate = (str) =>
  str
    ? new Date(str).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "--";

// Schematic component (fully responsive, draws lines/arrows, shows width/height with values)
function SizeSchematic({ lHeight, rHeight, tWidth, bWidth, jobNum }) {
  const leftHeightText = lHeight ? String(lHeight) : "L";
  const rightHeightText = rHeight ? String(rHeight) : "R";
  const topWidthText = tWidth ? String(tWidth) : "T";
  const bottomWidthText = bWidth ? String(bWidth) : "B";

  return (
    <div className={styles.schematicWrapper}>
      <svg
        viewBox="0 0 220 350"
        className={styles.schematicSvg}
      >
        {/* Sheet rectangle */}
        <rect
          x="24"
          y="28"
          width="172"
          height="294"
          rx="8"
          fill="#f7f7fa"
          stroke="#ccc"
          strokeWidth="2"
        />

        {/* Horizontal arrows (widths) */}
        <line
          x1="36"
          y1="85"
          x2="184"
          y2="85"
          stroke="#444"
          strokeWidth="2"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        />
        <line
          x1="36"
          y1="265"
          x2="184"
          y2="265"
          stroke="#444"
          strokeWidth="2"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        />

        {/* Vertical arrows (heights) */}
        <line
          x1="56"
          y1="55"
          x2="56"
          y2="295"
          stroke="#444"
          strokeWidth="2"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        />
        <line
          x1="164"
          y1="55"
          x2="164"
          y2="295"
          stroke="#444"
          strokeWidth="2"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        />

        {/* Width labels */}
        <rect
          x="80"
          y="68"
          width="60"
          height="23"
          rx="5"
          fill="#fff"
          stroke="#aaa"
        />
        <text
          x="110"
          y="85"
          textAnchor="middle"
          fontSize="15"
          fontWeight="bold"
          fill="#222"
        >
          {topWidthText}
        </text>
        <rect
          x="80"
          y="247"
          width="60"
          height="23"
          rx="5"
          fill="#fff"
          stroke="#aaa"
        />
        <text
          x="110"
          y="264"
          textAnchor="middle"
          fontSize="15"
          fontWeight="bold"
          fill="#222"
        >
          {bottomWidthText}
        </text>

        {/* Height labels */}
        <rect
          x="27"
          y="167"
          width="43"
          height="23"
          rx="5"
          fill="#fff"
          stroke="#aaa"
        />
        <text
          x="48.5"
          y="183"
          textAnchor="middle"
          fontSize="15"
          fontWeight="bold"
          fill="#222"
        >
          {leftHeightText}
        </text>
        <rect
          x="150"
          y="167"
          width="43"
          height="23"
          rx="5"
          fill="#fff"
          stroke="#aaa"
        />
        <text
          x="171.5"
          y="183"
          textAnchor="middle"
          fontSize="15"
          fontWeight="bold"
          fill="#222"
        >
          {rightHeightText}
        </text>

        {/* Job number in center */}
        <text
          x="110"
          y="200"
          textAnchor="middle"
          fontSize="48"
          fontWeight="bold"
          fill="#c5c9d6"
          opacity="0.65"
        >
          {jobNum ? String(jobNum).padStart(2, "0") : "01"}
        </text>

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,1.5 L7,4 L0,6.5" fill="#444" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

export default function JobSheetPreview({ open, jobSheet, onClose }) {
  const [previewImg, setPreviewImg] = useState(null);

  if (!open || !jobSheet) return null;

  const {
    client,
    contactPerson,
    srNumber,
    date,
    jobs,
    instructions,
  } = jobSheet;

  // Ensure jobs is always an array
  const safeJobs = Array.isArray(jobs) ? jobs : [];

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.previewBox}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.sheetTitle}>JOB SHEET</div>
          <img src={logo} alt="Alankar Logo" className={styles.logo} />
        </div>
        
        {/* TOP INFO */}
        <div className={styles.infoGrid}>
          <div className={styles.infoColumn}>
            <div className={styles.infoRow}>
              <span className={styles.label}>CLIENT NAME :-</span>
              <span className={styles.value}>{client?.name || "--"}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>CONTACT PERSON :-</span>
              <span className={styles.value}>{contactPerson || "--"}</span>
            </div>
          </div>
          <div className={styles.infoColumn}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Sr. No :-</span>
              <span className={styles.value}>{srNumber || "--"}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Date :-</span>
              <span className={styles.value}>{formatDate(date)}</span>
            </div>
          </div>
        </div>
        
        {/* JOBS */}
        <div className={styles.jobsArea}>
          {safeJobs.length === 0 && (
            <div className={styles.noJobs}>No jobs found.</div>
          )}
          {safeJobs.map((job, idx) => (
            <div className={styles.jobRow} key={idx}>
              {/* LEFT - schematic and material */}
              <div className={styles.leftSection}>
                <div className={styles.materialLabel}>Material:- {job.material || "--"}</div>
                <SizeSchematic
                  lHeight={job.lHeight}
                  rHeight={job.rHeight}
                  tWidth={job.tWidth}
                  bWidth={job.bWidth}
                  jobNum={idx + 1}
                />
              </div>
              
              {/* RIGHT - description and images */}
              <div className={styles.rightSection}>
                <div className={styles.descriptionLabel}>Description:- {job.description || "--"}</div>
                <div className={styles.imagesSection}>
                  <div className={styles.imagesLabel}>Images</div>
                  <div className={styles.imagesContainer}>
                    {job.images && Array.isArray(job.images) && job.images.length > 0 ? (
                      job.images.map((img, i) => (
                        <img
                          key={i}
                          src={img?.imageUrl || img?.base64 || img}
                          alt={`Job Image ${i + 1}`}
                          className={styles.jobImage}
                          onClick={() => setPreviewImg(img?.imageUrl || img?.base64 || img)}
                        />
                      ))
                    ) : (
                      <div className={styles.noImagePlaceholder}>
                        <div className={styles.noImageIcon}>📷</div>
                        <div className={styles.noImageText}>No Image</div>
                      </div>
                    )}
                  </div>
                </div>
                {job.remark && (
                  <div className={styles.remarkRow}>
                    <span className={styles.remarkLabel}>Remark:</span>
                    <span className={styles.remarkValue}>{job.remark}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* REMARKS SECTION */}
        {instructions && (
          <div className={styles.remarksSection}>
            <div className={styles.remarksLabel}>Remarks:-</div>
            <div className={styles.remarksContent}>{instructions}</div>
          </div>
        )}

        {/* IMAGE PREVIEW MODAL */}
        {previewImg && (
          <div
            className={styles.imagePreviewBackdrop}
            onClick={() => setPreviewImg(null)}
          >
            <img
              src={previewImg}
              alt="Job Full Size"
              className={styles.imagePreviewBig}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className={styles.imagePreviewClose}
              onClick={() => setPreviewImg(null)}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}