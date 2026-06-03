import React from 'react';
import { MdPeople, MdMenuBook, MdAttachMoney, MdQuestionAnswer, MdAddCircle, MdAssignment } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'معلم';

  const statCards = [
    { title: 'إجمالي الطلاب', value: '0', icon: <MdPeople />, color: '#0f4c81' },
    { title: 'الكورسات النشطة', value: '0', icon: <MdMenuBook />, color: '#10b981' },
    { title: 'أرباح الشهر', value: '0 ج.م', icon: <MdAttachMoney />, color: '#ffb703' },
    { title: 'أسئلة معلقة', value: '0', icon: <MdQuestionAnswer />, color: '#e74c3c' },
  ];

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: '0 0 10px 0'}}>لوحة تحكم المعلم</h1>
          <p className="text-muted" style={{margin: 0}}>متابعة أداء كورساتك وطلابك.</p>
        </div>
        <button className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => navigate('/teacher/courses')}>
          <MdAddCircle size={24} /> إضافة كورس جديد
        </button>
      </div>

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

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)'}}>
        
        {/* Main Column */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-6)'}}>
          <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
            <h2 style={{margin: '0 0 20px 0', color: 'var(--primary-color)'}}>أحدث الكورسات</h2>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '2px solid var(--border-color)', textAlign: 'right', backgroundColor: 'var(--bg-light)'}}>
                  <th style={{padding: '12px'}}>الكورس</th>
                  <th style={{padding: '12px'}}>المشتركين</th>
                  <th style={{padding: '12px'}}>السعر</th>
                  <th style={{padding: '12px'}}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
                    لا توجد كورسات مضافة بعد
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Column */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-6)'}}>
          <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
            <h2 style={{margin: '0 0 20px 0', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <MdQuestionAnswer /> الأسئلة المعلقة
            </h2>
            <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>
              لا توجد أسئلة معلقة
            </div>
          </div>

          <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
            <h2 style={{margin: '0 0 20px 0', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <MdAssignment /> المهام القادمة
            </h2>
            <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>
              لا توجد مهام قادمة
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
