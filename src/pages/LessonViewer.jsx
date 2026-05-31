import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdCheckCircle, MdPlayCircleOutline, MdOutlineFileDownload } from 'react-icons/md';
import SecureVideoPlayer from '../components/SecureVideoPlayer';

export default function LessonViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState(1);
  const [viewError, setViewError] = useState('');

  const lessons = [
    { id: 1, title: 'الدرس الأول: مقدمة في المفاهيم الأساسية', duration: '15:30', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 2, title: 'الدرس الثاني: التدريب العملي وحل المسائل', duration: '45:10', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 3, title: 'الدرس الثالث: مراجعة شاملة', duration: '30:00', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  ];

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    fetch('http://localhost:3000/api/lesson/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: id, sessionToken })
    })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        setViewError(data.message);
      }
    })
    .catch(err => console.error(err));
  }, [id]);

  if (viewError) {
    return (
      <div className="container fade-in" style={{padding: 'var(--space-6) 0', textAlign: 'center'}}>
        <div className="card" style={{padding: '50px', color: 'var(--error-color)'}}>
          <h2>تنبيه أمني</h2>
          <p>{viewError}</p>
          <button className="btn btn-outline" style={{marginTop: '20px'}} onClick={() => navigate('/my-courses')}>العودة لكورساتي</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div style={{display: 'flex', flex: 1, gap: 'var(--space-6)', flexWrap: 'wrap', padding: 'var(--space-4)'}}>
        {/* مشغل الفيديو */}
        <div style={{flex: '2 1 600px', display: 'flex', flexDirection: 'column'}}>
          <SecureVideoPlayer videoSrc={lessons.find(l => l.id === activeLesson)?.videoUrl} />
          <div className="card" style={{padding: 'var(--space-4)', marginTop: 'var(--space-4)'}}>
            <h2>{lessons.find(l => l.id === activeLesson)?.title}</h2>
            <p className="text-muted" style={{marginTop: '10px'}}>
              يحتوي هذا الدرس على شرح تفصيلي للنقاط الرئيسية مع التركيز على الأسئلة المتوقعة في الامتحان.
            </p>
          </div>
        </div>

        {/* قائمة الدروس */}
        <div style={{flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
          <div className="card" style={{padding: '0', overflow: 'hidden'}}>
            <h3 style={{padding: 'var(--space-4)', backgroundColor: 'var(--primary-color)', color: 'white', margin: 0}}>محتوى الكورس</h3>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              {lessons.map(lesson => (
                <div 
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson.id)}
                  style={{
                    padding: 'var(--space-4)', 
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    backgroundColor: activeLesson === lesson.id ? 'rgba(15, 76, 129, 0.05)' : 'white',
                    borderLeft: activeLesson === lesson.id ? '4px solid var(--primary-color)' : '4px solid transparent'
                  }}
                >
                  <MdPlayCircleOutline size={24} color={activeLesson === lesson.id ? 'var(--primary-color)' : 'var(--text-muted)'} />
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: activeLesson === lesson.id ? 'bold' : 'normal', color: activeLesson === lesson.id ? 'var(--primary-color)' : 'var(--text-main)'}}>
                      {lesson.title}
                    </div>
                    <span className="text-muted" style={{fontSize: '0.8rem'}}>{lesson.duration}</span>
                  </div>
                  {lesson.id < activeLesson && <MdCheckCircle color="var(--secondary-color)" />}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{padding: 'var(--space-4)'}}>
            <h3 style={{marginBottom: 'var(--space-4)'}}>المرفقات</h3>
            <button className="btn btn-outline" style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
              <span>ملزمة الدرس.pdf</span>
              <MdOutlineFileDownload size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
