import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MdMenuBook, MdPeople, MdStar, MdArrowBack } from 'react-icons/md';
import PublicNavbar from '../components/PublicNavbar';
import CourseCard from '../components/CourseCard';

export default function InstructorProfile() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/instructors/${encodeURIComponent(name)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setInstructor(data.data.instructor);
          setCourses(data.data.courses);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [name]);

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>جاري تحميل ملف المعلم...</div>;
  if (!instructor) return <div style={{textAlign: 'center', padding: '50px'}}>لم يتم العثور على المعلم</div>;

  return (
    <>
    <PublicNavbar />
    <div className="fade-in">
      {/* Cover and Header */}
      <div style={{
        height: '250px', 
        backgroundColor: 'var(--primary-color)',
        backgroundImage: 'linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        position: 'relative'
      }}>
        <button 
          onClick={() => navigate(-1)}
          className="btn btn-outline" 
          style={{position: 'absolute', top: '20px', right: '20px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none'}}
        >
          <MdArrowBack size={20} style={{verticalAlign: 'middle', marginLeft: '5px'}} />
          رجوع
        </button>
      </div>

      <div className="container" style={{position: 'relative', marginTop: '-80px', paddingBottom: 'var(--space-8)', zIndex: 10}}>
        <div className="card" style={{padding: 'var(--space-6)', textAlign: 'center', overflow: 'visible'}}>
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=random&color=fff&size=200`} 
            alt={instructor.name}
            style={{
              width: '150px', height: '150px', borderRadius: '50%', 
              border: '5px solid white', backgroundColor: 'white',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
              marginTop: '-100px',
              position: 'relative',
              zIndex: 20
            }} 
          />
          <h1 style={{margin: '15px 0 5px 0', color: 'var(--text-main)'}}>{instructor.name}</h1>
          <p className="text-muted" style={{fontSize: '1.1rem', margin: '0 0 20px 0'}}>معلم خبير في المنصة</p>

          <div style={{display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', flexWrap: 'wrap', marginBottom: 'var(--space-4)'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 'bold'}}>{courses.length}</div>
              <div className="text-muted" style={{display: 'flex', alignItems: 'center', gap: '5px'}}><MdMenuBook /> كورسات مسجلة</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{color: 'var(--secondary-color)', fontSize: '1.5rem', fontWeight: 'bold'}}>+1200</div>
              <div className="text-muted" style={{display: 'flex', alignItems: 'center', gap: '5px'}}><MdPeople /> طالب مسجل</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold'}}>4.9</div>
              <div className="text-muted" style={{display: 'flex', alignItems: 'center', gap: '5px'}}><MdStar /> تقييم الطلاب</div>
            </div>
          </div>
          
          <p style={{maxWidth: '600px', margin: '0 auto', lineHeight: 1.8, color: 'var(--text-muted)'}}>
            أستاذ متخصص بخبرة تزيد عن 10 سنوات في تقديم المحتوى التعليمي. يسعى دائماً لتبسيط المعلومة وتوصيلها بأسهل الطرق للطلاب مع الاهتمام بالمتابعة الدورية والتقييم المستمر.
          </p>
        </div>

        <h2 style={{marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)', color: 'var(--primary-color)'}}>الكورسات التي يقدمها</h2>
        
        {courses.length === 0 ? (
          <p className="text-muted">لا يوجد كورسات متاحة لهذا المعلم حالياً.</p>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px'}}>
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
