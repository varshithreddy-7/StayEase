import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'40px 24px',background:'var(--cream)'}}>
      <div>
        <div style={{fontSize:'120px',fontWeight:'900',color:'var(--border)',fontFamily:'var(--font-display)',lineHeight:1}}>404</div>
        <h1 style={{fontFamily:'var(--font-display)',fontSize:'32px',color:'var(--navy)',margin:'16px 0 12px'}}>Page Not Found</h1>
        <p style={{color:'var(--text-light)',fontSize:'16px',marginBottom:'32px'}}>The page you're looking for doesn't exist or has been moved.</p>
        <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
          <Link to="/" className="btn btn-primary btn-lg"><i className="fas fa-home"></i> Go Home</Link>
          <Link to="/hotels" className="btn btn-outline btn-lg"><i className="fas fa-hotel"></i> Browse Hotels</Link>
        </div>
      </div>
    </div>
  );
}
