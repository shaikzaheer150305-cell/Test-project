import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my');
        setOrders(res.data.orders);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const statusColors = {
    placed: 'badge-info', confirmed: 'badge-primary', preparing: 'badge-warning',
    ready: 'badge-success', dispatched: 'badge-info', on_the_way: 'badge-primary',
    delivered: 'badge-success', cancelled: 'badge-danger',
  };

  return (
    <div className="container">
      <h1 className="section-title">My Orders</h1>
      {loading ? (
        <div className="loader"><div className="loader-spinner"></div></div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📦</div>
          <h3>No orders yet</h3>
          <p>Order your favorite food!</p>
          <Link to="/restaurants"><button className="btn btn-primary" style={{ marginTop: 16 }}>Order Now</button></Link>
        </div>
      ) : (
        orders.map(order => (
          <Link to={`/order/${order._id}`} key={order._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ marginBottom: 4 }}>{order.restaurant?.name}</h3>
                    <p style={{ color: '#6c757d', fontSize: 13 }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p style={{ fontSize: 13, marginTop: 4 }}>
                      {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${statusColors[order.status]}`}>{order.status.replace(/_/g, ' ').toUpperCase()}</span>
                    <p style={{ fontWeight: 700, fontSize: 18, marginTop: 8 }}>₹{order.totalAmount}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default MyOrders;
