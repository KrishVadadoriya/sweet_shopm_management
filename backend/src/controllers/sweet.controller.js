const Sweet = require('../models/sweet.model');

// @desc    Create a new sweet
// @route   POST /sweets
// @access  Public
const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity
    });

    res.status(201).json(sweet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all sweets
// @route   GET /sweets
// @access  Public
const getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find({});
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a sweet by ID
// @route   GET /sweets/:id
// @access  Public
const getSweetById = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    
    res.status(200).json(sweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search sweets by name, category, or price range
// @route   GET /sweets/search
// @access  Public
const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    const sweets = await Sweet.find(query);
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a sweet
// @route   DELETE /sweets/:id
// @access  Public
const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    
    await sweet.deleteOne();
    res.status(200).json({ message: 'Sweet removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Purchase a sweet (reduce quantity)
// @route   POST /sweets/:id/purchase
// @access  Public
const purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Please provide a valid quantity' });
    }
    
    if (sweet.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    sweet.quantity -= quantity;
    const updatedSweet = await sweet.save();
    
    res.status(200).json(updatedSweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Restock a sweet (increase quantity)
// @route   POST /sweets/:id/restock
// @access  Public
const restockSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Please provide a valid quantity' });
    }
    
    sweet.quantity += quantity;
    const updatedSweet = await sweet.save();
    
    res.status(200).json(updatedSweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSweet,
  getSweets,
  getSweetById,
  searchSweets,
  deleteSweet,
  purchaseSweet,
  restockSweet
};