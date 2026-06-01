import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdSettings, 
  MdSecurity, 
  MdDns,
  MdStorage,
  MdExitToApp,
  MdMenu,
  MdClose
} from 'react-icons/md';

export default function SuperAdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const navItems = [
    { path: '/super-admin', icon: <MdDashboard size={24} />, label: 'مراقبة النظام' },
    { path: '/super-admin/database', icon: <MdStorage size={24} />, label: 'قاعدة البيانات' },
    { path: '/super-admin/security', icon: <MdSecurity size={24} />, label: 'الأمان والصلاحيات' },
    { path: '/super-admin/servers', icon: <MdDns size={24} />, label: 'حالة الخوادم' },
    { path: '/super-admin/settings', icon: <MdSettings size={24} />, label: 'الإعدادات العامة' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ backgroundColor: '#0f172a', color: '#fff' }}>
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Sidebar Content */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{
        backgroundColor: '#0f172a', /* Very dark slate for tech feel */
        borderLeft: '1px solid #1e293b'
      }}>
        <div className="sidebar-header" style={{ borderBottom: '1px solid #1e293b', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              SA
            </div>
            <h2 style={{ color: '#f8fafc', margin: 0, fontSize: '1.2rem' }}>إدارة النظام العليا</h2>
          </div>
        </div>

        <nav className="sidebar-nav" style={{ padding: '20px 10px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navItems.map((item) => (
              <li key={item.path} style={{ marginBottom: '10px' }}>
                <NavLink 
                  to={item.path}
                  end={item.path === '/super-admin'}
                  style={({isActive}) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    color: isActive ? '#fff' : '#94a3b8',
                    backgroundColor: isActive ? '#ef4444' : 'transparent',
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal',
                    transition: 'all 0.3s ease'
                  })}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer" style={{ padding: '20px', borderTop: '1px solid #1e293b', marginTop: 'auto' }}>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px',
              backgroundColor: 'transparent',
              color: '#ef4444',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
          >
            <MdExitToApp size={24} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 99
          }}
        />
      )}
    </>
  );
}
