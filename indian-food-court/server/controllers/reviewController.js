const Review = require('../models/Review');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

exports.createReview = async (req, res) => {
  try {
    const { restaurantId, foodItemId, orderId, rating, comment } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only review delivered orders' });
    }

    const existingReview = await Review.findOne({ customer: req.user._id, order: orderId });
    if (existingReview) return res.status(400).json({ message: 'Already reviewed this order' });

    const review = await Review.create({
      customer: req.user._id,
      restaurant: restaurantId,
      foodItem: foodItemId || undefined,
      order: orderId,
      rating,
      comment,
    });

    // Update restaurant average rating
    const allReviews = await Review.find({ restaurant: restaurantId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length,
    });

    // Update food item rating if provided
    if (foodItemId) {
      const itemReviews = await Review.find({ foodItem: foodItemId });
      const itemAvg = itemReviews.reduce((sum, r) => sum + r.rating, 0) / itemReviews.length;
      await FoodItem.findByIdAndUpdate(foodItemId, { rating: Math.round(itemAvg * 10) / 10 });
    }

    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate('customer', 'name avatar')
      .populate('foodItem', 'name')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.replyToReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const restaurant = await Restaurant.findById(review.restaurant);
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review.reply = req.body.reply;
    review.replyAt = new Date();
    await review.save();
    res.json({ review });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
