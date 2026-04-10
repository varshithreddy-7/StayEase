import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './UserDashboard.css';

const statusColor = { pending: 'warning', confirmed: 'success', cancelled: 'danger', completed: 'info' };

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const { data } = await API.put('/auth/updateprofile', form);
      updateUser(data.user); toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) { toast.error('New password must be 6+ characters'); return; }
    try {
      await API.put('/auth/changepassword', pwForm);
      toast.success('Password changed!'); setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <h2 className="dash-title">My Profile</h2>
      <div className="profile-grid">
        <div className="dash-card">
          <h3>Personal Information</h3>
          <div className="profile-avatar-section">
            <div className="big-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div><h4>{user?.name}</h4><p>{user?.email}</p><span className={`badge badge-${user?.role === 'admin' ? 'gold' : 'navy'}`}>{user?.role}</span></div>
          </div>
          <form onSubmit={saveProfile}>
            <div className="form-group"><label>Full Name</label><input type="text" className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label>Phone</label><input type="tel" className="form-control" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div className="form-group"><label>Email</label><input type="email" className="form-control" value={user?.email} disabled /></div>
            <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
        <div className="dash-card">
          <h3>Change Password</h3>
          <form onSubmit={changePassword}>
            <div className="form-group"><label>Current Password</label><input type="password" className="form-control" value={pwForm.currentPassword} onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} required /></div>
            <div className="form-group"><label>New Password</label><input type="password" className="form-control" value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} required /></div>
            <button className="btn btn-secondary">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/bookings/my').then(r => setBookings(r.data.bookings)).finally(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      setBookings(b => b.map(x => x._id === id ? { ...x, status: 'cancelled' } : x));
      toast.success('Booking cancelled');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>;

  return (
    <div>
      <h2 className="dash-title">My Bookings</h2>
      {bookings.length === 0 ? (
        <div className="empty-state"><i className="fas fa-calendar-times"></i><h3>No bookings yet</h3><p>Start exploring hotels to make your first booking!</p><a href="/hotels" className="btn btn-primary">Browse Hotels</a></div>
      ) : (
        <div className="bookings-list">
          {bookings.map(b => (
            <div key={b._id} className="booking-item">
              <img src={b.hotel?.featuredImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200'} alt=""
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200'; }} />
              <div className="booking-details">
                <div className="booking-top">
                  <div>
                    <h3>{b.hotel?.name}</h3>
                    <p><i className="fas fa-map-marker-alt"></i> {b.hotel?.city}</p>
                  </div>
                  <span className={`badge badge-${statusColor[b.status]}`}>{b.status}</span>
                </div>
                <div className="booking-meta">
                  <span><i className="fas fa-bed"></i> {b.roomType}</span>
                  <span><i className="fas fa-sign-in-alt"></i> {new Date(b.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span><i className="fas fa-sign-out-alt"></i> {new Date(b.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span><i className="fas fa-moon"></i> {b.nights} nights</span>
                </div>
                <div className="booking-footer">
                  <div>
                    <span className="ref">#{b.bookingReference}</span>
                    <span className={`pay-status ${b.paymentStatus}`}><i className="fas fa-credit-card"></i> {b.paymentStatus}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <strong className="booking-amount">₹{b.totalPrice?.toLocaleString()}</strong>
                    {b.status === 'confirmed' && <button className="btn btn-danger btn-sm" onClick={() => cancel(b._id)}>Cancel</button>}
                    {b.status === 'pending' && b.paymentStatus === 'pending' && <a href={`/payment/${b._id}`} className="btn btn-primary btn-sm">Pay Now</a>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleWishlist } = useAuth();

  useEffect(() => {
    API.get('/users/wishlist').then(r => setWishlist(r.data.wishlist)).finally(() => setLoading(false));
  }, []);

  const remove = async (hotelId) => {
    await toggleWishlist(hotelId);
    setWishlist(w => w.filter(h => h._id !== hotelId));
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>;

  return (
    <div>
      <h2 className="dash-title">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="empty-state"><i className="fas fa-heart"></i><h3>Wishlist is empty</h3><p>Save your favourite hotels to view them here</p><a href="/hotels" className="btn btn-primary">Explore Hotels</a></div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(h => (
            <div key={h._id} className="wish-card">
              <div className="wish-img">
                <img src={h.featuredImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'} alt={h.name}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300'; }} />
                <button className="wish-remove" onClick={() => remove(h._id)}><i className="fas fa-heart"></i></button>
              </div>
              <div className="wish-body">
                <h3>{h.name}</h3>
                <p><i className="fas fa-map-marker-alt"></i> {h.city}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <strong>₹{h.pricePerNight?.toLocaleString()}/night</strong>
                  <a href={`/hotels/${h._id}`} className="btn btn-primary btn-sm">View</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const UserDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="dashboard-page">
      <div className="dash-sidebar">
        <div className="dash-user-info">
          <div className="dash-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>
        <nav className="dash-nav">
          <NavLink to="/dashboard" end><i className="fas fa-user"></i> Profile</NavLink>
          <NavLink to="/dashboard/bookings"><i className="fas fa-calendar-check"></i> Bookings</NavLink>
          <NavLink to="/dashboard/wishlist"><i className="fas fa-heart"></i> Wishlist</NavLink>
        </nav>
      </div>
      <div className="dash-content">
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;
