import React, { useState, useEffect } from 'react';
import { MdAssignment, MdAdd, MdDelete, MdCheckCircle } from 'react-icons/md';
import { supabase } from '../supabaseClient';

export default function TeacherAssignments() {
  const userName = localStorage.getItem('userName') || 'معلم';
  
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newAssignment, setNewAssignment] = useState({
    course_id: '',
    title: '',
    description: '',
    due_date: ''
  });

  useEffect(() => {
    fetchData();
  }, [userName]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch teacher's courses
      const { data: myCourses } = await supabase.from('courses').select('id, title').eq('instructor_name', userName);
      setCourses(myCourses || []);

      // Fetch assignments
      const { data: myAssignments } = await supabase
        .from('assignments')
        .select(`
          *,
          courses ( title )
        `)
        .eq('instructor_name', userName)
        .order('created_at', { ascending: false });
        
      setAssignments(myAssignments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.course_id) {
      alert('الرجاء اختيار الكورس');
      return;
    }
    
    try {
      const { data, error } = await supabase.from('assignments').insert([{
        instructor_name: userName,
        course_id: newAssignment.course_id,
        title: newAssignment.title,
        description: newAssignment.description,
        due_date: newAssignment.due_date || null
      }]).select(`*, courses(title)`);

      if (error) throw error;
      
      setAssignments([data[0], ...assignments]);
      setShowModal(false);
      setNewAssignment({ course_id: '', title: '', description: '', due_date: '' });
      alert('تم إضافة الواجب بنجاح!');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة الواجب');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('هل أنت متأكد من حذف هذا الواجب؟')) return;
    try {
      await supabase.from('assignments').delete().eq('id', id);
      setAssignments(assignments.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <div style={{width: '50px', height: '50px', backgroundColor: 'var(--primary-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
            <MdAssignment size={28} />
          </div>
          <div>
            <h1 style={{color: 'var(--primary-color)', margin: 0}}>الواجبات والتكليفات</h1>
            <p className="text-muted" style={{margin: '5px 0 0 0'}}>إدارة ومتابعة التكليفات الموجهة للطلاب.</p>
          </div>
        </div>
        <button className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => setShowModal(true)}>
          <MdAdd size={24} /> إضافة واجب جديد
        </button>
      </div>

      <div className="card" style={{padding: 'var(--space-6)'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)'}}>جاري التحميل...</div>
        ) : assignments.length === 0 ? (
          <div style={{textAlign: 'center', padding: '50px', color: 'var(--text-muted)', backgroundColor: '#f8fafc', borderRadius: '10px'}}>
            <MdAssignment size={50} color="#cbd5e1" style={{marginBottom: '15px'}} />
            <h3>لم تقم بإضافة أي تكليفات بعد</h3>
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
              <thead>
                <tr style={{borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)'}}>
                  <th style={{padding: '12px'}}>الواجب</th>
                  <th style={{padding: '12px'}}>الكورس</th>
                  <th style={{padding: '12px'}}>تاريخ الاستحقاق</th>
                  <th style={{padding: '12px'}}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => {
                  const isPastDue = a.due_date && new Date(a.due_date) < new Date();
                  return (
                    <tr key={a.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                      <td style={{padding: '15px'}}>
                        <div style={{fontWeight: 'bold', color: 'var(--primary-color)'}}>{a.title}</div>
                        <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{a.description?.substring(0, 50)}...</div>
                      </td>
                      <td style={{padding: '15px', color: 'var(--secondary-color)', fontWeight: 'bold'}}>
                        {a.courses?.title || 'غير محدد'}
                      </td>
                      <td style={{padding: '15px'}}>
                        {a.due_date ? (
                          <span style={{color: isPastDue ? '#e74c3c' : '#10b981', fontWeight: isPastDue ? 'normal' : 'bold'}}>
                            {new Date(a.due_date).toLocaleDateString('ar-EG')}
                            {isPastDue && ' (انتهى)'}
                          </span>
                        ) : 'مفتوح'}
                      </td>
                      <td style={{padding: '15px'}}>
                        <div style={{display: 'flex', gap: '10px'}}>
                          <button className="btn btn-outline" style={{padding: '5px 10px', color: '#e74c3c', borderColor: '#e74c3c'}} onClick={() => handleDelete(a.id)}>
                            <MdDelete /> حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
            <h2 style={{margin: '0 0 20px 0', color: 'var(--primary-color)'}}>إضافة واجب جديد</h2>
            <form onSubmit={handleAddAssignment}>
              <div className="form-group">
                <label>الكورس التابع له الواجب</label>
                <select className="form-control" required value={newAssignment.course_id} onChange={e => setNewAssignment({...newAssignment, course_id: e.target.value})}>
                  <option value="">اختر الكورس...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>عنوان الواجب</label>
                <input type="text" className="form-control" required value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>الوصف أو التعليمات</label>
                <textarea className="form-control" rows="3" required value={newAssignment.description} onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label>آخر موعد للتسليم (اختياري)</label>
                <input type="datetime-local" className="form-control" value={newAssignment.due_date} onChange={e => setNewAssignment({...newAssignment, due_date: e.target.value})} />
              </div>
              <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1}}>حفظ الواجب</button>
                <button type="button" className="btn btn-outline" style={{flex: 1}} onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
