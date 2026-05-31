import React from 'react';
import { MdComputer } from 'react-icons/md';

export default function Settings() {
  return (
    <div className="fade-in" style={{padding: '20px 0'}}>
      <div style={styles.card}>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px'}}>
          <h2 style={{margin: 0, color: '#1e293b'}}>الأجهزة</h2>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
          <button style={styles.logoutBtn}>
            تسجيل الخروج من الأجهزة الأخرى
          </button>
          
          <div style={{color: '#64748b', fontSize: '1.1rem'}}>
            أنت تستخدم حاليا <span style={{color: '#38bdf8', fontWeight: 'bold'}}>1</span> من الأجهزة <span style={{color: '#38bdf8', fontWeight: 'bold'}}>20</span>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <div style={styles.deviceCard}>
            <div style={{color: '#cbd5e1', marginBottom: '15px'}}>
              <MdComputer size={100} />
            </div>
            
            <div style={{color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px'}}>Firefox</div>
            <h3 style={{margin: '0 0 20px 0', color: '#1e293b', fontSize: '1.4rem'}}>desktop</h3>
            
            <div style={{color: '#94a3b8', fontSize: '0.85rem', marginBottom: '5px'}}>آخر تسجيل دخول</div>
            <div style={{color: '#64748b', fontSize: '0.9rem', marginBottom: '15px', direction: 'ltr'}}>30/05 08:29 م</div>
            
            <div style={{color: '#94a3b8', fontSize: '0.85rem', marginBottom: '5px'}}>عدد تسجيل الدخول</div>
            <div style={{color: '#64748b', fontSize: '1.1rem', marginBottom: '20px'}}>1</div>
            
            <button style={styles.logoutLink}>تسجيل الخروج</button>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    padding: '30px',
    border: '1px solid #f8fafc',
    minHeight: '600px'
  },
  logoutBtn: {
    backgroundColor: '#38bdf8',
    color: '#fff',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(56, 189, 248, 0.3)'
  },
  deviceCard: {
    width: '300px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0,0,0,0.02)'
  },
  logoutLink: {
    background: 'none',
    border: 'none',
    color: '#f97316',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};
