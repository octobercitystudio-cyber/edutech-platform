import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { MdCheckCircle, MdPlayCircleOutline, MdOutlineFileDownload, MdArrowBack } from 'react-icons/md';
import SecureVideoPlayer from '../components/SecureVideoPlayer';
import { supabase } from '../supabaseClient';

export default function LessonViewer() {
  const { id } = useParams(); // this is the courseId
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetchCourseAndLessons();
  }, [id]);

  useEffect(() => {
    // Set active lesson from URL if provided, else default to first lesson
    if (lessons.length > 0) {
      const urlLessonId = searchParams.get('lessonId');
      if (urlLessonId) {
        const found = lessons.find(l => l.id === urlLessonId);
        if (found) {
          setActiveLesson(found);
          return;
        }
      }
      setActiveLesson(lessons[0]);
    }
  }, [lessons, searchParams]);

  const fetchCourseAndLessons = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      // Check if user is enrolled (optional but good practice for security)
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setErrorMsg('يجب تسجيل الدخول لمشاهدة هذا المحتوى');
        return;
      }

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*')
        .eq('student_id', userData.user.id)
        .eq('course_id', id);

      if (!enrollments || enrollments.length === 0) {
        setErrorMsg('أنت غير مشترك في هذا الكورس! لا يمكنك مشاهدة الدروس.');
        return;
      }

      // Fetch Course Details
      const { data: courseData } = await supabase.from('courses').select('title').eq('id', id).single();
      if (courseData) setCourse(courseData);

      // Fetch Lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;
      
      setLessons(lessonsData || []);

    } catch (err) {
      console.error(err);
      setErrorMsg('حدث خطأ أثناء تحميل الدروس');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonChange = (lesson) => {
    setActiveLesson(lesson);
    // Update URL without reloading
    window.history.replaceState(null, '', `/lesson/${id}?lessonId=${lesson.id}`);
  };

  if (loading) {
    return <div style={{padding: '50px', textAlign: 'center', color: 'var(--primary-color)'}}>جاري تحميل المحتوى...</div>;
  }

  if (errorMsg) {
    return (
      <div className="container fade-in" style={{padding: 'var(--space-6) 0', textAlign: 'center'}}>
        <div className="card" style={{padding: '50px', color: 'var(--error-color)'}}>
          <h2>تنبيه أمني</h2>
          <p>{errorMsg}</p>
          <button className="btn btn-outline" style={{marginTop: '20px'}} onClick={() => navigate('/my-courses')}>العودة لكورساتي</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}} className="fade-in">
      <div style={{padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'white'}}>
        <button className="btn btn-outline" style={{padding: '5px 10px'}} onClick={() => navigate('/my-courses')}>
          <MdArrowBack size={20} /> رجوع
        </button>
        <h2 style={{margin: 0, color: 'var(--primary-color)'}}>{course?.title || 'مشاهدة الكورس'}</h2>
      </div>

      <div style={{display: 'flex', flex: 1, gap: 'var(--space-6)', flexWrap: 'wrap', padding: 'var(--space-4)'}}>
        {/* مشغل الفيديو */}
        <div style={{flex: '2 1 600px', display: 'flex', flexDirection: 'column'}}>
          {activeLesson ? (
            <>
              <SecureVideoPlayer videoSrc={activeLesson.video_url} />
              <div className="card fade-in" style={{padding: 'var(--space-4)', marginTop: 'var(--space-4)'}}>
                <h2 style={{color: 'var(--text-main)', margin: '0 0 10px 0'}}>{activeLesson.title}</h2>
                <div style={{fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px'}}>المدة: {activeLesson.duration_minutes} دقيقة</div>
                <p className="text-muted" style={{margin: 0, lineHeight: '1.6'}}>
                  {activeLesson.description || 'لا يوجد وصف لهذا الدرس.'}
                </p>
              </div>
            </>
          ) : (
            <div className="card" style={{padding: '50px', textAlign: 'center', color: 'var(--text-muted)'}}>
              <h3>لا يوجد دروس في هذا الكورس حالياً</h3>
            </div>
          )}
        </div>

        {/* قائمة الدروس */}
        <div style={{flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
          <div className="card" style={{padding: '0', overflow: 'hidden'}}>
            <h3 style={{padding: 'var(--space-4)', backgroundColor: 'var(--primary-color)', color: 'white', margin: 0}}>محتوى الكورس</h3>
            <div style={{display: 'flex', flexDirection: 'column', maxHeight: '500px', overflowY: 'auto'}}>
              {lessons.map((lesson, idx) => (
                <div 
                  key={lesson.id}
                  onClick={() => handleLessonChange(lesson)}
                  style={{
                    padding: 'var(--space-4)', 
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    backgroundColor: activeLesson?.id === lesson.id ? 'rgba(15, 76, 129, 0.05)' : 'white',
                    borderLeft: activeLesson?.id === lesson.id ? '4px solid var(--primary-color)' : '4px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <MdPlayCircleOutline size={24} color={activeLesson?.id === lesson.id ? 'var(--primary-color)' : 'var(--text-muted)'} />
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: activeLesson?.id === lesson.id ? 'bold' : 'normal', color: activeLesson?.id === lesson.id ? 'var(--primary-color)' : 'var(--text-main)'}}>
                      {idx + 1}. {lesson.title}
                    </div>
                    <span className="text-muted" style={{fontSize: '0.8rem'}}>{lesson.duration_minutes} دقيقة</span>
                  </div>
                  {/* يمكن اضافة نظام تتبع تقدم لاحقا 
                  {lesson.id < activeLesson?.id && <MdCheckCircle color="var(--secondary-color)" />}
                  */}
                </div>
              ))}
              {lessons.length === 0 && (
                <div style={{padding: '20px', textAlign: 'center', color: 'var(--text-muted)'}}>القائمة فارغة</div>
              )}
            </div>
          </div>

          {activeLesson && activeLesson.pdf_url && (
            <div className="card" style={{padding: 'var(--space-4)'}}>
              <h3 style={{marginBottom: 'var(--space-4)', color: 'var(--primary-color)'}}>المرفقات</h3>
              <button 
                className="btn btn-outline" 
                style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}
                onClick={() => window.open(activeLesson.pdf_url, '_blank')}
              >
                <span>ملف الدرس (PDF)</span>
                <MdOutlineFileDownload size={20} />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
