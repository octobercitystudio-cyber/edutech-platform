import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAccessTime, MdOutlineAssignment } from 'react-icons/md';

export default function Exams() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/exams')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setExams(data.data);
        }
      });
  }, []);

  return (
    <div className="container" style={{padding: 'var(--space-6) 0'}}>
      <h1 style={{color: 'var(--primary-color)', marginBottom: 'var(--space-6)'}}>الامتحانات المتاحة</h1>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)'}}>
        {exams.map(exam => (
          <div key={exam.id} className="card" style={{padding: 'var(--space-4)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-4)'}}>
              <div style={{
                backgroundColor: 'rgba(15, 76, 129, 0.1)', 
                padding: '15px', 
                borderRadius: '50%',
                color: 'var(--primary-color)'
              }}>
                <MdOutlineAssignment size={24} />
              </div>
              <div>
                <h3 style={{margin: 0}}>{exam.title}</h3>
                <span className="text-muted" style={{fontSize: '0.9rem'}}>{exam.course_title}</span>
              </div>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)'}}>
              <span className="text-muted" style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                <MdAccessTime /> {exam.duration_minutes} دقيقة
              </span>
              <span style={{fontWeight: 'bold', color: 'var(--secondary-hover)'}}>
                الدرجة: {exam.total_marks}
              </span>
            </div>
            
            <button 
              className="btn btn-primary" 
              style={{width: '100%'}}
              onClick={() => navigate(`/exams/${exam.id}`)}
            >
              ابدأ الامتحان
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
