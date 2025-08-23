import React, { useEffect, useState } from 'react';
import styles from './JobsheetList.module.scss';
import { useData } from '../../context/DataContext';
import ContentStructure from "../../Layout/ContentStructure";
import Table from "../../Components/Table";
import JobSheetPopup from "../Employee/JobsheetPopup.jsx";
import JobSheetEditPopup from "../Employee/JobSheetEditPopup.jsx";
import JobSheetPreview from '../../Components/JobSheetPreview.jsx';
import api from "../../api/axiosConfig";

const links = [
  { to: "/jobsheets/new", label: "Add New JobSheet" },
  { to: "/jobsheets/list", label: "All JobSheets" }
];

const STATUS_COLORS = {
  "Ongoing": styles.statusOngoing,
  "Pending": styles.statusPending,
  "Completed": styles.statusCompleted,
};

const columns = [
  { key: "srNumber", label: "Sr No." },
  { key: "clientName", label: "Client Name" },
  { key: "employeeName", label: "Employee" },
  { key: "contactPerson", label: "Contact Person" },
  { key: "date", label: "Date" },
  { key: "jobsCount", label: "Jobs Count" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" }
];

const AllJobSheets = () => {
  const [jobsheets, setJobsheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobSheet, setSelectedJobSheet] = useState(null);
  const [showView, setShowView] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [jobSheetOpen, setJobSheetOpen] = useState(false);
  const [editJobSheetOpen, setEditJobSheetOpen] = useState(false);
  const [editJobSheet, setEditJobSheet] = useState(null);
  const [viewJobSheet, setViewJobSheet] = useState(null);

  const { employees, handleGetAllEmployees } = useData();

  useEffect(() => {
    fetchJobsheets();
    handleGetAllEmployees();
    // eslint-disable-next-line
  }, []);

  const fetchJobsheets = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await api.get("/jobsheet/getalljobsheets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobsheets(res.data?.data || []);
      console.log("JobSheets data:", res.data?.data);
    } catch (e) {
      console.error("Error fetching jobsheets:", e);
      setJobsheets([]);
    }
    setLoading(false);
  };

  // Get status based on date and jobs completion (you can modify this logic)
  const getJobSheetStatus = (jobsheet) => {
    const today = new Date();
    const jobDate = new Date(jobsheet.date);
    
    if (jobDate > today) {
      return "Pending";
    } else if (jobDate.toDateString() === today.toDateString()) {
      return "Ongoing";
    } else {
      return "Completed";
    }
  };

  // Calculate stats
  const getStats = () => {
    const total = jobsheets.length;
    const ongoing = jobsheets.filter(js => getJobSheetStatus(js) === "Ongoing").length;
    const completed = jobsheets.filter(js => getJobSheetStatus(js) === "Completed").length;
    const pending = jobsheets.filter(js => getJobSheetStatus(js) === "Pending").length;

    return { total, ongoing, completed, pending };
  };

  const stats = getStats();

  // View handler
  const handleView = (jobsheet) => {
    setSelectedJobSheet(jobsheet);
    setShowView(true);
  };

  // Edit handler
  const handleEdit = (jobsheet) => {
    setEditJobSheet(jobsheet);
    setEditJobSheetOpen(true);
  };

  // Delete handlers
  const handleDelete = async (srNumber) => {
    try {
      const token = sessionStorage.getItem("token");
      await api.delete(`/jobsheet/deletejobsheet/${srNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJobsheets(); // Refresh the list
      if (showView) setShowView(false);
    } catch (error) {
      console.error("Error deleting jobsheet:", error);
      alert("Error deleting jobsheet");
    }
  };

  const confirmDelete = () => {
    handleDelete(deleteId);
    setDeleteConfirm(false);
    setDeleteId(null);
  };

  // Success handlers
  const handleJobSheetSuccess = () => {
    fetchJobsheets(); // Refresh data
    setJobSheetOpen(false);
  };

  const handleJobSheetEditSuccess = () => {
    fetchJobsheets(); // Refresh data
    setViewJobSheet(null);
    setShowView(false);
    setEditJobSheetOpen(false);
    setEditJobSheet(null);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  // Prepare data for the Table component
  const tableData = jobsheets.map((jobsheet) => ({
    srNumber: String(jobsheet.srNumber).padStart(2, "0"),
    clientName: jobsheet.client?.name || jobsheet.clientName || "-",
    employeeName: `${jobsheet.employee?.firstName || ""} ${jobsheet.employee?.lastName || ""}`.trim() || "-",
    contactPerson: jobsheet.contactPerson || "-",
    date: formatDate(jobsheet.date),
    jobsCount: jobsheet.jobs?.length || 0,
    status: (
      <span className={`${styles.statusChip} ${STATUS_COLORS[getJobSheetStatus(jobsheet)]}`}>
        {getJobSheetStatus(jobsheet)}
      </span>
    ),
    actions: (
      <div className={styles.actionBtns}>
        <button
          className={styles.iconBtn}
          title="View Details"
          onClick={() => handleView(jobsheet)}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#8B98A9" strokeWidth="1.7"/>
            <circle cx="12" cy="12" r="3.5" stroke="#8B98A9" strokeWidth="1.7"/>
          </svg>
        </button>
        <button
          className={styles.iconBtn}
          title="Edit JobSheet"
          onClick={() => handleEdit(jobsheet)}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M14.166 2.5a1.768 1.768 0 0 1 2.5 2.5l-10 10a2 2 0 0 1-.792.496l-3.125 1.042 1.041-3.125a2 2 0 0 1 .496-.792l10-10Z" stroke="#8B98A9" strokeWidth="1.7"/>
          </svg>
        </button>
        <button
          className={styles.iconBtn}
          title="Delete JobSheet"
          onClick={() => {
            setDeleteId(jobsheet.srNumber);
            setDeleteConfirm(true);
          }}
          style={{ color: "#ff4444" }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M6.667 5V4.167a2.5 2.5 0 0 1 2.5-2.5h1.666a2.5 2.5 0 0 1 2.5 2.5V5m3.334 0v11.667a2.5 2.5 0 0 1-2.5 2.5H5.833a2.5 2.5 0 0 1-2.5-2.5V5m0 0h12.5M8.333 9.167v5M11.667 9.167v5" stroke="#ff4444" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    )
  }));

  return (
  <ContentStructure links={[]} >

      <div className={styles.jobsheetPage}>
        {/* Stats Cards Row */}
        <div className={styles.statsRow}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Total JobSheets</div>
            <div className={styles.cardValueRow}>
              <span className={styles.cardValue}>{stats.total}</span>
              <span className={styles.percentUp}>
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M8 12V4M8 4L4 8M8 4l4 4" stroke="#4CC187" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                100%
              </span>
            </div>
            <div className={styles.cardDesc}>All Time</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Ongoing</div>
            <div className={styles.cardValueRow}>
              <span className={styles.cardValue}>{stats.ongoing}</span>
              <span className={styles.percentUp}>
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M8 12V4M8 4L4 8M8 4l4 4" stroke="#4CC187" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {stats.total > 0 ? Math.round((stats.ongoing / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className={styles.cardDesc}>Today</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Completed</div>
            <div className={styles.cardValueRow}>
              <span className={styles.cardValue}>{stats.completed}</span>
              <span className={styles.percentUp}>
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M8 12V4M8 4L4 8M8 4l4 4" stroke="#4CC187" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className={styles.cardDesc}>This Month</div>
          </div>
        </div>

        {/* Table Container */}
        <div className={styles.tableContainer}>
          <div className={styles.headerRow}>
            <span className={styles.pageTitle}>JobSheets List</span>
            <div className={styles.headerActions}>
              <button className={styles.filterBtn}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M3.667 5.5h14.666M6.417 10.083h9.166M9.167 14.667h3.666" stroke="#6F8B98" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              <button 
                className={styles.addBtn}
                onClick={() => setJobSheetOpen(true)}
              >
                + Add New JobSheet
              </button>
            </div>
          </div>
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table columns={columns} data={tableData} />
          )}
        </div>

        {/* View JobSheet Popup */}
      {showView && selectedJobSheet && (
  <div className={styles.viewPopup}>
    <div className={styles.popupContent}>
      {/* Header Section */}
      <div className={styles.popupHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.jobsheetIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.headerTitle}>
              JobSheet #{String(selectedJobSheet.srNumber).padStart(3, '0')}
            </div>
            <div className={styles.headerSubtitle}>
              Created on {formatDate(selectedJobSheet.date)}
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.statusBadge}>
            <span className={`${styles.statusChip} ${STATUS_COLORS[getJobSheetStatus(selectedJobSheet)]}`}>
              {getJobSheetStatus(selectedJobSheet)}
            </span>
          </div>
          <button 
            className={styles.closeBtn} 
            onClick={() => setShowView(false)}
            aria-label="Close popup"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.popupBody}>
        {/* Basic Information Cards */}
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardLabel}>Client</div>
              <div className={styles.cardValue}>
                {selectedJobSheet.client?.name || selectedJobSheet.clientName || "N/A"}
              </div>
              <div className={styles.cardSubtext}>
                {selectedJobSheet.client?.email || "No email provided"}
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardLabel}>Assigned Employee</div>
              <div className={styles.cardValue}>
                {selectedJobSheet.employee?.firstName} {selectedJobSheet.employee?.lastName}
              </div>
              <div className={styles.cardSubtext}>
                {selectedJobSheet.employee?.role || "Employee"}
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardLabel}>Contact Person</div>
              <div className={styles.cardValue}>
                {selectedJobSheet.contactPerson || "Not specified"}
              </div>
              <div className={styles.cardSubtext}>
                {selectedJobSheet.client?.phone || "No phone provided"}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        {selectedJobSheet.instructions && (
          <div className={styles.instructionsSection}>
            <div className={styles.sectionHeader}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Special Instructions</span>
            </div>
            <div className={styles.instructionsContent}>
              {selectedJobSheet.instructions}
            </div>
          </div>
        )}

        {/* Jobs Section */}
        <div className={styles.jobsSection}>
          <div className={styles.sectionHeader}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9,11 12,14 15,11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="2" x2="12" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Jobs Details ({selectedJobSheet.jobs?.length || 0} {selectedJobSheet.jobs?.length === 1 ? 'job' : 'jobs'})</span>
          </div>

          <div className={styles.jobsList}>
            {selectedJobSheet.jobs && selectedJobSheet.jobs.length > 0 ? (
              selectedJobSheet.jobs.map((job, idx) => (
                <div key={idx} className={styles.jobCard}>
                  <div className={styles.jobHeader}>
                    <div className={styles.jobNumber}>Job #{idx + 1}</div>
                    <div className={styles.jobMaterial}>{job.material || "Material not specified"}</div>
                  </div>

                  <div className={styles.jobContent}>
                    <div className={styles.jobDetails}>
                      <div className={styles.jobDescription}>
                        <strong>Description:</strong>
                        <p>{job.description || "No description provided"}</p>
                      </div>

                      <div className={styles.dimensionsGrid}>
                        <div className={styles.dimensionItem}>
                          <span className={styles.dimensionLabel}>Left Height</span>
                          <span className={styles.dimensionValue}>{job.lHeight || "--"}</span>
                        </div>
                        <div className={styles.dimensionItem}>
                          <span className={styles.dimensionLabel}>Right Height</span>
                          <span className={styles.dimensionValue}>{job.rHeight || "--"}</span>
                        </div>
                        <div className={styles.dimensionItem}>
                          <span className={styles.dimensionLabel}>Top Width</span>
                          <span className={styles.dimensionValue}>{job.tWidth || "--"}</span>
                        </div>
                        <div className={styles.dimensionItem}>
                          <span className={styles.dimensionLabel}>Bottom Width</span>
                          <span className={styles.dimensionValue}>{job.bWidth || "--"}</span>
                        </div>
                      </div>

                      {job.remark && (
                        <div className={styles.jobRemark}>
                          <strong>Remark:</strong>
                          <p>{job.remark}</p>
                        </div>
                      )}
                    </div>

                    {/* Job Images */}
                    {job.images && job.images.length > 0 && (
                      <div className={styles.jobImages}>
                        <div className={styles.imagesHeader}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                            <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Images ({job.images.length})
                        </div>
                        <div className={styles.imagesGrid}>
                          {job.images.map((image, imgIdx) => (
                            <div 
                              key={imgIdx} 
                              className={styles.imageItem}
                              onClick={() => openImagePreview(image.imageUrl || image.url || image, imgIdx, job.images)}
                            >
                              <img
                                src={image.imageUrl || image.url || image}
                                alt={`Job ${idx + 1} - Image ${imgIdx + 1}`}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className={styles.imagePlaceholder} style={{ display: 'none' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                                  <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Image unavailable
                              </div>
                              <div className={styles.imageOverlay}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noJobs}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>No Jobs Found</h3>
                <p>This jobsheet doesn't have any jobs assigned yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className={styles.popupFooter}>
        <div className={styles.footerLeft}>
          <span className={styles.footerInfo}>
            Created on {formatDate(selectedJobSheet.date)}
          </span>
        </div>
        <div className={styles.footerRight}>
          <button 
            className={styles.actionBtn}
            onClick={() => setViewJobSheet(selectedJobSheet)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="6,9 6,2 18,2 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="6" y="14" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
             Preview Jobsheet
          </button>
          <button 
            className={`${styles.actionBtn} ${styles.editBtn}`}
            onClick={() => handleEdit(selectedJobSheet)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit JobSheet
          </button>
          <button 
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={() => {
              setDeleteId(selectedJobSheet.srNumber);
              setDeleteConfirm(true);
              setShowView(false);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Nested JobSheet Preview Popup */}
      {viewJobSheet && (
        <JobSheetPreview
          open={!!viewJobSheet}
          jobSheet={viewJobSheet}
          onClose={() => setViewJobSheet(null)}
        />
      )}
    </div>
  </div>
)}

        {/* Delete Confirm Popup */}
        {deleteConfirm && (
          <div className={styles.deleteAlert}>
            <div className={styles.alertBox}>
              <div className={styles.alertTitle}>Delete JobSheet?</div>
              <div className={styles.alertText}>
                Are you sure you want to delete this jobsheet? This action cannot be undone.
              </div>
              <div className={styles.alertActions}>
                <button onClick={confirmDelete}>Delete</button>
                <button onClick={() => setDeleteConfirm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* JobSheet Create Popup */}
        <JobSheetPopup
          open={jobSheetOpen}
          onClose={() => setJobSheetOpen(false)}
          onSuccess={handleJobSheetSuccess}
        />

        {/* JobSheet Edit Popup */}
        <JobSheetEditPopup
          open={editJobSheetOpen}
          onClose={() => {
            setEditJobSheetOpen(false);
            setEditJobSheet(null);
          }}
          jobSheet={editJobSheet}
          onSuccess={handleJobSheetEditSuccess}
        />
      </div>
    </ContentStructure>
  );
};

export default AllJobSheets;