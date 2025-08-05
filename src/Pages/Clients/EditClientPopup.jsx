// src/components/EditClientPopup.jsx
import React, { useState } from "react";
import styles from "./EditClientPopup.module.scss";

export default function EditClientPopup({ open, onClose, client, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    address: client?.address || "",
    gstNo: client?.gstNo || "",
    pan: client?.pan || "",
  });

  // If client changes (switch between edits), update form fields
  React.useEffect(() => {
    setForm({
      name: client?.name || "",
      email: client?.email || "",
      phone: client?.phone || "",
      address: client?.address || "",
      gstNo: client?.gstNo || "",
      pan: client?.pan || "",
    });
  }, [client]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <div className={styles.header}>
          <div className={styles.title}>Edit Client</div>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Full Name*<br />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </label>
          <label>
            Email<br />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone Number<br />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Address (optional)<br />
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </label>
          <label>
            GST No (optional)<br />
            <input
              name="gstNo"
              value={form.gstNo}
              onChange={handleChange}
            />
          </label>
          <label>
            PAN (optional)<br />
            <input
              name="pan"
              value={form.pan}
              onChange={handleChange}
            />
          </label>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}
