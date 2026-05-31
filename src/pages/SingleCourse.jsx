import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MdPlayCircleOutline, MdOutlineFileDownload, MdOutlineCheckCircle } from 'react-icons/md';
import PublicNavbar from '../components/PublicNavbar';

export default function SingleCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/courses/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCourse(data.data);
        } else {
          setCourse(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <>
        <PublicNavbar />
        <div style={{padding: 'var(--space-6)', textAlign: 'center'}}>جاري تحميل تفاصيل الكورس...</div>
      </>
    );
  }
  
  if (!course) {
    return (
      <>
        <PublicNavbar />
        <div style={{padding: 'var(--space-6)', textAlign: 'center', color: 'red'}}>لم يتم العثور على الكورس.</div>
      </>
    );
  }

  return (
    <>
    <PublicNavbar />
    <div style={styles.container}>
      <div style={{padding: 'var(--space-4) 0'}}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-outline" 
          style={{marginBottom: 'var(--space-4)'}}
        >
          رجوع
        </button>
      </div>
      <div style={styles.header}>
        <div>
          <h1 style={{color: 'var(--primary-color)'}}>{course.title}</h1>
          <p className="text-muted" style={{fontSize: '1.2rem'}}>
            <Link to={`/instructor/${encodeURIComponent(course.teacher)}`} style={{color: 'inherit', textDecoration: 'none'}}>
              {course.teacher}
            </Link> - كورس كامل
          </p>
        </div>
      </div>

      <div style={styles.contentLayout}>
        <div style={styles.mainCol}>
          <div className="card" style={{padding: 'var(--space-6)', marginBottom: 'var(--space-6)'}}>
            <h2>عن هذا الكورس</h2>
            <p>
              كورس متكامل بأسلوب مبسط يعتمد على الفهم والتطبيق.
              يحتوي الكورس على شرح نظري، حل مسائل، وامتحانات دورية لتقييم مستواك.
            </p>
            
            <h3 style={{marginTop: 'var(--space-6)'}}>ماذا ستتعلم؟</h3>
            <ul style={styles.list}>
              <li><MdOutlineCheckCircle style={styles.checkIcon} /> فهم القواعد والمفاهيم بعمق</li>
              <li><MdOutlineCheckCircle style={styles.checkIcon} /> القدرة على حل الأسئلة المعقدة</li>
              <li><MdOutlineCheckCircle style={styles.checkIcon} /> التدريب على أسئلة النظام الجديد</li>
            </ul>
          </div>

          <div className="card" style={{padding: 'var(--space-6)'}}>
            <h2>محتوى الكورس</h2>
            <div style={styles.lesson}>
              <div style={styles.lessonTitle}><MdPlayCircleOutline /> الدرس الأول: المفاهيم الأساسية</div>
              <span className="text-muted">15:30 دقيقة</span>
            </div>
            <div style={styles.lesson}>
              <div style={styles.lessonTitle}><MdPlayCircleOutline /> الدرس الثاني: تطبيقات وتدريبات</div>
              <span className="text-muted">45:10 دقيقة</span>
            </div>
            <div style={styles.lesson}>
              <div style={styles.lessonTitle}><MdOutlineFileDownload /> ملزمة وملخص الكورس (PDF)</div>
              <span className="text-muted">2 MB</span>
            </div>
          </div>
        </div>
        
        <div style={styles.sideCol}>
          <div className="card" style={{padding: 'var(--space-4)'}}>
            <img 
              src={course.image} 
              alt={course.title} 
              style={{width: '100%', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)'}} 
            />
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)'}}>
              <span className="text-muted">عدد الدروس:</span>
              <strong>{course.lessons} درس</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)'}}>
              <span className="text-muted">إجمالي الساعات:</span>
              <strong>{course.duration}</strong>
            </div>
            <h3 style={{textAlign: 'center', color: 'var(--secondary-hover)'}}>{course.price} ج.م</h3>
            <button 
              className="btn btn-primary" 
              style={{width: '100%', marginBottom: 'var(--space-2)'}} 
              onClick={() => {
                if (!localStorage.getItem('userId')) {
                  navigate('/login', { state: { from: `/courses/${id}` } });
                } else {
                  navigate('/checkout', { state: { courseId: course.id, price: course.price, title: course.title } });
                }
              }}
            >
              شراء الكورس
            </button>
            <p className="text-muted" style={{textAlign: 'center', fontSize: '0.9rem'}}>يشمل الوصول الكامل للمحتوى والامتحانات</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-6)',
    flexWrap: 'wrap',
    gap: 'var(--space-4)',
  },
  contentLayout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: 'var(--space-6)',
  },
  mainCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  sideCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  checkIcon: {
    color: 'var(--secondary-color)',
    marginLeft: 'var(--space-2)',
  },
  lesson: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 'var(--space-4) 0',
    borderBottom: '1px solid var(--border-color)',
  },
  lessonTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    fontWeight: '600',
  }
};
