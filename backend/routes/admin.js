const express = require('express');
const router = express.Router();
const { getDashboardStats, updateBookingStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getDashboardStats);
router.put('/bookings/:id', protect, adminOnly, updateBookingStatus);

module.exports = router;
