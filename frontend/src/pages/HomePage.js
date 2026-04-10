import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import HotelCard from '../components/hotel/HotelCard';
import './HomePage.css';

const categories = [
  { key: 'luxury', label: 'Luxury', icon: 'fa-crown', color: '#c9a84c' },
  { key: 'resort', label: 'Resort', icon: 'fa-umbrella-beach', color: '#27ae60' },
  { key: 'boutique', label: 'Boutique', icon: 'fa-gem', color: '#9b59b6' },
  { key: 'business', label: 'Business', icon: 'fa-briefcase', color: '#2980b9' },
  { key: 'mid-range', label: 'Mid-Range', icon: 'fa-building', color: '#e67e22' },
  { key: 'budget', label: 'Budget', icon: 'fa-piggy-bank', color: '#16a085' },
];

const cities = ['Mumbai', 'New Delhi', 'Goa', 'Bangalore', 'Jaipur', 'Chennai', 'Udaipur', 'Shimla'];

const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ city: '', checkIn: '', checkOut: '', guests: 1 });
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({ hotels: '500+', cities: '50+', guests: '1M+', rating: '4.8' });

  useEffect(() => {
    API.get('/hotels/featured').then(r => setFeatured(r.data.hotels)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.city) params.set('city', search.city);
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80" alt="Hero" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge"><i className="fas fa-star"></i> Trusted by 1 Million+ Travellers</div>
          <h1>Find Your Perfect <em>Escape</em></h1>
          <p>Discover extraordinary hotels across India — from Himalayan retreats to beachfront resorts</p>

          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-field">
              <i className="fas fa-map-marker-alt"></i>
              <input type="text" placeholder="Where are you going?" value={search.city}
                onChange={e => setSearch(s => ({ ...s, city: e.target.value }))} list="cities-list" />
              <datalist id="cities-list">{cities.map(c => <option key={c} value={c} />)}</datalist>
            </div>
            <div className="search-divider"></div>
            <div className="search-field">
              <i className="fas fa-calendar"></i>
              <input type="date" placeholder="Check-in" value={search.checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setSearch(s => ({ ...s, checkIn: e.target.value }))} />
            </div>
            <div className="search-divider"></div>
            <div className="search-field">
              <i className="fas fa-calendar-check"></i>
              <input type="date" placeholder="Check-out" value={search.checkOut}
                min={search.checkIn || new Date().toISOString().split('T')[0]}
                onChange={e => setSearch(s => ({ ...s, checkOut: e.target.value }))} />
            </div>
            <div className="search-divider"></div>
            <div className="search-field">
              <i className="fas fa-user"></i>
              <select value={search.guests} onChange={e => setSearch(s => ({ ...s, guests: e.target.value }))}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <button type="submit" className="search-btn"><i className="fas fa-search"></i> Search</button>
          </form>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-band">
        <div className="container">
          <div className="stats-grid">
            <div className="stat"><span className="stat-num">{stats.hotels}</span><span className="stat-label">Hotels</span></div>
            <div className="stat"><span className="stat-num">{stats.cities}</span><span className="stat-label">Cities</span></div>
            <div className="stat"><span className="stat-num">{stats.guests}</span><span className="stat-label">Happy Guests</span></div>
            <div className="stat"><span className="stat-num">★ {stats.rating}</span><span className="stat-label">Avg Rating</span></div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">Whatever your travel style, we have the perfect match</p>
          <div className="categories-grid">
            {categories.map(cat => (
              <button key={cat.key} className="category-card" onClick={() => navigate(`/hotels?category=${cat.key}`)}>
                <div className="cat-icon" style={{ background: cat.color + '22', color: cat.color }}>
                  <i className={`fas ${cat.icon}`}></i>
                </div>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Hotels</h2>
              <p className="section-subtitle">Handpicked luxury stays for discerning travellers</p>
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/hotels')}>View All Hotels</button>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
          ) : (
            <div className="grid-3">
              {featured.map(hotel => <HotelCard key={hotel._id} hotel={hotel} />)}
            </div>
          )}
        </div>
      </section>

      {/* POPULAR CITIES */}
      <section className="cities-section">
        <div className="container">
          <h2 className="section-title">Popular Destinations</h2>
          <p className="section-subtitle">Explore top hotel destinations across India</p>
          <div className="cities-grid">
            {[
              { name: 'Mumbai', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400', count: '45+ Hotels' },
              { name: 'Goa', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400', count: '38+ Hotels' },
              { name: 'Jaipur', img: 'https://images.unsplash.com/photo-1477587458883-47145ed68e23?w=400', count: '32+ Hotels' },
              { name: 'Udaipur', img: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400', count: '28+ Hotels' },
              { name: 'New Delhi', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400', count: '55+ Hotels' },
              { name: 'Shimla', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400', count: '22+ Hotels' },
            ].map(city => (
              <div key={city.name} className="city-card" onClick={() => navigate(`/hotels?city=${city.name}`)}>
                <img src={city.img} alt={city.name} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'; }} />
                <div className="city-info"><h3>{city.name}</h3><span>{city.count}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="why-section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Why Choose StayEase?</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>We make hotel booking simple, secure and rewarding</p>
          <div className="grid-4" style={{ marginTop: '40px' }}>
            {[
              { icon: 'fa-shield-alt', title: 'Secure Booking', desc: 'Your payment and personal data is fully protected with bank-level encryption.' },
              { icon: 'fa-tags', title: 'Best Price Guarantee', desc: 'Find a lower price? We\'ll match it — no questions asked.' },
              { icon: 'fa-headset', title: '24/7 Support', desc: 'Our travel experts are available round the clock to assist you.' },
              { icon: 'fa-undo', title: 'Easy Cancellation', desc: 'Most hotels offer free cancellation. Plans change, and we get that.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon"><i className={`fas ${f.icon}`}></i></div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready for Your Next Adventure?</h2>
            <p>Join over a million travellers who trust StayEase for their perfect stays.</p>
            <div className="cta-btns">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/hotels')}>Explore Hotels</button>
              <button className="btn btn-outline-white btn-lg" onClick={() => navigate('/register')}>Sign Up Free</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
