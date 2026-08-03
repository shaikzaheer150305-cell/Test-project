const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

exports.placeOrder = async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod, specialInstructions } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const foodItem = await FoodItem.findById(item.foodItemId);
      if (!foodItem) return res.status(404).json({ message: `Food item not found: ${item.foodItemId}` });
      const price = foodItem.discountedPrice || foodItem.price;
      subtotal += price * item.quantity;
      orderItems.push({
        foodItem: foodItem._id,
        name: foodItem.name,
        quantity: item.quantity,
        price,
        isVeg: foodItem.isVeg,
      });
    }

    const deliveryCharge = subtotal > 500 ? 0 : 40;
    const tax = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + deliveryCharge + tax;

    const estimatedDelivery = new Date(Date.now() + (restaurant.averageDeliveryTime + 15) * 60000);

    const order = await Order.create({
      customer: req.user._id,
      restaurant: restaurantId,
      items: orderItems,
      deliveryAddress,
      paymentMethod,
      totalAmount,
      subtotal,
      deliveryCharge,
      tax,
      estimatedDelivery,
      specialInstructions,
      statusHistory: [{ status: 'placed', updatedBy: req.user._id }],
    });

    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('restaurant', 'name image')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name image phone address')
      .populate('customer', 'name phone')
      .populate('deliveryPartner', 'name phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({
      status,
      updatedBy: req.user._id,
      timestamp: new Date(),
    });

    if (status === 'dispatched') {
      order.deliveryPartner = req.user._id;
    }
    if (status === 'delivered') {
      order.actualDelivery = new Date();
      order.paymentStatus = order.paymentMethod === 'cod' ? 'pending' : 'paid';
    }

    await order.save();
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRestaurantOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { restaurant: req.params.restaurantId };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('customer', 'name phone')
      .populate('deliveryPartner', 'name phone')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { deliveryPartner: req.user._id, status: { $in: ['dispatched', 'on_the_way'] } },
        { status: 'ready' },
      ],
    })
      .populate('restaurant', 'name phone address')
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!['placed', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel order at this stage' });
    }
    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', updatedBy: req.user._id });
    if (order.paymentMethod !== 'cod') order.paymentStatus = 'refunded';
    await order.save();
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
