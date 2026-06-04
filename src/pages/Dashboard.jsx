import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MdPlayCircleFilled, MdMenuBook, MdAccessTime, MdTrendingUp, MdAssignment, MdAccountBalanceWallet, MdWorkspacePremium, MdVideocam, MdArrowForward } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'طالب');
  const [walletBalance, setWalletBalance] = useState(0);
  const [myCourses, setMyCourses] = useState([]);
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    learningHours: 0,
    rank: 0,
    points: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const userId = userData.user.id;

      // Fetch wallet
      const { data: walletData } = await supabase
        .from('wallet')
        .select('balance')
        .eq('student_id', userId)
        .single();
      if (walletData) setWalletBalance(walletData.balance);

      // Fetch profile (points, minutes)
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, points, learning_minutes')
        .eq('id', userId)
        .single();
        
      if (profile) {
        setUserName(profile.name.split(' ')[0]);
        const points = profile.points || 0;
        
        // Calculate Rank
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gt('points', points);
          
        setStats({
          learningHours: Math.floor((profile.learning_minutes || 0) / 60),
          rank: (count || 0) + 1,
          points: points
        });
      }

      // Fetch recent courses (enrollments)
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          id,
          course_id,
          progress,
          courses (id, title, instructor_name, type)
        `)
        .eq('student_id', userId)
        .limit(5);

      if (enrollments && enrollments.length > 0) {
        setMyCourses(enrollments);
        
        // Fetch upcoming tasks for enrolled courses
        const courseIds = enrollments.map(e => e.course_id);
        
        const { data: liveData } = await supabase.from('live_sessions').select('*').in('course_id', courseIds).gte('start_time', new Date().toISOString()).order('start_time', { ascending: true }).limit(2);
        const { data: assignData } = await supabase.from('assignments').select('*').in('course_id', courseIds).gte('due_date', new Date().toISOString()).order('due_date', { ascending: true }).limit(2);
        
        let tasks = [];
        if(liveData) tasks = [...tasks, ...liveData.map(l => ({...l, type: 'live', date: l.start_time}))];
        if(assignData) tasks = [...tasks, ...assignData.map(a => ({...a, type: 'assignment', date: a.due_date}))];
        
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        setUpcomingTasks(tasks.slice(0, 3));
        
      } else {
        // Fetch suggested courses if no enrollments
        const { data: popularCourses } = await supabase.from('courses').select('*').eq('status', 'نشط').limit(3);
        if (popularCourses) setSuggestedCourses(popularCourses);
      }

      // Fetch transactions
      const { data: transData } = await supabase
        .from('transactions')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (transData) setTransactions(transData);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLive = async (task) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        // Upsert attendance
        const { data: existing } = await supabase
          .from('attendance_records')
          .select('id')
          .eq('student_id', userData.user.id)
          .eq('session_id', task.id)
          .single();
          
        if (!existing) {
          await supabase.from('attendance_records').insert({
            student_id: userData.user.id,
            session_id: task.id,
            course_id: task.course_id,
            status: 'present'
          });
        }
      }
    } catch (err) {
      console.error('Error saving attendance', err);
    }
    window.open(task.meeting_link, '_blank');
  };

  const getStatusStyle = (status) => {
    if(status === 'مكتملة' || status === 'ناجحة') return { bg: '#ecfdf5', color: '#059669' };
    if(status === 'مرفوضة') return { bg: '#fef2f2', color: '#dc2626' };
    return { bg: '#fffbeb', color: '#d97706' }; // قيد المراجعة
  };

  const downloadCertificate = (courseTitle) => {
    alert(`جاري تحميل شهادة كورس: ${courseTitle}`);
    // In reality, this would trigger a jsPDF generation or a server-side PDF.
  };

  const statCards = [
    { title: 'الكورسات المشترك بها', value: myCourses.length, icon: <MdMenuBook />, color: '#0f4c81' },
    { title: 'الرصيد الحالي', value: `${walletBalance} ج.م`, icon: <MdAccountBalanceWallet />, color: '#ffb703' },
    { title: 'ساعات التعلم', value: stats.learningHours, icon: <MdAccessTime />, color: '#10b981' },
    { title: 'الترتيب (Rank)', value: `#${stats.rank}`, icon: <MdTrendingUp />, color: '#8e44ad', sub: `${stats.points} نقطة` },
  ];

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: '0 0 10px 0'}}>لوحة تحكم الطالب</h1>
          <p className="text-muted" style={{margin: 0}}>مرحباً بك يا {userName}، تابع إنجازاتك الدراسية وتفوقك.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/courses')}>
          متجر الكورسات
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
          <div key={idx} className="card" style={{padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'}}>
            <div style={{
              width: '70px', height: '70px', borderRadius: '15px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', backgroundColor: stat.color + '15', color: stat.color
            }}>
              {stat.icon}
            </div>
            <div>
              <h3 style={{margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem'}}>{stat.title}</h3>
              <h2 style={{margin: '5px 0 0 0', fontSize: '1.8rem', color: 'var(--text-main)'}}>{stat.value}</h2>
              {stat.sub && <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{stat.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)'}}>
        
        {/* Main Column */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-6)'}}>
          
          <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{margin: 0, color: 'var(--primary-color)'}}>متابعة التعلم</h2>
              {myCourses.length > 0 && (
                <button style={{background: 'none', border: 'none', color: 'var(--secondary-color)', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigate('/my-courses')}>
                  عرض الكل
                </button>
              )}
            </div>
            
            {loading ? (
              <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>جاري التحميل...</div>
            ) : myCourses.length === 0 ? (
              <div>
                <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)', marginBottom: '15px'}}>
                  أنت لست مشتركاً في أي كورس حالياً. استكشف هذه الكورسات المقترحة لك:
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                  {suggestedCourses.map(c => (
                    <div key={c.id} style={{padding: '15px', border: '1px solid #e2e8f0', borderRadius: '10px', textAlign: 'center'}}>
                      <h3 style={{fontSize: '1rem', margin: '0 0 10px 0'}}>{c.title}</h3>
                      <button className="btn btn-outline" style={{width: '100%', fontSize: '0.8rem'}} onClick={() => navigate(`/courses/${c.id}`)}>التفاصيل</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                {myCourses.map((enrollment) => {
                  const isCompleted = enrollment.progress >= 100;
                  return (
                    <div key={enrollment.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px',
                      padding: '15px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)'
                    }}>
                      <div style={{flex: '1 1 300px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px'}}>
                          <span className="badge badge-primary">{enrollment.courses?.type || 'اونلاين'}</span>
                          <h3 style={{margin: 0, fontSize: '1.1rem'}}>{enrollment.courses?.title}</h3>
                        </div>
                        <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>المعلم: {enrollment.courses?.instructor_name || 'غير محدد'}</div>
                        <div className="progress-container" style={{marginTop: '10px'}}>
                          <div className="progress-bar" style={{width: `${enrollment.progress || 0}%`, backgroundColor: isCompleted ? '#10b981' : 'var(--secondary-color)'}}></div>
                        </div>
                        <div style={{fontSize: '0.8rem', color: isCompleted ? '#10b981' : 'var(--text-muted)', marginTop: '5px', fontWeight: 'bold'}}>
                          {enrollment.progress || 0}% مكتمل
                        </div>
                      </div>
                      <div style={{display: 'flex', gap: '10px'}}>
                        {isCompleted ? (
                          <button 
                            className="btn btn-outline"
                            style={{color: '#10b981', borderColor: '#10b981', display: 'flex', alignItems: 'center', gap: '5px'}}
                            onClick={() => downloadCertificate(enrollment.courses?.title)}
                          >
                            <MdWorkspacePremium size={20} /> تحميل الشهادة
                          </button>
                        ) : (
                          <button 
                            className="btn btn-primary"
                            style={{display: 'flex', alignItems: 'center', gap: '5px'}}
                            onClick={() => navigate('/my-courses')}
                          >
                            <MdPlayCircleFilled size={20} /> استئناف
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{margin: 0, color: 'var(--primary-color)'}}>أحدث المعاملات</h2>
            </div>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
                <thead>
                  <tr style={{borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)'}}>
                    <th style={{padding: '12px'}}>التاريخ</th>
                    <th style={{padding: '12px'}}>النوع</th>
                    <th style={{padding: '12px'}}>الوصف</th>
                    <th style={{padding: '12px'}}>القيمة</th>
                    <th style={{padding: '12px'}}>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" style={{textAlign: 'center', padding: '30px'}}>جاري التحميل...</td></tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)'}}>
                        لا توجد معاملات مالية سابقة
                      </td>
                    </tr>
                  ) : (
                    transactions.map(t => {
                      const style = getStatusStyle(t.status);
                      return (
                        <tr key={t.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                          <td style={{padding: '15px'}}>{new Date(t.created_at).toLocaleDateString('ar-EG')}</td>
                          <td style={{padding: '15px', fontWeight: 'bold'}}>{t.type}</td>
                          <td style={{padding: '15px', color: 'var(--text-muted)'}}>{t.description}</td>
                          <td style={{padding: '15px', color: 'var(--primary-color)', fontWeight: 'bold'}}>{t.amount} ج.م</td>
                          <td style={{padding: '15px'}}>
                            <span style={{backgroundColor: style.bg, color: style.color, padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold'}}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-6)'}}>
          
          <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
            <h2 style={{margin: '0 0 20px 0', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <MdAssignment /> المهام القادمة
            </h2>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              {upcomingTasks.length === 0 ? (
                <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>
                  لا توجد مهام أو حصص قادمة
                </div>
              ) : (
                upcomingTasks.map((task, idx) => (
                  <div key={idx} style={{
                    padding: '15px', 
                    borderRight: `3px solid ${task.type === 'live' ? '#e74c3c' : '#ffb703'}`, 
                    backgroundColor: '#f8fafc',
                    borderRadius: '5px'
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
                      {task.type === 'live' ? <MdVideocam color="#e74c3c" size={20} /> : <MdAssignment color="#ffb703" size={20} />}
                      <div style={{fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--primary-color)'}}>{task.title}</div>
                    </div>
                    <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px'}}>
                      {new Date(task.date).toLocaleString('ar-EG', { dateStyle: 'long', timeStyle: 'short' })}
                    </div>
                    <button 
                      className={task.type === 'live' ? "btn btn-outline" : "btn btn-primary"} 
                      style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', borderColor: task.type === 'live' ? '#e74c3c' : '', color: task.type === 'live' ? '#e74c3c' : ''}}
                      onClick={() => {
                        if(task.type === 'live') {
                          handleJoinLive(task);
                        } else {
                          navigate('/assignments');
                        }
                      }}
                    >
                      {task.type === 'live' ? 'انضمام الآن' : 'ابدأ الآن'} <MdArrowForward />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
