import React, { useState } from 'react';
import QRCode from 'react-qr-code';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('basic');
  const userName = localStorage.getItem('userName') || 'احمد محمد';
  const email = 'hadaya3156@ifcoat.com';
  const phone = '01010101254';
  const studentId = '01010101254'; // Using phone as ID in mockup
  
  return (
    <div className="fade-in" style={{padding: '20px 0'}}>
      <div style={styles.card}>
        
        {/* Header Tabs */}
        <div style={styles.header}>
          <h2 style={{margin: 0, color: '#1e293b'}}>البيانات</h2>
          <div style={styles.tabsContainer}>
            <button 
              style={{...styles.tab, ...(activeTab === 'personal' ? styles.activeTab : {})}}
              onClick={() => setActiveTab('personal')}
            >المعلومات الشخصية</button>
            <button 
              style={{...styles.tab, ...(activeTab === 'educational' ? styles.activeTab : {})}}
              onClick={() => setActiveTab('educational')}
            >المعلومات التعليمية</button>
            <button 
              style={{...styles.tab, ...(activeTab === 'basic' ? styles.activeTab : {})}}
              onClick={() => setActiveTab('basic')}
            >المعلومات الاساسية</button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '30px'}}>
          
          {/* ID Card (Left Side theoretically, but Arabic so Right Side if LTR flex) */}
          <div style={{flex: '1 1 400px'}}>
            <div style={styles.idCardWrapper}>
              
              <div style={styles.idCardHeader}>
                <span style={{fontSize: '1.5rem', fontWeight: 'bold'}}>e</span>
                <span>Student ID</span>
              </div>
              
              <div style={styles.idCardBody}>
                <div style={{textAlign: 'right', flex: 1}}>
                  <h3 style={{margin: '0 0 5px 0', fontSize: '1.1rem'}}>{userName}</h3>
                  <p style={{fontSize: '0.7rem', color: '#64748b', margin: '0 0 15px 0'}}>username: {studentId}</p>
                  
                  <div style={{fontSize: '0.85rem', color: '#38bdf8', marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px'}}>
                    {phone} 📞
                  </div>
                  <div style={{fontSize: '0.85rem', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px'}}>
                    {email} ✉️
                  </div>
                </div>
                
                <div style={{width: '90px', height: '110px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: '1.5rem'}}>
                  ام
                </div>
              </div>

              <div style={styles.idCardFooter}>
                <div style={{backgroundColor: '#fff', padding: '5px', borderRadius: '5px'}}>
                  <QRCode value={studentId} size={60} />
                </div>
                <div style={{textAlign: 'right', fontSize: '0.7rem', color: '#64748b'}}>
                  <div>الثانوية العامة</div>
                  <div>الصف الثالث الثانوى</div>
                  <div>لغة عربية</div>
                  <div>علمى علوم</div>
                </div>
                <div style={{textAlign: 'right', fontSize: '0.7rem', color: '#64748b'}}>
                  <div>الشهادة:</div>
                  <div>Year:</div>
                  <div>Language:</div>
                  <div>Section:</div>
                </div>
              </div>

            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px', padding: '0 10px'}}>
              <span style={{color: '#f97316', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold'}}>اظهار الكود</span>
              <div style={{display: 'flex', gap: '20px'}}>
                <span style={{color: '#38bdf8', cursor: 'pointer', fontSize: '0.9rem'}}>تحميل</span>
                <span style={{color: '#38bdf8', cursor: 'pointer', fontSize: '0.9rem'}}>عرض</span>
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div style={{flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <div style={styles.formGroup}>
              <input type="text" style={styles.input} defaultValue={userName} dir="rtl" />
            </div>
            <div style={styles.formGroup}>
              <input type="text" style={styles.input} defaultValue="محمد" dir="rtl" />
            </div>
            <div style={styles.formGroup}>
              <input type="email" style={styles.input} defaultValue={email} dir="ltr" />
            </div>
            <div style={styles.formGroup}>
              <input type="text" style={styles.input} defaultValue={phone} dir="ltr" />
            </div>
            <div style={styles.formGroup}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px'}}>
                <span style={{color: '#f97316', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold'}}>Change Password</span>
                <span style={{color: '#64748b', letterSpacing: '3px'}}>•••••</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{display: 'flex', gap: '15px', marginTop: '50px', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', gap: '15px'}}>
            <button style={{...styles.btn, backgroundColor: '#7dd3fc'}}>Save</button>
            <button style={{...styles.btn, backgroundColor: '#fdba74'}}>Cancel</button>
          </div>
          
          <button 
            style={{...styles.btn, backgroundColor: '#0f4c81', fontSize: '0.8rem'}}
            onClick={() => {
              localStorage.setItem('userRole', 'admin');
              window.location.href = '/dashboard';
            }}
          >
            تفعيل وضع الإدارة (مؤقت)
          </button>
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
    border: '1px solid #f8fafc'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '15px'
  },
  tabsContainer: {
    display: 'flex',
    gap: '20px'
  },
  tab: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '5px 0',
    position: 'relative'
  },
  activeTab: {
    color: '#38bdf8',
    fontWeight: 'bold',
    borderBottom: '2px solid #38bdf8',
    marginBottom: '-16px' // overlap the border
  },
  idCardWrapper: {
    width: '100%',
    maxWidth: '450px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0'
  },
  idCardHeader: {
    backgroundColor: '#38bdf8',
    color: 'white',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold'
  },
  idCardBody: {
    display: 'flex',
    padding: '20px',
    gap: '20px',
    justifyContent: 'flex-end'
  },
  idCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: '0 20px 20px 20px'
  },
  formGroup: {
    width: '100%'
  },
  input: {
    width: '100%',
    padding: '10px 0',
    border: 'none',
    borderBottom: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '1rem',
    color: '#1e293b',
    backgroundColor: 'transparent'
  },
  btn: {
    padding: '10px 30px',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    minWidth: '120px'
  }
};
