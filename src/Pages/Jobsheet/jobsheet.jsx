import React, { useEffect, useState } from "react";
import styles from "./JobsheetList.module.scss";
import Table from "../../Components/Table";
import api from "../../api/api"; // Use your axios instance

// You can use a real profile image here, or use a static placeholder.
// import placeholderProfile from "../../assets/profile_placeholder.png"; // Provide a fallback image

const STATUS_COLORS = {
  "Goining on": styles.statusOngoing,
  "Pending": styles.statusPending,
  "Completed": styles.statusCompleted,
};

const columns = [
  { key: "srNumber", label: "S.No" },
  { key: "employeeName", label: "Employee Name" },
  { key: "checkIn", label: "Check In" },
  { key: "checkOut", label: "Check Out" },
//   { key: "profilePic", label: "" },
  { key: "jobSheet", label: "Job Sheet" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

export default function JobsheetList() {
  const [jobsheets, setJobsheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobsheets();
    // eslint-disable-next-line
  }, []);

  async function fetchJobsheets() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
    const res = await api.get("/jobsheet/getalljobsheets", {
  headers: { Authorization: `Bearer ${token}` },
});
      // Adjust according to your backend response structure
      setJobsheets(res.data?.data || []);
      console.log(res.data?.data);
      
    } catch (e) {
      setJobsheets([]);
    }
    setLoading(false);
  }

  // Demo static times/status – replace with real checkin/checkout if you have
  const getStatus = (idx) =>
    idx % 3 === 0
      ? "Goining on"
      : idx % 3 === 1
      ? "Pending"
      : "Completed";
  const getCheckIn = () => "10:28 AM";
  const getCheckOut = () => "6:30 PM";

  // Table data mapping
  const data = jobsheets.map((sheet, idx) => ({
    srNumber: String(sheet.srNumber).padStart(2, "0"),
    employeeName: `${sheet.employee?.firstName || ""} ${sheet.employee?.lastName || ""}`.trim(),
    checkIn: getCheckIn(),
    checkOut: getCheckOut(),
    profilePic: (
      <img
        // src={placeholderProfile}
        alt="Profile"
        className={styles.avatar}
      />
    ),
    jobSheet: (
      <a
        href="#" // replace with actual link if available
        className={styles.jobSheetLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        Job Sheet Link{" "}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M7 17L17 7M17 7H9M17 7V15" stroke="#6F8B98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    ),
    status: (
      <span className={`${styles.statusChip} ${STATUS_COLORS[getStatus(idx)]}`}>
        {getStatus(idx)}
      </span>
    ),
    action: (
      <div className={styles.actionBtns}>
        <button className={styles.iconBtn} title="View">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#8B98A9" strokeWidth="1.7"/>
            <circle cx="12" cy="12" r="3.5" stroke="#8B98A9" strokeWidth="1.7"/>
          </svg>
        </button>
        <button className={styles.iconBtn} title="Edit">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M14.166 2.5a1.768 1.768 0 0 1 2.5 2.5l-10 10a2 2 0 0 1-.792.496l-3.125 1.042 1.041-3.125a2 2 0 0 1 .496-.792l10-10Z" stroke="#8B98A9" strokeWidth="1.7"/>
          </svg>
        </button>
      </div>
    ),
  }));

  return (
    <div className={styles.jobsheetPage}>
      {/* Cards Row */}
      <div className={styles.statsRow}>
        {[1, 2, 3].map((_, idx) => (
          <div className={styles.card} key={idx}>
            <div className={styles.cardTitle}>Attendance</div>
            <div className={styles.cardValueRow}>
              <span className={styles.cardValue}>290</span>
              <span className={styles.percentUp}>
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M8 12V4M8 4L4 8M8 4l4 4" stroke="#4CC187" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                10%
              </span>
            </div>
            <div className={styles.cardDesc}>This Week</div>
          </div>
        ))}
      </div>

      {/* Table Row */}
      <div className={styles.tableContainer}>
        <div className={styles.headerRow}>
          <span className={styles.pageTitle}>Attendance List</span>
          <div className={styles.headerActions}>
            <button className={styles.filterBtn}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M3.667 5.5h14.666M6.417 10.083h9.166M9.167 14.667h3.666" stroke="#6F8B98" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button className={styles.addBtn}>+ Add New Jobsheet</button>
          </div>
        </div>
        <Table columns={columns} data={loading ? [] : data} />
      </div>
    </div>
  );
}
