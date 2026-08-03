const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id });
    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const { cuisine, search, sortBy = 'rating' } = req.query;
    const query = { isActive: true, isOpen: true };

    if (cuisine) query.cuisine = { $in: cuisine.split(',') };
    if (search) query.name = { $regex: search, $options: 'i' };

    const sortOptions = {};
    if (sortBy === 'rating') sortOptions.rating = -1;
    else if (sortBy === 'delivery_time') sortOptions.averageDeliveryTime = 1;
    else if (sortBy === 'newest') sortOptions.createdAt = -1;

    const restaurants = await Restaurant.find(query).sort(sortOptions);
    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const foodItems = await FoodItem.find({ restaurant: restaurant._id, isAvailable: true });
    res.json({ restaurant, foodItems });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleOpen = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();
    res.json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Food Items
exports.createFoodItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const foodItem = await FoodItem.create(req.body);
    res.status(201).json({ foodItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) return res.status(404).json({ message: 'Food item not found' });

    const restaurant = await Restaurant.findById(foodItem.restaurant);
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(foodItem, req.body);
    await foodItem.save();
    res.json({ foodItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) return res.status(404).json({ message: 'Food item not found' });

    const restaurant = await Restaurant.findById(foodItem.restaurant);
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await foodItem.deleteOne();
    res.json({ message: 'Food item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRestaurantFoodItems = async (req, res) => {
  try {
    const { category, vegOnly, sortBy } = req.query;
    const query = { restaurant: req.params.restaurantId, isAvailable: true };

    if (category) query.category = category;
    if (vegOnly === 'true') query.isVeg = true;

    const sortOptions = {};
    if (sortBy === 'price_low') sortOptions.price = 1;
    else if (sortBy === 'price_high') sortOptions.price = -1;
    else if (sortBy === 'rating') sortOptions.rating = -1;
    else if (sortBy === 'bestseller') sortOptions.isBestseller = -1;

    const items = await FoodItem.find(query).sort(sortOptions);
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchFoodItems = async (req, res) => {
  try {
    const { q } = req.query;
    const items = await FoodItem.find({
      isAvailable: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ],
    }).populate('restaurant', 'name image').limit(20);
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
