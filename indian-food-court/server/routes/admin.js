const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getAllUsers, toggleUserStatus,
  getAllOrders, getAllRestaurants, toggleRestaurantStatus,
} = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.get('/orders', getAllOrders);
router.get('/restaurants', getAllRestaurants);
router.put('/restaurants/:id/toggle', toggleRestaurantStatus);

module.exports = router;
