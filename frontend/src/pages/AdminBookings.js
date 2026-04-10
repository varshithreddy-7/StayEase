import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { AdminLayout } from './AdminDashboard';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => API.get('/bookings/all?limit=100').then(r => setBookings(r.data.bookings)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await API.put(`/admin/bookings/${id}`, { status }); toast.success('Status updated'); load(); } catch { toast.error('Error'); }
  };

  const updatePayment = async (id, paymentStatus) => {
    try { await API.put(`/admin/bookings/${id}`, { paymentStatus }); toast.success('Payment status updated'); load(); } catch { toast.error('Error'); }
  };

  const filtered = filter ? bookings.filter(b => b.status === filter) : bookings;
  const statusColor = { pending:'warning', confirmed:'success', cancelled:'danger', completed:'info' };

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1>Manage Bookings</h1>
        <div className="admin-toolbar">
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {['','pending','confirmed','cancelled','completed'].map(s => (
              <button key={s} className={`btn btn-sm ${filter===s?'btn-secondary':'btn-outline'}`} onClick={()=>setFilter(s)}>
                {s||'All'}
              </button>
            ))}
          </div>
          <span style={{fontSize:'14px',color:'var(--text-light)'}}>Total: {filtered.length}</span>
        </div>
        {loading ? <div style={{textAlign:'center',padding:'40px'}}><div className="spinner" style={{margin:'0 auto'}}></div></div> : (
          <div className="admin-card">
            <table className="admin-table">
              <thead><tr><th>Ref</th><th>Guest</th><th>Hotel</th><th>Dates</th><th>Amount</th><th>Status</th><th>Payment</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b._id}>
                    <td style={{fontSize:'12px',fontWeight:'600'}}>{b.bookingReference}</td>
                    <td><div style={{fontWeight:'600'}}>{b.user?.name}</div><div style={{fontSize:'12px',color:'var(--text-light)'}}>{b.user?.email}</div></td>
                    <td><div style={{fontWeight:'600'}}>{b.hotel?.name}</div><div style={{fontSize:'12px',color:'var(--text-light)'}}>{b.hotel?.city}</div></td>
                    <td style={{fontSize:'12px'}}>
                      <div>In: {new Date(b.checkIn).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
                      <div>Out: {new Date(b.checkOut).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
                    </td>
                    <td style={{fontWeight:'700'}}>₹{b.totalPrice?.toLocaleString()}</td>
                    <td><span className={`badge badge-${statusColor[b.status]||'navy'}`}>{b.status}</span></td>
                    <td><span className={`badge badge-${b.paymentStatus==='paid'?'success':b.paymentStatus==='pending'?'warning':'danger'}`}>{b.paymentStatus}</span></td>
                    <td>
                      <select style={{fontSize:'12px',padding:'4px 8px',border:'1px solid var(--border)',borderRadius:'6px',cursor:'pointer'}} value={b.status} onChange={e=>updateStatus(b._id,e.target.value)}>
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
