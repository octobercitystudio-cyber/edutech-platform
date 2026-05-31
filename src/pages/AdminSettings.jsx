import React, { useState } from 'react';
import { MdSave, MdLanguage, MdSecurity, MdPayment } from 'react-icons/md';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'علمني - منصة التعليم الذكي',
    maintenanceMode: false,
    allowRegistration: true,
    currency: 'EGP',
    contactEmail: 'support@alemni.com'
  });

  const handleSave = (e) => {
    e.preventDefault();
    // Here we would save to Supabase or an API. For now, we simulate saving.
    alert('تم حفظ الإعدادات بنجاح!');
  };

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <h1 style={{color: 'var(--primary-color)', marginBottom: '20px'}}>إعدادات المنصة</h1>
      
      <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px'}}>
        
        {/* Sidebar for settings tabs */}
        <div className="card" style={{padding: 'var(--space-4)'}}>
          <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <li style={{...styles.tabItem, backgroundColor: 'rgba(15, 76, 129, 0.1)', color: 'var(--primary-color)', fontWeight: 'bold'}}>
              <MdLanguage size={20} /> الإعدادات العامة
            </li>
            <li style={{...styles.tabItem}}>
              <MdSecurity size={20} /> الحماية والخصوصية
            </li>
            <li style={{...styles.tabItem}}>
              <MdPayment size={20} /> بوابات الدفع
            </li>
          </ul>
        </div>

        {/* Main Settings Form */}
        <div className="card" style={{padding: 'var(--space-6)'}}>
          <h2 style={{margin: '0 0 20px 0', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px'}}>الإعدادات العامة</h2>
          
          <form onSubmit={handleSave} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <div className="form-group">
              <label className="form-label">اسم المنصة</label>
              <input 
                type="text" 
                className="form-control" 
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">البريد الإلكتروني للدعم الفني</label>
              <input 
                type="email" 
                className="form-control" 
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">عملة الدفع الافتراضية</label>
              <select 
                className="form-control" 
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
              >
                <option value="EGP">الجنيه المصري (EGP)</option>
                <option value="USD">الدولار الأمريكي (USD)</option>
                <option value="SAR">الريال السعودي (SAR)</option>
              </select>
            </div>

            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', padding: '15px', backgroundColor: 'var(--bg-light)', borderRadius: '8px'}}>
              <input 
                type="checkbox" 
                id="allowReg"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({...settings, allowRegistration: e.target.checked})}
                style={{width: '20px', height: '20px', cursor: 'pointer'}}
              />
              <label htmlFor="allowReg" style={{cursor: 'pointer', fontWeight: 'bold'}}>السماح بتسجيل حسابات جديدة</label>
            </div>

            <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #ef4444'}}>
              <input 
                type="checkbox" 
                id="maintenance"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                style={{width: '20px', height: '20px', cursor: 'pointer'}}
              />
              <label htmlFor="maintenance" style={{cursor: 'pointer', fontWeight: 'bold', color: '#b91c1c'}}>تفعيل وضع الصيانة (إغلاق الموقع مؤقتاً)</label>
            </div>

            <button type="submit" className="btn btn-primary" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px', fontSize: '1.1rem', marginTop: '10px'}}>
              <MdSave size={24} /> حفظ التغييرات
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

const styles = {
  tabItem: {
    padding: '12px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--text-muted)',
    transition: 'all 0.2s'
  }
};
