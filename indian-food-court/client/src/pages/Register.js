import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', role: 'customer',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = formData;
      const result = await register(data);
      toast.success('Registration successful!');
      const redirectMap = { vendor: '/vendor', admin: '/admin', delivery: '/delivery' };
      navigate(redirectMap[result.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join Indian Food Court</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>I am a</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="vendor">Restaurant Owner</option>
              <option value="delivery">Delivery Partner</option>
            </select>
          </div>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" required placeholder="Your name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" required placeholder="your@email.com" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" required placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" required minLength={6} placeholder="Min 6 characters" value={formData.password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input name="confirmPassword" type="password" required placeholder="Re-enter password" value={formData.confirmPassword} onChange={handleChange} />
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <div className="switch-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
