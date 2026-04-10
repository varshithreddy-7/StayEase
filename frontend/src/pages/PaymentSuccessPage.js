import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import './PaymentSuccessPage.css';

const PaymentSuccessPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    API.get(`/bookings/${bookingId}`).then(r => setBooking(r.data.booking)).catch(() => navigate('/'));
  }, [bookingId, navigate]);

  if (!booking) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-icon"><i className="fas fa-check"></i></div>
        <h1>Booking Confirmed!</h1>
        <p>Your stay has been successfully booked. A confirmation email has been sent to <strong>{booking.guestInfo?.email}</strong></p>

        <div className="booking-ref">
          <span>Booking Reference</span>
          <strong>{booking.bookingReference}</strong>
        </div>

        <div className="success-details">
          <div className="hotel-success-info">
            <img src={booking.hotel?.featuredImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
              alt="" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400'; }} />
            <h2>{booking.hotel?.name}</h2>
            <p><i className="fas fa-map-marker-alt"></i> {booking.hotel?.city}</p>
          </div>

          <div className="success-info-grid">
            <div className="info-item">
              <i className="fas fa-sign-in-alt"></i>
              <div><span>Check-in</span><strong>{new Date(booking.checkIn).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
            </div>
            <div className="info-item">
              <i className="fas fa-sign-out-alt"></i>
              <div><span>Check-out</span><strong>{new Date(booking.checkOut).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
            </div>
            <div className="info-item">
              <i className="fas fa-bed"></i>
              <div><span>Room</span><strong>{booking.roomType?.charAt(0).toUpperCase() + booking.roomType?.slice(1)} × {booking.rooms}</strong></div>
            </div>
            <div className="info-item">
              <i className="fas fa-moon"></i>
              <div><span>Duration</span><strong>{booking.nights} Night{booking.nights > 1 ? 's' : ''}</strong></div>
            </div>
            <div className="info-item">
              <i className="fas fa-users"></i>
              <div><span>Guests</span><strong>{booking.guests?.adults} Adult{booking.guests?.adults > 1 ? 's' : ''}</strong></div>
            </div>
            <div className="info-item paid">
              <i className="fas fa-rupee-sign"></i>
              <div><span>Total Paid</span><strong>₹{booking.totalPrice?.toLocaleString()}</strong></div>
            </div>
          </div>

          <div className="status-pills">
            <span className="pill green"><i className="fas fa-check-circle"></i> Booking Confirmed</span>
            <span className="pill blue"><i className="fas fa-credit-card"></i> Payment Successful</span>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/dashboard/bookings" className="btn btn-primary btn-lg"><i className="fas fa-calendar-check"></i> View My Bookings</Link>
          <Link to="/hotels" className="btn btn-outline btn-lg"><i className="fas fa-hotel"></i> Explore More Hotels</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
