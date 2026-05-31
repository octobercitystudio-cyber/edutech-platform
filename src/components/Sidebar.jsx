import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdMenuBook, MdPayment, MdEventNote, MdOndemandVideo } from 'react-icons/md';

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
        { name: 'الطلاب', path: '/teacher-students', icon: <MdMenuBook /> },
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
        <h2 style={styles.logoText}>علمني</h2>
      </div>
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              style={{
                ...styles.link,
                ...(isActive ? styles.activeLink : {})
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
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
    backgroundColor: 'var(--surface-color)',
    borderLeft: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
  },
  logoContainer: {
    padding: 'var(--space-6)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: 'var(--primary-color)',
    margin: 0,
    fontSize: '1.8rem',
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
    color: 'var(--text-muted)',
    fontSize: '1.1rem',
    fontWeight: 600,
    transition: 'all 0.2s',
  },
  activeLink: {
    color: 'var(--primary-color)',
    backgroundColor: 'rgba(15, 76, 129, 0.05)',
    borderRight: '4px solid var(--primary-color)',
  },
  icon: {
    marginLeft: 'var(--space-4)',
    fontSize: '1.4rem',
    display: 'flex',
  }
};
