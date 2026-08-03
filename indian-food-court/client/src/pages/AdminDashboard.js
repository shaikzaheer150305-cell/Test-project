import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/axios';
import { FaUsers, FaStore, FaClipboardList, FaRupeeSign, FaStar, FaUtensils } from 'react-icons/fa';

const AdminDashboard = () => {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch (err) { console.error(err); }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data.orders);
    } catch (err) { console.error(err); }
  }, []);

  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await api.get('/admin/restaurants');
      setRestaurants(res.data.restaurants);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    if (tab === 'dashboard') fetchDashboard();
    else if (tab === 'users') fetchUsers();
    else if (tab === 'orders') fetchOrders();
    else if (tab === 'restaurants') fetchRestaurants();
  }, [tab]);

  const toggleUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle`);
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  const toggleRestaurant = async (restId) => {
    try {
      await api.put(`/admin/restaurants/${restId}/toggle`);
      fetchRestaurants();
    } catch (err) { console.error(err); }
  };

  const statusColors = {
    placed: 'badge-info', confirmed: 'badge-primary', preparing: 'badge-warning',
    ready: 'badge-success', dispatched: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger',
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2 style={{ marginBottom: 32, fontSize: '1.2rem' }}>Admin Panel</h2>
        {[
          { key: 'dashboard', icon: <FaRupeeSign />, label: 'Dashboard' },
          { key: 'orders', icon: <FaClipboardList />, label: 'Orders' },
          { key: 'users', icon: <FaUsers />, label: 'Users' },
          { key: 'restaurants', icon: <FaStore />, label: 'Restaurants' },
        ].map(item => (
          <div key={item.key} className={`menu-item ${tab === item.key ? 'active' : ''}`} onClick={() => setTab(item.key)}>
            {item.icon} {item.label}
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        {/* Dashboard Stats */}
        {tab === 'dashboard' && stats && (
          <div>
            <h2 style={{ marginBottom: 24 }}>Dashboard Overview</h2>
            <div className="grid grid-4" style={{ marginBottom: 24 }}>
              <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><div className="stat-value">{stats.stats.totalUsers}</div><div className="stat-label">Total Users</div></div>
                  <FaUsers className="stat-icon" />
                </div>
              </div>
              <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><div className="stat-value">{stats.stats.totalRestaurants}</div><div className="stat-label">Restaurants</div></div>
                  <FaStore className="stat-icon" />
                </div>
              </div>
              <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><div className="stat-value">{stats.stats.totalOrders}</div><div className="stat-label">Total Orders</div></div>
                  <FaClipboardList className="stat-icon" />
                </div>
              </div>
              <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><div className="stat-value">₹{stats.stats.totalRevenue.toLocaleString()}</div><div className="stat-label">Revenue</div></div>
                  <FaRupeeSign className="stat-icon" />
                </div>
              </div>
            </div>

            {/* Orders by Status */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-body">
                <h3>Orders by Status</h3>
                <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                  {stats.ordersByStatus.map(s => (
                    <div key={s._id} className={`badge ${statusColors[s._id]}`} style={{ padding: '8px 16px', fontSize: 14 }}>
                      {s._id}: {s.count}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Restaurants */}
            <div className="card">
              <div className="card-body">
                <h3>Top Restaurants</h3>
                {stats.topRestaurants.map(r => (
                  <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <span>{r.name}</span>
                    <span><FaStar size={12} style={{ color: 'var(--warning)' }} /> {r.rating} ({r.totalReviews} reviews)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div>
            <h2 style={{ marginBottom: 16 }}>All Users</h2>
            <div className="table-container">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className="badge badge-info">{u.role}</span></td>
                      <td>{u.phone}</td>
                      <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td><button className="btn btn-outline btn-sm" onClick={() => toggleUser(u._id)}>{u.isActive ? 'Deactivate' : 'Activate'}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            <h2 style={{ marginBottom: 16 }}>All Orders</h2>
            <div className="table-container">
              <table>
                <thead><tr><th>Order ID</th><th>Customer</th><th>Restaurant</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6).toUpperCase()}</td>
                      <td>{order.customer?.name}</td>
                      <td>{order.restaurant?.name}</td>
                      <td>₹{order.totalAmount}</td>
                      <td><span className={`badge ${statusColors[order.status]}`}>{order.status}</span></td>
                      <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Restaurants Tab */}
        {tab === 'restaurants' && (
          <div>
            <h2 style={{ marginBottom: 16 }}>All Restaurants</h2>
            <div className="table-container">
              <table>
                <thead><tr><th>Name</th><th>Owner</th><th>Cuisine</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {restaurants.map(r => (
                    <tr key={r._id}>
                      <td>{r.name}</td>
                      <td>{r.owner?.name}</td>
                      <td>{r.cuisine?.join(', ')}</td>
                      <td>★ {r.rating}</td>
                      <td><span className={`badge ${r.isActive ? 'badge-success' : 'badge-danger'}`}>{r.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td><button className="btn btn-outline btn-sm" onClick={() => toggleRestaurant(r._id)}>{r.isActive ? 'Deactivate' : 'Activate'}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
