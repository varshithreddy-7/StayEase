const Booking = require('../models/Booking');

// Mock Stripe for test mode
let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch (e) {
  console.log('Stripe not configured, using mock payment');
}

// @POST /api/payments/create-intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findById(bookingId).populate('hotel', 'name');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    // Real Stripe
    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(booking.totalPrice * 100),
        currency: 'inr',
        metadata: { bookingId: booking._id.toString() }
      });
      
      return res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: booking.totalPrice,
        useMock: false
      });
    }
    
    // Mock payment - generate fake client secret
    const mockPaymentIntentId = 'pi_mock_' + Date.now();
    res.json({
      success: true,
      clientSecret: mockPaymentIntentId + '_secret_mock',
      paymentIntentId: mockPaymentIntentId,
      amount: booking.totalPrice,
      useMock: true
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/payments/confirm
exports.confirmPayment = async (req, res) => {
  try {
    const { bookingId, paymentIntentId, paymentMethod = 'card' } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    // Verify with Stripe if configured and not mock
    if (stripe && paymentIntentId && !paymentIntentId.startsWith('pi_mock_')) {
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (intent.status !== 'succeeded') {
        return res.status(400).json({ success: false, message: 'Payment not completed' });
      }
    }
    
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.paymentIntentId = paymentIntentId || '';
    booking.paymentMethod = paymentMethod;
    await booking.save();
    
    await booking.populate('hotel', 'name city featuredImage address checkInTime checkOutTime');
    
    res.json({ success: true, booking, message: 'Payment confirmed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/payments/mock-pay (for testing without Stripe)
exports.mockPay = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    const mockId = 'pi_mock_' + Date.now();
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.paymentIntentId = mockId;
    booking.paymentMethod = 'mock';
    await booking.save();
    
    await booking.populate('hotel', 'name city featuredImage address checkInTime checkOutTime');
    
    res.json({ success: true, booking, message: 'Mock payment successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
