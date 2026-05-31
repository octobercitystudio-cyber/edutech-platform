import React, { useState, useEffect } from 'react';
import { MdGroup, MdSchool, MdPointOfSale, MdOutlineLocalOffer, MdSettings } from 'react-icons/md';
import { supabase } from '../supabaseClient';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    revenue: 0,
    courses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const { data: profiles } = await supabase.from('profiles').select('role');
      let studentsCount = 0;
      let teachersCount = 0;
      if (profiles) {
        studentsCount = profiles.filter(p => p.role === 'student' || !p.role).length;
        teachersCount = profiles.filter(p => p.role === 'teacher').length;
      }

      // Fetch courses
      const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });

      // Fetch wallet total (simulated revenue)
      const { data: wallets } = await supabase.from('wallet').select('balance');
      const totalRevenue = wallets ? wallets.reduce((sum, w) => sum + (w.balance || 0), 0) : 0;

      setStats({
        students: studentsCount,
        teachers: teachersCount,
        revenue: totalRevenue,
        courses: coursesCount || 0
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'الطلاب المسجلين', value: stats.students, icon: <MdGroup />, color: '#0f4c81' },
    { title: 'إجمالي الكورسات', value: stats.courses, icon: <MdSchool />, color: '#10b981' },
    { title: 'أرصدة المحافظ (مبيعات)', value: `${stats.revenue} ج.م`, icon: <MdPointOfSale />, color: '#ffb703' },
    { title: 'المعلمين النشطين', value: stats.teachers, icon: <MdOutlineLocalOffer />, color: '#e74c3c' },
  ];

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: '0 0 10px 0'}}>لوحة تحكم الإدارة</h1>
          <p className="text-muted" style={{margin: 0}}>نظرة عامة حية على إحصائيات النظام ومؤشرات الأداء.</p>
        </div>
        <button className="btn btn-secondary" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <MdSettings size={24} /> إعدادات النظام
        </button>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '50px', color: 'var(--text-muted)'}}>جاري جلب بيانات النظام...</div>
      ) : (
        <>
          {/* الكروت الإحصائية العلوية */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-8)'
          }}>
            {statCards.map((stat, idx) => (
              <div key={idx} className="card" style={{padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'}}>
                <div style={{
                  width: '70px', height: '70px', borderRadius: '15px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem', backgroundColor: stat.color + '15', color: stat.color
                }}>
                  {stat.icon}
                </div>
                <div>
                  <h3 style={{margin: 0, color: 'var(--text-muted)', fontSize: '1rem'}}>{stat.title}</h3>
                  <h2 style={{margin: '5px 0 0 0', fontSize: '1.8rem', color: 'var(--text-main)'}}>{stat.value}</h2>
                </div>
              </div>
            ))}
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)'}}>
            
            <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
              <h2 style={{margin: '0 0 20px 0', color: 'var(--primary-color)'}}>إجراءات سريعة</h2>
              <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                <button className="btn btn-primary" onClick={() => window.location.href = '/users'}>إدارة المستخدمين</button>
                <button className="btn btn-secondary" onClick={() => window.location.href = '/admin-courses'}>اعتماد الكورسات</button>
                <button className="btn btn-outline" onClick={() => window.location.href = '/finances'}>شحن محافظ الطلاب</button>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
