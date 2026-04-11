import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import HotelCard from '../components/hotel/HotelCard';
import './HotelsPage.css';

const categories = ['', 'luxury', 'resort', 'boutique', 'business', 'mid-range', 'budget'];

const HotelsPage = () => {
  const [searchParams] = useSearchParams();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [cities, setCities] = useState([]);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sort: '-rating',
    page: 1
  });

  // 🔥 FIXED FUNCTION (NO useCallback)
  const fetchHotels = async (f) => {
    console.log("🚀 Fetching hotels...");
    setLoading(true);

    try {
      const params = new URLSearchParams();

      Object.entries(f).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      params.set('limit', 9);

      const { data } = await API.get(`/hotels?${params.toString()}`);

      console.log("✅ API DATA:", data);

      setHotels(data?.hotels || []);
      setTotal(data?.total || 0);
      setPages(data?.pages || 1);

    } catch (error) {
      console.error("❌ Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIXED useEffect
  useEffect(() => {
    fetchHotels(filters);
  }, [filters]);

  // Fetch cities
  useEffect(() => {
    API.get('/hotels/cities')
      .then(res => setCities(res.data.cities))
      .catch(err => console.error(err));
  }, []);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: '-rating',
      page: 1
    });
  };

  return (
    <div className="hotels-page">
      
      {/* HERO */}
      <div className="hotels-hero">
        <div className="container">
          <h1>Find Your Perfect Hotel</h1>

          <div className="top-search">
            <input
              type="text"
              placeholder="Search hotels, cities..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container hotels-layout">

        {/* SIDEBAR */}
        <aside className="filters-panel">
          <h3>Filters</h3>

          <select value={filters.city} onChange={(e) => updateFilter('city', e.target.value)}>
            <option value="">All Cities</option>
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}>
            {categories.map(c => (
              <option key={c} value={c}>
                {c || 'All Categories'}
              </option>
            ))}
          </select>

          <button onClick={clearFilters}>Clear Filters</button>
        </aside>

        {/* RESULTS */}
        <div className="hotels-results">

          <h3>
            {loading ? 'Loading...' : `${total} hotels found`}
          </h3>

          {loading ? (
            <p>Loading...</p>

          ) : hotels.length === 0 ? (
            <div>
              <h3>No hotels found</h3>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>

          ) : (
            <div className="hotels-grid">
              {hotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {pages > 1 && (
            <div className="pagination">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                  className={filters.page === i + 1 ? 'active' : ''}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default HotelsPage;