import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { connectSocket, getSocket } from '../utils/socket';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import { FaMotorcycle, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';

const DeliveryDashboard = () => {
  const { user, token } = useAuth();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get('/orders/delivery');
      const active = res.data.orders.find(o => ['dispatched', 'on_the_way'].includes(o.status));
      const available = res.data.orders.filter(o => o.status === 'ready');
      setActiveOrder(active);
      setAvailableOrders(available);
    } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);
    socket.emit('join_delivery');

    socket.on('new_delivery', (data) => {
      toast.info('New delivery available!');
      fetchOrders();
    });

    socket.on('order_update', (data) => {
      if (activeOrder && data.orderId === activeOrder._id) {
        fetchOrders();
      }
    });

    return () => { socket.off('new_delivery'); socket.off('order_update'); };
  }, [token, activeOrder, fetchOrders]);

  const acceptOrder = async (order) => {
    try {
      await api.put(`/orders/${order._id}/status`, { status: 'dispatched' });
      const socket = getSocket();
      socket.emit('delivery_accepted', {
        orderId: order._id,
        customerId: order.customer?._id,
        deliveryPartnerName: user.name,
        deliveryPartnerPhone: user.phone,
      });
      toast.success('Order accepted! Pick up the food.');
      fetchOrders();
    } catch (err) { toast.error('Failed to accept order'); }
  };

  const updateStatus = async (status) => {
    try {
      await api.put(`/orders/${activeOrder._id}/status`, { status });
      const socket = getSocket();
      if (status === 'on_the_way') {
        // Start sharing location
        shareLocation(activeOrder._id, activeOrder.customer?._id);
        socket.emit('order_status_update', {
          orderId: activeOrder._id,
          customerId: activeOrder.customer?._id,
          status: 'on_the_way',
          message: 'Your delivery partner is on the way!',
        });
      } else if (status === 'delivered') {
        socket.emit('order_delivered', { orderId: activeOrder._id, customerId: activeOrder.customer?._id });
      }
      toast.success(`Order ${status.replace(/_/g, ' ')}`);
      fetchOrders();
    } catch (err) { toast.error('Failed to update status'); }
  };

  const shareLocation = (orderId, customerId) => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const socket = getSocket();
        socket.emit('delivery_location', {
          orderId,
          customerId,
          location: { lat: position.coords.latitude, lng: position.coords.longitude },
        });
      },
      (err) => console.error('Location error:', err),
      { enableHighAccuracy: true }
    );
    // Stop sharing after 30 min
    setTimeout(() => navigator.geolocation.clearWatch(watchId), 30 * 60 * 1000);
  };

  if (loading) return <div className="container"><div className="loader"><div className="loader-spinner"></div></div></div>;

  return (
    <div className="container" style={{ maxWidth: 800, marginTop: 40 }}>
      <h1 style={{ marginBottom: 8 }}>Delivery Partner</h1>
      <p style={{ color: '#6c757d', marginBottom: 32 }}>Welcome, {user.name}!</p>

      {/* Active Order */}
      {activeOrder && (
        <div className="card" style={{ marginBottom: 24, border: '2px solid var(--primary)' }}>
          <div className="card-body">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)' }}>
              <FaMotorcycle /> Active Delivery
            </h3>
            <div style={{ marginTop: 16 }}>
              <p><strong>Order:</strong> #{activeOrder._id.slice(-6).toUpperCase()}</p>
              <p><strong>Restaurant:</strong> {activeOrder.restaurant?.name}</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FaMapMarkerAlt /> Pickup: {activeOrder.restaurant?.address?.street}, {activeOrder.restaurant?.address?.city}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FaMapMarkerAlt /> Drop: {activeOrder.deliveryAddress?.street}, {activeOrder.deliveryAddress?.city}
              </p>
              <p><strong>Customer:</strong> {activeOrder.customer?.name} ({activeOrder.customer?.phone})</p>
              <p><strong>Amount:</strong> ₹{activeOrder.totalAmount}</p>
              <p><strong>Status:</strong> <span className="badge badge-primary">{activeOrder.status}</span></p>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                {activeOrder.status === 'dispatched' && (
                  <button className="btn btn-primary" onClick={() => updateStatus('on_the_way')}>
                    🛵 Start Delivery
                  </button>
                )}
                {activeOrder.status === 'on_the_way' && (
                  <button className="btn btn-success" onClick={() => updateStatus('delivered')}>
                    <FaCheck /> Mark Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Orders */}
      <h2 style={{ marginBottom: 16 }}>Available Pickups ({availableOrders.length})</h2>
      {availableOrders.length === 0 ? (
        <div className="card">
          <div className="card-body empty-state">
            <div className="icon">📭</div>
            <h3>No orders available</h3>
            <p>Waiting for restaurants to mark orders as ready...</p>
          </div>
        </div>
      ) : (
        availableOrders.map(order => (
          <div key={order._id} className="card" style={{ marginBottom: 12 }}>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4>#{order._id.slice(-6).toUpperCase()}</h4>
                  <p style={{ color: '#6c757d' }}>Pickup: {order.restaurant?.name}</p>
                  <p style={{ fontSize: 13 }}>{order.restaurant?.address?.street}, {order.restaurant?.address?.city}</p>
                  <p style={{ fontSize: 13 }}>Drop: {order.deliveryAddress?.street}, {order.deliveryAddress?.city}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: 18, color: 'var(--primary)' }}>₹{order.totalAmount}</p>
                  <button className="btn btn-success btn-sm" onClick={() => acceptOrder(order)} disabled={!!activeOrder}>
                    Accept Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DeliveryDashboard;
