import React, { useState, useRef } from "react";
import { X, Plus, Trash2, Eye, Upload, AlertCircle, Check } from "lucide-react";
import styles from "./ImageManagementPopup.module.scss";
import api from "../../api/axiosConfig";

const ImageManagementPopup = ({
  isOpen,
  onClose,
  order,
  onImagesUpdated
}) => {
  const [images, setImages] = useState(order?.images || []);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingImageUrl, setDeletingImageUrl] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      uploadImages(files);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImages = async (files) => {
    if (!order?.id) {
      setUploadResult({ success: false, message: "Order ID is required" });
      return;
    }

    try {
      setIsUploading(true);
      setUploadResult(null);

      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const token = sessionStorage.getItem('token');
      
      console.log('🖼️ Uploading images for order:', order.id);
      
      const response = await api.post(`/orders/addimagesinorder?orderid=${order.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      // Update local images state with new images
      const updatedOrder = response.data.data;
      const newImages = updatedOrder.images || [];
      setImages(newImages);

      setUploadResult({ 
        success: true, 
        message: `${files.length} image(s) uploaded successfully!` 
      });

      // Notify parent component
      if (onImagesUpdated) {
        onImagesUpdated(newImages);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setUploadResult(null), 3000);

    } catch (error) {
      console.error('❌ Error uploading images:', error);
      
      let errorMessage = "Failed to upload images";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setUploadResult({ 
        success: false, 
        message: errorMessage
      });

      // Clear error message after 5 seconds
      setTimeout(() => setUploadResult(null), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (imageUrl) => {
    try {
      setDeletingImageUrl(imageUrl);
      
      const token = sessionStorage.getItem('token');
      
      console.log('🗑️ Deleting image:', imageUrl);
      
      await api.delete(`/orders/deleteimage?imageUrl=${encodeURIComponent(imageUrl)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update local images state
      const updatedImages = images.filter(img => img.imageUrl !== imageUrl);
      setImages(updatedImages);

      setUploadResult({ 
        success: true, 
        message: "Image deleted successfully!" 
      });

      // Notify parent component
      if (onImagesUpdated) {
        onImagesUpdated(updatedImages);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setUploadResult(null), 3000);

    } catch (error) {
      console.error('❌ Error deleting image:', error);
      
      let errorMessage = "Failed to delete image";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setUploadResult({ 
        success: false, 
        message: errorMessage
      });

      // Clear error message after 5 seconds
      setTimeout(() => setUploadResult(null), 5000);
    } finally {
      setDeletingImageUrl(null);
    }
  };

  const openFullScreen = (image) => {
    setFullScreenImage(image);
  };

  const closeFullScreen = () => {
    setFullScreenImage(null);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {/* Main Image Management Popup */}
      <div className={styles.modalOverlay}>
        <div className={styles.modalBox}>
          {/* Header */}
          <div className={styles.modalHeader}>
            <h3>Manage Images - Order #{order?.id}</h3>
            <button 
              className={styles.closeBtn} 
              onClick={onClose}
              disabled={isUploading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className={styles.modalContent}>
            {/* Upload Result Message */}
            {uploadResult && (
              <div className={uploadResult.success ? styles.successMsg : styles.errorMsg}>
                {uploadResult.success ? <Check size={16} /> : <AlertCircle size={16} />}
                {uploadResult.message}
              </div>
            )}

            {/* Images Grid */}
            <div className={styles.imagesGrid}>
              {/* Existing Images */}
              {images.map((image, index) => (
                <div key={`${image.id || index}-${image.imageUrl}`} className={styles.imageCard}>
                  <div className={styles.imageContainer}>
                    <img 
                      src={image.imageUrl} 
                      alt={`Order image ${index + 1}`}
                      className={styles.image}
                      onClick={() => openFullScreen(image)}
                    />
                    
                    {/* Image Actions */}
                    <div className={styles.imageActions}>
                      <button
                        className={styles.viewBtn}
                        onClick={() => openFullScreen(image)}
                        title="View full screen"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => deleteImage(image.imageUrl)}
                        disabled={deletingImageUrl === image.imageUrl}
                        title="Delete image"
                      >
                        {deletingImageUrl === image.imageUrl ? (
                          <AlertCircle size={14} />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Image Card */}
              <div className={styles.addImageCard}>
                <button
                  className={styles.addImageBtn}
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  title="Add new images"
                >
                  {isUploading ? (
                    <AlertCircle size={24} />
                  ) : (
                    <Plus size={24} />
                  )}
                  <span>Add Images</span>
                  {isUploading && <span>Uploading...</span>}
                </button>
              </div>
            </div>

            {/* Empty State */}
            {images.length === 0 && !isUploading && (
              <div className={styles.emptyState}>
                <Upload size={48} />
                <p>No images uploaded yet</p>
                <button
                  className={styles.uploadBtn}
                  onClick={triggerFileInput}
                >
                  <Plus size={16} />
                  Upload First Image
                </button>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className={styles.hiddenFileInput}
            />
          </div>

          {/* Footer */}
          <div className={styles.modalFooter}>
            <div className={styles.imageCount}>
              Total Images: {images.length}
            </div>
            <button 
              className={styles.doneBtn} 
              onClick={onClose}
              disabled={isUploading}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div className={styles.fullScreenOverlay} onClick={closeFullScreen}>
          <div className={styles.fullScreenModal}>
            <button 
              className={styles.fullScreenCloseBtn} 
              onClick={closeFullScreen}
            >
              <X size={24} />
            </button>
            <img 
              src={fullScreenImage.imageUrl} 
              alt="Full screen view"
              className={styles.fullScreenImage}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageManagementPopup;