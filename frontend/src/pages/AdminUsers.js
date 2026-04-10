import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { AdminLayout } from './AdminDashboard';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => API.get('/users?limit=100').then(r => setUsers(r.data.users)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const toggle = async (id) => {
    try { await API.put(`/users/${id}/status`); toast.success('Status updated'); load(); } catch { toast.error('Error'); }
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1>Manage Users</h1>
        <div className="admin-toolbar">
          <div className="admin-search"><i className="fas fa-search"></i><input placeholder="Search users..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
          <span style={{fontSize:'14px',color:'var(--text-light)'}}>Total: {filtered.length}</span>
        </div>
        {loading ? <div style={{textAlign:'center',padding:'40px'}}><div className="spinner" style={{margin:'0 auto'}}></div></div> : (
          <div className="admin-card">
            <table className="admin-table">
              <thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id}>
                    <td><div style={{display:'flex',alignItems:'center',gap:'10px'}}><div style={{width:'36px',height:'36px',borderRadius:'50%',background:'var(--navy)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'700',fontSize:'14px',flexShrink:0}}>{u.name[0].toUpperCase()}</div><strong>{u.name}</strong></div></td>
                    <td>{u.email}</td>
                    <td>{u.phone||'-'}</td>
                    <td><span className={`badge badge-${u.role==='admin'?'gold':'navy'}`}>{u.role}</span></td>
                    <td style={{fontSize:'12px'}}>{new Date(u.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                    <td><span className={`badge badge-${u.isActive?'success':'danger'}`}>{u.isActive?'Active':'Inactive'}</span></td>
                    <td><button className={`btn btn-sm ${u.isActive?'btn-danger':'btn-primary'}`} onClick={()=>toggle(u._id)} disabled={u.role==='admin'}>{u.isActive?'Deactivate':'Activate'}</button></td>
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
