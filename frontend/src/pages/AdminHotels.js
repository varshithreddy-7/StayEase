import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { AdminLayout } from './AdminDashboard';
import './AdminDashboard.css';

const emptyHotel = { name:'', description:'', city:'', address:'', country:'India', category:'luxury', pricePerNight:'', featuredImage:'', amenities:'', featured:false, checkInTime:'14:00', checkOutTime:'11:00', roomTypes:[{name:'standard',description:'',price:'',capacity:2,quantity:10},{name:'deluxe',description:'',price:'',capacity:2,quantity:8},{name:'suite',description:'',price:'',capacity:4,quantity:4}] };

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyHotel);
  const [search, setSearch] = useState('');

  const load = () => API.get('/hotels?limit=100').then(r => setHotels(r.data.hotels)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyHotel); setEditing(null); setModal(true); };
  const openEdit = (h) => {
    setForm({ ...h, amenities: h.amenities?.join(', ') || '', roomTypes: h.roomTypes?.length ? h.roomTypes.map(r => ({...r})) : emptyHotel.roomTypes });
    setEditing(h._id); setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean), pricePerNight: Number(form.pricePerNight), roomTypes: form.roomTypes.map(r => ({...r, price: Number(r.price), capacity: Number(r.capacity), quantity: Number(r.quantity) })) };
    try {
      if (editing) { await API.put(`/hotels/${editing}`, payload); toast.success('Hotel updated'); }
      else { await API.post('/hotels', payload); toast.success('Hotel created'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this hotel?')) return;
    try { await API.delete(`/hotels/${id}`); toast.success('Hotel deleted'); load(); } catch { toast.error('Error'); }
  };

  const updateRoom = (i, k, v) => { const rt = [...form.roomTypes]; rt[i] = {...rt[i],[k]:v}; setForm(f=>({...f,roomTypes:rt})); };

  const filtered = hotels.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="admin-page">
        <h1>Manage Hotels</h1>
        <div className="admin-toolbar">
          <div className="admin-search"><i className="fas fa-search"></i><input placeholder="Search hotels..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
          <button className="btn btn-primary" onClick={openAdd}><i className="fas fa-plus"></i> Add Hotel</button>
        </div>
        {loading ? <div style={{textAlign:'center',padding:'40px'}}><div className="spinner" style={{margin:'0 auto'}}></div></div> : (
          <div className="admin-card">
            <table className="admin-table">
              <thead><tr><th>Hotel</th><th>City</th><th>Category</th><th>Price/Night</th><th>Rating</th><th>Featured</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(h => (
                  <tr key={h._id}>
                    <td><strong>{h.name}</strong></td>
                    <td>{h.city}</td>
                    <td><span className="badge badge-gold">{h.category}</span></td>
                    <td>₹{h.pricePerNight?.toLocaleString()}</td>
                    <td>⭐ {h.rating?.toFixed(1)}</td>
                    <td>{h.featured ? <span className="badge badge-success">Yes</span> : <span className="badge badge-navy">No</span>}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" style={{marginRight:'8px'}} onClick={()=>openEdit(h)}><i className="fas fa-edit"></i></button>
                      <button className="btn btn-danger btn-sm" onClick={()=>del(h._id)}><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modal && (
          <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
            <div className="modal-box" style={{maxWidth:'720px'}}>
              <div className="modal-header">
                <h2>{editing ? 'Edit Hotel' : 'Add New Hotel'}</h2>
                <button className="modal-close" onClick={()=>setModal(false)}>×</button>
              </div>
              <form onSubmit={save}>
                <div className="modal-form">
                  <div className="form-row">
                    <div className="form-group"><label>Hotel Name *</label><input className="form-control" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required /></div>
                    <div className="form-group"><label>City *</label><input className="form-control" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} required /></div>
                  </div>
                  <div className="form-group"><label>Address *</label><input className="form-control" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} required /></div>
                  <div className="form-row">
                    <div className="form-group"><label>Category</label>
                      <select className="form-control" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                        {['luxury','resort','boutique','business','mid-range','budget'].map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group"><label>Base Price/Night (₹) *</label><input type="number" className="form-control" value={form.pricePerNight} onChange={e=>setForm(f=>({...f,pricePerNight:e.target.value}))} required /></div>
                  </div>
                  <div className="form-group"><label>Description *</label><textarea className="form-control" rows="3" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} required></textarea></div>
                  <div className="form-group"><label>Featured Image URL</label><input className="form-control" value={form.featuredImage} onChange={e=>setForm(f=>({...f,featuredImage:e.target.value}))} /></div>
                  <div className="form-group"><label>Amenities (comma separated)</label><input className="form-control" value={form.amenities} onChange={e=>setForm(f=>({...f,amenities:e.target.value}))} placeholder="WiFi, Pool, Spa, Gym..." /></div>
                  <div className="form-row">
                    <div className="form-group"><label>Check-in Time</label><input className="form-control" value={form.checkInTime} onChange={e=>setForm(f=>({...f,checkInTime:e.target.value}))} /></div>
                    <div className="form-group"><label>Check-out Time</label><input className="form-control" value={form.checkOutTime} onChange={e=>setForm(f=>({...f,checkOutTime:e.target.value}))} /></div>
                  </div>
                  <div className="form-group"><label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}><input type="checkbox" checked={form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))} /> Mark as Featured</label></div>
                  <h4 style={{marginBottom:'12px',color:'var(--navy)'}}>Room Types</h4>
                  {form.roomTypes.map((r,i)=>(
                    <div key={r.name} style={{background:'var(--cream)',borderRadius:'8px',padding:'14px',marginBottom:'10px'}}>
                      <strong style={{textTransform:'capitalize',display:'block',marginBottom:'10px'}}>{r.name}</strong>
                      <div className="form-row">
                        <div className="form-group"><label>Price/Night (₹)</label><input type="number" className="form-control" value={r.price} onChange={e=>updateRoom(i,'price',e.target.value)} /></div>
                        <div className="form-group"><label>Quantity</label><input type="number" className="form-control" value={r.quantity} onChange={e=>updateRoom(i,'quantity',e.target.value)} /></div>
                      </div>
                      <div className="form-group"><label>Description</label><input className="form-control" value={r.description} onChange={e=>updateRoom(i,'description',e.target.value)} /></div>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',gap:'12px',marginTop:'20px'}}>
                  <button type="submit" className="btn btn-primary">{editing ? 'Update Hotel' : 'Create Hotel'}</button>
                  <button type="button" className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
