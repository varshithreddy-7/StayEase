import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand"><i className="fas fa-hotel"></i> StayEase <span>Admin</span></div>
        <nav className="admin-nav">
          <NavLink to="/admin" end><i className="fas fa-chart-line"></i> Dashboard</NavLink>
          <NavLink to="/admin/hotels"><i className="fas fa-hotel"></i> Hotels</NavLink>
          <NavLink to="/admin/bookings"><i className="fas fa-calendar-check"></i> Bookings</NavLink>
          <NavLink to="/admin/users"><i className="fas fa-users"></i> Users</NavLink>
        </nav>
        <div className="admin-user-info">
          <div className="small-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div><p>{user?.name}</p><span>Administrator</span></div>
        </div>
        <button className="admin-logout" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</button>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => { API.get('/admin/stats').then(r => setStats(r.data.stats)); }, []);
  if (!stats) return <AdminLayout><div className="loading-screen"><div className="spinner"></div></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1>Dashboard Overview</h1>
        <div className="stat-cards">
          {[
            { label: 'Total Hotels', value: stats.totalHotels, icon: 'fa-hotel', color: '#c9a84c' },
            { label: 'Total Bookings', value: stats.totalBookings, icon: 'fa-calendar-check', color: '#27ae60' },
            { label: 'Total Users', value: stats.totalUsers, icon: 'fa-users', color: '#3498db' },
            { label: 'Total Revenue', value: `₹${Math.round(stats.revenue / 1000)}K`, icon: 'fa-rupee-sign', color: '#9b59b6' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ '--accent': s.color }}>
              <div className="stat-icon"><i className={`fas ${s.icon}`}></i></div>
              <div><span>{s.label}</span><strong>{s.value}</strong></div>
            </div>
          ))}
        </div>
        <div className="admin-grid-2">
          <div className="admin-card">
            <h2>Recent Bookings</h2>
            <table className="admin-table">
              <thead><tr><th>Guest</th><th>Hotel</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {stats.recentBookings.map(b => (
                  <tr key={b._id}>
                    <td>{b.user?.name}</td>
                    <td>{b.hotel?.name}</td>
                    <td>₹{b.totalPrice?.toLocaleString()}</td>
                    <td><span className={`badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'pending' ? 'warning' : 'danger'}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-card">
            <h2>Booking Status</h2>
            {stats.bookingsByStatus.map(s => (
              <div key={s._id} className="status-bar">
                <span>{s._id}</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(100, (s.count / stats.totalBookings) * 100)}%` }}></div></div>
                <strong>{s.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export { AdminLayout };
export default AdminDashboard;
