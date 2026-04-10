const User = require('../models/User');
const Hotel = require('../models/Hotel');

// @GET /api/users/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name city featuredImage pricePerNight rating category');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/users/wishlist/:hotelId
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const hotelId = req.params.hotelId;
    
    const idx = user.wishlist.indexOf(hotelId);
    let message;
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
      message = 'Removed from wishlist';
    } else {
      user.wishlist.push(hotelId);
      message = 'Added to wishlist';
    }
    
    await user.save();
    res.json({ success: true, wishlist: user.wishlist, message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments();
    const users = await User.find().select('-password').sort('-createdAt').skip(skip).limit(Number(limit));
    res.json({ success: true, users, total, pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: PUT /api/users/:id/status
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
