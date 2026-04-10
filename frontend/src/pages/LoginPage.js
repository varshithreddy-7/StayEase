import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthPages.css';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@hotelbooking.com', password: 'admin123' });
    else setForm({ email: 'rahul@example.com', password: 'password123' });
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80" alt="Hotel" />
        <div className="auth-overlay">
          <h2>Welcome back to StayEase</h2>
          <p>Your dream stay is just a login away</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <Link to="/" className="auth-logo"><i className="fas fa-hotel"></i> Stay<em>Ease</em></Link>
          <h1>Sign In</h1>
          <p className="auth-sub">Don't have an account? <Link to="/register">Sign up</Link></p>

          <div className="demo-btns">
            <span>Quick Demo:</span>
            <button type="button" onClick={() => fillDemo('user')}>User Login</button>
            <button type="button" onClick={() => fillDemo('admin')}>Admin Login</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon">
                <i className="fas fa-envelope"></i>
                <input type="email" className="form-control" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-icon">
                <i className="fas fa-lock"></i>
                <input type="password" className="form-control" placeholder="Your password"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Signing in...</> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
