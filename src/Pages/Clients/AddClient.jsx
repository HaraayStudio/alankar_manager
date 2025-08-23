import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./AddClient.module.scss";
import { useData } from "../../context/DataContext";
import HeaderLink from "../../Components/HeaderLinks";
import ContentStructure from "../../Layout/ContentStructure";
const links = [
  { to: "/clients/new", label: "Add New Client" },
  { to: "/clients/list", label: "All Clients" },
  { to: "/clients/billing", label: "GST Plans & Billing" },
];
export default function AddClient() {
  const location = useLocation();
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
      setFormData({ name: "", email: "", phone: "", address: "" });
    } catch (error) {
      setMessage("❌ Failed to create client.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <ContentStructure links={links}>
      <div className={styles.formDiv}>
         <h2 className='mainContentHeading'>Add New Client</h2>
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
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="phone">
                Phone <span>*</span>
              </label>
              <input maxLength={10}
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Phone Number"
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
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <label htmlFor="phone">GST No(optional)</label>
              <input
                type="text"
                name="gstcertificate"
                value={formData.gstcertificate}
                onChange={handleChange}
                placeholder="gstcertificate"
              />
            </div>
            <div className={styles.col}>
              <label htmlFor="address">Pan (optional)</label>
              <input
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                placeholder="pan"
              />
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create Client"}
          </button>
        </form>
        {/* {message && (
          <div
            className={styles.message}
            style={{ color: message.includes("✅") ? "#14b554" : "#e32a2a" }}
          >
            {message}
          </div>
        )} */}
      </div>
    </ContentStructure>
  );
}
