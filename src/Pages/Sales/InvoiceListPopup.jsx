import React, { useState, useEffect } from "react";
import styles from "./InvoiceList.module.scss";
import InvoicePreview from "./InvoicePreview";
import { 
  X, 
  Eye, 
  Plus, 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Receipt,
  Calendar,
  DollarSign,
  User,
  Building,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useData } from "../../context/DataContext"; // Use your DataContext

const InvoiceManagementPopup = ({ open, postsale, onClose, onInvoiceAdded }) => {
  const { handleCreateInvoice, handleCreateNGInvoice, loading } = useData();
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [invoiceType, setInvoiceType] = useState("GST");
  const [activeTab, setActiveTab] = useState("list");
  const [localLoading, setLocalLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    items: [],
    subtotal: 0,
    gst: 18,
    total: 0,
    notes: "",
    terms: "Payment due within 30 days"
  });

  // Initialize invoice data with postsale information
  useEffect(() => {
    if (postsale) {
      setInvoiceData(prev => ({
        ...prev,
        clientName: postsale.client?.name || "",
        clientEmail: postsale.client?.email || "",
        clientPhone: postsale.client?.phone || "",
        clientAddress: postsale.client?.address || "",
        items: postsale.orders?.map((order, index) => ({
          id: order.id || index,
          description: order.description || `${order.orderType} - ${order.printType}`,
          quantity: order.qty || 1,
          rate: order.unitPrice || 0,
          amount: order.totalAmount || 0
        })) || []
      }));
    }
  }, [postsale]);

  // Calculate totals
  useEffect(() => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const gstAmount = (subtotal * invoiceData.gst) / 100;
    const total = subtotal + gstAmount;
    
    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      total
    }));
  }, [invoiceData.items, invoiceData.gst]);

  // Normalize invoices to array
  let invoicesRaw = postsale?.invoices || postsale?.invoice || [];
  let invoices = [];
  if (Array.isArray(invoicesRaw)) {
    invoices = invoicesRaw;
  } else if (invoicesRaw && typeof invoicesRaw === "object") {
    invoices = [invoicesRaw];
  }

  // Format date
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "-";

  // Handle create invoice API call - FIXED
  const handleCreateInvoiceClick = async () => {
    setLocalLoading(true);
    try {
      const postSaleSrNumber = postsale.srNumber;

      let result;
      if (invoiceType === "GST") {
        result = await handleCreateInvoice(postSaleSrNumber);
      } else {
        result = await handleCreateNGInvoice(postSaleSrNumber);
      }

      // Check if successful
      if (result) {
        setActiveTab("list");
        if (onInvoiceAdded) onInvoiceAdded();
      } 
      window.location.reload();
    } catch (error) {
      console.error("Create invoice error:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  // Update invoice item
  const updateInvoiceItem = (index, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Add new item
  const addInvoiceItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: Date.now(),
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0
      }]
    }));
  };

  // Remove item
  const removeInvoiceItem = (index) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <FileText size={24} className={styles.headerIcon} />
            <div className={styles.headerText}>
              <h2>Invoice Management</h2>
              <p>Order #{postsale.srNumber} - {postsale.client?.name}</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tab} ${activeTab === "list" ? styles.active : ""}`}
            onClick={() => setActiveTab("list")}
          >
            <Receipt size={16} />
            Invoice List
            <span className={styles.badge}>{invoices.length}</span>
          </button>
        </div>

        <div className={styles.modalBody}>
          {activeTab === "list" && (
            <div className={styles.listTab}>
              {/* Only show invoice creation options if no invoices exist */}
              {invoices.length === 0 && (
                <>
                  {/* Invoice Type Selection */}
                  <div className={styles.invoiceTypeSection}>
                    <h3>Invoice Type</h3>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="invoiceType"
                          value="GST"
                          checked={invoiceType === "GST"}
                          onChange={() => setInvoiceType("GST")}
                          disabled={localLoading || loading}
                        />
                        <span className={styles.radioCustom}></span>
                        GST Invoice
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="invoiceType"
                          value="NON-GST"
                          checked={invoiceType === "NON-GST"}
                          onChange={() => setInvoiceType("NON-GST")}
                          disabled={localLoading || loading}
                        />
                        <span className={styles.radioCustom}></span>
                        Non-GST Invoice
                      </label>
                    </div>
                  </div>

                  {/* Quick Create Button */}
                  <div className={styles.quickCreateSection}>
                    <button
                      className={styles.createInvoiceBtn}
                      onClick={handleCreateInvoiceClick}
                      disabled={localLoading || loading}
                    >
                      <Plus size={16} />
                      {localLoading || loading
                        ? `Creating ${invoiceType} Invoice...`
                        : `Create ${invoiceType} Invoice`}
                    </button>
                  </div>
                </>
              )}

              {/* Show existing invoices info if they exist */}
              {invoices.length > 0 && (
                <div className={styles.existingInvoicesInfo}>
                  <div className={styles.infoHeader}>
                    <Receipt size={20} />
                    <h3>Invoices Generated</h3>
                  </div>
                  <p>This order already has {invoices.length} invoice{invoices.length > 1 ? 's' : ''} generated. You can view, download, or send them below.</p>
                </div>
              )}

              {/* Invoices Table */}
              {invoices.length === 0 ? (
                <div className={styles.emptyState}>
                  <FileText size={48} className={styles.emptyIcon} />
                  <h3>No Invoices Found</h3>
                  <p>Create your first invoice to get started</p>
                </div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.invoiceTable}>
                    <thead>
                      <tr>
                        <th>Invoice No.</th>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Amount (No GST)</th>
                        <th>GST %</th>
                        <th>Total (With GST)</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv, idx) => (
                        <tr key={inv.invoiceNumber || idx}>
                          <td>
                            <div className={styles.invoiceNumber}>
                              <Receipt size={16} />
                              {inv.invoiceNumber || `INV-${idx + 1}`}
                            </div>
                          </td>
                          <td>
                            <div className={styles.dateCell}>
                              <Calendar size={14} />
                              {formatDate(inv.issueDate)}
                            </div>
                          </td>
                          <td>
                            <div className={styles.clientCell}>
                              <User size={14} />
                              {inv.clientName || "-"}
                            </div>
                          </td>
                          <td>
                            <div className={styles.amountCell}>
                              <DollarSign size={14} />
                              ₹{typeof inv.totalAmount === "number"
                                ? inv.totalAmount.toLocaleString()
                                : "-"}
                            </div>
                          </td>
                          <td>
                            <span className={styles.gstBadge}>
                              {inv.gST ?? "-"}%
                            </span>
                          </td>
                          <td>
                            <div className={styles.totalCell}>
                              <strong>
                                ₹{typeof inv.totalAmountWithGST === "number"
                                  ? inv.totalAmountWithGST.toLocaleString()
                                  : "-"}
                              </strong>
                            </div>
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button
                                className={`${styles.actionBtn} ${styles.viewBtn}`}
                                onClick={() => setPreviewInvoice({ ...postsale, invoice: inv })}
                                title="View Invoice"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                className={`${styles.actionBtn} ${styles.downloadBtn}`}
                                title="Download Invoice"
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Invoice Preview Modal */}
        {previewInvoice && (
          <InvoicePreview
            postsale={previewInvoice}
            onClose={() => setPreviewInvoice(null)}
          />
        )}
      </div>
    </div>
  );
};

export default InvoiceManagementPopup;