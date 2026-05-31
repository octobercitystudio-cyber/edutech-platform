import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="landing-nav" style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: 'var(--space-4) var(--space-8)',
      backgroundColor: 'var(--surface-color)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <h2 
        style={{color: 'var(--primary-color)', margin: 0, fontSize: '2.2rem', cursor: 'pointer'}} 
        onClick={() => navigate('/')}
      >
        علمني
      </h2>
      
      <div className="nav-links" style={{display: 'flex', gap: 'var(--space-6)'}}>
        <Link to="/" style={{color: 'var(--text-main)', textDecoration: 'none', fontWeight: 'bold'}}>الرئيسية</Link>
        <Link to="/courses" style={{color: 'var(--text-main)', textDecoration: 'none', fontWeight: 'bold'}}>الكورسات</Link>
      </div>

      <div className="nav-actions" style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
        {(userId && userId !== 'undefined' && userId !== 'null') ? (
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <span style={{fontWeight: 'bold', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '5px'}}>
              <MdAccountCircle size={24} />
              أهلاً، {userName || 'طالب'}
            </span>
            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>اللوحة الرئيسية</button>
            <button className="btn btn-outline" style={{borderColor: '#e74c3c', color: '#e74c3c'}} onClick={handleLogout}>خروج</button>
          </div>
        ) : (
          <>
            <button className="btn btn-outline" onClick={() => navigate('/login', { state: { from: location.pathname } })}>تسجيل الدخول</button>
            <button className="btn btn-primary" onClick={() => navigate('/register', { state: { from: location.pathname } })}>سجل الآن</button>
          </>
        )}
      </div>
    </nav>
  );
}
