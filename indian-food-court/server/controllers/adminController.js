const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const Review = require('../models/Review');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalRestaurants, totalOrders, totalFoodItems, totalReviews] = await Promise.all([
      User.countDocuments(),
      Restaurant.countDocuments(),
      Order.countDocuments(),
      FoodItem.countDocuments(),
      Review.countDocuments(),
    ]);

    const revenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const topRestaurants = await Restaurant.find()
      .sort({ rating: -1 })
      .limit(5)
      .select('name rating totalReviews');

    res.json({
      stats: {
        totalUsers,
        totalRestaurants,
        totalOrders,
        totalFoodItems,
        totalReviews,
        totalRevenue: revenue[0]?.total || 0,
      },
      recentOrders,
      ordersByStatus,
      topRestaurants,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('customer', 'name email')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleRestaurantStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    restaurant.isActive = !restaurant.isActive;
    await restaurant.save();
    res.json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
