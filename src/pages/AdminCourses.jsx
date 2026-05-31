import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (data) setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseStatus = async (courseId, currentStatus) => {
    const newStatus = currentStatus === 'نشط' ? 'مغلق' : 'نشط';
    try {
      const { error } = await supabase.from('courses').update({ status: newStatus }).eq('id', courseId);
      if (!error) {
        setCourses(courses.map(c => c.id === courseId ? { ...c, status: newStatus } : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{color: 'var(--primary-color)', margin: 0}}>إدارة الكورسات</h1>
        <button className="btn btn-primary">+ إضافة كورس جديد</button>
      </div>

      <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '40px'}}>جاري تحميل الكورسات...</div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
              <thead>
                <tr style={{borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)'}}>
                  <th style={{padding: '15px'}}>صورة</th>
                  <th style={{padding: '15px'}}>عنوان الكورس</th>
                  <th style={{padding: '15px'}}>المعلم</th>
                  <th style={{padding: '15px'}}>السعر</th>
                  <th style={{padding: '15px'}}>الحالة</th>
                  <th style={{padding: '15px', textAlign: 'center'}}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>لا توجد كورسات</td></tr>
                ) : (
                  courses.map(course => (
                    <tr key={course.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                      <td style={{padding: '15px'}}>
                        <div style={{width: '50px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden'}}>
                          {course.image_url && <img src={course.image_url} alt="course" style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
                        </div>
                      </td>
                      <td style={{padding: '15px', fontWeight: 'bold'}}>{course.title}</td>
                      <td style={{padding: '15px', color: 'var(--text-muted)'}}>{course.instructor_name || 'غير محدد'}</td>
                      <td style={{padding: '15px', fontWeight: 'bold', color: 'var(--secondary-color)'}}>{course.price} ج.م</td>
                      <td style={{padding: '15px'}}>
                        <span className={`badge ${course.status === 'نشط' ? 'badge-primary' : 'badge-secondary'}`}>
                          {course.status}
                        </span>
                      </td>
                      <td style={{padding: '15px', textAlign: 'center'}}>
                        <button 
                          onClick={() => toggleCourseStatus(course.id, course.status)}
                          className="btn btn-outline" 
                          style={{padding: '5px 10px', fontSize: '0.8rem'}}
                        >
                          {course.status === 'نشط' ? 'إيقاف' : 'تفعيل'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
