import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './BookingPage.css';

const BookingPage = () => {
  const { hotelId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [form, setForm] = useState({
    roomType: state?.room?.name || '',
    checkIn: today, checkOut: tomorrow,
    adults: 1, children: 0, rooms: 1,
    specialRequests: '',
    guestName: user?.name || '',
    guestEmail: user?.email || '',
    guestPhone: user?.phone || ''
  });

  useEffect(() => {
    API.get(`/hotels/${hotelId}`)
      .then(r => { setHotel(r.data.hotel); if (!form.roomType && r.data.hotel.roomTypes?.length) setForm(f => ({ ...f, roomType: r.data.hotel.roomTypes[0].name })); })
      .catch(() => navigate('/hotels'))
      .finally(() => setLoading(false));
  }, [hotelId, navigate]);

  const selectedRoom = hotel?.roomTypes?.find(r => r.name === form.roomType);
  const nights = form.checkIn && form.checkOut ? Math.max(0, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000)) : 0;
  const total = selectedRoom ? selectedRoom.price * nights * form.rooms : 0;
  const taxes = Math.round(total * 0.12);
  const grandTotal = total + taxes;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nights < 1) { toast.error('Please select valid dates'); return; }
    if (!form.roomType) { toast.error('Please select a room type'); return; }
    setSubmitting(true);
    try {
      const { data } = await API.post('/bookings', {
        hotelId, roomType: form.roomType,
        checkIn: form.checkIn, checkOut: form.checkOut,
        guests: { adults: form.adults, children: form.children },
        rooms: form.rooms,
        specialRequests: form.specialRequests,
        guestInfo: { name: form.guestName, email: form.guestEmail, phone: form.guestPhone }
      });
      toast.success('Booking created! Proceed to payment.');
      navigate(`/payment/${data.booking._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="booking-page">
      <div className="booking-hero">
        <div className="container"><h1><i className="fas fa-calendar-check"></i> Complete Your Booking</h1></div>
      </div>
      <div className="container booking-layout">
        <form className="booking-form" onSubmit={handleSubmit}>
          {/* HOTEL SUMMARY */}
          <div className="booking-section">
            <h2>Hotel Details</h2>
            <div className="hotel-summary">
              <img src={hotel.featuredImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'}
                alt={hotel.name} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300'; }} />
              <div>
                <h3>{hotel.name}</h3>
                <p><i className="fas fa-map-marker-alt"></i> {hotel.city}, {hotel.country}</p>
                <div className="stars-sm">{[1,2,3,4,5].map(s => <i key={s} className={`fas fa-star ${s <= hotel.rating ? 'on' : ''}`}></i>)}</div>
              </div>
            </div>
          </div>

          {/* ROOM TYPE */}
          <div className="booking-section">
            <h2>Select Room Type</h2>
            <div className="room-options">
              {hotel.roomTypes?.map(r => (
                <label key={r.name} className={`room-option ${form.roomType === r.name ? 'selected' : ''}`}>
                  <input type="radio" name="roomType" value={r.name} checked={form.roomType === r.name}
                    onChange={e => setForm(f => ({ ...f, roomType: e.target.value }))} />
                  <div>
                    <strong>{r.name.charAt(0).toUpperCase() + r.name.slice(1)}</strong>
                    <span>{r.description}</span>
                    <span className="room-price-tag">₹{r.price.toLocaleString()}/night</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* DATES */}
          <div className="booking-section">
            <h2>Check-in & Check-out</h2>
            <div className="dates-grid">
              <div className="form-group">
                <label>Check-in Date</label>
                <input type="date" className="form-control" value={form.checkIn} min={today}
                  onChange={e => setForm(f => ({ ...f, checkIn: e.target.value, checkOut: e.target.value >= f.checkOut ? '' : f.checkOut }))} required />
              </div>
              <div className="form-group">
                <label>Check-out Date</label>
                <input type="date" className="form-control" value={form.checkOut} min={form.checkIn || today}
                  onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))} required />
              </div>
            </div>
            {nights > 0 && <div className="nights-badge"><i className="fas fa-moon"></i> {nights} Night{nights > 1 ? 's' : ''}</div>}
          </div>

          {/* GUESTS */}
          <div className="booking-section">
            <h2>Guests & Rooms</h2>
            <div className="guests-grid">
              <div className="form-group">
                <label>Adults</label>
                <select className="form-control" value={form.adults} onChange={e => setForm(f => ({ ...f, adults: Number(e.target.value) }))}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Children</label>
                <select className="form-control" value={form.children} onChange={e => setForm(f => ({ ...f, children: Number(e.target.value) }))}>
                  {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Rooms</label>
                <select className="form-control" value={form.rooms} onChange={e => setForm(f => ({ ...f, rooms: Number(e.target.value) }))}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* GUEST INFO */}
          <div className="booking-section">
            <h2>Guest Information</h2>
            <div className="dates-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" className="form-control" value={form.guestName}
                  onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" className="form-control" value={form.guestEmail}
                  onChange={e => setForm(f => ({ ...f, guestEmail: e.target.value }))} required />
              </div>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" className="form-control" value={form.guestPhone}
                onChange={e => setForm(f => ({ ...f, guestPhone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Special Requests (Optional)</label>
              <textarea className="form-control" rows="3" placeholder="Any special requests or requirements..."
                value={form.specialRequests} onChange={e => setForm(f => ({ ...f, specialRequests: e.target.value }))}></textarea>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={submitting || nights < 1}>
            {submitting ? <><i className="fas fa-spinner fa-spin"></i> Processing...</> : <><i className="fas fa-credit-card"></i> Proceed to Payment · ₹{grandTotal.toLocaleString()}</>}
          </button>
        </form>

        {/* PRICE SUMMARY */}
        <div className="price-summary">
          <div className="summary-card">
            <h3>Price Summary</h3>
            <div className="summary-line"><span>Room ({selectedRoom?.name || '-'})</span><span>₹{selectedRoom?.price?.toLocaleString() || 0}</span></div>
            <div className="summary-line"><span>× {nights} night{nights !== 1 ? 's' : ''}</span><span></span></div>
            <div className="summary-line"><span>× {form.rooms} room{form.rooms > 1 ? 's' : ''}</span><span>₹{total.toLocaleString()}</span></div>
            <div className="summary-line"><span>Taxes & fees (12%)</span><span>₹{taxes.toLocaleString()}</span></div>
            <hr />
            <div className="summary-total"><span>Total</span><span>₹{grandTotal.toLocaleString()}</span></div>
            <p className="free-cancel"><i className="fas fa-check-circle"></i> Free cancellation available</p>
            <p className="no-charge-msg">You won't be charged until payment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
