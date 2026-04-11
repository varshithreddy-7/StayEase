import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import HotelCard from '../components/hotel/HotelCard';
import './HotelsPage.css';

const categories = ['', 'luxury', 'resort', 'boutique', 'business', 'mid-range', 'budget'];

const HotelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [cities, setCities] = useState([]);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    minPrice: '', maxPrice: '',
    rating: '', sort: '-rating',
    page: 1
  });

  const fetchHotels = useCallback(async (f) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(f).forEach(([k, v]) => { if (v) params.set(k, v); });
      params.set('limit', 9);
      const { data } = await API.get(`/hotels?${params.toString()}`);
      setHotels(data.hotels);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchHotels(filters); }, [filters, fetchHotels]);

  useEffect(() => {
    API.get('/hotels/cities').then(r => setCities(r.data.cities));
  }, []);

  const updateFilter = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  const clearFilters = () => setFilters({ search: '', city: '', category: '', minPrice: '', maxPrice: '', rating: '', sort: '-rating', page: 1 });

  return (
    <div className="hotels-page">
      <div className="hotels-hero">
        <div className="container">
          <h1>Find Your Perfect Hotel</h1>
          <div className="top-search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search hotels, cities..." value={filters.search}
              onChange={e => updateFilter('search', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="container hotels-layout">
        {/* FILTERS SIDEBAR */}
        <aside className="filters-panel">
          <div className="filters-header">
            <h3><i className="fas fa-sliders-h"></i> Filters</h3>
            <button onClick={clearFilters} className="clear-btn">Clear All</button>
          </div>

          <div className="filter-group">
            <label>City</label>
            <select value={filters.city} onChange={e => updateFilter('city', e.target.value)}>
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <div className="radio-group">
              {categories.map(c => (
                <label key={c} className={`radio-label ${filters.category === c ? 'active' : ''}`}>
                  <input type="radio" name="category" value={c} checked={filters.category === c}
                    onChange={() => updateFilter('category', c)} />
                  {c || 'All Categories'}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Price per Night (₹)</label>
            <div className="price-range">
              <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} className="price-input" />
              <span>–</span>
              <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} className="price-input" />
            </div>
          </div>

          <div className="filter-group">
            <label>Minimum Rating</label>
            <div className="rating-filter">
              {[4, 3, 2].map(r => (
                <button key={r} className={`rating-btn ${filters.rating === String(r) ? 'active' : ''}`}
                  onClick={() => updateFilter('rating', filters.rating === String(r) ? '' : String(r))}>
                  {'★'.repeat(r)} {r}+
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
              <option value="-rating">Top Rated</option>
              <option value="pricePerNight">Price: Low to High</option>
              <option value="-pricePerNight">Price: High to Low</option>
              <option value="-createdAt">Newest First</option>
            </select>
          </div>
        </aside>

        {/* RESULTS */}
        <div className="hotels-results">
          <div className="results-header">
            <p>{loading ? 'Searching...' : `${total} hotel${total !== 1 ? 's' : ''} found`}</p>
            <div className="active-filters">
              {filters.city && <span className="filter-tag">{filters.city} <button onClick={() => updateFilter('city', '')}>×</button></span>}
              {filters.category && <span className="filter-tag">{filters.category} <button onClick={() => updateFilter('category', '')}>×</button></span>}
              {filters.rating && <span className="filter-tag">★{filters.rating}+ <button onClick={() => updateFilter('rating', '')}>×</button></span>}
            </div>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card"><div className="sk-img"></div><div className="sk-body"><div className="sk-line"></div><div className="sk-line short"></div><div className="sk-line"></div></div></div>)}
            </div>
          ) : hotels.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-hotel"></i>
              <h3>No hotels found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="hotels-grid">
                {hotels.map(h => <HotelCard key={h._id} hotel={h} />)}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  {[...Array(pages)].map((_, i) => (
                    <button key={i} className={`page-btn ${filters.page === i + 1 ? 'active' : ''}`}
                      onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
