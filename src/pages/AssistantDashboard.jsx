import React from 'react';
import { MdQuestionAnswer, MdAssignment, MdWarning } from 'react-icons/md';

export default function AssistantDashboard() {
  const stats = [
    { title: 'أسئلة تم الرد عليها', value: '145', icon: <MdQuestionAnswer />, color: '#0f4c81' },
    { title: 'واجبات مصححة', value: '320', icon: <MdAssignment />, color: '#10b981' },
    { title: 'طلاب متأخرين (غياب)', value: '18', icon: <MdWarning />, color: '#e74c3c' },
  ];

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: '0 0 10px 0'}}>لوحة تحكم المساعد</h1>
          <p className="text-muted" style={{margin: 0}}>مرحباً بك في فريق الدعم الأكاديمي. إليك مهامك اليوم.</p>
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

      <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)'}}>
        <div className="card" style={{padding: 'var(--space-6)'}}>
          <h2 style={{margin: '0 0 var(--space-4) 0', color: 'var(--primary-color)'}}>أسئلة تحتاج إلى رد (Q&A)</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <div style={{padding: '15px', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-md)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{fontWeight: 'bold', marginBottom: '5px'}}>سارة كمال - الكيمياء العضوية</div>
                <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>منذ ساعتين</span>
              </div>
              <p style={{margin: 0, fontSize: '0.95rem', color: 'var(--text-main)'}}>هل يمكن شرح تفاعل الاستبدال مرة أخرى؟ لم أفهمه جيداً.</p>
              <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                <input type="text" className="form-control" placeholder="اكتب ردك هنا..." style={{flex: 1}} />
                <button className="btn btn-primary" style={{padding: '10px 20px'}}>إرسال</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
