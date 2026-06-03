import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MdAdd, MdEdit, MdDelete, MdAssignment } from 'react-icons/md';

export default function TeacherExams() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    description: '',
    course_id: '',
    duration_minutes: 30
  });

  useEffect(() => {
    fetchExamsAndCourses();
  }, []);

  const fetchExamsAndCourses = async () => {
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

      if (instructorName) {
        // Fetch courses for dropdown
        const { data: coursesData } = await supabase
          .from('courses')
          .select('id, title')
          .eq('instructor_name', instructorName);
          
        setCourses(coursesData || []);

        // Fetch exams
        const { data: examsData, error } = await supabase
          .from('exams')
          .select('*, courses(title)')
          // Usually we'd filter by course IDs that belong to the instructor
          // For simplicity, we just fetch all exams linked to those courses
          .in('course_id', (coursesData || []).map(c => c.id));

        // If table doesn't exist, it will throw an error, which we catch
        if (error) {
          console.warn('Exams table might not exist yet:', error);
          setExams([]);
        } else {
          setExams(examsData || []);
        }
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExam = async (e) => {
    e.preventDefault();
    if (!newExam.course_id) {
      alert('الرجاء اختيار الكورس');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('exams')
        .insert([
          {
            title: newExam.title,
            description: newExam.description,
            course_id: newExam.course_id,
            duration_minutes: newExam.duration_minutes,
            is_active: true
          }
        ]);

      if (error) {
        if (error.code === '42P01') {
          alert('جدول الامتحانات غير موجود في قاعدة البيانات! الرجاء تنفيذ كود SQL الخاص بالمعلم.');
        } else {
          throw error;
        }
      } else {
        alert('تم إضافة الامتحان بنجاح!');
        setShowModal(false);
        setNewExam({ title: '', description: '', course_id: '', duration_minutes: 30 });
        fetchExamsAndCourses();
      }
    } catch (err) {
      console.error('Error adding exam:', err);
      alert('حدث خطأ أثناء إضافة الامتحان');
    }
  };

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: '0 0 10px 0'}}>إدارة الامتحانات</h1>
          <p className="text-muted" style={{margin: 0}}>إنشاء وتعديل الامتحانات الخاصة بكورساتك.</p>
        </div>
        <button className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => setShowModal(true)}>
          <MdAdd size={24} /> إضافة امتحان جديد
        </button>
      </div>

      <div className="card" style={{padding: 'var(--space-6)'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)'}}>جاري تحميل الامتحانات...</div>
        ) : exams.length === 0 ? (
          <div style={{textAlign: 'center', padding: '50px', color: 'var(--text-muted)', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)'}}>
            <MdAssignment size={50} style={{marginBottom: '15px', color: '#cbd5e1'}} />
            <h3>لا توجد امتحانات مضافة</h3>
            <p>يمكنك إنشاء امتحان جديد لتقييم طلابك في الكورسات المختلفة.</p>
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
              <thead>
                <tr style={{borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)'}}>
                  <th style={{padding: '15px'}}>عنوان الامتحان</th>
                  <th style={{padding: '15px'}}>الكورس المرتبط</th>
                  <th style={{padding: '15px'}}>المدة</th>
                  <th style={{padding: '15px'}}>تاريخ الإنشاء</th>
                  <th style={{padding: '15px'}}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => (
                  <tr key={exam.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                    <td style={{padding: '15px', fontWeight: 'bold', color: 'var(--primary-color)'}}>{exam.title}</td>
                    <td style={{padding: '15px'}}>{exam.courses?.title || 'غير معروف'}</td>
                    <td style={{padding: '15px'}}>{exam.duration_minutes} دقيقة</td>
                    <td style={{padding: '15px', color: 'var(--text-muted)'}}>{new Date(exam.created_at).toLocaleDateString('ar-EG')}</td>
                    <td style={{padding: '15px'}}>
                      <div style={{display: 'flex', gap: '10px'}}>
                        <button className="btn btn-outline" style={{padding: '5px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px'}}>
                          <MdEdit /> الأسئلة
                        </button>
                        <button className="btn btn-secondary" style={{padding: '5px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#e74c3c', color: 'white'}}>
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

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, 
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="card fade-in" style={{width: '100%', maxWidth: '500px', padding: '30px'}}>
            <h2 style={{margin: '0 0 20px 0', color: 'var(--primary-color)'}}>إنشاء امتحان جديد</h2>
            <form onSubmit={handleAddExam}>
              <div className="form-group">
                <label>عنوان الامتحان</label>
                <input type="text" className="form-control" required value={newExam.title} onChange={e => setNewExam({...newExam, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>الكورس</label>
                <select className="form-control" required value={newExam.course_id} onChange={e => setNewExam({...newExam, course_id: e.target.value})}>
                  <option value="">-- اختر الكورس --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>مدة الامتحان (بالدقائق)</label>
                <input type="number" className="form-control" required value={newExam.duration_minutes} onChange={e => setNewExam({...newExam, duration_minutes: parseInt(e.target.value) || 30})} />
              </div>
              <div className="form-group">
                <label>وصف / ملاحظات للطلاب</label>
                <textarea className="form-control" rows="2" value={newExam.description} onChange={e => setNewExam({...newExam, description: e.target.value})}></textarea>
              </div>
              <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>حفظ الامتحان</button>
                <button type="button" className="btn btn-outline" style={{flex: 1}} onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
