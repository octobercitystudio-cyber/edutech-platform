import React, { useState, useEffect } from 'react';
import { MdGroup, MdSchool, MdPointOfSale, MdOutlineLocalOffer, MdSettings } from 'react-icons/md';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    revenue: 0,
    courses: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const { data: profiles } = await supabase.from('profiles').select('id, name, email, role, created_at').order('created_at', { ascending: false });
      let studentsCount = 0;
      let teachersCount = 0;
      if (profiles) {
        studentsCount = profiles.filter(p => p.role === 'student' || !p.role).length;
        teachersCount = profiles.filter(p => p.role === 'teacher').length;
        setRecentUsers(profiles.slice(0, 5)); // Latest 5 users
      }

      // Fetch courses
      const { data: coursesData } = await supabase.from('courses').select('id');
      const fakeIds = ['ba2c8232-0717-464f-9ca4-0e7511223b00', '4fd22259-e473-45be-8584-24e6805f5d6f', '5165d69f-5bf1-478a-8c60-644ab131f0f6'];
      const coursesCount = coursesData ? coursesData.filter(c => !fakeIds.includes(c.id)).length : 0;

      // Fetch actual revenue (sum of enrolled course prices)
      const { data: enrollments } = await supabase.from('enrollments').select('courses(price)');
      let totalRevenue = 0;
      if (enrollments) {
        enrollments.forEach(en => {
          if (en.courses && en.courses.price) {
            totalRevenue += parseFloat(en.courses.price);
          }
        });
      }

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
    { title: 'المعلمين النشطين', value: stats.teachers, icon: <MdSchool />, color: '#10b981' },
    { title: 'إجمالي المبيعات', value: `${stats.revenue} ج.م`, icon: <MdPointOfSale />, color: '#ffb703' },
    { title: 'إجمالي الكورسات', value: stats.courses, icon: <MdOutlineLocalOffer />, color: '#e74c3c' },
  ];

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: '0 0 10px 0'}}>لوحة تحكم الإدارة</h1>
          <p className="text-muted" style={{margin: 0}}>نظرة عامة حية على إحصائيات النظام ومؤشرات الأداء.</p>
        </div>
        <button className="btn btn-secondary" style={{display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => navigate('/settings')}>
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
            
            {/* جدول إدارة المستخدمين */}
            <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)'}}>
                <h2 style={{margin: 0, color: 'var(--primary-color)'}}>أحدث المستخدمين المسجلين</h2>
                <button className="btn btn-outline" style={{padding: '5px 15px'}} onClick={() => navigate('/users')}>عرض الكل</button>
              </div>
              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
                  <thead>
                    <tr style={{borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)'}}>
                      <th style={{padding: '15px'}}>الاسم</th>
                      <th style={{padding: '15px'}}>البريد الإلكتروني</th>
                      <th style={{padding: '15px'}}>الدور (Role)</th>
                      <th style={{padding: '15px'}}>تاريخ التسجيل</th>
                      <th style={{padding: '15px'}}>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user, i) => (
                      <tr key={i} style={{borderBottom: '1px solid var(--border-color)'}}>
                        <td style={{padding: '15px'}}>{user.name}</td>
                        <td style={{padding: '15px', color: 'var(--text-muted)'}}>{user.email}</td>
                        <td style={{padding: '15px'}}>
                          <span style={{
                            padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem',
                            backgroundColor: user.role === 'teacher' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 76, 129, 0.1)',
                            color: user.role === 'teacher' ? '#10b981' : '#0f4c81'
                          }}>
                            {user.role === 'teacher' ? 'معلم' : user.role === 'admin' ? 'أدمن' : 'طالب'}
                          </span>
                        </td>
                        <td style={{padding: '15px', color: 'var(--text-muted)'}}>
                          {new Date(user.created_at).toLocaleDateString('ar-EG')}
                        </td>
                        <td style={{padding: '15px'}}>
                          <button className="btn btn-outline" style={{padding: '5px 10px', fontSize: '0.8rem'}} onClick={() => navigate('/users')}>تعديل</button>
                        </td>
                      </tr>
                    ))}
                    {recentUsers.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)'}}>
                          لا يوجد مستخدمين بعد
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
              <h2 style={{margin: '0 0 20px 0', color: 'var(--primary-color)'}}>إجراءات سريعة</h2>
              <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                <button className="btn btn-primary" onClick={() => navigate('/users')}>إدارة المستخدمين</button>
                <button className="btn btn-secondary" onClick={() => navigate('/admin-courses')}>اعتماد الكورسات</button>
                <button className="btn btn-outline" onClick={() => navigate('/finances')}>شحن محافظ الطلاب</button>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
