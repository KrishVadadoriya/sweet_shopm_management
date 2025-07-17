const express = require('express');
const router = express.Router();
const {
  createSweet,
  getSweets,
  getSweetById,
  searchSweets,
  deleteSweet,
  purchaseSweet,
  restockSweet
} = require('../controllers/sweet.controller');

// Create a new sweet
router.post('/', createSweet);

// Get all sweets
router.get('/', getSweets);

// Search sweets
router.get('/search', searchSweets);

// Get a sweet by ID
router.get('/:id', getSweetById);

// Delete a sweet
router.delete('/:id', deleteSweet);

// Purchase a sweet
router.post('/:id/purchase', purchaseSweet);

// Restock a sweet
router.post('/:id/restock', restockSweet);

module.exports = router;