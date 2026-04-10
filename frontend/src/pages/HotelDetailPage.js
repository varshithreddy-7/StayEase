import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './HotelDetailPage.css';

const HotelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleWishlist, isInWishlist } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({ rating: 5, title: '', comment: '' });

  useEffect(() => {
    Promise.all([
      API.get(`/hotels/${id}`),
      API.get(`/reviews/hotel/${id}`)
    ]).then(([h, r]) => {
      setHotel(h.data.hotel);
      setReviews(r.data.reviews);
      if (h.data.hotel.roomTypes?.length) setSelectedRoom(h.data.hotel.roomTypes[0]);
    }).catch(() => navigate('/hotels'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleBook = () => {
    if (!user) { toast.info('Please login to book'); navigate('/login'); return; }
    if (!selectedRoom) { toast.error('Please select a room type'); return; }
    navigate(`/booking/${hotel._id}`, { state: { room: selectedRoom } });
  };

  const handleWishlist = () => {
    if (!user) { navigate('/login'); return; }
    toggleWishlist(hotel._id);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await API.post('/reviews', { hotelId: id, ...review });
      setReviews(r => [data.review, ...r]);
      setShowReviewForm(false);
      setReview({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (err) { toast.error(err.response?.data?.message || 'Error submitting review'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!hotel) return null;

  const images = hotel.images?.length ? hotel.images : [hotel.featuredImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'];

  return (
    <div className="hotel-detail-page">
      {/* IMAGE GALLERY */}
      <div className="gallery-section">
        <div className="main-image">
          <img src={images[activeImg]} alt={hotel.name}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'; }} />
          <button className="wishlist-hero" onClick={handleWishlist}>
            <i className={`${isInWishlist(hotel._id) ? 'fas' : 'far'} fa-heart`}></i>
          </button>
        </div>
        {images.length > 1 && (
          <div className="thumb-row">
            {images.map((img, i) => (
              <img key={i} src={img} alt="" className={activeImg === i ? 'active' : ''} onClick={() => setActiveImg(i)}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400'; }} />
            ))}
          </div>
        )}
      </div>

      <div className="container detail-layout">
        {/* LEFT */}
        <div className="detail-main">
          <div className="detail-header">
            <div>
              <span className="cat-chip">{hotel.category}</span>
              <h1>{hotel.name}</h1>
              <p className="detail-location"><i className="fas fa-map-marker-alt"></i> {hotel.address}</p>
              <div className="detail-rating">
                <div className="stars">{[1,2,3,4,5].map(s => <i key={s} className={`fas fa-star ${s <= hotel.rating ? 'on' : ''}`}></i>)}</div>
                <strong>{hotel.rating.toFixed(1)}</strong>
                <span>({hotel.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2>About This Hotel</h2>
            <p className="description">{hotel.description}</p>
          </div>

          <div className="detail-section">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              {hotel.amenities?.map(a => (
                <div key={a} className="amenity-item"><i className="fas fa-check-circle"></i> {a}</div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h2>Room Types</h2>
            <div className="rooms-grid">
              {hotel.roomTypes?.map(room => (
                <div key={room.name} className={`room-card ${selectedRoom?.name === room.name ? 'selected' : ''}`}
                  onClick={() => setSelectedRoom(room)}>
                  <div className="room-header">
                    <h3>{room.name.charAt(0).toUpperCase() + room.name.slice(1)}</h3>
                    {selectedRoom?.name === room.name && <i className="fas fa-check-circle"></i>}
                  </div>
                  <p className="room-desc">{room.description}</p>
                  <div className="room-tags">
                    <span><i className="fas fa-user"></i> {room.capacity} guests</span>
                    {room.amenities?.slice(0, 3).map(a => <span key={a}>{a}</span>)}
                  </div>
                  <div className="room-price">
                    <span className="price">₹{room.price.toLocaleString()}</span>
                    <span className="pn">/night</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h2>Hotel Policies</h2>
            <div className="policies">
              <div className="policy-item"><i className="fas fa-clock"></i><div><strong>Check-in</strong><span>From {hotel.checkInTime}</span></div></div>
              <div className="policy-item"><i className="fas fa-door-open"></i><div><strong>Check-out</strong><span>Until {hotel.checkOutTime}</span></div></div>
              <div className="policy-item"><i className="fas fa-ban"></i><div><strong>Cancellation</strong><span>{hotel.policies?.cancellation}</span></div></div>
              <div className="policy-item"><i className={`fas ${hotel.policies?.pets ? 'fa-check' : 'fa-times'}`}></i><div><strong>Pets</strong><span>{hotel.policies?.pets ? 'Allowed' : 'Not allowed'}</span></div></div>
              <div className="policy-item"><i className={`fas ${hotel.policies?.smoking ? 'fa-smoking' : 'fa-smoking-ban'}`}></i><div><strong>Smoking</strong><span>{hotel.policies?.smoking ? 'Allowed in designated areas' : 'Not allowed'}</span></div></div>
            </div>
          </div>

          {/* REVIEWS */}
          <div className="detail-section">
            <div className="reviews-header">
              <h2>Guest Reviews</h2>
              {user && <button className="btn btn-outline btn-sm" onClick={() => setShowReviewForm(s => !s)}>
                <i className="fas fa-pen"></i> Write a Review
              </button>}
            </div>
            {showReviewForm && (
              <form className="review-form" onSubmit={submitReview}>
                <div className="star-select">
                  {[1,2,3,4,5].map(s => (
                    <i key={s} className={`fas fa-star ${s <= review.rating ? 'on' : ''}`} onClick={() => setReview(r => ({ ...r, rating: s }))}></i>
                  ))}
                </div>
                <input type="text" placeholder="Review title" value={review.title} onChange={e => setReview(r => ({ ...r, title: e.target.value }))} className="form-control" required />
                <textarea placeholder="Share your experience..." value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} className="form-control" rows="4" required></textarea>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn btn-primary">Submit Review</button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowReviewForm(false)}>Cancel</button>
                </div>
              </form>
            )}
            <div className="reviews-list">
              {reviews.length === 0 ? <p style={{ color: 'var(--text-light)' }}>No reviews yet. Be the first!</p> :
                reviews.map(r => (
                  <div key={r._id} className="review-item">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">{r.user?.name?.[0]?.toUpperCase()}</div>
                      <div>
                        <strong>{r.user?.name}</strong>
                        <span>{new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="review-stars">{[1,2,3,4,5].map(s => <i key={s} className={`fas fa-star ${s <= r.rating ? 'on' : ''}`}></i>)}</div>
                    </div>
                    <h4>{r.title}</h4>
                    <p>{r.comment}</p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* BOOKING SIDEBAR */}
        <aside className="booking-sidebar">
          <div className="booking-card">
            <div className="booking-price">
              <span className="from">from</span>
              <span className="price">₹{selectedRoom?.price?.toLocaleString() || hotel.pricePerNight?.toLocaleString()}</span>
              <span className="pn">/night</span>
            </div>
            <div className="booking-rating">
              <i className="fas fa-star" style={{ color: '#f4c430' }}></i>
              <strong>{hotel.rating.toFixed(1)}</strong> · {hotel.reviewCount} reviews
            </div>

            <div className="selected-room-info">
              <p>Selected: <strong>{selectedRoom?.name ? selectedRoom.name.charAt(0).toUpperCase() + selectedRoom.name.slice(1) : 'None'}</strong></p>
            </div>

            <button className="btn btn-primary btn-full btn-lg" onClick={handleBook}>
              <i className="fas fa-calendar-check"></i> Book Now
            </button>
            <button className="btn btn-outline btn-full" onClick={handleWishlist} style={{ marginTop: '12px' }}>
              <i className={`${isInWishlist(hotel._id) ? 'fas' : 'far'} fa-heart`}></i>
              {isInWishlist(hotel._id) ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>
            <p className="no-charge">You won't be charged yet</p>

            <div className="quick-info">
              <div><i className="fas fa-clock"></i> Check-in: {hotel.checkInTime}</div>
              <div><i className="fas fa-door-open"></i> Check-out: {hotel.checkOutTime}</div>
              <div><i className="fas fa-shield-alt"></i> Free cancellation available</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HotelDetailPage;
