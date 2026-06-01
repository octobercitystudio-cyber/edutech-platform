import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';
import { MdLock } from 'react-icons/md';

export default function SuperAdminLayout() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = sessionStorage.getItem('superAdminAuth');
    if (auth === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // جلب بيانات الدخول المحفوظة أو استخدام الافتراضية
    const VALID_USERNAME = localStorage.getItem('superAdminUser') || 'admin';
    const VALID_PASSWORD = localStorage.getItem('superAdminPass') || '123';

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      sessionStorage.setItem('superAdminAuth', 'true');
      setIsAuthorized(true);
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  if (!isAuthorized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0f172a' }}>
        <div className="card fade-in" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center', backgroundColor: '#1e293b', border: '1px solid #334155' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <MdLock size={40} color="#fff" />
          </div>
          <h2 style={{ color: '#f8fafc', marginBottom: '10px', marginTop: 0 }}>إدارة النظام</h2>
          <p style={{ color: '#94a3b8', marginBottom: '30px' }}>يرجى تسجيل الدخول بصلاحيات المدير العام</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="اسم المستخدم" 
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              style={{ padding: '15px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', textAlign: 'center', fontSize: '1.2rem' }}
              autoFocus
            />
            <input 
              type="password" 
              placeholder="كلمة المرور" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              style={{ padding: '15px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', textAlign: 'center', fontSize: '1.2rem' }}
            />
            {error && <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</div>}
            
            <button type="submit" style={{ padding: '15px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
              دخول
            </button>
            <button type="button" onClick={() => navigate('/')} style={{ padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>
              العودة للمنصة
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout" style={{ backgroundColor: '#f1f5f9' }}>
      <SuperAdminSidebar />
      <div className="main-content">
        <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '15px 30px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#0f172a' }}>المدير العام</span>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#0f172a', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>SA</div>
          </div>
        </div>
        <main className="page-content" style={{ padding: '30px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
