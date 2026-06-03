import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MdAdd, MdEdit, MdDelete, MdOndemandVideo } from 'react-icons/md';

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: 0,
    type: 'اونلاين'
  });
  const [userName, setUserName] = useState('');

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

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([
          {
            title: newCourse.title,
            description: newCourse.description,
            price: newCourse.price,
            instructor_name: userName,
            status: 'مسودة', // Default to draft so admin can approve it, or active directly? Let's say 'نشط' for now for testing
          }
        ])
        .select();

      if (error) throw error;
      
      // Also set the type and status to 'نشط' directly to avoid friction
      await supabase.from('courses').update({ status: 'نشط', type: newCourse.type }).eq('id', data[0].id);
      
      alert('تم إضافة الكورس بنجاح!');
      setShowModal(false);
      setNewCourse({ title: '', description: '', price: 0, type: 'اونلاين' });
      fetchTeacherCourses();
    } catch (err) {
      console.error('Error adding course:', err);
      alert('حدث خطأ أثناء إضافة الكورس');
    }
  };

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: '0 0 10px 0'}}>إدارة كورساتي</h1>
          <p className="text-muted" style={{margin: 0}}>قم بإضافة وتعديل الكورسات الخاصة بك ومحتواها.</p>
        </div>
        <button className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => setShowModal(true)}>
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
                    <td style={{padding: '15px', fontWeight: 'bold', color: 'var(--primary-color)'}}>{course.title}</td>
                    <td style={{padding: '15px'}}>{course.price} ج.م</td>
                    <td style={{padding: '15px', color: 'var(--text-muted)'}}>{new Date(course.created_at).toLocaleDateString('ar-EG')}</td>
                    <td style={{padding: '15px'}}>
                      <span className="badge badge-primary">{course.status}</span>
                    </td>
                    <td style={{padding: '15px'}}>
                      <div style={{display: 'flex', gap: '10px'}}>
                        <button className="btn btn-outline" style={{padding: '5px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px'}}>
                          <MdEdit /> تعديل
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
            <h2 style={{margin: '0 0 20px 0', color: 'var(--primary-color)'}}>إضافة كورس جديد</h2>
            <form onSubmit={handleAddCourse}>
              <div className="form-group">
                <label>عنوان الكورس</label>
                <input type="text" className="form-control" required value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>وصف الكورس</label>
                <textarea className="form-control" rows="3" required value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label>سعر الكورس (ج.م)</label>
                <input type="number" className="form-control" required value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: parseInt(e.target.value) || 0})} />
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
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>حفظ الكورس</button>
                <button type="button" className="btn btn-outline" style={{flex: 1}} onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
