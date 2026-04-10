import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';
import './PaymentPage.css';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '4242 4242 4242 4242', name: '', expiry: '12/26', cvv: '123' });
  const [payMethod, setPayMethod] = useState('card');

  useEffect(() => {
    API.get(`/bookings/${bookingId}`)
      .then(r => { setBooking(r.data.booking); setCardForm(c => ({ ...c, name: r.data.booking.guestInfo?.name || '' })); })
      .catch(() => navigate('/dashboard/bookings'))
      .finally(() => setLoading(false));
  }, [bookingId, navigate]);

  const handlePay = async () => {
    if (payMethod === 'card' && (!cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvv)) {
      toast.error('Please fill in card details'); return;
    }
    setPaying(true);
    try {
      await API.post('/payments/mock-pay', { bookingId });
      toast.success('Payment successful!');
      navigate(`/payment-success/${bookingId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally { setPaying(false); }
  };

  const formatCard = (v) => v.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!booking) return null;

  return (
    <div className="payment-page">
      <div className="payment-hero"><div className="container"><h1><i className="fas fa-credit-card"></i> Secure Payment</h1></div></div>
      <div className="container payment-layout">
        <div className="payment-left">
          {/* METHOD SELECT */}
          <div className="pay-section">
            <h2>Payment Method</h2>
            <div className="method-tabs">
              {[['card','fa-credit-card','Credit / Debit Card'],['upi','fa-mobile-alt','UPI'],['netbanking','fa-university','Net Banking']].map(([k,ico,lbl]) => (
                <button key={k} className={`method-tab ${payMethod === k ? 'active' : ''}`} onClick={() => setPayMethod(k)}>
                  <i className={`fas ${ico}`}></i> {lbl}
                </button>
              ))}
            </div>

            {payMethod === 'card' && (
              <div className="card-form">
                <div className="credit-card-visual">
                  <div className="cc-brand"><i className="fas fa-hotel"></i> StayEase</div>
                  <div className="cc-chip"><i className="fas fa-microchip"></i></div>
                  <div className="cc-number">{cardForm.number || '•••• •••• •••• ••••'}</div>
                  <div className="cc-bottom">
                    <div><span>Card Holder</span><strong>{cardForm.name || 'YOUR NAME'}</strong></div>
                    <div><span>Expires</span><strong>{cardForm.expiry || 'MM/YY'}</strong></div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input className="form-control" value={cardForm.number} placeholder="1234 5678 9012 3456"
                    onChange={e => setCardForm(f => ({ ...f, number: formatCard(e.target.value) }))} maxLength={19} />
                </div>
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input className="form-control" value={cardForm.name} placeholder="As on card"
                    onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="card-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input className="form-control" value={cardForm.expiry} placeholder="MM/YY"
                      onChange={e => setCardForm(f => ({ ...f, expiry: e.target.value }))} maxLength={5} />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input className="form-control" value={cardForm.cvv} placeholder="•••" type="password"
                      onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value }))} maxLength={4} />
                  </div>
                </div>
                <div className="test-note"><i className="fas fa-info-circle"></i> Test mode: Use any details above. Real payment is simulated.</div>
              </div>
            )}

            {payMethod === 'upi' && (
              <div className="upi-form">
                <div className="form-group">
                  <label>UPI ID</label>
                  <input className="form-control" placeholder="yourname@upi" />
                </div>
                <div className="test-note"><i className="fas fa-info-circle"></i> Mock payment — no real transaction occurs.</div>
              </div>
            )}

            {payMethod === 'netbanking' && (
              <div className="upi-form">
                <div className="form-group">
                  <label>Select Bank</label>
                  <select className="form-control">
                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map(b => <option key={b}>{b} Bank</option>)}
                  </select>
                </div>
                <div className="test-note"><i className="fas fa-info-circle"></i> Mock payment — no real transaction occurs.</div>
              </div>
            )}
          </div>

          <button className="btn btn-primary btn-full btn-lg pay-btn" onClick={handlePay} disabled={paying}>
            {paying ? <><i className="fas fa-spinner fa-spin"></i> Processing Payment...</> : <><i className="fas fa-lock"></i> Pay ₹{booking.totalPrice?.toLocaleString()} Securely</>}
          </button>
          <div className="secure-badges">
            <span><i className="fas fa-shield-alt"></i> SSL Secured</span>
            <span><i className="fas fa-lock"></i> Encrypted</span>
            <span><i className="fab fa-cc-visa"></i> Visa</span>
            <span><i className="fab fa-cc-mastercard"></i> Mastercard</span>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="order-summary">
          <div className="summary-card">
            <h3>Booking Summary</h3>
            <div className="hotel-mini">
              <img src={booking.hotel?.featuredImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200'}
                alt="" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200'; }} />
              <div>
                <strong>{booking.hotel?.name}</strong>
                <span>{booking.hotel?.city}</span>
              </div>
            </div>
            <div className="order-lines">
              <div className="order-line"><span>Room Type</span><span>{booking.roomType?.charAt(0).toUpperCase() + booking.roomType?.slice(1)}</span></div>
              <div className="order-line"><span>Check-in</span><span>{new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
              <div className="order-line"><span>Check-out</span><span>{new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
              <div className="order-line"><span>Nights</span><span>{booking.nights}</span></div>
              <div className="order-line"><span>Rooms</span><span>{booking.rooms}</span></div>
              <div className="order-line"><span>Guests</span><span>{booking.guests?.adults} Adult{booking.guests?.adults > 1 ? 's' : ''}{booking.guests?.children > 0 ? `, ${booking.guests.children} Child` : ''}</span></div>
            </div>
            <hr />
            <div className="order-line total"><span>Room Charges</span><span>₹{booking.totalPrice?.toLocaleString()}</span></div>
            <div className="order-line total grand"><span>Total Amount</span><span>₹{booking.totalPrice?.toLocaleString()}</span></div>
            <p style={{ fontSize: '12px', color: 'var(--text-light)', textAlign: 'center', marginTop: '12px' }}>Ref: {booking.bookingReference}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
