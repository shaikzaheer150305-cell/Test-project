const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  cuisine: { type: [String], required: true },
  image: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  phone: { type: String, required: true },
  openingTime: { type: String, default: '09:00' },
  closingTime: { type: String, default: '22:00' },
  isOpen: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  averageDeliveryTime: { type: Number, default: 30 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
