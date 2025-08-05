import React from "react";
import styles from "./AttendanceList.module.scss";
import Table from "../../Components/Table";

// Use a real image or your own placeholder path
import ajayPhoto from "../../assets/ajay.png"; // Save your photo as ajay.png

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
  { key: "profilePic", label: "" },
  { key: "jobSheet", label: "Job Sheet" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

// Dummy data as per screenshot
const dummyAttendance = [
  {
    srNumber: "01",
    employeeName: "Ajay kumar thakur",
    checkIn: "10:28 AM",
    checkOut: "6:30 PM",
    profilePic: ajayPhoto,
    jobSheet: "#",
    status: "Goining on",
  },
  {
    srNumber: "02",
    employeeName: "Ajay kumar thakur",
    checkIn: "10:28 AM",
    checkOut: "6:30 PM",
    profilePic: ajayPhoto,
    jobSheet: "#",
    status: "Pending",
  },
  {
    srNumber: "03",
    employeeName: "Ajay kumar thakur",
    checkIn: "10:28 AM",
    checkOut: "6:30 PM",
    profilePic: ajayPhoto,
    jobSheet: "#",
    status: "Completed",
  },
  {
    srNumber: "04",
    employeeName: "Ajay kumar thakur",
    checkIn: "10:28 AM",
    checkOut: "6:30 PM",
    profilePic: ajayPhoto,
    jobSheet: "#",
    status: "Goining on",
  },
  {
    srNumber: "05",
    employeeName: "Ajay kumar thakur",
    checkIn: "10:28 AM",
    checkOut: "6:30 PM",
    profilePic: ajayPhoto,
    jobSheet: "#",
    status: "Completed",
  },
];

export default function AttendanceList() {
  const data = dummyAttendance.map((item, idx) => ({
    srNumber: item.srNumber,
    employeeName: item.employeeName,
    checkIn: item.checkIn,
    checkOut: item.checkOut,
    profilePic: (
      <img
        src={item.profilePic}
        alt="Profile"
        className={styles.avatar}
      />
    ),
    jobSheet: (
      <a
        href={item.jobSheet}
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
      <span className={`${styles.statusChip} ${STATUS_COLORS[item.status]}`}>
        {item.status}
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
    <div className={styles.attendancePage}>
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
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
}
