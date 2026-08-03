import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, searchRes] = await Promise.all([
          api.get('/restaurants?sortBy=rating'),
          api.get('/restaurants/search?q=biryani'),
        ]);
        setRestaurants(restRes.data.restaurants.slice(0, 6));
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const categories = [
    { name: 'Biryani', icon: '🍛' },
    { name: 'North Indian', icon: '🥘' },
    { name: 'South Indian', icon: '🫕' },
    { name: 'Street Food', icon: '🌮' },
    { name: 'Desserts', icon: '🍮' },
    { name: 'Beverages', icon: '🥤' },
    { name: 'Breads', icon: '🫓' },
    { name: 'Thali', icon: '🍽️' },
  ];

  return (
    <div className="container">
      {/* Hero */}
      <div className="hero">
        <h1>Delicious Indian Food, Delivered Hot</h1>
        <p>Order from the best restaurants in your food court</p>
        <Link to="/restaurants">
          <button className="btn btn-lg" style={{ background: 'white', color: '#ff6b35', marginTop: 20, fontWeight: 700 }}>
            Explore Restaurants
          </button>
        </Link>
      </div>

      {/* Categories */}
      <div className="section">
        <h2 className="section-title">What's on your mind?</h2>
        <div className="category-pills">
          {categories.map(cat => (
            <Link to={`/restaurants?cuisine=${cat.name}`} key={cat.name} className="category-pill" style={{ textDecoration: 'none' }}>
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Top Restaurants */}
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Top Restaurants</h2>
          <Link to="/restaurants" style={{ color: 'var(--primary)', fontWeight: 600 }}>View All</Link>
        </div>
        {loading ? (
          <div className="grid grid-3">
            {[1,2,3].map(i => <div key={i} className="card" style={{ height: 300, background: '#eee' }} />)}
          </div>
        ) : (
          <div className="grid grid-3">
            {restaurants.map(r => (
              <Link to={`/restaurant/${r._id}`} key={r._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card restaurant-card">
                  <img
                    src={r.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}
                    alt={r.name}
                    className="card-img"
                  />
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3>{r.name}</h3>
                      <span className="rating">★ {r.rating || 'New'}</span>
                    </div>
                    <div className="cuisine-tags">
                      {r.cuisine?.map(c => <span key={c} className="cuisine-tag">{c}</span>)}
                    </div>
                    <p style={{ fontSize: 13, color: '#6c757d', marginTop: 8 }}>
                      {r.averageDeliveryTime} min delivery
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
