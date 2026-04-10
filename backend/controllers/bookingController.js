const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');

// @POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { hotelId, roomType, checkIn, checkOut, guests, rooms, specialRequests, guestInfo } = req.body;
    
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    
    const room = hotel.roomTypes.find(r => r.name === roomType);
    if (!room) return res.status(400).json({ success: false, message: 'Room type not found' });
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    if (nights < 1) return res.status(400).json({ success: false, message: 'Invalid dates' });
    
    const totalPrice = room.price * nights * (rooms || 1);
    
    const booking = await Booking.create({
      user: req.user._id,
      hotel: hotelId,
      roomType,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests || { adults: 1, children: 0 },
      rooms: rooms || 1,
      totalPrice,
      pricePerNight: room.price,
      nights,
      specialRequests: specialRequests || '',
      guestInfo: guestInfo || { name: req.user.name, email: req.user.email, phone: req.user.phone || '' }
    });
    
    await booking.populate('hotel', 'name city featuredImage address');
    
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('hotel', 'name city featuredImage address category')
      .sort('-createdAt');
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/bookings/:id
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel', 'name city featuredImage address category checkInTime checkOutTime')
      .populate('user', 'name email phone');
    
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }
    
    booking.status = 'cancelled';
    booking.paymentStatus = booking.paymentStatus === 'paid' ? 'refunded' : booking.paymentStatus;
    await booking.save();
    
    res.json({ success: true, booking, message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/bookings/all (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    let query = {};
    if (status) query.status = status;
    
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('hotel', 'name city')
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));
    
    res.json({ success: true, bookings, total, pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
