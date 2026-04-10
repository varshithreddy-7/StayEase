const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist, getAllUsers, toggleUserStatus } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:hotelId', protect, toggleWishlist);
router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id/status', protect, adminOnly, toggleUserStatus);

module.exports = router;
