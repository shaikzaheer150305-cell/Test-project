import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { connectSocket, getSocket } from '../utils/socket';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import { FaStore, FaUtensils, FaClipboardList, FaPlus, FaEdit, FaToggleOn } from 'react-icons/fa';

const VendorDashboard = () => {
  const { user, token } = useAuth();
  const [tab, setTab] = useState('orders');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', discountedPrice: '', category: 'Main Course', isVeg: false, preparationTime: 15 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '', description: '', cuisine: '', phone: '',
    street: '', city: '', state: '', pincode: '',
  });
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [editRestaurant, setEditRestaurant] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await api.get('/restaurants/my');
      setRestaurants(res.data.restaurants);
      if (res.data.restaurants.length > 0 && !selectedRestaurant) {
        setSelectedRestaurant(res.data.restaurants[0]);
      }
    } catch (err) { console.error(err); }
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!selectedRestaurant) return;
    try {
      const res = await api.get(`/orders/restaurant/${selectedRestaurant._id}`);
      setOrders(res.data.orders);
    } catch (err) { console.error(err); }
  }, [selectedRestaurant]);

  const fetchFoodItems = useCallback(async () => {
    if (!selectedRestaurant) return;
    try {
      const res = await api.get(`/restaurants/${selectedRestaurant._id}`);
      setFoodItems(res.data.foodItems);
    } catch (err) { console.error(err); }
  }, [selectedRestaurant]);

  useEffect(() => { fetchRestaurants(); }, []);
  useEffect(() => { fetchOrders(); fetchFoodItems(); }, [selectedRestaurant]);

  useEffect(() => {
    if (!token || !selectedRestaurant) return;
    const socket = connectSocket(token);
    socket.emit('join_restaurant', selectedRestaurant._id);

    socket.on('new_order', (data) => {
      toast.info(`New order received! #${data.orderId.slice(-6)}`);
      fetchOrders();
    });

    return () => { socket.off('new_order'); };
  }, [token, selectedRestaurant, fetchOrders]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      const socket = getSocket();
      const order = orders.find(o => o._id === orderId);
      if (status === 'ready') {
        socket.emit('order_ready', { orderId, restaurantId: selectedRestaurant._id, restaurantAddress: selectedRestaurant.address });
      } else if (['confirmed', 'preparing'].includes(status)) {
        socket.emit('order_status_update', {
          orderId, customerId: order.customer._id, status,
          message: status === 'confirmed' ? 'Your order has been confirmed!' : 'Your order is being prepared!',
        });
      }
      fetchOrders();
      toast.success(`Order ${status}`);
    } catch (err) { toast.error('Failed to update order'); }
  };

  const addFoodItem = async (e) => {
    e.preventDefault();
    try {
      const itemData = { ...newItem, restaurant: selectedRestaurant._id, price: Number(newItem.price), discountedPrice: newItem.discountedPrice ? Number(newItem.discountedPrice) : undefined };
      await api.post('/restaurants/items', itemData);
      toast.success('Food item added!');
      setShowAddForm(false);
      setNewItem({ name: '', description: '', price: '', discountedPrice: '', category: 'Main Course', isVeg: false, preparationTime: 15 });
      fetchFoodItems();
    } catch (err) { toast.error('Failed to add item'); }
  };

  const toggleItemAvailability = async (itemId, currentStatus) => {
    try {
      await api.put(`/restaurants/items/${itemId}`, { isAvailable: !currentStatus });
      fetchFoodItems();
    } catch (err) { toast.error('Failed to update'); }
  };

  const createRestaurant = async (e) => {
    e.preventDefault();
    try {
      const data = { ...newRestaurant, cuisine: newRestaurant.cuisine.split(',').map(c => c.trim()) };
      await api.post('/restaurants', data);
      toast.success('Restaurant created!');
      setShowRestaurantForm(false);
      setNewRestaurant({ name: '', description: '', cuisine: '', phone: '', street: '', city: '', state: '', pincode: '' });
      fetchRestaurants();
    } catch (err) { toast.error('Failed to create restaurant'); }
  };

  const startEditRestaurant = () => {
    if (!selectedRestaurant) return;
    setEditRestaurant({
      name: selectedRestaurant.name,
      description: selectedRestaurant.description,
      cuisine: (selectedRestaurant.cuisine || []).join(', '),
      phone: selectedRestaurant.phone,
      street: selectedRestaurant.address?.street || '',
      city: selectedRestaurant.address?.city || '',
      state: selectedRestaurant.address?.state || '',
      pincode: selectedRestaurant.address?.pincode || '',
      openingTime: selectedRestaurant.openingTime,
      closingTime: selectedRestaurant.closingTime,
    });
    setShowEditForm(true);
  };

  const updateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: editRestaurant.name,
        description: editRestaurant.description,
        cuisine: editRestaurant.cuisine.split(',').map(c => c.trim()),
        phone: editRestaurant.phone,
        address: {
          street: editRestaurant.street,
          city: editRestaurant.city,
          state: editRestaurant.state,
          pincode: editRestaurant.pincode,
        },
        openingTime: editRestaurant.openingTime,
        closingTime: editRestaurant.closingTime,
      };
      const res = await api.put(`/restaurants/${selectedRestaurant._id}`, data);
      setSelectedRestaurant(res.data.restaurant);
      setShowEditForm(false);
      setEditRestaurant(null);
      toast.success('Restaurant updated!');
      fetchRestaurants();
    } catch (err) { toast.error('Failed to update restaurant'); }
  };

  const toggleRestaurantOpen = async () => {
    try {
      const res = await api.put(`/restaurants/${selectedRestaurant._id}/toggle-open`);
      setSelectedRestaurant(res.data.restaurant);
      fetchRestaurants();
      toast.success(res.data.restaurant.isOpen ? 'Restaurant is now open' : 'Restaurant is now closed');
    } catch (err) { toast.error('Failed to toggle status'); }
  };

  const statusColors = {
    placed: 'badge-info', confirmed: 'badge-primary', preparing: 'badge-warning',
    ready: 'badge-success', dispatched: 'badge-info', on_the_way: 'badge-primary',
    delivered: 'badge-success', cancelled: 'badge-danger',
  };

  const categories = ['Starters', 'Main Course', 'Breads', 'Rice', 'Biryani', 'South Indian', 'Snacks', 'Desserts', 'Beverages', 'Thali', 'Combos', 'Street Food'];

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2 style={{ marginBottom: 32, fontSize: '1.2rem' }}>Vendor Panel</h2>
        {[
          { key: 'orders', icon: <FaClipboardList />, label: 'Orders' },
          { key: 'menu', icon: <FaUtensils />, label: 'Menu Items' },
          { key: 'restaurant', icon: <FaStore />, label: 'Restaurant' },
        ].map(item => (
          <div key={item.key} className={`menu-item ${tab === item.key ? 'active' : ''}`} onClick={() => setTab(item.key)}>
            {item.icon} {item.label}
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        {/* Restaurant Selector */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={selectedRestaurant?._id || ''} onChange={e => setSelectedRestaurant(restaurants.find(r => r._id === e.target.value))}
            style={{ padding: 10, borderRadius: 8, border: '2px solid #dee2e6', fontSize: 14 }}>
            {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => setShowRestaurantForm(true)}><FaPlus /> New Restaurant</button>
        </div>

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            <h2 style={{ marginBottom: 16 }}>Recent Orders</h2>
            {orders.length === 0 ? (
              <div className="empty-state"><h3>No orders yet</h3></div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-6).toUpperCase()}</td>
                        <td>{order.customer?.name}</td>
                        <td>{order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</td>
                        <td>₹{order.totalAmount}</td>
                        <td><span className={`badge ${statusColors[order.status]}`}>{order.status}</span></td>
                        <td>
                          {order.status === 'placed' && (
                            <button className="btn btn-success btn-sm" onClick={() => updateOrderStatus(order._id, 'confirmed')}>Accept</button>
                          )}
                          {order.status === 'confirmed' && (
                            <button className="btn btn-warning btn-sm" onClick={() => updateOrderStatus(order._id, 'preparing')}>Start Prep</button>
                          )}
                          {order.status === 'preparing' && (
                            <button className="btn btn-success btn-sm" onClick={() => updateOrderStatus(order._id, 'ready')}>Ready</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Menu Tab */}
        {tab === 'menu' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2>Menu Items</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(true)}><FaPlus /> Add Item</button>
            </div>

            {showAddForm && (
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-body">
                  <h3 style={{ marginBottom: 16 }}>Add New Item</h3>
                  <form onSubmit={addFoodItem}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="form-group">
                        <label>Name *</label>
                        <input required value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Category *</label>
                        <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      <div className="form-group">
                        <label>Price ₹ *</label>
                        <input type="number" required value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Discounted Price ₹</label>
                        <input type="number" value={newItem.discountedPrice} onChange={e => setNewItem({ ...newItem, discountedPrice: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Prep Time (min)</label>
                        <input type="number" value={newItem.preparationTime} onChange={e => setNewItem({ ...newItem, preparationTime: Number(e.target.value) })} />
                      </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <input type="checkbox" checked={newItem.isVeg} onChange={e => setNewItem({ ...newItem, isVeg: e.target.checked })} />
                      Vegetarian
                    </label>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button className="btn btn-primary" type="submit">Add Item</button>
                      <button className="btn btn-outline" type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Name</th><th>Category</th><th>Price</th><th>VEG</th><th>Available</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {foodItems.map(item => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>₹{item.discountedPrice || item.price}</td>
                      <td><span className={`badge ${item.isVeg ? 'badge-success' : 'badge-danger'}`}>{item.isVeg ? 'VEG' : 'NON-VEG'}</span></td>
                      <td><span className={`badge ${item.isAvailable ? 'badge-success' : 'badge-danger'}`}>{item.isAvailable ? 'Available' : 'Unavailable'}</span></td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => toggleItemAvailability(item._id, item.isAvailable)}>
                          <FaToggleOn /> Toggle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Restaurant Tab */}
        {tab === 'restaurant' && (
          <div>
            <h2 style={{ marginBottom: 16 }}>Restaurant Details</h2>
            {selectedRestaurant && (
              <div className="card">
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>{selectedRestaurant.name}</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={startEditRestaurant}><FaEdit /> Edit</button>
                      <button className={`btn ${selectedRestaurant.isOpen ? 'btn-warning' : 'btn-success'} btn-sm`} onClick={toggleRestaurantOpen}>
                        <FaToggleOn /> {selectedRestaurant.isOpen ? 'Close' : 'Open'}
                      </button>
                    </div>
                  </div>
                  <p style={{ color: '#6c757d' }}>{selectedRestaurant.description}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                    <div>
                      <p><strong>Cuisine:</strong> {selectedRestaurant.cuisine?.join(', ')}</p>
                      <p><strong>Rating:</strong> ★ {selectedRestaurant.rating}</p>
                      <p><strong>Total Reviews:</strong> {selectedRestaurant.totalReviews}</p>
                    </div>
                    <div>
                      <p><strong>Timing:</strong> {selectedRestaurant.openingTime} - {selectedRestaurant.closingTime}</p>
                      <p><strong>Delivery Time:</strong> {selectedRestaurant.averageDeliveryTime} min</p>
                      <p><strong>Status:</strong> <span className={`badge ${selectedRestaurant.isOpen ? 'badge-success' : 'badge-danger'}`}>
                        {selectedRestaurant.isOpen ? 'Open' : 'Closed'}
                      </span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showEditForm && editRestaurant && (
              <div className="card" style={{ marginTop: 20 }}>
                <div className="card-body">
                  <h3>Edit Restaurant</h3>
                  <form onSubmit={updateRestaurant}>
                    <div className="form-group">
                      <label>Name *</label>
                      <input required value={editRestaurant.name} onChange={e => setEditRestaurant({ ...editRestaurant, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea value={editRestaurant.description} onChange={e => setEditRestaurant({ ...editRestaurant, description: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Cuisine (comma separated) *</label>
                      <input required value={editRestaurant.cuisine} onChange={e => setEditRestaurant({ ...editRestaurant, cuisine: e.target.value })} placeholder="North Indian, Biryani, Mughlai" />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input required value={editRestaurant.phone} onChange={e => setEditRestaurant({ ...editRestaurant, phone: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="form-group"><label>Street *</label><input required value={editRestaurant.street} onChange={e => setEditRestaurant({ ...editRestaurant, street: e.target.value })} /></div>
                      <div className="form-group"><label>City *</label><input required value={editRestaurant.city} onChange={e => setEditRestaurant({ ...editRestaurant, city: e.target.value })} /></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="form-group"><label>State *</label><input required value={editRestaurant.state} onChange={e => setEditRestaurant({ ...editRestaurant, state: e.target.value })} /></div>
                      <div className="form-group"><label>Pincode *</label><input required value={editRestaurant.pincode} onChange={e => setEditRestaurant({ ...editRestaurant, pincode: e.target.value })} /></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="form-group"><label>Opening Time</label><input type="time" value={editRestaurant.openingTime} onChange={e => setEditRestaurant({ ...editRestaurant, openingTime: e.target.value })} /></div>
                      <div className="form-group"><label>Closing Time</label><input type="time" value={editRestaurant.closingTime} onChange={e => setEditRestaurant({ ...editRestaurant, closingTime: e.target.value })} /></div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button className="btn btn-primary" type="submit">Save Changes</button>
                      <button className="btn btn-outline" type="button" onClick={() => { setShowEditForm(false); setEditRestaurant(null); }}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showRestaurantForm && (
              <div className="card" style={{ marginTop: 20 }}>
                <div className="card-body">
                  <h3>Create New Restaurant</h3>
                  <form onSubmit={createRestaurant}>
                    <div className="form-group">
                      <label>Name *</label>
                      <input required value={newRestaurant.name} onChange={e => setNewRestaurant({ ...newRestaurant, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea value={newRestaurant.description} onChange={e => setNewRestaurant({ ...newRestaurant, description: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Cuisine (comma separated) *</label>
                      <input required value={newRestaurant.cuisine} onChange={e => setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })} placeholder="North Indian, Biryani, Mughlai" />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input required value={newRestaurant.phone} onChange={e => setNewRestaurant({ ...newRestaurant, phone: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="form-group"><label>Street *</label><input required value={newRestaurant.street} onChange={e => setNewRestaurant({ ...newRestaurant, street: e.target.value })} /></div>
                      <div className="form-group"><label>City *</label><input required value={newRestaurant.city} onChange={e => setNewRestaurant({ ...newRestaurant, city: e.target.value })} /></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="form-group"><label>State *</label><input required value={newRestaurant.state} onChange={e => setNewRestaurant({ ...newRestaurant, state: e.target.value })} /></div>
                      <div className="form-group"><label>Pincode *</label><input required value={newRestaurant.pincode} onChange={e => setNewRestaurant({ ...newRestaurant, pincode: e.target.value })} /></div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button className="btn btn-primary" type="submit">Create</button>
                      <button className="btn btn-outline" type="button" onClick={() => setShowRestaurantForm(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
