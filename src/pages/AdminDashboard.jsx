import React from 'react';
import { MdGroup, MdSchool, MdPointOfSale, MdOutlineLocalOffer, MdSettings } from 'react-icons/md';

export default function AdminDashboard() {
  const stats = [
    { title: 'الطلاب المسجلين', value: '15,420', icon: <MdGroup />, color: '#0f4c81' },
    { title: 'المعلمين النشطين', value: '45', icon: <MdSchool />, color: '#10b981' },
    { title: 'إجمالي المبيعات', value: '450,000 ج.م', icon: <MdPointOfSale />, color: '#ffb703' },
    { title: 'كوبونات نشطة', value: '8', icon: <MdOutlineLocalOffer />, color: '#e74c3c' },
  ];

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: '0 0 10px 0'}}>لوحة تحكم الإدارة</h1>
          <p className="text-muted" style={{margin: 0}}>نظرة عامة على إحصائيات النظام ومؤشرات الأداء.</p>
        </div>
        <button className="btn btn-secondary" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <MdSettings size={24} /> إعدادات النظام
        </button>
      </div>

      {/* الكروت الإحصائية العلوية */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-8)'
      }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="card" style={{padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '20px'}}>
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
        <div className="card" style={{padding: 'var(--space-6)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)'}}>
            <h2 style={{margin: 0, color: 'var(--primary-color)'}}>أحدث المستخدمين المسجلين</h2>
            <button className="btn btn-outline" style={{padding: '5px 15px'}}>عرض الكل</button>
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
                {[
                  { name: 'أحمد طالب', email: 'student@alemni.com', role: 'student', date: '2023-10-15' },
                  { name: 'محمود حمدي', email: 'teacher@alemni.com', role: 'teacher', date: '2023-10-14' },
                  { name: 'خالد سعيد', email: 'khaled@gmail.com', role: 'student', date: '2023-10-14' },
                ].map((user, i) => (
                  <tr key={i} style={{borderBottom: '1px solid var(--border-color)'}}>
                    <td style={{padding: '15px'}}>{user.name}</td>
                    <td style={{padding: '15px', color: 'var(--text-muted)'}}>{user.email}</td>
                    <td style={{padding: '15px'}}>
                      <span style={{
                        padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem',
                        backgroundColor: user.role === 'teacher' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 76, 129, 0.1)',
                        color: user.role === 'teacher' ? '#10b981' : '#0f4c81'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{padding: '15px', color: 'var(--text-muted)'}}>{user.date}</td>
                    <td style={{padding: '15px'}}>
                      <button className="btn btn-outline" style={{padding: '5px 10px', fontSize: '0.8rem'}}>تعديل</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
