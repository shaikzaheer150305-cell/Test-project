import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axios';
import FoodCard from '../components/FoodCard';
import { FaStar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/restaurants/${id}`);
        setRestaurant(res.data.restaurant);
        setFoodItems(res.data.foodItems);
        const reviewRes = await api.get(`/reviews/restaurant/${id}`);
        setReviews(reviewRes.data.reviews);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const categories = [...new Set(foodItems.map(item => item.category))];

  const filteredItems = foodItems.filter(item => {
    if (activeCategory && item.category !== activeCategory) return false;
    if (vegOnly && !item.isVeg) return false;
    return true;
  });

  if (loading) return <div className="container"><div className="loader"><div className="loader-spinner"></div></div></div>;
  if (!restaurant) return <div className="container"><h2>Restaurant not found</h2></div>;

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4))',
        backgroundImage: `url(${restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        color: 'white', padding: '60px 24px',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{restaurant.name}</h1>
          <p style={{ fontSize: 16, opacity: 0.9, margin: '8px 0 16px' }}>{restaurant.description}</p>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 8 }}>
              <FaStar /> {restaurant.rating || 'New'} ({restaurant.totalReviews} reviews)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FaClock /> {restaurant.averageDeliveryTime} min
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FaMapMarkerAlt /> {restaurant.address?.city}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {restaurant.cuisine?.map(c => (
              <span key={c} style={{
                padding: '4px 12px', background: 'rgba(255,107,53,0.8)',
                borderRadius: 20, fontSize: 13
              }}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)} />
            Veg Only
          </label>
        </div>

        {/* Categories */}
        <div className="category-pills">
          <span className={`category-pill ${activeCategory === '' ? 'active' : ''}`} onClick={() => setActiveCategory('')}>All</span>
          {categories.map(cat => (
            <span key={cat} className={`category-pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </span>
          ))}
        </div>

        {/* Food Items */}
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🍽️</div>
            <h3>No items found</h3>
            <p>Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid grid-4">
            {filteredItems.map(item => (
              <FoodCard key={item._id} item={item} restaurantId={restaurant._id} />
            ))}
          </div>
        )}

        {/* Reviews */}
        <div className="section" style={{ marginTop: 40 }}>
          <h2 className="section-title">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p style={{ color: '#6c757d' }}>No reviews yet</p>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="card" style={{ marginBottom: 12 }}>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong>{review.customer?.name}</strong>
                    <span className="badge badge-success">★ {review.rating}</span>
                  </div>
                  <p style={{ color: '#6c757d' }}>{review.comment}</p>
                  {review.reply && (
                    <div style={{ marginTop: 8, padding: 12, background: '#f8f9fa', borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
                      <strong>Restaurant Reply:</strong> {review.reply}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
