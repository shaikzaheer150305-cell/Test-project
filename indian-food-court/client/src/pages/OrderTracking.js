import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { connectSocket, getSocket } from '../utils/socket';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';

const OrderTracking = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    socket.on('order_update', (data) => {
      if (data.orderId === id) {
        setOrder(prev => prev ? { ...prev, status: data.status } : prev);
        toast.info(data.message);
      }
    });

    socket.on('delivery_tracking', (data) => {
      if (data.orderId === id) {
        setDeliveryLocation(data.location);
      }
    });

    return () => { socket.off('order_update'); socket.off('delivery_tracking'); };
  }, [id, token]);

  const statusSteps = ['placed', 'confirmed', 'preparing', 'ready', 'dispatched', 'on_the_way', 'delivered'];

  const getStatusIndex = (status) => statusSteps.indexOf(status);

  const currentStep = order ? getStatusIndex(order.status) : -1;

  if (loading) return <div className="container"><div className="loader"><div className="loader-spinner"></div></div></div>;
  if (!order) return <div className="container"><h2>Order not found</h2></div>;

  return (
    <div className="container">
      <h1 className="section-title">Order #{order._id.slice(-8).toUpperCase()}</h1>

      {/* Status Timeline */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body">
          <h3 style={{ marginBottom: 20 }}>Order Status</h3>
          <div className="order-status-bar" style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {statusSteps.slice(0, -1).map((step, index) => (
              <div key={step} className={`status-step ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}>
                <div className="step-icon">
                  {index < currentStep ? <FaCheckCircle size={16} /> : <FaCircle size={8} />}
                </div>
                <span className="step-label">{step.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Order Details */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-body">
              <h3 style={{ marginBottom: 12 }}>Order Items</h3>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span>
                    <span style={{
                      width: 10, height: 10, border: `2px solid ${item.isVeg ? '#2e7d32' : '#c62828'}`,
                      borderRadius: 2, display: 'inline-block', marginRight: 8
                    }} />
                    {item.name} x {item.quantity}
                  </span>
                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Partner */}
          {order.deliveryPartner && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-body">
                <h3>Delivery Partner</h3>
                <p style={{ marginTop: 8 }}>{order.deliveryPartner.name}</p>
                <p style={{ color: '#6c757d' }}>{order.deliveryPartner.phone}</p>
              </div>
            </div>
          )}

          {/* Live Tracking */}
          {deliveryLocation && (
            <div className="card">
              <div className="card-body">
                <h3>Live Delivery Tracking</h3>
                <div style={{ background: '#e8f5e9', padding: 20, borderRadius: 8, textAlign: 'center', marginTop: 12 }}>
                  <p style={{ fontSize: 14, color: 'var(--success)' }}>
                    🛵 Delivery partner is on the way!
                  </p>
                  <p style={{ fontSize: 13, color: '#6c757d', marginTop: 4 }}>
                    Lat: {deliveryLocation.lat?.toFixed(4)}, Lng: {deliveryLocation.lng?.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <div className="card" style={{ position: 'sticky', top: 80 }}>
            <div className="card-body">
              <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Subtotal</span><span>₹{order.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Delivery</span>
                <span style={{ color: order.deliveryCharge === 0 ? 'var(--success)' : 'inherit' }}>
                  {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span>Tax</span><span>₹{order.tax}</span>
              </div>
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, margin: '12px 0' }}>
                <span>Total</span><span>₹{order.totalAmount}</span>
              </div>
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 13 }}><strong>Payment:</strong> {order.paymentMethod.toUpperCase()}</p>
                <p style={{ fontSize: 13 }}><strong>Status:</strong> {order.paymentStatus}</p>
                <p style={{ fontSize: 13, marginTop: 8 }}>
                  <strong>Estimated:</strong> {new Date(order.estimatedDelivery).toLocaleTimeString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
