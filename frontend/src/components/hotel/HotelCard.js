import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './HotelCard.css';

const categoryColors = { luxury: '#c9a84c', resort: '#27ae60', budget: '#3498db', 'mid-range': '#8e44ad', boutique: '#e67e22', business: '#2c3e50' };

const HotelCard = ({ hotel }) => {
  const { user, toggleWishlist, isInWishlist } = useAuth();
  const wished = isInWishlist(hotel._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { window.location.href = '/login'; return; }
    await toggleWishlist(hotel._id);
  };

  const minPrice = hotel.roomTypes?.length ? Math.min(...hotel.roomTypes.map(r => r.price)) : hotel.pricePerNight;

  return (
    <Link to={`/hotels/${hotel._id}`} className="hotel-card">
      <div className="hotel-card-img">
        <img
          src={hotel.featuredImage || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600`}
          alt={hotel.name}
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600'; }}
        />
        <button className={`wishlist-btn ${wished ? 'wished' : ''}`} onClick={handleWishlist} title={wished ? 'Remove from wishlist' : 'Add to wishlist'}>
          <i className={`${wished ? 'fas' : 'far'} fa-heart`}></i>
        </button>
        <span className="category-badge" style={{ background: categoryColors[hotel.category] || '#666' }}>
          {hotel.category}
        </span>
      </div>
      <div className="hotel-card-body">
        <h3 className="hotel-name">{hotel.name}</h3>
        <p className="hotel-location"><i className="fas fa-map-marker-alt"></i> {hotel.city}, {hotel.country}</p>
        <div className="hotel-rating">
          <div className="stars">
            {[1,2,3,4,5].map(s => (
              <i key={s} className={`fas fa-star ${s <= Math.round(hotel.rating) ? 'filled' : ''}`}></i>
            ))}
          </div>
          <span className="rating-num">{hotel.rating.toFixed(1)}</span>
          <span className="review-count">({hotel.reviewCount} reviews)</span>
        </div>
        <div className="hotel-amenities">
          {hotel.amenities?.slice(0, 3).map(a => <span key={a} className="amenity-chip">{a}</span>)}
          {hotel.amenities?.length > 3 && <span className="amenity-chip more">+{hotel.amenities.length - 3}</span>}
        </div>
        <div className="hotel-footer">
          <div className="hotel-price">
            <span className="from">from</span>
            <span className="price">₹{minPrice.toLocaleString()}</span>
            <span className="per-night">/night</span>
          </div>
          <span className="view-btn">View Details <i className="fas fa-arrow-right"></i></span>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
