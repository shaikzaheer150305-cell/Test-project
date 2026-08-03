const express = require('express');
const router = express.Router();
const {
  createRestaurant, getMyRestaurants, getAllRestaurants, getRestaurantById,
  updateRestaurant, toggleOpen, createFoodItem, updateFoodItem,
  deleteFoodItem, getRestaurantFoodItems, searchFoodItems,
} = require('../controllers/restaurantController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', getAllRestaurants);
router.get('/search', searchFoodItems);
router.get('/my', auth, authorize('vendor'), getMyRestaurants);
router.post('/', auth, authorize('vendor'), createRestaurant);
router.get('/:id', getRestaurantById);
router.put('/:id', auth, authorize('vendor'), updateRestaurant);
router.put('/:id/toggle-open', auth, authorize('vendor'), toggleOpen);

router.get('/:restaurantId/items', getRestaurantFoodItems);
router.post('/items', auth, authorize('vendor'), createFoodItem);
router.put('/items/:id', auth, authorize('vendor'), updateFoodItem);
router.delete('/items/:id', auth, authorize('vendor'), deleteFoodItem);

module.exports = router;
