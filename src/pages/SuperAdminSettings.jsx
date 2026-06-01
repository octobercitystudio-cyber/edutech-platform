import React, { useState } from 'react';
import { MdDeleteForever, MdToggleOn, MdSecurity, MdVpnKey } from 'react-icons/md';

export default function SuperAdminSettings() {
  const [newUsername, setNewUsername] = useState(localStorage.getItem('superAdminUser') || 'admin');
  const [newPassword, setNewPassword] = useState(localStorage.getItem('superAdminPass') || '123');

  const handleWipeData = () => {
    if (window.confirm('تحذير خطير: هل أنت متأكد من مسح كافة بيانات المنصة (مستخدمين، كورسات، ومحافظ)؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      alert('تم تعطيل هذه الخاصية حالياً لحماية البيانات.');
    }
  };

  const handleSaveCredentials = (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      alert('يرجى إدخال اسم مستخدم وكلمة مرور');
      return;
    }
    localStorage.setItem('superAdminUser', newUsername);
    localStorage.setItem('superAdminPass', newPassword);
    alert('تم تغيير بيانات تسجيل الدخول بنجاح!');
  };

  return (
    <div className="fade-in">
      <h1 style={{ color: '#0f172a', marginBottom: '30px' }}>الإعدادات العليا للنظام</h1>

      <div style={{ display: 'grid', gap: '20px' }}>
        <div className="card" style={{ padding: '30px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a', marginTop: 0 }}>
            <MdToggleOn size={28} color="#3b82f6" />
            تحكم الميزات المركزية
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '5px' }}>بوابات الدفع الإلكتروني</strong>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>تفعيل أو إيقاف بوابات الدفع بالموقع بالكامل</span>
              </div>
              <button className="btn btn-primary">مفعل</button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '5px' }}>وضع الصيانة (Maintenance Mode)</strong>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>إغلاق الموقع للزوار وإظهار رسالة الصيانة</span>
              </div>
              <button className="btn btn-outline" style={{ color: '#64748b', borderColor: '#cbd5e1' }}>معطل</button>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '30px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a', marginTop: 0 }}>
            <MdVpnKey size={28} color="#f59e0b" />
            بيانات الدخول للإدارة العليا
          </h2>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            يمكنك تغيير اسم المستخدم وكلمة المرور الخاصة بهذه اللوحة. (يتم حفظها في متصفحك الحالي)
          </p>
          
          <form onSubmit={handleSaveCredentials} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اسم المستخدم الجديد</label>
              <input 
                type="text" 
                value={newUsername} 
                onChange={(e) => setNewUsername(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }} 
              />
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>كلمة المرور الجديدة</label>
              <input 
                type="text" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }} 
              />
            </div>
            <button type="submit" style={{ padding: '12px 25px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontWeight: 'bold', cursor: 'pointer', height: '43px' }}>
              حفظ التغييرات
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: '30px', border: '1px solid #fecaca', backgroundColor: '#fff5f5' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b91c1c', marginTop: 0 }}>
            <MdSecurity size={28} />
            منطقة الخطر (Danger Zone)
          </h2>
          <p style={{ color: '#7f1d1d', marginBottom: '20px' }}>
            الخيارات أدناه تؤثر على البنية التحتية للمنصة بالكامل. يرجى الحذر.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#fff', border: '1px solid #fca5a5', borderRadius: '8px' }}>
            <div>
              <strong style={{ display: 'block', marginBottom: '5px', color: '#b91c1c' }}>مسح بيانات المنصة (Factory Reset)</strong>
              <span style={{ fontSize: '0.9rem', color: '#991b1b' }}>سيتم مسح جميع المستخدمين، الكورسات، والبيانات المالية بشكل نهائي.</span>
            </div>
            <button 
              onClick={handleWipeData}
              style={{ backgroundColor: '#ef4444', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <MdDeleteForever size={20} /> مسح الكل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
