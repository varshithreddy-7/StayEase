const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // standard, deluxe, suite
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  capacity: { type: Number, default: 2 },
  amenities: [String],
  images: [String],
  available: { type: Boolean, default: true },
  quantity: { type: Number, default: 10 }
});

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  country: {
    type: String,
    required: true,
    default: 'India'
  },
  category: {
    type: String,
    enum: ['budget', 'mid-range', 'luxury', 'resort', 'boutique', 'business'],
    required: true
  },
  images: [String],
  featuredImage: {
    type: String,
    default: ''
  },
  amenities: [String],
  roomTypes: [roomTypeSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  checkInTime: { type: String, default: '14:00' },
  checkOutTime: { type: String, default: '11:00' },
  policies: {
    cancellation: { type: String, default: 'Free cancellation up to 24 hours before check-in' },
    pets: { type: Boolean, default: false },
    smoking: { type: Boolean, default: false }
  },
  coordinates: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  }
}, { timestamps: true });

hotelSchema.index({ city: 'text', name: 'text' });

module.exports = mongoose.model('Hotel', hotelSchema);
