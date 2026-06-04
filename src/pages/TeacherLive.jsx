import React, { useState, useEffect } from 'react';
import { MdVideocam, MdAdd, MdDelete, MdLink } from 'react-icons/md';
import { supabase } from '../supabaseClient';

export default function TeacherLive() {
  const userName = localStorage.getItem('userName') || 'معلم';
  
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newSession, setNewSession] = useState({
    course_id: '',
    title: '',
    meeting_link: '',
    start_time: '',
    duration_minutes: 60
  });

  useEffect(() => {
    fetchData();
  }, [userName]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: myCourses } = await supabase.from('courses').select('id, title').eq('instructor_name', userName);
      setCourses(myCourses || []);

      const { data: mySessions } = await supabase
        .from('live_sessions')
        .select(`*, courses(title)`)
        .eq('instructor_name', userName)
        .order('start_time', { ascending: true });
        
      setSessions(mySessions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!newSession.course_id || !newSession.meeting_link) {
      alert('الرجاء إكمال كافة البيانات المطلوبة');
      return;
    }
    
    try {
      const { data, error } = await supabase.from('live_sessions').insert([{
        instructor_name: userName,
        course_id: newSession.course_id,
        title: newSession.title,
        meeting_link: newSession.meeting_link,
        start_time: newSession.start_time,
        duration_minutes: newSession.duration_minutes
      }]).select(`*, courses(title)`);

      if (error) throw error;
      
      setSessions([...sessions, data[0]].sort((a,b) => new Date(a.start_time) - new Date(b.start_time)));
      setShowModal(false);
      setNewSession({ course_id: '', title: '', meeting_link: '', start_time: '', duration_minutes: 60 });
      alert('تم جدولة الفصل المباشر بنجاح!');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء جدولة الفصل المباشر');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('هل أنت متأكد من إلغاء هذا الفصل المباشر؟')) return;
    try {
      await supabase.from('live_sessions').delete().eq('id', id);
      setSessions(sessions.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <div style={{width: '50px', height: '50px', backgroundColor: '#e74c3c', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
            <MdVideocam size={28} />
          </div>
          <div>
            <h1 style={{color: '#e74c3c', margin: 0}}>الفصول المباشرة</h1>
            <p className="text-muted" style={{margin: '5px 0 0 0'}}>قم بجدولة حصصك المباشرة (Zoom أو Google Meet) للطلاب.</p>
          </div>
        </div>
        <button className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#e74c3c', borderColor: '#e74c3c'}} onClick={() => setShowModal(true)}>
          <MdAdd size={24} /> جدولة حصة جديدة
        </button>
      </div>

      <div className="card" style={{padding: 'var(--space-6)'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)'}}>جاري التحميل...</div>
        ) : sessions.length === 0 ? (
          <div style={{textAlign: 'center', padding: '50px', color: 'var(--text-muted)', backgroundColor: '#f8fafc', borderRadius: '10px'}}>
            <MdVideocam size={50} color="#cbd5e1" style={{marginBottom: '15px'}} />
            <h3>لا توجد فصول مباشرة مجدولة</h3>
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
              <thead>
                <tr style={{borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)'}}>
                  <th style={{padding: '12px'}}>موضوع الحصة</th>
                  <th style={{padding: '12px'}}>الكورس</th>
                  <th style={{padding: '12px'}}>موعد البدء</th>
                  <th style={{padding: '12px'}}>الرابط</th>
                  <th style={{padding: '12px'}}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => {
                  const isPast = new Date(s.start_time) < new Date();
                  return (
                    <tr key={s.id} style={{borderBottom: '1px solid var(--border-color)', opacity: isPast ? 0.6 : 1}}>
                      <td style={{padding: '15px'}}>
                        <div style={{fontWeight: 'bold', color: 'var(--primary-color)'}}>{s.title}</div>
                        <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{s.duration_minutes} دقيقة</div>
                      </td>
                      <td style={{padding: '15px', color: 'var(--secondary-color)', fontWeight: 'bold'}}>
                        {s.courses?.title || 'غير محدد'}
                      </td>
                      <td style={{padding: '15px'}}>
                        {new Date(s.start_time).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                        {isPast && <span style={{display:'block', color: 'red', fontSize: '0.8rem'}}>منتهية</span>}
                      </td>
                      <td style={{padding: '15px'}}>
                        <a href={s.meeting_link} target="_blank" rel="noreferrer" className="btn btn-outline" style={{padding: '5px 10px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '5px'}}>
                          <MdLink /> فتح الرابط
                        </a>
                      </td>
                      <td style={{padding: '15px'}}>
                        <button className="btn btn-outline" style={{padding: '5px 10px', color: '#e74c3c', borderColor: '#e74c3c'}} onClick={() => handleDelete(s.id)}>
                          <MdDelete /> إلغاء
                        </button>
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
            <h2 style={{margin: '0 0 20px 0', color: '#e74c3c'}}>جدولة فصل مباشر جديد</h2>
            <form onSubmit={handleAddSession}>
              <div className="form-group">
                <label>الكورس التابع له</label>
                <select className="form-control" required value={newSession.course_id} onChange={e => setNewSession({...newSession, course_id: e.target.value})}>
                  <option value="">اختر الكورس...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>عنوان / موضوع الحصة</label>
                <input type="text" className="form-control" required value={newSession.title} onChange={e => setNewSession({...newSession, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>رابط الاجتماع (Zoom / Google Meet)</label>
                <input type="url" className="form-control" required placeholder="https://..." value={newSession.meeting_link} onChange={e => setNewSession({...newSession, meeting_link: e.target.value})} />
              </div>
              <div className="form-group">
                <label>موعد البدء</label>
                <input type="datetime-local" className="form-control" required value={newSession.start_time} onChange={e => setNewSession({...newSession, start_time: e.target.value})} />
              </div>
              <div className="form-group">
                <label>المدة (بالدقائق)</label>
                <input type="number" className="form-control" required min="10" value={newSession.duration_minutes} onChange={e => setNewSession({...newSession, duration_minutes: parseInt(e.target.value) || 60})} />
              </div>
              <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1, backgroundColor: '#e74c3c', borderColor: '#e74c3c'}}>تأكيد الجدولة</button>
                <button type="button" className="btn btn-outline" style={{flex: 1}} onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
