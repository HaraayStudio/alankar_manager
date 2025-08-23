// // src/components/EditClientPopup.jsx
// import React, { useState } from "react";
// import styles from "./EditClientPopup.module.scss";

// export default function EditClientPopup({ open, onClose, client, onSubmit, loading }) {
//   const [form, setForm] = useState({
//     name: client?.name || "",
//     email: client?.email || "",
//     phone: client?.phone || "",
//     address: client?.address || "",
//     gstcertificate: client?.gstcertificate || "",
//     pan: client?.pan || "",
//   });

//   // If client changes (switch between edits), update form fields
//   React.useEffect(() => {
//     setForm({
//       name: client?.name || "",
//       email: client?.email || "",
//       phone: client?.phone || "",
//       address: client?.address || "",
//       gstcertificate: client?.gstcertificate || "",
//       pan: client?.pan || "",
//     });
//   }, [client]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(form);
//   };

//   if (!open) return null;

//   return (
//     <div className={styles.popupOverlay}>
//       <div className={styles.popupContent}>
//         <div className={styles.header}>
//           <div className={styles.title}>Edit Client</div>
//           <button className={styles.closeBtn} onClick={onClose}>&times;</button>
//         </div>
//         <form className={styles.form} onSubmit={handleSubmit}>
//           <label>
//             Full Name*<br />
//             <input
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               required
//               autoFocus
//             />
//           </label>
//           <label>
//             Email<br />
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               required
//             />
//           </label>
//           <label>
//             Phone Number<br />
//             <input maxLength={10}
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//               required
//             />
//           </label>
//           <label>
//             Address (optional)<br />
//             <input
//               name="address"
//               value={form.address}
//               onChange={handleChange}
//             />
//           </label>
//           <label>
//             GST No (optional)<br />
//             <input
//               name="gstcertificate"
//               value={form.gstcertificate}
//               onChange={handleChange}
//             />
//           </label>
//           <label>
//             PAN (optional)<br />
//             <input
//               name="pan"
//               value={form.pan}
//               onChange={handleChange}
//             />
//           </label>
//           <button
//             type="submit"
//             className={styles.saveBtn}
//             disabled={loading}
//           >
//             {loading ? "Updating..." : "Update"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
// src/components/EditClientPopup.jsx
import React, { useState, useEffect } from "react";
import styles from "./EditClientPopup.module.scss";

export default function EditClientPopup({ open, onClose, client, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    address: client?.address || "",
    gstcertificate: client?.gstcertificate || "",
    pan: client?.pan || "",
  });

  const [errors, setErrors] = useState({});
  const [isClosing, setIsClosing] = useState(false);

  // If client changes (switch between edits), update form fields
  useEffect(() => {
    setForm({
      name: client?.name || "",
      email: client?.email || "",
      phone: client?.phone || "",
      address: client?.address || "",
      gstcertificate: client?.gstcertificate || "",
      pan: client?.pan || "",
    });
    setErrors({});
  }, [client]);

  // Handle ESC key to close popup
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
    // if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Phone must be 10 digits";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(form);
    }
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing while loading
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!open && !isClosing) return null;

  return (
    <div 
      className={`${styles.popupOverlay} ${isClosing ? styles.closing : ''}`}
      // onClick={handleOverlayClick}
    >
      <div className={`${styles.popupContent} ${isClosing ? styles.closing : ''}`}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>Edit Client</h2>
            <p className={styles.subtitle}>Update client information</p>
          </div>
          <button 
            className={styles.closeBtn} 
            onClick={handleClose}
            disabled={loading}
            type="button"
            aria-label="Close popup"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Full Name *
            </label>
            <div className={styles.inputWrapper}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Enter full name"
                autoFocus
                disabled={loading}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Email Address *
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="Enter email address"
                disabled={loading}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Phone Number *
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                placeholder="Enter 10-digit phone number"
                disabled={loading}
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Address
            </label>
            <div className={styles.inputWrapper}>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Enter address (optional)"
                rows="3"
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                GST Number
              </label>
              <div className={styles.inputWrapper}>
                <input
                  name="gstcertificate"
                  value={form.gstcertificate}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="GST Number (optional)"
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                PAN Number
              </label>
              <div className={styles.inputWrapper}>
                <input
                  name="pan"
                  value={form.pan}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="PAN Number (optional)"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Updating...
                </>
              ) : (
                "Update Client"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}