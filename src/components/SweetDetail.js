import React, { use, useEffect, useState } from 'react';
import { sweetService } from '../services/api';
import '../assets/SweetDetail.css';

const SweetDetail = ({ sweet, onClose, onSweetUpdated, onSweetDeleted }) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [restockQuantity, setRestockQuantity] = useState(10);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [qua,setQua]=useState(sweet.quantity);

  

  const handlePurchase = async () => {
    if (purchaseQuantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (purchaseQuantity > sweet.quantity) {
      setError('Not enough stock available');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const updatedSweet = await sweetService.purchaseSweet(sweet._id, purchaseQuantity);
      setQua(updatedSweet.quantity);
      setSuccess(`Successfully purchased ${purchaseQuantity} ${sweet.name}(s)`);
      setPurchaseQuantity(1);

      // Notify parent component
      if (onSweetUpdated) {
        onSweetUpdated(updatedSweet);
      }
    } catch (err) {
      setError(err.message || 'Failed to purchase. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle restock
  const handleRestock = async () => {
    if (restockQuantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const updatedSweet = await sweetService.restockSweet(sweet._id, restockQuantity);
      setQua(updatedSweet.quantity);
      setSuccess(`Successfully restocked ${restockQuantity} ${sweet.name}(s)`);
      setRestockQuantity(10);

      // Notify parent component
      if (onSweetUpdated) {
        onSweetUpdated(updatedSweet);
      }
    } catch (err) {
      setError(err.message || 'Failed to restock. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await sweetService.deleteSweet(sweet._id);
      setSuccess(`${sweet.name} has been deleted`);

      // Notify parent component
      if (onSweetDeleted) {
        onSweetDeleted(sweet._id);
      }

      // Close the detail view after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to delete. Please try again.');
      console.error(err);
      setShowConfirmDelete(false);
    } finally {
      setLoading(false);
    }
  };

  // Determine stock status class
  const getStockStatusClass = (quantity) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 10) return 'low-stock';
    return 'in-stock';
  };

  return (
    <div className="sweet-detail-container">
      <div className="sweet-detail-header">
        <h2>{sweet.name}</h2>
        <button onClick={onClose} className="close-btn">
          &times;
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="sweet-detail-content">
        <div className="sweet-info">
          <p><strong>Category:</strong> {sweet.category}</p>
          <p><strong>Price:</strong> ₹{sweet.price.toFixed(2)}</p>
          <p className={`sweet-quantity ${getStockStatusClass(sweet.quantity)}`}>
            <strong>Quantity:</strong> {qua}
          </p>
          <p><strong>Added:</strong> {new Date(sweet.createdAt).toLocaleDateString()}</p>
          {sweet.updatedAt !== sweet.createdAt && (
            <p><strong>Last Updated:</strong> {new Date(sweet.updatedAt).toLocaleDateString()}</p>
          )}
        </div>

        <div className="sweet-actions">
          {/* Purchase Section */}
          <div className="action-section">
            <h3>Purchase</h3>
            <div className="quantity-control">
              <input
                type="number"
                value={purchaseQuantity}
                onChange={(e) => setPurchaseQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                min="1"
                max={sweet.quantity}
                disabled={sweet.quantity === 0 || loading}
              />
              <button 
                onClick={handlePurchase} 
                disabled={sweet.quantity === 0 || loading}
                className="purchase-btn"
              >
                {loading ? 'Processing...' : 'Purchase'}
              </button>
            </div>
          </div>

          {/* Restock Section */}
          <div className="action-section">
            <h3>Restock</h3>
            <div className="quantity-control">
              <input
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                min="1"
                disabled={loading}
              />
              <button 
                onClick={handleRestock} 
                disabled={loading}
                className="restock-btn"
              >
                {loading ? 'Processing...' : 'Restock'}
              </button>
            </div>
          </div>

          {/* Delete Section */}
          <div className="action-section delete-section">
            {!showConfirmDelete ? (
              <button 
                onClick={() => setShowConfirmDelete(true)} 
                className="delete-btn"
                disabled={loading}
              >
                Delete Sweet
              </button>
            ) : (
              <div className="confirm-delete">
                <p>Are you sure you want to delete this sweet?</p>
                <div className="confirm-buttons">
                  <button 
                    onClick={handleDelete} 
                    className="confirm-btn"
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  <button 
                    onClick={() => setShowConfirmDelete(false)} 
                    className="cancel-btn"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SweetDetail;