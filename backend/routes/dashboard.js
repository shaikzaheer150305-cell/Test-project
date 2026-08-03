const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getStats } = require('../controllers/dashboardController');

router.use(protect);

router.get('/stats', getStats);

module.exports = router;
