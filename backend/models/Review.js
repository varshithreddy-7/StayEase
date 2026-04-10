const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  categories: {
    cleanliness: { type: Number, min: 1, max: 5, default: 5 },
    service: { type: Number, min: 1, max: 5, default: 5 },
    location: { type: Number, min: 1, max: 5, default: 5 },
    value: { type: Number, min: 1, max: 5, default: 5 }
  }
}, { timestamps: true });

// Update hotel rating after review save
reviewSchema.post('save', async function() {
  const Hotel = require('./Hotel');
  const reviews = await this.constructor.find({ hotel: this.hotel });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Hotel.findByIdAndUpdate(this.hotel, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length
  });
});

module.exports = mongoose.model('Review', reviewSchema);
