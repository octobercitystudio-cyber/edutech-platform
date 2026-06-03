import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MdPeople, MdSearch, MdEmail } from 'react-icons/md';

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
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
        // Fetch enrollments where course belongs to this instructor
        const { data, error } = await supabase
          .from('enrollments')
          .select(`
            id,
            progress,
            enrolled_at,
            courses!inner ( id, title, instructor_name ),
            profiles!inner ( id, name, email, phone )
          `)
          .eq('courses.instructor_name', instructorName);

        if (error) throw error;
        
        // Data contains enrollments. We can map them or group them by student.
        // For now, let's just show each enrollment as a row: Student Name, Course, Progress.
        setStudents(data || []);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.courses?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: '20px'}}>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: '0 0 10px 0'}}>الطلاب المشتركين</h1>
          <p className="text-muted" style={{margin: 0}}>متابعة بيانات وتقدم الطلاب المشتركين في كورساتك.</p>
        </div>
        <div style={{position: 'relative', width: '300px'}}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="بحث باسم الطالب أو الكورس..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{paddingRight: '40px'}}
          />
          <MdSearch size={24} style={{position: 'absolute', right: '10px', top: '12px', color: 'var(--text-muted)'}} />
        </div>
      </div>

      <div className="card" style={{padding: 'var(--space-6)'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)'}}>جاري تحميل بيانات الطلاب...</div>
        ) : students.length === 0 ? (
          <div style={{textAlign: 'center', padding: '50px', color: 'var(--text-muted)', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)'}}>
            <MdPeople size={50} style={{marginBottom: '15px', color: '#cbd5e1'}} />
            <h3>لا يوجد طلاب مشتركون بعد</h3>
            <p>عند اشتراك الطلاب في أي من كورساتك، سيظهرون في هذه القائمة.</p>
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
              <thead>
                <tr style={{borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)'}}>
                  <th style={{padding: '15px'}}>اسم الطالب</th>
                  <th style={{padding: '15px'}}>الكورس</th>
                  <th style={{padding: '15px'}}>تاريخ الاشتراك</th>
                  <th style={{padding: '15px'}}>نسبة الإنجاز</th>
                  <th style={{padding: '15px'}}>تواصل</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                    <td style={{padding: '15px'}}>
                      <div style={{fontWeight: 'bold', color: 'var(--primary-color)'}}>{student.profiles?.name}</div>
                      <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{student.profiles?.phone}</div>
                    </td>
                    <td style={{padding: '15px', color: 'var(--text-main)'}}>{student.courses?.title}</td>
                    <td style={{padding: '15px', color: 'var(--text-muted)'}}>{new Date(student.enrolled_at).toLocaleDateString('ar-EG')}</td>
                    <td style={{padding: '15px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <div className="progress-container" style={{flex: 1, height: '8px', margin: 0}}>
                          <div className="progress-bar" style={{width: `${student.progress || 0}%`}}></div>
                        </div>
                        <span style={{fontSize: '0.85rem', fontWeight: 'bold'}}>{student.progress || 0}%</span>
                      </div>
                    </td>
                    <td style={{padding: '15px'}}>
                      <button className="btn btn-outline" style={{padding: '5px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <MdEmail /> رسالة
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{padding: '30px', textAlign: 'center', color: 'var(--text-muted)'}}>
                      لا توجد نتائج مطابقة للبحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
