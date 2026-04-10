const Hotel = require('../models/Hotel');

// @GET /api/hotels
exports.getHotels = async (req, res) => {
  try {
    const { city, category, minPrice, maxPrice, rating, search, page = 1, limit = 9, sort = '-createdAt' } = req.query;
    
    let query = { isActive: true };
    
    if (city) query.city = { $regex: city, $options: 'i' };
    if (category) query.category = category;
    if (rating) query.rating = { $gte: Number(rating) };
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query).sort(sort).skip(skip).limit(Number(limit));
    
    res.json({
      success: true,
      count: hotels.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      hotels
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/hotels/featured
exports.getFeaturedHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isActive: true, featured: true }).limit(6);
    res.json({ success: true, hotels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/hotels/:id
exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel || !hotel.isActive) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    res.json({ success: true, hotel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/hotels (admin)
exports.createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, hotel });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @PUT /api/hotels/:id (admin)
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, hotel });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @DELETE /api/hotels/:id (admin)
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/hotels/cities
exports.getCities = async (req, res) => {
  try {
    const cities = await Hotel.distinct('city', { isActive: true });
    res.json({ success: true, cities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
