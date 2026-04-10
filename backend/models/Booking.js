const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  roomType: {
    type: String,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 }
  },
  rooms: {
    type: Number,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  nights: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'mock'],
    default: 'card'
  },
  paymentIntentId: {
    type: String,
    default: ''
  },
  specialRequests: {
    type: String,
    default: ''
  },
  guestInfo: {
    name: String,
    email: String,
    phone: String
  },
  bookingReference: {
    type: String,
    unique: true
  }
}, { timestamps: true });

// Generate booking reference before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = 'HB' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
