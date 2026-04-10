const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Review = require('../models/Review');

// @GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalHotels, totalBookings, totalUsers, totalReviews] = await Promise.all([
      Hotel.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Review.countDocuments()
    ]);
    
    const revenueResult = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    const revenue = revenueResult[0]?.total || 0;
    
    const recentBookings = await Booking.find()
      .populate('hotel', 'name city')
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(5);
    
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const monthlyRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) } } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalHotels,
        totalBookings,
        totalUsers,
        totalReviews,
        revenue,
        recentBookings,
        bookingsByStatus,
        monthlyRevenue
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/admin/bookings/:id
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    
    const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('hotel', 'name city')
      .populate('user', 'name email');
    
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
