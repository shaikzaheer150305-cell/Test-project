import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { connectSocket } from '../utils/socket';
import api from '../utils/axios';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems, restaurantId, subtotal, deliveryCharge, tax, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    landmark: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        restaurantId,
        items: cartItems.map(item => ({ foodItemId: item._id, quantity: item.quantity })),
        deliveryAddress: address,
        paymentMethod,
        specialInstructions,
      };
      const res = await api.post('/orders', orderData);
      const order = res.data.order;

      // Emit socket event
      const socket = connectSocket(token);
      socket.emit('order_placed', { orderId: order._id, restaurantId });

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="section-title">Checkout</h1>
      <form onSubmit={handleOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div>
            {/* Delivery Address */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body">
                <h3 style={{ marginBottom: 16 }}>Delivery Address</h3>
                <div className="form-group">
                  <label>Street Address *</label>
                  <input required value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} placeholder="House No, Street, Area" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>City *</label>
                    <input required value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input required value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input required value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Landmark</label>
                    <input value={address.landmark} onChange={e => setAddress({ ...address, landmark: e.target.value })} placeholder="Optional" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body">
                <h3 style={{ marginBottom: 16 }}>Payment Method</h3>
                <div style={{ display: 'flex', gap: 16 }}>
                  {['cod', 'online', 'upi'].map(method => (
                    <label key={method} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
                      border: `2px solid ${paymentMethod === method ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 8, cursor: 'pointer', flex: 1, textAlign: 'center',
                      background: paymentMethod === method ? '#fff5f0' : 'white',
                    }}>
                      <input type="radio" name="payment" value={method} checked={paymentMethod === method}
                        onChange={e => setPaymentMethod(e.target.value)} style={{ display: 'none' }} />
                      {method === 'cod' ? '💵 Cash on Delivery' : method === 'upi' ? '📱 UPI' : '💳 Online Payment'}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="card">
              <div className="card-body">
                <h3 style={{ marginBottom: 16 }}>Special Instructions</h3>
                <textarea placeholder="Any special requests? (e.g., extra spicy, no onion)" value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)} rows={3} />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card" style={{ position: 'sticky', top: 80 }}>
              <div className="card-body">
                <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
                {cartItems.map(item => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{(item.discountedPrice || item.price) * item.quantity}</span>
                  </div>
                ))}
                <hr style={{ margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Subtotal</span><span>₹{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Delivery</span>
                  <span style={{ color: deliveryCharge === 0 ? 'var(--success)' : 'inherit' }}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span>Tax</span><span>₹{tax}</span>
                </div>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, margin: '12px 0' }}>
                  <span>Total</span><span>₹{total}</span>
                </div>
                <button className="btn btn-primary btn-lg" type="submit" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Placing Order...' : `Place Order - ₹${total}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
