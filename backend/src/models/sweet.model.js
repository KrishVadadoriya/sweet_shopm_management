const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sweet name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Sweet category is required'],
      enum: {
        values: ['Chocolate', 'Candy', 'Pastry', 'Nut-Based', 'Milk-Based'],
        message: '{VALUE} is not a valid category',
      },
    },
    price: {
      type: Number,
      required: [true, 'Sweet price is required'],
      min: [0.01, 'Price must be greater than 0'],
    },
    quantity: {
      type: Number,
      required: [true, 'Sweet quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Sweet = mongoose.model('Sweet', sweetSchema);

module.exports = Sweet;