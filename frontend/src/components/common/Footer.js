import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-main">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-logo"><i className="fas fa-hotel"></i> Stay<em>Ease</em></div>
            <p>India's premier hotel booking platform. Discover extraordinary stays at unbeatable prices across the country.</p>
            <div className="social-links">
              <a href="#!"><i className="fab fa-facebook-f"></i></a>
              <a href="#!"><i className="fab fa-instagram"></i></a>
              <a href="#!"><i className="fab fa-twitter"></i></a>
              <a href="#!"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/hotels">All Hotels</Link></li>
              <li><Link to="/hotels?category=luxury">Luxury Hotels</Link></li>
              <li><Link to="/hotels?category=resort">Resorts</Link></li>
              <li><Link to="/hotels?category=budget">Budget Stays</Link></li>
              <li><Link to="/hotels?category=boutique">Boutique Hotels</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
              <li><Link to="/dashboard">My Bookings</Link></li>
              <li><Link to="/dashboard/wishlist">Wishlist</Link></li>
              <li><Link to="/dashboard/profile">Profile</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul className="contact-list">
              <li><i className="fas fa-map-marker-alt"></i> Mumbai, Maharashtra, India</li>
              <li><i className="fas fa-phone"></i> +91-1800-123-4567</li>
              <li><i className="fas fa-envelope"></i> support@stayease.com</li>
              <li><i className="fas fa-clock"></i> 24/7 Customer Support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} StayEase. All rights reserved.</p>
        <div className="payment-icons">
          <i className="fab fa-cc-visa"></i>
          <i className="fab fa-cc-mastercard"></i>
          <i className="fab fa-cc-stripe"></i>
          <i className="fab fa-google-pay"></i>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
