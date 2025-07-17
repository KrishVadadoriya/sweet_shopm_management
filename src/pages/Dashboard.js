import React, { useState } from 'react';
import SweetList from '../components/SweetList';
import SweetForm from '../components/SweetForm';
import SweetDetail from '../components/SweetDetail';
import '../assets/Dashboard.css';

const Dashboard = () => {
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handle sweet selection for viewing details
  const handleSweetSelect = (sweet) => {
    setSelectedSweet(sweet);
    setShowAddForm(false);
  };

  // Handle closing the detail view
  const handleCloseDetail = () => {
    setSelectedSweet(null);
  };

  // Handle showing the add form
  const handleShowAddForm = () => {
    setShowAddForm(true);
    setSelectedSweet(null);
  };

  // Handle canceling the add form
  const handleCancelAddForm = () => {
    setShowAddForm(false);
  };

  // Handle sweet added/updated/deleted to refresh the list
  const handleSweetChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Sweet Shop Management</h1>
        <button onClick={handleShowAddForm} className="add-sweet-btn">
          Add New Sweet
        </button>
      </div>

      <div className="dashboard-content">
        <div className="sweet-list-section">
          <SweetList
            onSweetSelect={handleSweetSelect}
            refreshTrigger={refreshTrigger}
          />
        </div>

        <div className="sweet-detail-section">
          {showAddForm ? (
            <SweetForm
              onSweetAdded={handleSweetChange}
              onCancel={handleCancelAddForm}
            />
          ) : selectedSweet ? (
            <SweetDetail
              sweet={selectedSweet}
              onClose={handleCloseDetail}
              onSweetUpdated={handleSweetChange}
              onSweetDeleted={handleSweetChange}
            />
          ) : (
            <div className="no-selection-message">
              <h2>Sweet Shop Dashboard</h2>
              <p>Select a sweet from the list to view details or click "Add New Sweet" to create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;