const express = require('express');
const router = express.Router();
const { getHotels, getFeaturedHotels, getHotel, createHotel, updateHotel, deleteHotel, getCities } = require('../controllers/hotelController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getHotels);
router.get('/featured', getFeaturedHotels);
router.get('/cities', getCities);
router.get('/:id', getHotel);
router.post('/', protect, adminOnly, createHotel);
router.put('/:id', protect, adminOnly, updateHotel);
router.delete('/:id', protect, adminOnly, deleteHotel);

module.exports = router;
