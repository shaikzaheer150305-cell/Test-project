const express = require('express');
const router = express.Router();
const { createReview, getRestaurantReviews, replyToReview } = require('../controllers/reviewController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('customer'), createReview);
router.get('/restaurant/:restaurantId', getRestaurantReviews);
router.put('/:id/reply', auth, authorize('vendor'), replyToReview);

module.exports = router;
