import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MdClose } from 'react-icons/md';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    instructor_name: '',
    price: '',
    description: '',
    image_url: ''
  });

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

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('courses').insert([
        {
          title: newCourse.title,
          instructor_name: newCourse.instructor_name,
          price: parseFloat(newCourse.price) || 0,
          description: newCourse.description,
          image_url: newCourse.image_url,
          status: 'نشط'
        }
      ]).select();

      if (error) throw error;

      if (data) {
        setCourses([data[0], ...courses]);
        setShowAddModal(false);
        setNewCourse({ title: '', instructor_name: '', price: '', description: '', image_url: '' });
        alert('تمت إضافة الكورس بنجاح!');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert('حدث خطأ أثناء إضافة الكورس');
    }
  };

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{color: 'var(--primary-color)', margin: 0}}>إدارة الكورسات</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ إضافة كورس جديد</button>
      </div>

      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card fade-in" style={{width: '90%', maxWidth: '500px', padding: '30px', position: 'relative'}}>
            <button 
              onClick={() => setShowAddModal(false)}
              style={{position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem'}}
            >
              <MdClose />
            </button>
            
            <h2 style={{color: 'var(--primary-color)', marginTop: 0}}>إضافة كورس جديد</h2>
            <form onSubmit={handleAddCourse} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <input type="text" placeholder="عنوان الكورس" required className="form-control" 
                value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
              
              <input type="text" placeholder="اسم المعلم" required className="form-control" 
                value={newCourse.instructor_name} onChange={e => setNewCourse({...newCourse, instructor_name: e.target.value})} />
              
              <input type="number" placeholder="السعر (بالجنيه)" required className="form-control" 
                value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} />
              
              <input type="url" placeholder="رابط صورة الكورس" className="form-control" 
                value={newCourse.image_url} onChange={e => setNewCourse({...newCourse, image_url: e.target.value})} />
                
              <textarea placeholder="وصف قصير للكورس" className="form-control" rows="3"
                value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})}></textarea>
                
              <button type="submit" className="btn btn-primary" style={{marginTop: '10px'}}>إضافة الكورس للحفظ</button>
            </form>
          </div>
        </div>
      )}

      <div className="card" style={{padding: 'var(--space-6)'}}>
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
                          {course.image_url ? <img src={course.image_url} alt="course" style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#94a3b8'}}>بدون</div>}
                        </div>
                      </td>
                      <td style={{padding: '15px', fontWeight: 'bold'}}>{course.title}</td>
                      <td style={{padding: '15px', color: 'var(--text-muted)'}}>{course.instructor_name || 'غير محدد'}</td>
                      <td style={{padding: '15px', fontWeight: 'bold', color: 'var(--secondary-color)'}}>{course.price} ج.م</td>
                      <td style={{padding: '15px'}}>
                        <span className={`badge ${course.status === 'نشط' ? 'badge-primary' : 'badge-secondary'}`}>
                          {course.status || 'نشط'}
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
