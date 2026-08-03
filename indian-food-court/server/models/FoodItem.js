const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  discountedPrice: { type: Number, min: 0 },
  image: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    enum: [
      'Starters', 'Main Course', 'Breads', 'Rice', 'Biryani',
      'South Indian', 'Snacks', 'Desserts', 'Beverages',
      'Thali', 'Combos', 'Street Food', 'Appetizers', 'Curry',
    ],
  },
  isVeg: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  tags: [String],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  preparationTime: { type: Number, default: 15 },
  isBestseller: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);
