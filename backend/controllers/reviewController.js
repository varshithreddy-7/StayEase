const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @GET /api/reviews/hotel/:hotelId
exports.getHotelReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ hotel: req.params.hotelId })
      .populate('user', 'name avatar')
      .sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { hotelId, rating, title, comment, categories } = req.body;
    
    const existing = await Review.findOne({ user: req.user._id, hotel: hotelId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this hotel' });
    }
    
    const review = await Review.create({
      user: req.user._id,
      hotel: hotelId,
      rating,
      title,
      comment,
      categories: categories || {}
    });
    
    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
