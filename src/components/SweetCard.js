import React from 'react';
import '../assets/SweetCard.css';

const SweetCard = ({ sweet, onClick }) => {
  // Determine stock status class
  const getStockStatusClass = (quantity) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 10) return 'low-stock';
    return 'in-stock';
  };

  return (
    <div className="sweet-card" onClick={onClick}>
      <div className="sweet-card-content">
        <h3 className="sweet-name">{sweet.name}</h3>
        <div className="sweet-category">{sweet.category}</div>
        <div className="sweet-price">₹{sweet.price.toFixed(2)}</div>
        <div className={`sweet-quantity ${getStockStatusClass(sweet.quantity)}`}>
          {sweet.quantity === 0
            ? 'Out of Stock'
            : sweet.quantity < 10
            ? `Low Stock: ₹${sweet.quantity} left`
            : `In Stock: ₹${sweet.quantity}`}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;