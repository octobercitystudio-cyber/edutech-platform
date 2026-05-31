import React from 'react';
import { MdPeople, MdMenuBook, MdAttachMoney, MdQuestionAnswer, MdAddCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const stats = [
    { title: 'إجمالي الطلاب', value: '1,250', icon: <MdPeople />, color: '#0f4c81' },
    { title: 'الكورسات النشطة', value: '5', icon: <MdMenuBook />, color: '#ffb703' },
    { title: 'أرباح الشهر', value: '25,000 ج.م', icon: <MdAttachMoney />, color: '#10b981' },
    { title: 'أسئلة معلقة', value: '12', icon: <MdQuestionAnswer />, color: '#e74c3c' },
  ];

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: '0 0 10px 0'}}>لوحة تحكم المعلم</h1>
          <p className="text-muted" style={{margin: 0}}>مرحباً أ. محمود، إليك ملخص لأدائك هذا الشهر.</p>
        </div>
        <button className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem'}}>
          <MdAddCircle size={24} /> إضافة كورس جديد
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-8)'
      }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="card" style={{padding: 'var(--space-6)', textAlign: 'center'}}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto var(--space-4) auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', backgroundColor: stat.color + '15', color: stat.color
            }}>
              {stat.icon}
            </div>
            <h3 style={{margin: 0, color: 'var(--text-muted)', fontSize: '1rem'}}>{stat.title}</h3>
            <h2 style={{margin: '5px 0 0 0', fontSize: '1.8rem', color: 'var(--text-main)'}}>{stat.value}</h2>
          </div>
        ))}
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)'}}>
        <div className="card" style={{padding: 'var(--space-6)'}}>
          <h2 style={{margin: '0 0 var(--space-4) 0', color: 'var(--primary-color)'}}>أحدث الكورسات</h2>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid var(--border-color)', textAlign: 'right'}}>
                <th style={{padding: '10px'}}>الكورس</th>
                <th style={{padding: '10px'}}>المشتركين</th>
                <th style={{padding: '10px'}}>السعر</th>
                <th style={{padding: '10px'}}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{padding: '15px 10px', borderBottom: '1px solid var(--border-color)'}}>الفيزياء الشاملة للثانوية العامة</td>
                <td style={{padding: '15px 10px', borderBottom: '1px solid var(--border-color)'}}>450 طالب</td>
                <td style={{padding: '15px 10px', borderBottom: '1px solid var(--border-color)'}}>250 ج.م</td>
                <td style={{padding: '15px 10px', borderBottom: '1px solid var(--border-color)'}}><span style={{color: '#10b981', fontWeight: 'bold'}}>نشط</span></td>
              </tr>
              <tr>
                <td style={{padding: '15px 10px', borderBottom: '1px solid var(--border-color)'}}>مراجعة ليلة الامتحان</td>
                <td style={{padding: '15px 10px', borderBottom: '1px solid var(--border-color)'}}>800 طالب</td>
                <td style={{padding: '15px 10px', borderBottom: '1px solid var(--border-color)'}}>100 ج.م</td>
                <td style={{padding: '15px 10px', borderBottom: '1px solid var(--border-color)'}}><span style={{color: '#10b981', fontWeight: 'bold'}}>نشط</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card" style={{padding: 'var(--space-6)'}}>
          <h2 style={{margin: '0 0 var(--space-4) 0', color: 'var(--primary-color)'}}>الأسئلة المعلقة</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <div style={{padding: '15px', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-md)'}}>
              <div style={{fontWeight: 'bold', marginBottom: '5px'}}>أحمد محمود</div>
              <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)'}}>أستاذي، كيف يمكن حساب قوة الاحتكاك في المسألة رقم 5؟</p>
              <button className="btn btn-outline" style={{padding: '5px 10px', fontSize: '0.8rem', marginTop: '10px'}}>رد الآن</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
