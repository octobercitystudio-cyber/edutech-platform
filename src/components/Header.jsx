import React, { useState } from 'react';
import { MdAccountCircle, MdNotifications, MdAccountBalanceWallet, MdPerson, MdSettings, MdLogout } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'طالب';
  const userRole = localStorage.getItem('userRole') || 'student';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div style={styles.searchContainer}>
        <h3 style={{margin: 0, color: 'var(--primary-color)'}}>أهلاً بك، {userName} 👋</h3>
      </div>
      <div style={styles.actions}>
        {userRole === 'student' && (
          <div style={styles.wallet}>
            <MdAccountBalanceWallet style={styles.walletIcon} />
            <span>محفظتي</span>
          </div>
        )}
        
        <div style={{position: 'relative'}}>
          <button 
            className="icon-btn" 
            style={styles.iconBtn}
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <MdNotifications />
            <span style={{position: 'absolute', top: '5px', right: '5px', backgroundColor: '#ef4444', width: '10px', height: '10px', borderRadius: '50%'}}></span>
          </button>
          
          {notifOpen && (
            <div style={{...styles.dropdown, width: '300px'}} className="fade-in">
              <div style={{padding: '15px', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold'}}>
                الإشعارات
              </div>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, maxHeight: '300px', overflowY: 'auto'}}>
                <li style={{padding: '15px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(15,76,129,0.05)'}}>
                  <div style={{fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--primary-color)'}}>مرحباً بك في المنصة</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>نتمنى لك تجربة تعليمية ممتعة.</div>
                </li>
              </ul>
              <div style={{padding: '10px', textAlign: 'center', backgroundColor: 'var(--bg-light)', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.9rem'}}>
                عرض كل الإشعارات
              </div>
            </div>
          )}
        </div>
        
        <div style={{position: 'relative'}}>
          <button 
            className="icon-btn" 
            style={styles.iconBtn}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <MdAccountCircle />
          </button>
          
          {dropdownOpen && (
            <div style={styles.dropdown} className="fade-in">
              <div style={{padding: '15px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px'}}>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <MdPerson size={24} />
                </div>
                <div>
                  <div style={{fontWeight: 'bold'}}>{userName}</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                    {userRole === 'admin' ? 'مدير النظام' : 
                     userRole === 'teacher' ? 'معلم' : 
                     userRole === 'assistant' ? 'مساعد' : 
                     userRole === 'parent' ? 'ولي أمر' : 'طالب'}
                  </div>
                </div>
              </div>
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                <li style={styles.dropdownItem} onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>
                  <MdSettings size={20} /> الإعدادات والملف الشخصي
                </li>
                <li style={{...styles.dropdownItem, color: '#e74c3c'}} onClick={handleLogout}>
                  <MdLogout size={20} /> تسجيل الخروج
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: '80px',
    backgroundColor: 'var(--surface-color)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 var(--space-6)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-4)',
  },
  wallet: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    backgroundColor: 'rgba(255, 183, 3, 0.15)',
    color: 'var(--secondary-hover)',
    padding: 'var(--space-2) var(--space-4)',
    borderRadius: 'var(--radius-full)',
    fontWeight: 'bold',
  },
  walletIcon: {
    fontSize: '1.2rem',
  },
  iconBtn: {
    background: 'none',
    fontSize: '1.8rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-2)',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
    border: 'none'
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: '0', // Left because RTL
    minWidth: '250px',
    backgroundColor: 'var(--surface-color)',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    marginTop: '10px',
    overflow: 'hidden',
    zIndex: 101,
    border: '1px solid var(--border-color)'
  },
  dropdownItem: {
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }
};
