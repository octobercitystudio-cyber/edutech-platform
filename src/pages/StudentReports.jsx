import React from 'react';
import { MdMenuBook, MdCheckCircle, MdTrendingUp } from 'react-icons/md';

export default function StudentReports() {
  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <h1 style={{color: 'var(--primary-color)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '10px'}}>
        <MdMenuBook /> تقارير مستوى الطالب
      </h1>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)'}}>
        <div className="card" style={{padding: '20px', textAlign: 'center'}}>
          <div style={{fontSize: '3rem', color: '#10b981', fontWeight: 'bold'}}>95%</div>
          <div className="text-muted">نسبة الحضور والتفاعل</div>
        </div>
        <div className="card" style={{padding: '20px', textAlign: 'center'}}>
          <div style={{fontSize: '3rem', color: 'var(--primary-color)', fontWeight: 'bold'}}>12</div>
          <div className="text-muted">الواجبات المنجزة</div>
        </div>
        <div className="card" style={{padding: '20px', textAlign: 'center'}}>
          <div style={{fontSize: '3rem', color: 'var(--secondary-color)', fontWeight: 'bold'}}>88%</div>
          <div className="text-muted">متوسط الدرجات</div>
        </div>
      </div>

      <h2 style={{color: 'var(--text-main)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '10px'}}>
        <MdTrendingUp color="var(--primary-color)" /> تفصيل الدرجات
      </h2>
      
      <div className="card" style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
          <thead>
            <tr style={{backgroundColor: 'var(--bg-light)', borderBottom: '2px solid var(--border-color)'}}>
              <th style={{padding: '15px'}}>المادة</th>
              <th style={{padding: '15px'}}>الامتحان</th>
              <th style={{padding: '15px'}}>الدرجة</th>
              <th style={{padding: '15px'}}>التقييم</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{borderBottom: '1px solid var(--border-color)'}}>
              <td style={{padding: '15px'}}>الفيزياء</td>
              <td style={{padding: '15px'}}>امتحان الباب الأول</td>
              <td style={{padding: '15px', fontWeight: 'bold', color: '#10b981'}}>45 / 50</td>
              <td style={{padding: '15px'}}><span style={{backgroundColor: '#10b98120', color: '#10b981', padding: '5px 10px', borderRadius: '20px', fontSize: '0.9rem'}}><MdCheckCircle style={{verticalAlign: 'middle'}}/> ممتاز</span></td>
            </tr>
            <tr style={{borderBottom: '1px solid var(--border-color)'}}>
              <td style={{padding: '15px'}}>الكيمياء</td>
              <td style={{padding: '15px'}}>اختبار قصير 1</td>
              <td style={{padding: '15px', fontWeight: 'bold', color: '#f59e0b'}}>15 / 20</td>
              <td style={{padding: '15px'}}><span style={{backgroundColor: '#f59e0b20', color: '#f59e0b', padding: '5px 10px', borderRadius: '20px', fontSize: '0.9rem'}}>جيد جداً</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
