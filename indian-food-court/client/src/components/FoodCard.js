import React from 'react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const FoodCard = ({ item, restaurantId }) => {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item._id);

  return (
    <div className="card food-card">
      <div style={{ position: 'relative' }}>
        <img
          src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'}
          alt={item.name}
          className="card-img"
          style={{ height: 180 }}
        />
        <span className={`veg-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
          {item.isVeg ? 'VEG' : 'NON-VEG'}
        </span>
        {item.isBestseller && (
          <span style={{
            position: 'absolute', top: 12, right: 12, background: '#ff6b35',
            color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700
          }}>BESTSELLER</span>
        )}
      </div>
      <div className="card-body">
        <h4 style={{ marginBottom: 4 }}>{item.name}</h4>
        <p style={{ fontSize: 13, color: '#6c757d', marginBottom: 8 }}>
          {item.description?.substring(0, 60)}{item.description?.length > 60 ? '...' : ''}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span className="price">₹{item.discountedPrice || item.price}</span>
          {item.discountedPrice && (
            <span className="original-price">₹{item.price}</span>
          )}
        </div>
        <div className="add-btn">
          {quantity === 0 ? (
            <button className="btn btn-primary btn-sm" onClick={() => addToCart(item, restaurantId)} style={{ width: '100%' }}>
              ADD +
            </button>
          ) : (
            <div className="quantity-control" style={{ width: '100%', justifyContent: 'center' }}>
              <button onClick={() => removeFromCart(item._id)}><FaMinus size={12} /></button>
              <span>{quantity}</span>
              <button onClick={() => addToCart(item, restaurantId)}><FaPlus size={12} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
