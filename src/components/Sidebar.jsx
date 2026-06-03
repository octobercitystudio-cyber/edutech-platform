import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdMenuBook, MdPayment, MdEventNote, MdOndemandVideo, MdPeople } from 'react-icons/md';

export default function Sidebar() {
  const location = useLocation();
  const role = localStorage.getItem('userRole') || 'student';

  const getMenuItems = () => {
    if (role === 'admin') {
      return [
        { name: 'لوحة التحكم', path: '/dashboard', icon: <MdDashboard /> },
        { name: 'إدارة المستخدمين', path: '/users', icon: <MdMenuBook /> },
        { name: 'إدارة الكورسات', path: '/admin-courses', icon: <MdOndemandVideo /> },
        { name: 'التقارير المالية', path: '/finances', icon: <MdPayment /> },
        { name: 'الإعدادات', path: '/settings', icon: <MdEventNote /> },
      ];
    } else if (role === 'teacher') {
      return [
        { name: 'لوحة التحكم', path: '/dashboard', icon: <MdDashboard /> },
        { name: 'كورساتي', path: '/teacher-courses', icon: <MdOndemandVideo /> },
        { name: 'الامتحانات', path: '/teacher-exams', icon: <MdEventNote /> },
        { name: 'الواجبات والتكليفات', path: '/teacher-assignments', icon: <MdMenuBook /> },
        { name: 'الفصول المباشرة', path: '/teacher-live', icon: <MdOndemandVideo /> },
        { name: 'الطلاب', path: '/teacher-students', icon: <MdPeople /> },
        { name: 'الإعلانات', path: '/teacher-announcements', icon: <MdEventNote /> },
        { name: 'الماليات', path: '/teacher-finances', icon: <MdPayment /> },
        { name: 'أدوات التسويق', path: '/teacher-marketing', icon: <MdEventNote /> },
        { name: 'التقارير', path: '/teacher-reports', icon: <MdMenuBook /> },
      ];
    } else if (role === 'assistant') {
      return [
        { name: 'لوحة التحكم', path: '/dashboard', icon: <MdDashboard /> },
        { name: 'أسئلة الطلاب', path: '/qa', icon: <MdEventNote /> },
        { name: 'الواجبات', path: '/assignments', icon: <MdMenuBook /> },
        { name: 'متابعة الغياب', path: '/attendance', icon: <MdOndemandVideo /> },
      ];
    } else if (role === 'parent') {
      return [
        { name: 'لوحة التحكم', path: '/dashboard', icon: <MdDashboard /> },
        { name: 'التقارير الدراسية', path: '/reports', icon: <MdEventNote /> },
        { name: 'الامتحانات', path: '/parent-exams', icon: <MdMenuBook /> },
        { name: 'تواصل مع المعلم', path: '/contact', icon: <MdPayment /> },
      ];
    }
    
    // Default: Student
    return [
      { name: 'الرئيسية (الموقع)', path: '/', icon: <MdDashboard /> },
      { name: 'لوحة التحكم', path: '/dashboard', icon: <MdDashboard /> },
      { name: 'كورساتي', path: '/my-courses', icon: <MdOndemandVideo /> },
      { name: 'الواجبات', path: '/assignments', icon: <MdEventNote /> },
      { name: 'البث المباشر', path: '/live', icon: <MdOndemandVideo /> },
      { name: 'الامتحانات', path: '/exams', icon: <MdEventNote /> },
      { name: 'تقارير الطالب', path: '/reports', icon: <MdMenuBook /> },
      { name: 'متجر الكورسات', path: '/courses', icon: <MdMenuBook /> },
      { name: 'بوابة الدفع', path: '/checkout', icon: <MdPayment /> },
      { name: 'الدعم الفني', path: '/support', icon: <MdMenuBook /> },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <Link to="/" style={{textDecoration: 'none'}}>
          <h2 style={styles.logoText}>علمني</h2>
        </Link>
      </div>
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              style={{...styles.link, ...(isActive ? styles.activeLink : {})}}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span className="sidebar-icon" style={styles.icon}>{item.icon}</span>
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
    backgroundColor: 'var(--primary-color)',
    borderLeft: 'none',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
  },
  logoContainer: {
    padding: 'var(--space-6)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#ffffff',
    margin: 0,
    fontSize: '2rem',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  nav: {
    padding: 'var(--space-4) 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    padding: 'var(--space-4) var(--space-6)',
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  },
  activeLink: {
    color: 'var(--primary-color)',
    backgroundColor: '#ffffff',
    borderRight: '4px solid var(--secondary-color)',
  },
  icon: {
    marginLeft: 'var(--space-4)',
    fontSize: '1.4rem',
    display: 'flex',
  }
};
