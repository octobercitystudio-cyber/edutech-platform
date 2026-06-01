import React from 'react';
import { MdDeleteForever, MdToggleOn, MdSecurity } from 'react-icons/md';

export default function SuperAdminSettings() {
  const handleWipeData = () => {
    if (window.confirm('تحذير خطير: هل أنت متأكد من مسح كافة بيانات المنصة (مستخدمين، كورسات، ومحافظ)؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      alert('تم تعطيل هذه الخاصية حالياً لحماية البيانات.');
    }
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
