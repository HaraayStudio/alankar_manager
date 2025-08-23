import React, { useState, useEffect } from "react";
import styles from "./AddNewClientPopup.module.scss";
import { useData } from "../../context/DataContext";

export default function AddNewClientPopup({ open, onClose, onSuccess }) {
  const { handleCreateClient } = useData();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pan: "",
    gstcertificate: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  // Reset form when popup opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        pan: "",
        gstcertificate: "",
      });
      setMessage("");
    }
  }, [open]);

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await handleCreateClient(formData);
      console.log(formData);
      
      setMessage("✅ Client created successfully!");
      setFormData({ 
        name: "", 
        email: "", 
        phone: "", 
        address: "", 
        pan: "",
        gstcertificate: "",
      });
      
      // Close popup after success
      setTimeout(() => {
        handleClose();
        if (onSuccess) onSuccess();
      }, 1500);
      
    } catch (error) {
      setMessage("❌ Failed to create client.");
    } finally {
      setLoading(false);
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
      onClick={handleOverlayClick}
    >
      <div className={`${styles.popupContent} ${isClosing ? styles.closing : ''}`}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>Add New Client</h2>
            <p className={styles.subtitle}>Create a new client profile</p>
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

        <div className={styles.formDiv}>
          <form className={styles.formGrid} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label} htmlFor="name">
                  Name <span>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  autoFocus
                  disabled={loading}
                />
              </div>
              <div className={styles.col}>
                <label className={styles.label} htmlFor="email">
                  Email <span>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  disabled={loading}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label} htmlFor="phone">
                  Phone <span>*</span>
                </label>
                <input 
                  maxLength={10}
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone Number"
                  disabled={loading}
                />
              </div>
              <div className={styles.col}>
                <label htmlFor="address">Address (optional)</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.col}>
                <label htmlFor="gstcertificate">GST No (optional)</label>
                <input
                  type="text"
                  name="gstcertificate"
                  value={formData.gstcertificate}
                  onChange={handleChange}
                  placeholder="GST Certificate"
                  disabled={loading}
                />
              </div>
              <div className={styles.col}>
                <label htmlFor="pan">PAN (optional)</label>
                <input
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="PAN Number"
                  disabled={loading}
                />
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
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Client"}
              </button>
            </div>
          </form>

          {message && (
            <div
              className={styles.message}
              style={{ color: message.includes("✅") ? "#14b554" : "#e32a2a" }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}