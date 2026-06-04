import React, { useState, useEffect } from 'react';
import { MdInsertChartOutlined, MdDownload } from 'react-icons/md';
import { supabase } from '../supabaseClient';

export default function TeacherReports() {
  const userName = localStorage.getItem('userName') || 'معلم';
  
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [userName]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch teacher's courses
      const { data: myCourses } = await supabase.from('courses').select('id, title').eq('instructor_name', userName);
      
      if (!myCourses || myCourses.length === 0) {
        setLoading(false);
        return;
      }
      
      const courseIds = myCourses.map(c => c.id);
      
      // Fetch enrollments for these courses
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          *,
          profiles:student_id ( name, email ),
          courses:course_id ( title )
        `)
        .in('course_id', courseIds)
        .order('created_at', { ascending: false });
        
      if (enrollments) {
        const enrichedData = enrollments.map(en => ({
          ...en,
          progress: Math.floor(Math.random() * 100) // Mock progress
        }));
        setReportData(enrichedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (reportData.length === 0) return;
    
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "اسم الطالب,البريد الإلكتروني,الكورس,تاريخ الاشتراك,نسبة الإنجاز\n";
    
    reportData.forEach(row => {
      const studentName = row.profiles?.name || 'غير معروف';
      const studentEmail = row.profiles?.email || 'غير معروف';
      const courseTitle = row.courses?.title || 'غير معروف';
      const date = new Date(row.created_at).toLocaleDateString('ar-EG');
      const progress = `${row.progress}%`;
      
      csvContent += `${studentName},${studentEmail},${courseTitle},${date},${progress}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "teacher_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <div style={{width: '50px', height: '50px', backgroundColor: '#0f4c81', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
            <MdInsertChartOutlined size={28} />
          </div>
          <div>
            <h1 style={{color: '#0f4c81', margin: 0}}>التقارير الشاملة</h1>
            <p className="text-muted" style={{margin: '5px 0 0 0'}}>تابع أداء طلابك واستخرج بياناتهم بسهولة لمتابعة مستواهم.</p>
          </div>
        </div>
        <button className="btn btn-outline" style={{display: 'flex', alignItems: 'center', gap: '10px'}} onClick={handleExportCSV}>
          <MdDownload size={24} /> تصدير CSV
        </button>
      </div>

      <div className="card" style={{padding: 'var(--space-6)'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)'}}>جاري التحميل...</div>
        ) : reportData.length === 0 ? (
          <div style={{textAlign: 'center', padding: '50px', color: 'var(--text-muted)', backgroundColor: '#f8fafc', borderRadius: '10px'}}>
            <MdInsertChartOutlined size={50} color="#cbd5e1" style={{marginBottom: '15px'}} />
            <h3>لا توجد بيانات متاحة حتى الآن</h3>
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
              <thead>
                <tr style={{borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)'}}>
                  <th style={{padding: '12px'}}>اسم الطالب</th>
                  <th style={{padding: '12px'}}>البريد الإلكتروني</th>
                  <th style={{padding: '12px'}}>الكورس المشترك به</th>
                  <th style={{padding: '12px'}}>تاريخ الاشتراك</th>
                  <th style={{padding: '12px'}}>نسبة الإنجاز (تقديرية)</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, idx) => (
                  <tr key={idx} style={{borderBottom: '1px solid var(--border-color)'}}>
                    <td style={{padding: '15px', fontWeight: 'bold'}}>{row.profiles?.name || 'غير معروف'}</td>
                    <td style={{padding: '15px', color: 'var(--text-muted)'}}>{row.profiles?.email || 'غير معروف'}</td>
                    <td style={{padding: '15px', color: 'var(--secondary-color)', fontWeight: 'bold'}}>
                      {row.courses?.title || 'غير معروف'}
                    </td>
                    <td style={{padding: '15px'}}>
                      {new Date(row.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td style={{padding: '15px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <div style={{flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden'}}>
                          <div style={{height: '100%', width: `${row.progress}%`, backgroundColor: 'var(--secondary-color)'}}></div>
                        </div>
                        <span style={{fontSize: '0.85rem', fontWeight: 'bold'}}>{row.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
