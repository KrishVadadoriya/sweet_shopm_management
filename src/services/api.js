import axios from 'axios';

const API_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
});

export const sweetService = {
  // Get all sweets
  getSweets: async () => {
    try {
      const response = await api.get('/sweets');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a sweet by ID
  getSweetById: async (id) => {
    try {
      const response = await api.get(`/sweets/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new sweet
  createSweet: async (sweetData) => {
    try {
      const response = await api.post('/sweets', sweetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a sweet
  deleteSweet: async (id) => {
    try {
      const response = await api.delete(`/sweets/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Purchase a sweet
  purchaseSweet: async (id, quantity) => {
    try {
      const response = await api.post(`/sweets/${id}/purchase`, { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Restock a sweet
  restockSweet: async (id, quantity) => {
    try {
      const response = await api.post(`/sweets/${id}/restock`, { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search sweets
  searchSweets: async (params) => {
    try {
      const response = await api.get('/sweets/search', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};