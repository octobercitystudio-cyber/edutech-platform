import React from 'react';
import { MdLiveTv, MdAccessTime } from 'react-icons/md';

export default function LiveSessions() {
  const sessions = [
    { id: 1, title: 'مراجعة الباب الأول', date: '2026-06-01', time: '08:00 PM', instructor: 'أ. محمود حمدي', platform: 'Zoom' },
    { id: 2, title: 'حل أسئلة بنك المعرفة', date: '2026-06-02', time: '06:00 PM', instructor: 'أ. سامح عبد الله', platform: 'Google Meet' },
  ];

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <h1 style={{color: 'var(--primary-color)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '10px'}}>
        <MdLiveTv /> جدول البث المباشر
      </h1>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)'}}>
        {sessions.map(s => (
          <div key={s.id} className="card" style={{padding: '20px', borderTop: '4px solid #ef4444'}}>
            <h3 style={{margin: '0 0 10px 0', color: 'var(--text-main)'}}>{s.title}</h3>
            <p className="text-muted" style={{margin: '0 0 15px 0'}}>المعلم: {s.instructor}</p>
            
            <div style={{display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px', color: 'var(--secondary-hover)', fontWeight: 'bold'}}>
              <MdAccessTime size={20} />
              {s.date} - {s.time}
            </div>
            
            <button className="btn btn-primary" style={{width: '100%', backgroundColor: '#ef4444'}}>
              انضمام للبث ({s.platform})
            </button>
          </div>
        ))}
      </div>
      {sessions.length === 0 && <p className="text-muted">لا يوجد حصص بث مباشر مجدولة حالياً.</p>}
    </div>
  );
}
