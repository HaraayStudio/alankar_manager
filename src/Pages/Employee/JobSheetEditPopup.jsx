import React, { useState, useEffect } from "react";
import styles from "./JobSheetPopup.module.scss";
import { useData } from "../../context/DataContext";
import axios from "axios";
import { BASE_URL } from "../../api/constants";

// SizeSchematic component for visual preview
function SizeSchematic({ lHeight, rHeight, tWidth, bWidth, jobNum }) {
  const leftHeightText = lHeight ? String(lHeight) : "L";
  const rightHeightText = rHeight ? String(rHeight) : "R";
  const topWidthText = tWidth ? String(tWidth) : "T";
  const bottomWidthText = bWidth ? String(bWidth) : "B";

  return (
    <div
      style={{
        width: "200px",
        height: "280px",
        maxWidth: "100%",
        margin: "10px auto",
      }}
    >
      <svg
        viewBox="0 0 200 280"
        width="100%"
        height="100%"
        style={{ display: "block", background: "#f8f9fa", borderRadius: 12, border: "1px solid #e5ebf7" }}
      >
        {/* Sheet rectangle */}
        <rect
          x="20"
          y="25"
          width="160"
          height="230"
          rx="6"
          fill="#fff"
          stroke="#ccc"
          strokeWidth="1.5"
        />

        {/* Horizontal arrows (widths) */}
        <line
          x1="30"
          y1="65"
          x2="170"
          y2="65"
          stroke="#444"
          strokeWidth="1.5"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        />
        <line
          x1="30"
          y1="215"
          x2="170"
          y2="215"
          stroke="#444"
          strokeWidth="1.5"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        />

        {/* Vertical arrows (heights) */}
        <line
          x1="45"
          y1="45"
          x2="45"
          y2="235"
          stroke="#444"
          strokeWidth="1.5"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        />
        <line
          x1="155"
          y1="45"
          x2="155"
          y2="235"
          stroke="#444"
          strokeWidth="1.5"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        />

        {/* Width labels */}
        <rect
          x="75"
          y="52"
          width="50"
          height="18"
          rx="4"
          fill="#fff"
          stroke="#aaa"
        />
        <text
          x="100"
          y="65"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#222"
        >
          {topWidthText}
        </text>
        <rect
          x="75"
          y="202"
          width="50"
          height="18"
          rx="4"
          fill="#fff"
          stroke="#aaa"
        />
        <text
          x="100"
          y="215"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#222"
        >
          {bottomWidthText}
        </text>

        {/* Height labels */}
        <rect
          x="25"
          y="131"
          width="35"
          height="18"
          rx="4"
          fill="#fff"
          stroke="#aaa"
        />
        <text
          x="42.5"
          y="144"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#222"
        >
          {leftHeightText}
        </text>
        <rect
          x="140"
          y="131"
          width="35"
          height="18"
          rx="4"
          fill="#fff"
          stroke="#aaa"
        />
        <text
          x="157.5"
          y="144"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#222"
        >
          {rightHeightText}
        </text>

        {/* Job number in center */}
        <text
          x="100"
          y="155"
          textAnchor="middle"
          fontSize="36"
          fontWeight="bold"
          fill="#c5c9d6"
          opacity="0.6"
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

export default function JobSheetEditPopup({
  open,
  onClose,
  jobSheet = null, // null for create, jobSheet object for edit
  preSelectedEmployee,
  onSuccess,
}) {
  const { clients, employees } = useData();
  const isEditMode = !!jobSheet;

  const emptyJob = {
    id: null,
    material: "",
    description: "",
    remark: "",
    lHeight: "",
    rHeight: "",
    tWidth: "",
    bWidth: "",
    files: [], // New files to upload
    existingImages: [], // Existing images from server
  };

  const [form, setForm] = useState({
    clientId: "",
    employeeId: preSelectedEmployee?.id || "",
    clientName: "",
    contactPerson: "",
    date: "",
    instructions: "",
    jobs: [{ ...emptyJob }],
  });
  const [loading, setLoading] = useState(false);

  // Helper function to format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  // Initialize form with existing data for edit mode
  useEffect(() => {
    if (open) {
      if (isEditMode && jobSheet) {
        setForm({
          clientId: jobSheet.client?.id?.toString() || "",
          employeeId: jobSheet.employee?.id?.toString() || "",
          clientName: jobSheet.clientName || "",
          contactPerson: jobSheet.contactPerson || "",
          date: formatDateForInput(jobSheet.date),
          instructions: jobSheet.instructions || "",
          jobs: jobSheet.jobs?.length > 0 ? jobSheet.jobs.map(job => ({
            id: job.id,
            material: job.material || "",
            description: job.description || "",
            remark: job.remark || "",
            lHeight: job.lHeight || "",
            rHeight: job.rHeight || "",
            tWidth: job.tWidth || "",
            bWidth: job.bWidth || "",
            files: [],
            existingImages: job.images || [],
          })) : [{ ...emptyJob }],
        });
      } else {
        // Create mode
        setForm({
          clientId: "",
          employeeId: preSelectedEmployee?.id || "",
          clientName: "",
          contactPerson: "",
          date: "",
          instructions: "",
          jobs: [{ ...emptyJob }],
        });
      }
    }
  }, [open, jobSheet, preSelectedEmployee, isEditMode]);

  // Form handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleJobField = (idx, key, value) => {
    setForm((prev) => {
      const updatedJobs = prev.jobs.map((j, i) =>
        i === idx ? { ...j, [key]: value } : j
      );
      return { ...prev, jobs: updatedJobs };
    });
  };

  const handleJobFileChange = (idx, files) => {
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    
    setForm((prev) => {
      const updatedJobs = prev.jobs.map((j, i) => {
        if (i === idx) {
          const currentFiles = Array.isArray(j.files) ? j.files : [];
          return { 
            ...j, 
            files: [...currentFiles, ...fileArray]
          };
        }
        return j;
      });
      return { ...prev, jobs: updatedJobs };
    });
  };

  const handleRemoveNewImage = (jobIdx, fileIdx) => {
    setForm((prev) => {
      const updatedJobs = prev.jobs.map((j, i) => {
        if (i === jobIdx) {
          const currentFiles = Array.isArray(j.files) ? j.files : [];
          return { 
            ...j, 
            files: currentFiles.filter((_, k) => k !== fileIdx) 
          };
        }
        return j;
      });
      return { ...prev, jobs: updatedJobs };
    });
  };

  const handleRemoveExistingImage = (jobIdx, imgIdx) => {
    setForm((prev) => {
      const updatedJobs = prev.jobs.map((j, i) => {
        if (i === jobIdx) {
          const currentImages = Array.isArray(j.existingImages) ? j.existingImages : [];
          return { 
            ...j, 
            existingImages: currentImages.filter((_, k) => k !== imgIdx) 
          };
        }
        return j;
      });
      return { ...prev, jobs: updatedJobs };
    });
  };

  const addJob = () =>
    setForm((prev) => ({ ...prev, jobs: [...prev.jobs, { ...emptyJob }] }));
  
  const removeJob = (idx) =>
    setForm((prev) => ({
      ...prev,
      jobs: prev.jobs.length === 1 ? prev.jobs : prev.jobs.filter((_, i) => i !== idx),
    }));

  const createFilePreview = (file) => {
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.error("Error creating file preview:", error);
      return null;
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.clientId || !form.employeeId || !form.date) {
    alert("Please fill all required fields.");
    return;
  }
  // if ( (!jobSheet || !jobSheet.id)) { 
  //   alert("Invalid JobSheet data. Cannot update.");
  //   return;
  // }
  setLoading(true);

  try {
    const processedJobs = form.jobs.map(job => ({
      ...(job.id && { id: job.id }),
      material: job.material || "",
      description: job.description || "",
      remark: job.remark || "",
      lHeight: job.lHeight || "",
      rHeight: job.rHeight || "",
      tWidth: job.tWidth || "",
      bWidth: job.bWidth || "",
      images: []
    }));

    const jobSheetData = {
      ...(isEditMode && { id: jobSheet.id }),
      client: { id: parseInt(form.clientId) },
      employee: { id: parseInt(form.employeeId) },
      clientName: form.clientName || "",
      contactPerson: form.contactPerson || "",
      date: form.date,
      instructions: form.instructions || "",
      jobs: processedJobs
    };

    const formData = new FormData();
    formData.append("jobSheet", JSON.stringify(jobSheetData));
    form.jobs.forEach((job, jobIndex) => {
      if (Array.isArray(job.files) && job.files.length > 0) {
        job.files.forEach((file) => {
          formData.append(`jobImages[${jobIndex}]`, file);
        });
      }
    });
console.log("jb",jobSheet);

    const token = sessionStorage.getItem("token");
    let url, method;
    if (isEditMode) {
      url = `${BASE_URL}/jobsheet/updatejobsheet/${jobSheet.srNumber}`;
      method = "put";
    }

    const res = await axios({
      method,
      url,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    console.log("Response:", res.data);
    if (res.status === 200 || res.status === 201) {
      alert(`JobSheet ${isEditMode ? "updated" : "created"} successfully!`);
      onClose();
      if (onSuccess) onSuccess();
    } else {
      throw new Error(res.data?.message || `Error ${isEditMode ? "updating" : "creating"} JobSheet`);
    }
  } catch (err) {
    console.error("Submit error:", err);
    const errorMessage = err?.response?.data?.message || err.message || "Failed to save JobSheet!";
    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};


  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>{isEditMode ? 'Edit Job Sheet' : 'Add Job Sheet'}</h2>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          {/* Basic Details */}
          <div className={styles.row}>
            <label>
              Client<span>*</span>
              <select
                name="clientId"
                value={form.clientId}
                onChange={handleChange}
                required
              >
                <option value="">Select Client</option>
                {Array.isArray(clients) && clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.clientName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Employee<span>*</span>
              <select
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                required
                disabled={!!preSelectedEmployee}
              >
                <option value="">Select Employee</option>
                {Array.isArray(employees) && employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.firstName} {e.lastName}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.row}>
            <label>
              Contact Person
              <input
                type="text"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                placeholder="Contact person name"
              />
            </label>
            <label>
              Date<span>*</span>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.row}>
            <label style={{ flex: 1 }}>
              Instructions
              <input
                type="text"
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                placeholder="Instructions (optional)"
              />
            </label>
          </div>

          <hr style={{ margin: "18px 0 10px 0", border: 0, borderTop: "1.5px solid #e5ebf7" }} />

          {/* JOBS List */}
          <div className={styles.jobsSection}>
            <div style={{ fontWeight: 600, fontSize: "1.05rem", color: "#274787", marginBottom: 10 }}>
              Job Items
            </div>
            {form.jobs.map((job, idx) => (
              <div key={idx} className={styles.jobCard}>
                <div className={styles.row}>
                  <label>
                    <span>Material</span>
                    <input
                      type="text"
                      value={job.material}
                      onChange={e => handleJobField(idx, "material", e.target.value)}
                      placeholder="Material"
                    />
                  </label>
                  <label>
                    <span>Description</span>
                    <input
                      type="text"
                      value={job.description}
                      onChange={e => handleJobField(idx, "description", e.target.value)}
                      placeholder="Description"
                    />
                  </label>
                  <label>
                    <span>Remark</span>
                    <input
                      type="text"
                      value={job.remark}
                      onChange={e => handleJobField(idx, "remark", e.target.value)}
                      placeholder="Remark"
                    />
                  </label>
                </div>
                
                {/* Size Schematic Preview */}
                <div className={styles.schematicContainer}>
                  <div className={styles.schematicTitle}>
                    Dimension Preview - Job {idx + 1}
                  </div>
                  <SizeSchematic
                    lHeight={job.lHeight}
                    rHeight={job.rHeight}
                    tWidth={job.tWidth}
                    bWidth={job.bWidth}
                    jobNum={idx + 1}
                  />
                </div>

                <div className={styles.row}>
                  <label>
                    <span>Left Height (ft)</span>
                    <input
                      type="number"
                      value={job.lHeight}
                      min={0}
                      step="0.1"
                      onChange={e => handleJobField(idx, "lHeight", e.target.value)}
                      placeholder="Left Height"
                    />
                  </label>
                  <label>
                    <span>Right Height (ft)</span>
                    <input
                      type="number"
                      value={job.rHeight}
                      min={0}
                      step="0.1"
                      onChange={e => handleJobField(idx, "rHeight", e.target.value)}
                      placeholder="Right Height"
                    />
                  </label>
                </div>
                <div className={styles.row}>
                  <label>
                    <span>Top Width (ft)</span>
                    <input
                      type="number"
                      value={job.tWidth}
                      min={0}
                      step="0.1"
                      onChange={e => handleJobField(idx, "tWidth", e.target.value)}
                      placeholder="Top Width"
                    />
                  </label>
                  <label>
                    <span>Bottom Width (ft)</span>
                    <input
                      type="number"
                      value={job.bWidth}
                      min={0}
                      step="0.1"
                      onChange={e => handleJobField(idx, "bWidth", e.target.value)}
                      placeholder="Bottom Width"
                    />
                  </label>
                </div>
                <div className={styles.row}>
                  <label>
                    <span>Add New Images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={e => handleJobFileChange(idx, e.target.files)}
                      disabled={loading}
                    />
                  </label>
                </div>

                {/* Existing Images (Edit Mode) */}
                {isEditMode && Array.isArray(job.existingImages) && job.existingImages.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#274787", marginBottom: 6 }}>
                      Current Images:
                    </div>
                    <div className={styles.imgPreviewBox}>
                      {job.existingImages.map((img, imgIdx) => (
                        <div key={imgIdx} className={styles.imgPreview}>
                          <img
                            src={img.imageUrl}
                            alt={`existing ${imgIdx + 1}`}
                            width={56}
                            height={56}
                            style={{ borderRadius: 8, objectFit: "cover", border: "1.5px solid #e6edf5" }}
                            onError={(e) => {
                              console.error("Image failed to load:", img.imageUrl);
                              e.target.style.display = 'none';
                            }}
                          />
                          <button 
                            type="button" 
                            className={styles.removeBtn} 
                            onClick={() => handleRemoveExistingImage(idx, imgIdx)}
                            disabled={loading}
                            title="Remove existing image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview */}
                {Array.isArray(job.files) && job.files.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#274787", marginBottom: 6 }}>
                      New Images to Upload:
                    </div>
                    <div className={styles.imgPreviewBox}>
                      {job.files.map((file, fileIdx) => {
                        const previewUrl = createFilePreview(file);
                        return previewUrl ? (
                          <div key={fileIdx} className={styles.imgPreview}>
                            <img
                              src={previewUrl}
                              alt={`new ${fileIdx + 1}`}
                              width={56}
                              height={56}
                              style={{ borderRadius: 8, objectFit: "cover", border: "1.5px solid #e6edf5" }}
                              onError={(e) => {
                                console.error("Image failed to load:", file.name);
                                e.target.style.display = 'none';
                              }}
                              onLoad={(e) => {
                                URL.revokeObjectURL(previewUrl);
                              }}
                            />
                            <button 
                              type="button" 
                              className={styles.removeBtn} 
                              onClick={() => handleRemoveNewImage(idx, fileIdx)}
                              disabled={loading}
                              title="Remove new image"
                            >
                              ×
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 5 }}>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    style={{ color: "#d00", fontWeight: 600, fontSize: 16 }}
                    disabled={form.jobs.length === 1 || loading}
                    onClick={() => removeJob(idx)}
                  >
                    Remove Job
                  </button>
                </div>
                <hr style={{ margin: "13px 0 10px 0", border: 0, borderTop: "1.2px solid #e9eefa" }} />
              </div>
            ))}
            <button
              type="button"
              onClick={addJob}
              className={styles.addBtn}
              style={{ margin: "8px 0 0 0" }}
              disabled={loading}
            >
              + Add Job Item
            </button>
          </div>

          <div className={styles.actions}>
            <button 
              type="button" 
              onClick={onClose} 
              className={styles.cancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submit} 
              disabled={loading}
            >
              {loading ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Job Sheet" : "Save Job Sheet")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}