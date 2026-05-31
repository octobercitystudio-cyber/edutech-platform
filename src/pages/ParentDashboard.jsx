import React from 'react';
import { MdCheckCircle, MdMenuBook, MdAccessTime, MdTrendingUp } from 'react-icons/md';

export default function ParentDashboard() {
  const stats = [
    { title: 'الكورسات المشترك بها', value: '3', icon: <MdMenuBook />, color: '#0f4c81' },
    { title: 'الامتحانات المنجزة', value: '12', icon: <MdCheckCircle />, color: '#10b981' },
    { title: 'متوسط الدرجات', value: '85%', icon: <MdTrendingUp />, color: '#ffb703' },
    { title: 'ساعات المشاهدة', value: '24 ساعة', icon: <MdAccessTime />, color: '#e74c3c' },
  ];

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: '0 0 10px 0'}}>تقارير ولي الأمر</h1>
          <p className="text-muted" style={{margin: 0}}>مرحباً، إليك التقرير الشامل لأداء الطالب: <span style={{fontWeight: 'bold', color: 'var(--secondary-color)'}}>أحمد</span></p>
        </div>
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

      <div className="card" style={{padding: 'var(--space-6)'}}>
        <h2 style={{margin: '0 0 var(--space-4) 0', color: 'var(--primary-color)'}}>سجل الامتحانات الأخيرة</h2>
        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
          <thead>
            <tr style={{borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)'}}>
              <th style={{padding: '15px'}}>الامتحان</th>
              <th style={{padding: '15px'}}>المادة</th>
              <th style={{padding: '15px'}}>الدرجة</th>
              <th style={{padding: '15px'}}>التقييم</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{padding: '15px', borderBottom: '1px solid var(--border-color)'}}>امتحان شامل فيزياء</td>
              <td style={{padding: '15px', borderBottom: '1px solid var(--border-color)'}}>الفيزياء</td>
              <td style={{padding: '15px', borderBottom: '1px solid var(--border-color)'}}>45 / 50</td>
              <td style={{padding: '15px', borderBottom: '1px solid var(--border-color)'}}><span style={{color: '#10b981', fontWeight: 'bold'}}>ممتاز</span></td>
            </tr>
            <tr>
              <td style={{padding: '15px', borderBottom: '1px solid var(--border-color)'}}>كويز الباب الأول</td>
              <td style={{padding: '15px', borderBottom: '1px solid var(--border-color)'}}>الكيمياء</td>
              <td style={{padding: '15px', borderBottom: '1px solid var(--border-color)'}}>15 / 20</td>
              <td style={{padding: '15px', borderBottom: '1px solid var(--border-color)'}}><span style={{color: '#ffb703', fontWeight: 'bold'}}>جيد جداً</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
