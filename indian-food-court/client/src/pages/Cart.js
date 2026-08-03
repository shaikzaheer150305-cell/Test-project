import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, removeFromCart, addToCart, subtotal, deliveryCharge, tax, total, totalItems, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="icon"><FaShoppingCart size={64} /></div>
          <h3>Your cart is empty</h3>
          <p>Add delicious items from a restaurant</p>
          <Link to="/restaurants">
            <button className="btn btn-primary" style={{ marginTop: 16 }}>Browse Restaurants</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="section-title">Your Cart ({totalItems} items)</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Items */}
        <div>
          {cartItems.map(item => (
            <div key={item._id} className="card" style={{ marginBottom: 12 }}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100'}
                  alt={item.name}
                  style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{
                      width: 12, height: 12, border: `2px solid ${item.isVeg ? '#2e7d32' : '#c62828'}`,
                      borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: item.isVeg ? '#2e7d32' : '#c62828'
                      }} />
                    </span>
                    <strong>{item.name}</strong>
                  </div>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{item.discountedPrice || item.price}</span>
                </div>
                <div className="quantity-control">
                  <button onClick={() => removeFromCart(item._id)}><FaMinus size={12} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item, item.restaurant || cartItems[0]?.restaurant)}><FaPlus size={12} /></button>
                </div>
                <strong>₹{(item.discountedPrice || item.price) * item.quantity}</strong>
              </div>
            </div>
          ))}
          <button className="btn btn-danger btn-sm" onClick={clearCart} style={{ marginTop: 8 }}>
            <FaTrash /> Clear Cart
          </button>
        </div>

        {/* Summary */}
        <div>
          <div className="card" style={{ position: 'sticky', top: 80 }}>
            <div className="card-body">
              <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Subtotal</span><span>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Delivery</span>
                <span style={{ color: deliveryCharge === 0 ? 'var(--success)' : 'inherit' }}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Tax (5%)</span><span>₹{tax}</span>
              </div>
              {deliveryCharge === 0 && (
                <p style={{ fontSize: 12, color: 'var(--success)', marginBottom: 8 }}>
                  Free delivery on orders above ₹500
                </p>
              )}
              <hr style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700 }}>
                <span>Total</span><span>₹{total}</span>
              </div>
              <Link to="/checkout">
                <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 16 }}>
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
