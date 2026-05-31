import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdPerson, MdOndemandVideo, MdLocalActivity, MdSettings } from 'react-icons/md';

export default function StudentSidebar() {
  const location = useLocation();
  const userName = localStorage.getItem('userName') || 'طالب';
  const avatarUrl = localStorage.getItem('avatarUrl') || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=38bdf8&color=fff&size=100`;

  const menuItems = [
    { name: 'نبذة', path: '/dashboard', icon: <MdDashboard /> },
    { name: 'البيانات', path: '/profile', icon: <MdPerson /> },
    { name: 'الفصول', path: '/my-courses', icon: <MdOndemandVideo /> },
    { name: 'الانشطة', path: '/assignments', icon: <MdLocalActivity /> }, // Using assignments as activities base
    { name: 'الاعدادات', path: '/settings', icon: <MdSettings /> },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.profileSection}>
        <h3 style={styles.profileTitle}>الصفحة الشخصية</h3>
        <div style={styles.avatarWrapper}>
          <img src={avatarUrl} alt="Avatar" style={styles.avatar} />
          <button style={styles.uploadBtn}>+ تحميل صورة</button>
        </div>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => {
          // Check if active (handle sub-paths for activities later if needed)
          const isActive = location.pathname === item.path || 
                           (item.path === '/assignments' && ['/assignments', '/live', '/reports'].includes(location.pathname));
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: '#ffffff',
    borderLeft: '1px solid #f0f2f5',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    boxShadow: '-2px 0 10px rgba(0,0,0,0.02)'
  },
  profileSection: {
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottom: '1px solid transparent', // keeping it clean
  },
  profileTitle: {
    fontSize: '1.2rem',
    color: '#1e293b',
    marginBottom: '20px',
    fontWeight: 'bold'
  },
  avatarWrapper: {
    position: 'relative',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid #e0f2fe',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  uploadBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(56, 189, 248, 0.85)',
    color: 'white',
    border: 'none',
    padding: '3px 0',
    fontSize: '0.65rem',
    cursor: 'pointer',
    textAlign: 'center'
  },
  nav: {
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 30px',
    color: '#64748b',
    fontSize: '1.05rem',
    fontWeight: 600,
    transition: 'all 0.2s',
    textDecoration: 'none'
  },
  activeLink: {
    color: '#38bdf8', // Light blue from screenshot
    backgroundColor: '#f0f9ff',
    borderRight: '4px solid #38bdf8',
  },
  icon: {
    marginLeft: '15px',
    fontSize: '1.3rem',
    display: 'flex',
  }
};
