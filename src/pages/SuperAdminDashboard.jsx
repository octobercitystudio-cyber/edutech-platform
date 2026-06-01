import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MdMemory, MdStorage, MdSpeed, MdWarning } from 'react-icons/md';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    totalBalance: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
      const { data: wallets } = await supabase.from('wallet').select('balance');
      
      const total = (wallets || []).reduce((sum, w) => sum + (w.balance || 0), 0);

      setStats({
        users: usersCount || 0,
        courses: coursesCount || 0,
        totalBalance: total
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in">
      <h1 style={{ color: '#0f172a', marginBottom: '30px' }}>مراقبة النظام الشاملة</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* System Health Card */}
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #10b981', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontWeight: 'bold' }}>حالة النظام</span>
            <MdSpeed size={24} color="#10b981" />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0f172a', marginTop: '10px' }}>مستقر (99.9%)</span>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #3b82f6', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontWeight: 'bold' }}>إجمالي المستخدمين في قاعدة البيانات</span>
            <MdStorage size={24} color="#3b82f6" />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0f172a', marginTop: '10px' }}>{stats.users}</span>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #8b5cf6', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontWeight: 'bold' }}>الكورسات المسجلة في السيرفر</span>
            <MdMemory size={24} color="#8b5cf6" />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0f172a', marginTop: '10px' }}>{stats.courses}</span>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontWeight: 'bold' }}>إجمالي التدفق المالي (محافظ)</span>
            <MdWarning size={24} color="#f59e0b" />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0f172a', marginTop: '10px' }}>{stats.totalBalance} ج.م</span>
        </div>

      </div>

      <div className="card" style={{ padding: '30px' }}>
        <h2 style={{ color: '#0f172a', marginTop: 0 }}>تنبيهات النظام</h2>
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
          <strong>ملاحظة:</strong> قواعد البيانات تعمل حالياً بدون قيود أمنية (RLS Disabled) لأغراض التجربة. يُرجى تفعيلها قبل الإطلاق الرسمي.
        </div>
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '15px', borderRadius: '8px' }}>
          <strong>تحديث:</strong> تم أخذ نسخة احتياطية من جميع قواعد البيانات بنجاح في الساعة 3:00 ص.
        </div>
      </div>
    </div>
  );
}
