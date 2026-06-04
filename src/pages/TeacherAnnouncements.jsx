import React, { useState, useEffect } from 'react';
import { MdCampaign, MdAdd, MdDelete } from 'react-icons/md';
import { supabase } from '../supabaseClient';

export default function TeacherAnnouncements() {
  const userName = localStorage.getItem('userName') || 'معلم';
  
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newAnnouncement, setNewAnnouncement] = useState({
    course_id: '',
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchData();
  }, [userName]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: myCourses } = await supabase.from('courses').select('id, title').eq('instructor_name', userName);
      setCourses(myCourses || []);

      const { data: myAnnouncements } = await supabase
        .from('announcements')
        .select(`*, courses(title)`)
        .eq('instructor_name', userName)
        .order('created_at', { ascending: false });
        
      setAnnouncements(myAnnouncements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.course_id || !newAnnouncement.title || !newAnnouncement.message) {
      alert('الرجاء إكمال كافة البيانات المطلوبة');
      return;
    }
    
    try {
      const { data, error } = await supabase.from('announcements').insert([{
        instructor_name: userName,
        course_id: newAnnouncement.course_id,
        title: newAnnouncement.title,
        message: newAnnouncement.message
      }]).select(`*, courses(title)`);

      if (error) throw error;
      
      setAnnouncements([data[0], ...announcements]);
      setShowModal(false);
      setNewAnnouncement({ course_id: '', title: '', message: '' });
      alert('تم إرسال الإعلان بنجاح!');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إرسال الإعلان');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    try {
      await supabase.from('announcements').delete().eq('id', id);
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <div style={{width: '50px', height: '50px', backgroundColor: '#8e44ad', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
            <MdCampaign size={28} />
          </div>
          <div>
            <h1 style={{color: '#8e44ad', margin: 0}}>الإعلانات والتنبيهات</h1>
            <p className="text-muted" style={{margin: '5px 0 0 0'}}>أرسل رسائل وتنبيهات هامة لطلاب كورس معين لتبقيهم على اطلاع.</p>
          </div>
        </div>
        <button className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#8e44ad', borderColor: '#8e44ad'}} onClick={() => setShowModal(true)}>
          <MdAdd size={24} /> إرسال إعلان جديد
        </button>
      </div>

      <div className="card" style={{padding: 'var(--space-6)'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)'}}>جاري التحميل...</div>
        ) : announcements.length === 0 ? (
          <div style={{textAlign: 'center', padding: '50px', color: 'var(--text-muted)', backgroundColor: '#f8fafc', borderRadius: '10px'}}>
            <MdCampaign size={50} color="#cbd5e1" style={{marginBottom: '15px'}} />
            <h3>لا توجد إعلانات مرسلة</h3>
          </div>
        ) : (
          <div style={{display: 'grid', gap: '20px'}}>
            {announcements.map(a => (
              <div key={a.id} style={{padding: '20px', border: '1px solid var(--border-color)', borderRadius: '10px', position: 'relative', backgroundColor: '#fbfcfd'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
                  <div>
                    <h3 style={{margin: '0 0 5px 0', color: 'var(--primary-color)'}}>{a.title}</h3>
                    <span style={{fontSize: '0.85rem', color: 'white', backgroundColor: 'var(--secondary-color)', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold'}}>
                      {a.courses?.title || 'عام'}
                    </span>
                    <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '10px'}}>
                      {new Date(a.created_at).toLocaleString('ar-EG', { dateStyle: 'long', timeStyle: 'short' })}
                    </span>
                  </div>
                  <button className="btn btn-outline" style={{padding: '5px', color: '#e74c3c', borderColor: '#e74c3c', border: 'none'}} onClick={() => handleDelete(a.id)}>
                    <MdDelete size={20} />
                  </button>
                </div>
                <p style={{margin: 0, color: 'var(--text-main)', lineHeight: '1.6'}}>{a.message}</p>
              </div>
            ))}
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
            <h2 style={{margin: '0 0 20px 0', color: '#8e44ad'}}>إرسال إعلان جديد</h2>
            <form onSubmit={handleAddAnnouncement}>
              <div className="form-group">
                <label>إرسال إلى طلاب كورس:</label>
                <select className="form-control" required value={newAnnouncement.course_id} onChange={e => setNewAnnouncement({...newAnnouncement, course_id: e.target.value})}>
                  <option value="">اختر الكورس...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>عنوان الإعلان</label>
                <input type="text" className="form-control" required value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} placeholder="مثال: تأجيل محاضرة الغد" />
              </div>
              <div className="form-group">
                <label>نص الإعلان</label>
                <textarea className="form-control" rows="5" required value={newAnnouncement.message} onChange={e => setNewAnnouncement({...newAnnouncement, message: e.target.value})} placeholder="اكتب رسالتك للطلاب هنا..."></textarea>
              </div>
              <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                <button type="submit" className="btn btn-primary" style={{flex: 1, backgroundColor: '#8e44ad', borderColor: '#8e44ad'}}>نشر الإعلان</button>
                <button type="button" className="btn btn-outline" style={{flex: 1}} onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
