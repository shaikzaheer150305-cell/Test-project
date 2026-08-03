import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaSearch, FaStar, FaClock } from 'react-icons/fa';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const cuisines = ['Biryani', 'North Indian', 'South Indian', 'Street Food', 'Desserts', 'Chinese', 'Mughlai', 'Rajasthani'];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const params = new URLSearchParams();
        if (cuisine) params.set('cuisine', cuisine);
        if (search) params.set('search', search);
        params.set('sortBy', sortBy);
        const res = await api.get(`/restaurants?${params}`);
        setRestaurants(res.data.restaurants);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchRestaurants();
  }, [cuisine, sortBy, search]);

  return (
    <div className="container">
      <h1 className="section-title">Restaurants</h1>

      <div className="search-bar">
        <FaSearch style={{ alignSelf: 'center', color: '#6c757d' }} />
        <input
          type="text" placeholder="Search restaurants..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
          padding: 12, border: '2px solid #dee2e6', borderRadius: 8, fontSize: 14
        }}>
          <option value="rating">Top Rated</option>
          <option value="delivery_time">Fast Delivery</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="category-pills">
        <span
          className={`category-pill ${cuisine === '' ? 'active' : ''}`}
          onClick={() => setCuisine('')}
        >All</span>
        {cuisines.map(c => (
          <span
            key={c}
            className={`category-pill ${cuisine === c ? 'active' : ''}`}
            onClick={() => setCuisine(c)}
          >{c}</span>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="card" style={{ height: 320, background: '#eee' }} />)}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🍽️</div>
          <h3>No restaurants found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {restaurants.map(r => (
            <Link to={`/restaurant/${r._id}`} key={r._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card restaurant-card">
                <img
                  src={r.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}
                  alt={r.name} className="card-img"
                />
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>{r.name}</h3>
                    {r.rating > 0 && (
                      <span className="rating"><FaStar size={12} /> {r.rating}</span>
                    )}
                  </div>
                  <div className="cuisine-tags">
                    {r.cuisine?.map(c => <span key={c} className="cuisine-tag">{c}</span>)}
                  </div>
                  <p style={{ fontSize: 13, color: '#6c757d', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FaClock size={12} /> {r.averageDeliveryTime} min
                    <span style={{ margin: '0 4px' }}>|</span>
                    {r.totalReviews || 0} reviews
                  </p>
                  <p style={{ fontSize: 12, color: r.isOpen ? 'var(--success)' : 'var(--danger)', fontWeight: 600, marginTop: 4 }}>
                    {r.isOpen ? 'Open Now' : 'Closed'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
