import React, { useState, useEffect } from 'react';
import { MdPeople, MdMenuBook, MdAttachMoney, MdQuestionAnswer, MdAddCircle, MdAssignment, MdEdit, MdDelete, MdContentCopy, MdVisibilityOff } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'معلم';
  
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    revenue: 0,
    questions: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for the chart (In reality, derived from enrollments)
  const chartData = [
    { name: '1 يونيو', sales: 1200 },
    { name: '5 يونيو', sales: 1900 },
    { name: '10 يونيو', sales: 1500 },
    { name: '15 يونيو', sales: 2800 },
    { name: '20 يونيو', sales: 3400 },
    { name: '25 يونيو', sales: 3100 },
    { name: '30 يونيو', sales: 4200 },
  ];

  useEffect(() => {
    fetchTeacherStats();
  }, [userName]);

  const fetchTeacherStats = async () => {
    try {
      setLoading(true);
      
      const { data: myCourses } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_name', userName)
        .order('created_at', { ascending: false });
        
      if (!myCourses || myCourses.length === 0) {
        setStats(s => ({ ...s, courses: 0 }));
        setLoading(false);
        return;
      }
      
      // Update recent courses with mock completion data
      const coursesWithMockStats = myCourses.slice(0, 5).map(c => ({
        ...c,
        studentsCount: Math.floor(Math.random() * 50) + 1, // Mock
        completionRate: Math.floor(Math.random() * 100) // Mock
      }));
      setRecentCourses(coursesWithMockStats);

      const courseIds = myCourses.map(c => c.id);
      
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('student_id, course_id')
        .in('course_id', courseIds);
        
      let uniqueStudents = new Set();
      let totalRevenue = 0;
      
      if (enrollments) {
        enrollments.forEach(en => {
          uniqueStudents.add(en.student_id);
          const course = myCourses.find(c => c.id === en.course_id);
          if (course && course.price) {
            totalRevenue += parseFloat(course.price);
          }
        });
      }

      setStats({
        students: uniqueStudents.size,
        courses: myCourses.length,
        revenue: totalRevenue,
        questions: Math.floor(Math.random() * 5) // Mock
      });

    } catch (error) {
      console.error('Error fetching teacher stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if(status === 'نشط') return '#10b981'; // Green
    if(status === 'مسودة') return '#94a3b8'; // Gray
    return '#e74c3c'; // Red (Closed)
  };

  // خصم عمولة المنصة (مثلاً 10%)
  const platformFee = 0.10;
  const netRevenue = stats.revenue - (stats.revenue * platformFee);

  const statCards = [
    { title: 'إجمالي الطلاب', value: stats.students, icon: <MdPeople />, color: '#0f4c81' },
    { title: 'الكورسات النشطة', value: stats.courses, icon: <MdMenuBook />, color: '#10b981' },
    { title: 'صافي الأرباح', value: `${netRevenue.toFixed(0)} ج.م`, icon: <MdAttachMoney />, color: '#ffb703' },
    { title: 'أسئلة معلقة', value: stats.questions, icon: <MdQuestionAnswer />, color: '#e74c3c' },
  ];

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: '0 0 10px 0'}}>لوحة تحكم المعلم (V2)</h1>
          <p className="text-muted" style={{margin: 0}}>أهلاً بك، إليك نظرة شاملة لأداء عملك على المنصة.</p>
        </div>
        <button className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => navigate('/teacher-courses')}>
          <MdAddCircle size={24} /> إدارة الكورسات
        </button>
      </div>

      {/* الكروت الإحصائية العلوية */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-8)'
      }}>
        {statCards.map((stat, idx) => (
          <div key={idx} className="card" style={{padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'}}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '15px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', backgroundColor: stat.color + '15', color: stat.color
            }}>
              {stat.icon}
            </div>
            <div>
              <h3 style={{margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem'}}>{stat.title}</h3>
              <h2 style={{margin: '5px 0 0 0', fontSize: '1.5rem', color: 'var(--text-main)'}}>{stat.value}</h2>
              {stat.title === 'صافي الأرباح' && (
                <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>بعد خصم 10% رسوم المنصة</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* الرسم البياني للأرباح */}
      <div className="card fade-in" style={{marginBottom: 'var(--space-6)', padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
        <h2 style={{margin: '0 0 20px 0', color: 'var(--primary-color)'}}>تحليلات المبيعات (هذا الشهر)</h2>
        <div style={{width: '100%', height: '300px'}}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
              <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                labelStyle={{fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '5px'}}
              />
              <Line type="monotone" dataKey="sales" name="المبيعات (ج.م)" stroke="var(--primary-color)" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)'}}>
        
        {/* Main Column */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-6)'}}>
          <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0', overflowX: 'auto'}}>
            <h2 style={{margin: '0 0 20px 0', color: 'var(--primary-color)'}}>أحدث الكورسات وأداء الطلاب</h2>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '2px solid var(--border-color)', textAlign: 'right', backgroundColor: 'var(--bg-light)'}}>
                  <th style={{padding: '12px'}}>الكورس</th>
                  <th style={{padding: '12px'}}>إنجاز الطلاب</th>
                  <th style={{padding: '12px'}}>الحالة</th>
                  <th style={{padding: '12px'}}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>جاري التحميل...</td></tr>
                ) : recentCourses.length === 0 ? (
                  <tr><td colSpan="4" style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>لا توجد كورسات مضافة بعد</td></tr>
                ) : (
                  recentCourses.map(course => (
                    <tr key={course.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                      <td style={{padding: '15px'}}>
                        <div style={{fontWeight: 'bold', color: 'var(--text-main)'}}>{course.title}</div>
                        <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{course.studentsCount} مشتركين</div>
                      </td>
                      <td style={{padding: '15px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                          <div style={{flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden'}}>
                            <div style={{height: '100%', width: `${course.completionRate}%`, backgroundColor: 'var(--secondary-color)'}}></div>
                          </div>
                          <span style={{fontSize: '0.85rem', fontWeight: 'bold'}}>{course.completionRate}%</span>
                        </div>
                      </td>
                      <td style={{padding: '15px'}}>
                        <span style={{
                          backgroundColor: getStatusColor(course.status) + '20',
                          color: getStatusColor(course.status),
                          padding: '5px 10px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          {course.status}
                        </span>
                      </td>
                      <td style={{padding: '15px'}}>
                        <div style={{display: 'flex', gap: '10px'}}>
                          <button title="تعديل" className="btn btn-outline" style={{padding: '5px', borderRadius: '5px'}} onClick={() => navigate('/teacher-courses')}><MdEdit size={18} /></button>
                          <button title="نسخ الرابط" className="btn btn-outline" style={{padding: '5px', borderRadius: '5px'}} onClick={() => {navigator.clipboard.writeText(window.location.origin + '/course/' + course.id); alert('تم النسخ');}}><MdContentCopy size={18} /></button>
                          <button title="إخفاء" className="btn btn-outline" style={{padding: '5px', borderRadius: '5px'}}><MdVisibilityOff size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Column */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-6)'}}>
          <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{margin: 0, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <MdAssignment /> المهام القادمة
              </h2>
              <span className="badge badge-primary">3 مهام</span>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <div style={{padding: '10px', borderRight: '3px solid #ffb703', backgroundColor: '#f8fafc'}}>
                <div style={{fontWeight: 'bold', fontSize: '0.9rem'}}>جلسة بث مباشر (فيزياء)</div>
                <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>اليوم - 08:00 مساءً</div>
              </div>
              <div style={{padding: '10px', borderRight: '3px solid #e74c3c', backgroundColor: '#f8fafc'}}>
                <div style={{fontWeight: 'bold', fontSize: '0.9rem'}}>تقييم واجبات (الفصل الأول)</div>
                <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>غداً - 12:00 ظهراً</div>
              </div>
              <div style={{padding: '10px', borderRight: '3px solid #10b981', backgroundColor: '#f8fafc'}}>
                <div style={{fontWeight: 'bold', fontSize: '0.9rem'}}>تفعيل امتحان الميدتيرم</div>
                <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>الأربعاء القادم</div>
              </div>
            </div>
            <button className="btn btn-outline" style={{width: '100%', marginTop: '20px'}}>عرض كل المهام</button>
          </div>

          <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, var(--primary-color), #0a365c)', color: 'white'}}>
            <h2 style={{margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <MdAttachMoney /> رصيدك المتاح
            </h2>
            <h1 style={{margin: '0 0 15px 0', fontSize: '2.5rem'}}>{(netRevenue * 0.4).toFixed(0)} ج.م</h1>
            <p style={{fontSize: '0.9rem', opacity: 0.8, marginBottom: '20px'}}>يمكنك طلب سحب الأرباح الآن.</p>
            <button className="btn" style={{backgroundColor: 'white', color: 'var(--primary-color)', width: '100%', fontWeight: 'bold'}} onClick={() => navigate('/teacher-finances')}>
              إدارة الماليات وسحب الأرباح
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
