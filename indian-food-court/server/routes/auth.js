const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, getDeliveryPartners } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/delivery-partners', auth, getDeliveryPartners);

module.exports = router;
