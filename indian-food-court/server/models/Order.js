const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  name: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  isVeg: Boolean,
});

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [orderItemSchema],
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String,
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'ready', 'dispatched', 'on_the_way', 'delivered', 'cancelled'],
    default: 'placed',
  },
  paymentMethod: { type: String, enum: ['cod', 'online', 'upi'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  estimatedDelivery: Date,
  actualDelivery: Date,
  specialInstructions: String,
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
  rating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
