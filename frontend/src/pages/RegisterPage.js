import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthPages.css';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.phone);
      toast.success(`Welcome to StayEase, ${user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80" alt="Hotel" />
        <div className="auth-overlay">
          <h2>Join StayEase Today</h2>
          <p>Unlock exclusive deals and personalised recommendations</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <Link to="/" className="auth-logo"><i className="fas fa-hotel"></i> Stay<em>Ease</em></Link>
          <h1>Create Account</h1>
          <p className="auth-sub">Already have an account? <Link to="/login">Sign in</Link></p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-icon">
                <i className="fas fa-user"></i>
                <input type="text" className="form-control" placeholder="John Doe"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
            </div>
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
                <input type="password" className="form-control" placeholder="Min 6 characters"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              </div>
            </div>
            <div className="form-group">
              <label>Phone (Optional)</label>
              <div className="input-icon">
                <i className="fas fa-phone"></i>
                <input type="tel" className="form-control" placeholder="+91-9876543210"
                  value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating account...</> : 'Create Account'}
            </button>
          </form>
          <p style={{ fontSize: '12px', color: 'var(--text-light)', textAlign: 'center', marginTop: '16px' }}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
