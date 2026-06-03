import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MdAdd, MdEdit, MdDelete, MdOndemandVideo, MdClose } from 'react-icons/md';

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Create / Edit Course State
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: 0,
    type: 'اونلاين',
    image_url: ''
  });
  
  const [userName, setUserName] = useState('');

  // Lesson Management States
  const [showLessonsModal, setShowLessonsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    video_url: '',
    duration_minutes: 0
  });

  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  const fetchTeacherCourses = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', userData.user.id)
        .single();
        
      const instructorName = profile ? profile.name : '';
      setUserName(instructorName);

      if (instructorName) {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('instructor_name', instructorName)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourseId) {
        // Edit existing course
        const { error } = await supabase
          .from('courses')
          .update({
            title: newCourse.title,
            description: newCourse.description,
            price: newCourse.price,
            type: newCourse.type,
            image_url: newCourse.image_url
          })
          .eq('id', editingCourseId);

        if (error) throw error;
        alert('تم تعديل الكورس بنجاح!');
      } else {
        // Add new course
        const { data, error } = await supabase
          .from('courses')
          .insert([
            {
              title: newCourse.title,
              description: newCourse.description,
              price: newCourse.price,
              instructor_name: userName,
              status: 'نشط',
              image_url: newCourse.image_url
            }
          ])
          .select();

        if (error) throw error;
        
        // update type since it might not be in the initial schema correctly
        if(data && data.length > 0) {
          await supabase.from('courses').update({ status: 'نشط', type: newCourse.type }).eq('id', data[0].id);
        }
        alert('تم إضافة الكورس بنجاح!');
      }

      setShowModal(false);
      resetCourseForm();
      fetchTeacherCourses();
    } catch (err) {
      console.error('Error saving course:', err);
      alert('حدث خطأ أثناء حفظ الكورس');
    }
  };

  const openAddModal = () => {
    resetCourseForm();
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourseId(course.id);
    setNewCourse({
      title: course.title || '',
      description: course.description || '',
      price: course.price || 0,
      type: course.type || 'اونلاين',
      image_url: course.image_url || ''
    });
    setShowModal(true);
  };

  const resetCourseForm = () => {
    setEditingCourseId(null);
    setNewCourse({ title: '', description: '', price: 0, type: 'اونلاين', image_url: '' });
  };

  const handleDeleteCourse = async (courseId) => {
    if(!window.confirm('هل أنت متأكد من حذف هذا الكورس وجميع دروسه نهائياً؟')) return;
    try {
      await supabase.from('courses').delete().eq('id', courseId);
      setCourses(courses.filter(c => c.id !== courseId));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Lessons Logic ---
  const handleManageContent = async (course) => {
    setSelectedCourse(course);
    setShowLessonsModal(true);
    await fetchLessons(course.id);
  };

  const fetchLessons = async (courseId) => {
    setLoadingLessons(true);
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });
      if (error) throw error;
      setLessons(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLessons(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const orderIndex = lessons.length;
      const { data, error } = await supabase.from('lessons').insert([{
        course_id: selectedCourse.id,
        title: newLesson.title,
        description: newLesson.description,
        video_url: newLesson.video_url,
        duration_minutes: newLesson.duration_minutes,
        order_index: orderIndex
      }]).select();
      
      if (error) throw error;
      setLessons([...lessons, data[0]]);
      setNewLesson({ title: '', description: '', video_url: '', duration_minutes: 0 });
    } catch (err) {
      console.error(err);
      alert('خطأ في إضافة الدرس');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
    try {
      const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
      if (error) throw error;
      setLessons(lessons.filter(l => l.id !== lessonId));
    } catch (err) {
      console.error(err);
      alert('خطأ في حذف الدرس');
    }
  };

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: '0 0 10px 0'}}>إدارة كورساتي</h1>
          <p className="text-muted" style={{margin: 0}}>قم بإضافة وتعديل الكورسات الخاصة بك ومحتواها.</p>
        </div>
        <button className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '10px'}} onClick={openAddModal}>
          <MdAdd size={24} /> إضافة كورس جديد
        </button>
      </div>

      <div className="card" style={{padding: 'var(--space-6)'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)'}}>جاري تحميل الكورسات...</div>
        ) : courses.length === 0 ? (
          <div style={{textAlign: 'center', padding: '50px', color: 'var(--text-muted)', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)'}}>
            <MdOndemandVideo size={50} style={{marginBottom: '15px', color: '#cbd5e1'}} />
            <h3>لم تقم بإضافة أي كورسات بعد</h3>
            <p>اضغط على زر "إضافة كورس جديد" للبدء في نشر محتواك للطلاب.</p>
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
              <thead>
                <tr style={{borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)'}}>
                  <th style={{padding: '15px'}}>صورة</th>
                  <th style={{padding: '15px'}}>عنوان الكورس</th>
                  <th style={{padding: '15px'}}>السعر</th>
                  <th style={{padding: '15px'}}>تاريخ الإنشاء</th>
                  <th style={{padding: '15px'}}>الحالة</th>
                  <th style={{padding: '15px'}}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                    <td style={{padding: '15px'}}>
                      <div style={{width: '60px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden'}}>
                        {course.image_url ? (
                          <img src={course.image_url} alt="course" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        ) : (
                          <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#94a3b8'}}>بدون صورة</div>
                        )}
                      </div>
                    </td>
                    <td style={{padding: '15px', fontWeight: 'bold', color: 'var(--primary-color)'}}>{course.title}</td>
                    <td style={{padding: '15px'}}>{course.price} ج.م</td>
                    <td style={{padding: '15px', color: 'var(--text-muted)'}}>{new Date(course.created_at).toLocaleDateString('ar-EG')}</td>
                    <td style={{padding: '15px'}}>
                      <span className="badge badge-primary">{course.status}</span>
                    </td>
                    <td style={{padding: '15px'}}>
                      <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                        <button 
                          className="btn btn-outline" 
                          style={{padding: '5px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px'}}
                          onClick={() => openEditModal(course)}
                        >
                          <MdEdit /> تعديل
                        </button>
                        <button 
                          className="btn btn-primary" 
                          style={{padding: '5px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px'}}
                          onClick={() => handleManageContent(course)}
                        >
                          <MdOndemandVideo /> المحتوى
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          style={{padding: '5px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#e74c3c', color: 'white'}}
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <MdDelete /> حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Add / Edit Course */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, 
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="card fade-in" style={{width: '100%', maxWidth: '500px', padding: '30px', maxHeight: '90vh', overflowY: 'auto'}}>
            <h2 style={{margin: '0 0 20px 0', color: 'var(--primary-color)'}}>
              {editingCourseId ? 'تعديل الكورس' : 'إضافة كورس جديد'}
            </h2>
            <form onSubmit={handleSaveCourse}>
              <div className="form-group">
                <label>عنوان الكورس</label>
                <input type="text" className="form-control" required value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>صورة مصغرة للكورس (رابط Image URL)</label>
                <input type="url" className="form-control" placeholder="https://..." value={newCourse.image_url} onChange={e => setNewCourse({...newCourse, image_url: e.target.value})} />
                {newCourse.image_url && (
                  <div style={{marginTop: '10px', height: '120px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)'}}>
                    <img src={newCourse.image_url} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>وصف الكورس</label>
                <textarea className="form-control" rows="3" required value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label>سعر الكورس (ج.م)</label>
                <input type="number" className="form-control" required value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: parseFloat(e.target.value) || 0})} />
              </div>
              <div className="form-group">
                <label>نوع الكورس</label>
                <select className="form-control" value={newCourse.type} onChange={e => setNewCourse({...newCourse, type: e.target.value})}>
                  <option value="اونلاين">اونلاين (مسجل)</option>
                  <option value="بث مباشر">بث مباشر (Live)</option>
                  <option value="حضور بالسنتر">حضور بالسنتر</option>
                </select>
              </div>
              <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>
                  {editingCourseId ? 'حفظ التعديلات' : 'حفظ الكورس'}
                </button>
                <button type="button" className="btn btn-outline" style={{flex: 1}} onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Manage Lessons */}
      {showLessonsModal && selectedCourse && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, 
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div className="card fade-in" style={{width: '100%', maxWidth: '800px', height: '90vh', display: 'flex', flexDirection: 'column'}}>
            <div style={{padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 style={{margin: 0, color: 'var(--primary-color)'}}>إدارة محتوى الكورس: {selectedCourse.title}</h2>
              <button className="btn btn-outline" style={{padding: '5px 10px'}} onClick={() => setShowLessonsModal(false)}><MdClose size={20} /></button>
            </div>
            
            <div style={{display: 'flex', flex: 1, overflow: 'hidden'}}>
              {/* قائمة الدروس الحالية */}
              <div style={{flex: 1, borderRight: '1px solid var(--border-color)', padding: '20px', overflowY: 'auto'}}>
                <h3 style={{marginTop: 0, marginBottom: '20px'}}>الدروس الحالية</h3>
                {loadingLessons ? (
                  <p className="text-muted">جاري تحميل الدروس...</p>
                ) : lessons.length === 0 ? (
                  <p className="text-muted" style={{textAlign: 'center', marginTop: '50px'}}>لم يتم إضافة أي دروس بعد.</p>
                ) : (
                  <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                    {lessons.map((lesson, idx) => (
                      <li key={lesson.id} style={{padding: '15px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '10px', backgroundColor: '#f8fafc'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <div>
                            <strong>{idx + 1}. {lesson.title}</strong>
                            <div style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '5px'}}>المدة: {lesson.duration_minutes} دقيقة</div>
                          </div>
                          <button 
                            style={{color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', display: 'flex'}}
                            onClick={() => handleDeleteLesson(lesson.id)}
                            title="حذف الدرس"
                          >
                            <MdDelete size={20} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* إضافة درس جديد */}
              <div style={{flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f4f7f9'}}>
                <h3 style={{marginTop: 0, marginBottom: '20px'}}>إضافة درس جديد</h3>
                <form onSubmit={handleAddLesson}>
                  <div className="form-group">
                    <label>عنوان الدرس</label>
                    <input type="text" className="form-control" required value={newLesson.title} onChange={e => setNewLesson({...newLesson, title: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>الوصف (اختياري)</label>
                    <textarea className="form-control" rows="2" value={newLesson.description} onChange={e => setNewLesson({...newLesson, description: e.target.value})}></textarea>
                  </div>
                  <div className="form-group">
                    <label>رابط الفيديو (YouTube)</label>
                    <input type="url" className="form-control" required placeholder="https://..." value={newLesson.video_url} onChange={e => setNewLesson({...newLesson, video_url: e.target.value})} />
                    <small className="text-muted" style={{display: 'block', marginTop: '5px'}}>يرجى التأكد من صلاحية الرابط ليعمل لدى الطالب.</small>
                  </div>
                  <div className="form-group">
                    <label>مدة الدرس (بالدقائق)</label>
                    <input type="number" className="form-control" required min="1" value={newLesson.duration_minutes} onChange={e => setNewLesson({...newLesson, duration_minutes: parseInt(e.target.value) || 0})} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}}>
                    <MdAdd style={{marginLeft: '5px'}} /> حفظ الدرس
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
