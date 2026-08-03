const express = require('express');
const router = express.Router();
const {
  placeOrder, getMyOrders, getOrderById, updateOrderStatus,
  getRestaurantOrders, getDeliveryOrders, cancelOrder,
} = require('../controllers/orderController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('customer'), placeOrder);
router.get('/my', auth, getMyOrders);
router.get('/restaurant/:restaurantId', auth, authorize('vendor'), getRestaurantOrders);
router.get('/delivery', auth, authorize('delivery'), getDeliveryOrders);
router.get('/:id', auth, getOrderById);
router.put('/:id/status', auth, updateOrderStatus);
router.put('/:id/cancel', auth, cancelOrder);

module.exports = router;
