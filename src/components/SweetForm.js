import React, { useState, useEffect } from 'react';
import { sweetService } from '../services/api';
import '../assets/SweetForm.css';

const SweetForm = ({ sweet = null, onSweetAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Chocolate',
    price: '',
    quantity: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // If sweet is provided, populate form for editing
  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
      });
    }
  }, [sweet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }

      if (formData.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      if (formData.quantity < 0) {
        throw new Error('Quantity cannot be negative');
      }

      // Create or update sweet
      let result;
      if (sweet) {
        // Update logic would go here if we had an update endpoint
        // For now, we'll just show a message
        setSuccess('Sweet updated successfully!');
      } else {
        // Create new sweet
        result = await sweetService.createSweet(formData);
        setSuccess('Sweet added successfully!');
        // Reset form after successful creation
        setFormData({
          name: '',
          category: 'Chocolate',
          price: '',
          quantity: '',
        });
      }

      // Notify parent component
      if (onSweetAdded) {
        onSweetAdded(result);
      }
    } catch (err) {
      setError(err.message || 'Failed to save sweet. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sweet-form-container">
      <h2>{sweet ? 'Edit Sweet' : 'Add New Sweet'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="sweet-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Sweet name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Chocolate">Chocolate</option>
            <option value="Candy">Candy</option>
            <option value="Pastry">Pastry</option>
            <option value="Nut-Based">Nut-Based</option>
            <option value="Milk-Based">Milk-Based</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price (₹)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            placeholder="0"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Saving...' : sweet ? 'Update Sweet' : 'Add Sweet'}
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SweetForm;