import React, { useEffect, useState } from 'react';
import styles from './AllEmployees.module.scss';
import { useData } from '../../context/DataContext';
import ContentStructure from "../../Layout/ContentStructure";
import Table from "../../Components/Table"; // Update the path if needed
import JobSheetPopup from "./JobsheetPopup.jsx"; // Update path as needed
import JobSheetEditPopup from "./JobSheetEditPopup.jsx"; // Add this import
import axios from "axios";
import JobSheetPreview from '../../Components/JobSheetPreview.jsx';

const links = [
  { to: "/employee/new", label: "Add New Employee" },
  { to: "/employee/list", label: "All Employee" }
];
const protectedEmail = "admin@alankarimprrint.com";

const columns = [
  { key: "sr", label: "Sr" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "role", label: "Role" },
  { key: "joinDate", label: "Join Date" },
  { key: "view", label: "View" },
  // { key: "action", label: "Action" }
];

const AllEmployees = () => {
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [showView, setShowView] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [jobSheetOpen, setJobSheetOpen] = useState(false);
  const [preSelectedEmployee, setPreSelectedEmployee] = useState(null);
  const [viewJobSheet, setViewJobSheet] = useState(null);
  
  // New states for JobSheet editing
  const [editJobSheetOpen, setEditJobSheetOpen] = useState(false);
  const [editJobSheet, setEditJobSheet] = useState(null);

  const {
    employees,
    handleGetAllEmployees,
    handleDeleteEmployee,
    handleUpdateEmployee,
    loading
  } = useData();

  useEffect(() => {
    handleGetAllEmployees();
    // eslint-disable-next-line
  }, []);

  // Edit handlers
const handleEdit = (emp) => {
  setSelectedEmployee(emp);
  setFormData({
    ...emp,
    phone: emp.phone ? String(emp.phone) : "",
    adharNumber: emp.adharNumber && emp.adharNumber !== 0 ? String(emp.adharNumber) : "",
    joinDate: emp.joinDate || "",
    leaveDate: emp.leaveDate || "",
    birthDate: emp.birthDate || "",
  });
  setEditMode(true);
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = async () => {
    console.log( "emp update",formData);
    
    await handleUpdateEmployee(formData.id,formData);
    setEditMode(false);
    handleGetAllEmployees();
  };

  // View handler
  const handleView = (emp) => {
    setSelectedEmployee(emp);
    setShowView(true);
  };

  // Delete handlers
  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteConfirm(true);
  };
  const confirmDelete = async () => {
    await handleDeleteEmployee(deleteId);
    setDeleteConfirm(false);
    setDeleteId(null);
    handleGetAllEmployees();
    if (showView) setShowView(false);
  };

  // JobSheet handlers
  const handleEditJobSheet = (jobSheet) => {
    setEditJobSheet(jobSheet);
    console.log(jobSheet);
    
    setEditJobSheetOpen(true);
  };

  const handleJobSheetEditSuccess = () => {
    handleGetAllEmployees(); // Refresh data
    setViewJobSheet(null); // Close view popup if open
    setShowView(false); // Close employee view popup
  };

  // Prepare data for the Table component
  const tableData = employees.map((emp, idx) => ({
    sr: idx + 1,
    name: `${emp.firstName} ${emp.lastName}`,
    email: emp.email,
    phone: emp.phone,
    role: emp.role,
    joinDate: emp.joinDate,
    view: (
      <button 
        className={styles.viewBtn}
        title="View Details"
        onClick={() => handleView(emp)}
        style={{ background: "#f0f4ff", color: "#255ec6", fontWeight: 500 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
          <path d="M2.06 12.35c-.08-.22-.08-.47 0-.7C2.87 9.68 4.25 8 6.02 6.82 7.79 5.63 9.87 5 12 5s4.21.63 5.98 1.82c1.77 1.18 3.15 2.86 3.94 4.83.08.23.08.47 0 .7-.79 1.97-2.17 3.65-3.94 4.83C16.21 18.37 14.13 19 12 19c-2.13 0-4.21-.63-5.98-1.82C4.25 15.99 2.87 14.32 2.06 12.35z" stroke="#0584FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="#0584FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    ),
    // action: (
    //   <div className={styles.actionButtons}>
    //     <button onClick={() => handleEdit(emp)}>Edit</button>
    //     <button
    //       onClick={() => handleDelete(emp.id)}
    //       disabled={emp.email === protectedEmail}
    //       title={emp.email === protectedEmail ? "This user can't be deleted." : "Delete Employee"}
    //       style={emp.email === protectedEmail ? { opacity: 0.5, cursor: "not-allowed" } : {}}
    //     >
    //       Delete
    //     </button>
    //   </div>
    // )
  }));

  return (
    <ContentStructure links={links}>
      <h2 className='mainContentHeading'>Employee List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table columns={columns} data={tableData} />
      )}

      {/* Edit Popup */}
      {editMode && (
        <div className={styles.editPopup}>
          <div className={styles.popupContent}>
            <button className={styles.closeBtn} onClick={() => setEditMode(false)}>×</button>
            <h3>Edit Employee</h3>
            <form className={styles.grid} autoComplete="off" onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}>
              {/* Row 1: Names */}
              <div className={styles.row}>
                <div className={styles.col}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    autoComplete="off"
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.col} style={{ display: "none" }}>
                  <label htmlFor="secondName">Second Name</label>
                  <input
                    autoComplete="off"
                    type="text"
                    name="secondName"
                    placeholder="Second Name"
                    value={formData.secondName || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.col}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    autoComplete="off"
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {/* Row 2: Email & Phone */}
              <div className={styles.row}>
                <div className={styles.col}>
                  <label htmlFor="email">Email</label>
                  <input
                    autoComplete="off"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.col}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    autoComplete="off"
                    type="tel"
                    maxLength={10}
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Row 3: Role */}
              <div className={styles.row}>
                <div className={styles.col}>
                  <label htmlFor="role">Role</label>
                  <select
                    name="role"
                    value={formData.role || ''}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="GUEST">Guest</option>
                  </select>
                </div>
                <div className={styles.col}></div>
              </div>
              {/* Row 4: Gender & Birth Date */}
              <div className={styles.row}>
                <div className={styles.col}>
                  <label htmlFor="gender">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className={styles.col}>
                  <label htmlFor="birthDate">Birth Date</label>
                  <input
                    autoComplete="off"
                    type="date"
                    name="birthDate"
                    placeholder="Birth Date"
                    value={formData.birthDate || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Row 5: Blood Group & PAN */}
              <div className={styles.row}>
                <div className={styles.col}>
                  <label htmlFor="bloodGroup">Blood Group</label>
                  <input
                    autoComplete="off"
                    type="text"
                    name="bloodGroup"
                    placeholder="Blood Group"
                    value={formData.bloodGroup || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.col}>
                  <label htmlFor="panNumber">PAN Number</label>
                  <input
                    autoComplete="off"
                    type="text"
                    name="panNumber"
                    placeholder="PAN Number"
                    value={formData.panNumber || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Row 6: Aadhar */}
              <div className={styles.row}>
                <div className={styles.col}>
                  <label htmlFor="adharNumber">Aadhar Number</label>
                <input
  type="text"
  name="adharNumber"
  placeholder="1234-5678-9012"
  value={
    formData.adharNumber
      ? formData.adharNumber.replace(/(\d{4})(?=\d)/g, "$1-") // Format only for display
      : ""
  }
  onChange={(e) => {
    let rawValue = e.target.value.replace(/\D/g, '').slice(0, 12); // Keep only numbers (max 12 digits)
    setFormData(prev => ({ ...prev, adharNumber: rawValue })); // Store unformatted
  }}
  autoComplete="off"
  inputMode="numeric"
  maxLength={14} // For display with dashes
/>

                </div>
                <div className={styles.col}></div>
              </div>
              {/* Row 7: Join & Leave Date */}
              <div className={styles.row}>
                <div className={styles.col}>
                  <label htmlFor="joinDate">Join Date</label>
                  <input
                    autoComplete="off"
                    type="date"
                    name="joinDate"
                    placeholder="Join Date"
                    value={formData.joinDate || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.col}>
                  <label htmlFor="leaveDate">Leave Date</label>
                  <input
                    autoComplete="off"
                    type="date"
                    name="leaveDate"
                    placeholder="Leave Date"
                    value={formData.leaveDate || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Buttons */}
              <div className={styles.row}>
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Popup */}
      {showView && selectedEmployee && (
        <div className={styles.viewPopup}>
          <div className={styles.popupContent}>
            {/* Profile Header */}
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              background: "#f0f4ff",
              borderRadius: "18px",
              padding: "24px 32px 18px 24px",
              gap: "28px",
              marginBottom: "1.3rem"
            }}>
              {/* Circle initial */}
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "#e4ecfd", color: "#1762d2",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "2.2rem", marginRight: 18, boxShadow: "0 2px 9px #a4c9fb22"
              }}>
                {selectedEmployee.firstName?.[0]?.toUpperCase() || "?"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 23, fontWeight: 700, color: "#2d3959", marginBottom: 3
                }}>
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </div>
                <div style={{
                  display: "flex", gap: "2.1rem", color: "#3564a4", fontWeight: 500, marginBottom: 10, marginTop: 10
                }}>
                  <span>Name: <b style={{ color: "#23234c" }}>
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </b></span>
                  <span>E-mail address: <span style={{ color: "#333" }}>{selectedEmployee.email}</span></span>
                </div>
                <div style={{
                  display: "flex", gap: "2.1rem", color: "#3564a4", fontWeight: 500, fontSize: 15
                }}>
                  <span>Mobile Number: <b style={{ color: "#2c2c49" }}>{selectedEmployee.phone}</b></span>
                  <span>Address: <span style={{ color: "#333" }}>
                    {selectedEmployee.jobSheets?.[0]?.client?.address || "--"}
                  </span></span>
                </div>
              </div>
              {/* Close */}
              <button className={styles.closeBtn} style={{ position: "absolute", top: 22, right: 28, fontSize: 34 }}
                onClick={() => setShowView(false)}
              >×</button>
            </div>

            {/* Employee Info Grid */}
            <div className={styles.detailsGrid} style={{ marginBottom: 0 }}>
              <div><span className={styles.label}>Role:</span> {selectedEmployee.role || "--"}</div>
              <div><span className={styles.label}>Status:</span> {selectedEmployee.status || "--"}</div>
              <div><span className={styles.label}>Gender:</span> {selectedEmployee.gender || "--"}</div>
              <div><span className={styles.label}>Birth Date:</span> {selectedEmployee.birthDate || "--"}</div>
              <div><span className={styles.label}>Blood Group:</span> {selectedEmployee.bloodGroup || "--"}</div>
              <div><span className={styles.label}>Join Date:</span> {selectedEmployee.joinDate || "--"}</div>
              <div><span className={styles.label}>Leave Date:</span> {selectedEmployee.leaveDate || "--"}</div>
              <div><span className={styles.label}>PAN Number:</span> {selectedEmployee.panNumber || "--"}</div>
              <div><span className={styles.label}>Aadhar Number:</span> {selectedEmployee.adharNumber || "--"}</div>
            </div>

            {/* All JobSheets Table */}
            {selectedEmployee.role === "EMPLOYEE" && (
              <div style={{ marginTop: "1.1rem" }}>
                <div style={{
                  fontWeight: 600, color: "#1877d2", fontSize: 18, marginBottom: 4
                }}>All JobSheets</div>
                <div style={{
                   background: "#f8faff", borderRadius: 8, boxShadow: "0 1px 7px #eaf3fc",
                  marginBottom: 12
                }}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Sr. No</th>
                        <th>Client Name</th>
                        <th>Date</th>
                        <th>Contact Person</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEmployee.jobSheets && selectedEmployee.jobSheets.length > 0 ? (
                        selectedEmployee.jobSheets.map((js, idx) => (
                          <tr key={js.srNumber || idx}>
                            <td>{js.srNumber || idx + 1}</td>
                            <td>{js.client?.name || js.clientName || "--"}</td>
                            <td>{js.date ? new Date(js.date).toLocaleDateString("en-GB") : "--"}</td>
                            <td>{js.contactPerson || "--"}</td>
                            <td>
                              <button disabled
                                className={styles.viewBtn}
                                style={{
                                  padding: "5px 15px", background: "#2e9bf5",
                                  color: "#fff", border: "none", borderRadius: 8,
                                  fontWeight: 500, fontSize: 15, cursor: "pointer",
                                  marginRight: 8
                                }}
                                // onClick={() => setViewJobSheet(js)}
                              >
                                View
                              </button>
                              <button disabled
                                style={{
                                  padding: "5px 15px", background: "#ff9500",
                                  color: "#fff", border: "none", borderRadius: 8,
                                  fontWeight: 500, fontSize: 15, cursor: "pointer"
                                }}
                                // onClick={() => handleEditJobSheet(js)}
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ color: "#888", textAlign: "center" }}>
                            No JobSheets found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>)}

            {/* Popup Actions */}
            <div className={styles.popupActions}>
              {selectedEmployee.role === "EMPLOYEE" && (
                <button
                  onClick={() => {
                    setPreSelectedEmployee(selectedEmployee);
                    setJobSheetOpen(true);
                    setShowView(false);
                  }}
                >
                  Add Job sheet
                </button>
              )}
              <button onClick={() => setShowView(false)}>Close</button>
              <button
                onClick={() => handleDelete(selectedEmployee.id)}
                disabled={selectedEmployee.email === protectedEmail}
                title={selectedEmployee.email === protectedEmail ? "This user can't be deleted." : "Delete Employee"}
                style={selectedEmployee.email === protectedEmail ? {
                  opacity: 0.5,
                  cursor: "not-allowed"
                } : {}}
              >
                Delete
              </button>
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
            <div className={styles.alertTitle}>Delete Employee?</div>
            <div className={styles.alertText}>
              Are you sure you want to delete this employee? This action cannot be undone.
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
        preSelectedEmployee={preSelectedEmployee}
        onSuccess={() => {
          handleGetAllEmployees(); // Refresh data
        }}
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
    </ContentStructure>
  );
};

export default AllEmployees;