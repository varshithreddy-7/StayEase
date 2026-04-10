import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-hotel"></i>
          <span>Stay<em>Ease</em></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/hotels" onClick={() => setMenuOpen(false)}>Hotels</NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink>
          )}
        </div>

        <div className="navbar-right">
          {user ? (
            <div className="user-menu">
              <button className="user-trigger" onClick={() => setDropdownOpen(o => !o)}>
                <div className="avatar">{user.name[0].toUpperCase()}</div>
                <span>{user.name.split(' ')[0]}</span>
                <i className={`fas fa-chevron-down ${dropdownOpen ? 'rotated' : ''}`}></i>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)}><i className="fas fa-user"></i> My Profile</Link>
                  <Link to="/dashboard/bookings" onClick={() => setDropdownOpen(false)}><i className="fas fa-calendar-check"></i> My Bookings</Link>
                  <Link to="/dashboard/wishlist" onClick={() => setDropdownOpen(false)}><i className="fas fa-heart"></i> Wishlist</Link>
                  {user.role === 'admin' && <Link to="/admin" onClick={() => setDropdownOpen(false)}><i className="fas fa-cog"></i> Admin Panel</Link>}
                  <hr />
                  <button onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-nav-outline">Login</Link>
              <Link to="/register" className="btn-nav-solid">Sign Up</Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)}>
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
