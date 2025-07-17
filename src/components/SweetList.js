import React, { useState, useEffect } from 'react';
import { sweetService } from '../services/api';
import SweetCard from './SweetCard';
import '../assets/SweetList.css';

const SweetList = ({ onSweetSelect, refreshTrigger }) => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('name-asc');
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  // Fetch sweets on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchSweets();
  }, [refreshTrigger]);

  // Fetch all sweets
  const fetchSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetService.getSweets();
      setSweets(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sweets. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Filter out empty search params
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      );
      
      if (Object.keys(filteredParams).length === 0) {
        // If no search params, fetch all sweets
        await fetchSweets();
      } else {
        // Otherwise, search with params
        const data = await sweetService.searchSweets(filteredParams);
        setSweets(data);
      }
      setError(null);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Sort sweets based on selected option
  const sortedSweets = [...sweets].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'quantity-asc':
        return a.quantity - b.quantity;
      case 'quantity-desc':
        return b.quantity - a.quantity;
      default:
        return 0;
    }
  });

  // Reset search
  const handleResetSearch = () => {
    setSearchParams({
      name: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    });
    fetchSweets();
  };

  return (
    <div className="sweet-list-container">
      <div className="sweet-list-header">
        <h2>Sweet Inventory</h2>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-inputs">
            <div className="search-group">
              <input
                type="text"
                name="name"
                placeholder="Search by name"
                value={searchParams.name}
                onChange={handleSearchInputChange}
              />
            </div>
            
            <div className="search-group">
              <select
                name="category"
                value={searchParams.category}
                onChange={handleSearchInputChange}
              >
                <option value="">All Categories</option>
                <option value="Chocolate">Chocolate</option>
                <option value="Candy">Candy</option>
                <option value="Pastry">Pastry</option>
                <option value="Nut-Based">Nut-Based</option>
                <option value="Milk-Based">Milk-Based</option>
              </select>
            </div>
            
            <div className="search-group price-range">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={searchParams.minPrice}
                onChange={handleSearchInputChange}
                min="0"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={searchParams.maxPrice}
                onChange={handleSearchInputChange}
                min="0"
              />
            </div>
          </div>
          
          <div className="search-buttons">
            <button type="submit" className="search-btn">Search</button>
            <button type="button" onClick={handleResetSearch} className="reset-btn">Reset</button>
          </div>
        </form>
        
        {/* Sort Options */}
        <div className="sort-container">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="quantity-asc">Quantity (Low to High)</option>
            <option value="quantity-desc">Quantity (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading Indicator */}
      {loading ? (
        <div className="loading">Loading sweets...</div>
      ) : (
        <div className="sweet-cards">
          {sortedSweets.length > 0 ? (
            sortedSweets.map((sweet) => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onClick={() => onSweetSelect(sweet)}
              />
            ))
          ) : (
            <div className="no-sweets">No sweets found. Try a different search or add some sweets!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SweetList;