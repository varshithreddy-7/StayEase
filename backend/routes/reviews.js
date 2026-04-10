const express = require('express');
const router = express.Router();
const { getHotelReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/hotel/:hotelId', getHotelReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
