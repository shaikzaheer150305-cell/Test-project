import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', {
        name: formData.name,
        phone: formData.phone,
        address: { street: formData.street, city: formData.city, state: formData.state, pincode: formData.pincode },
      });
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: 600, marginTop: 40 }}>
      <div className="card">
        <div className="card-body">
          <h2 style={{ marginBottom: 24 }}>My Profile</h2>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto', fontSize: 32, color: 'white', fontWeight: 700
            }}>
              {user?.name?.charAt(0)}
            </div>
            <p style={{ marginTop: 8, color: '#6c757d', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={user?.email} disabled style={{ background: '#f5f5f5' }} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <h3 style={{ marginTop: 24, marginBottom: 16 }}>Address</h3>
            <div className="form-group">
              <label>Street</label>
              <input value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>City</label>
                <input value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
