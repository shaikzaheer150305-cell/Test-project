import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaUtensils } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case 'vendor': return '/vendor';
      case 'admin': return '/admin';
      case 'delivery': return '/delivery';
      default: return '/orders';
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <FaUtensils style={{ marginRight: 8 }} />
        Indian<span>FoodCourt</span>
      </Link>
      <div className="nav-links">
        <Link to="/restaurants">Restaurants</Link>
        {user ? (
          <>
            {user.role === 'customer' && (
              <Link to="/cart" className="cart-badge">
                <FaShoppingCart /> Cart
                {totalItems > 0 && <span className="count">{totalItems}</span>}
              </Link>
            )}
            <Link to={getDashboardLink()}>
              {user.role === 'customer' ? 'My Orders' : 'Dashboard'}
            </Link>
            <Link to="/profile">
              <FaUser /> {user.name}
            </Link>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"><button className="btn btn-outline btn-sm">Login</button></Link>
            <Link to="/register"><button className="btn btn-primary btn-sm">Register</button></Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
