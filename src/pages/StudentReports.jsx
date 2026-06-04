import React, { useState, useEffect } from 'react';
import { MdCheckCircle, MdCancel, MdDateRange, MdTrendingUp, MdPlayArrow } from 'react-icons/md';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { supabase } from '../supabaseClient';

export default function StudentReports() {
  const [loading, setLoading] = useState(true);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [recentClasses, setRecentClasses] = useState([]);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const userId = userData.user.id;

      // 1. Fetch live sessions for courses the student is enrolled in
      const { data: enrollments } = await supabase.from('enrollments').select('course_id').eq('student_id', userId);
      const courseIds = enrollments?.map(e => e.course_id) || [];

      // Fetch past sessions for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: pastSessions } = await supabase
        .from('live_sessions')
        .select('*')
        .in('course_id', courseIds)
        .gte('start_time', thirtyDaysAgo.toISOString())
        .lte('start_time', new Date().toISOString())
        .order('start_time', { ascending: false });

      // Fetch attendance records
      const { data: records } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('student_id', userId);

      const attendedSessionIds = new Set(records?.filter(r => r.status === 'present').map(r => r.session_id) || []);

      // Calculate recent classes list
      const formattedRecent = (pastSessions || []).slice(0, 5).map((session, idx) => ({
        id: session.id,
        name: session.title,
        date: new Date(session.start_time).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: attendedSessionIds.has(session.id) ? 'مكتمل' : 'غياب'
      }));
      setRecentClasses(formattedRecent);

      // Calculate attendance rate
      const totalSessions = pastSessions?.length || 0;
      const attendedCount = pastSessions?.filter(s => attendedSessionIds.has(s.id)).length || 0;
      const rate = totalSessions > 0 ? Math.round((attendedCount / totalSessions) * 100) : 100;
      setAttendanceRate(rate);

      // Generate Calendar (Simple 30-day view based on current month)
      const date = new Date();
      const currentMonth = date.getMonth();
      const currentYear = date.getFullYear();
      const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const today = date.getDate();

      // Map sessions to days
      const sessionsByDay = {};
      pastSessions?.forEach(s => {
        const sDate = new Date(s.start_time);
        if (sDate.getMonth() === currentMonth && sDate.getFullYear() === currentYear) {
          const d = sDate.getDate();
          if (!sessionsByDay[d]) sessionsByDay[d] = [];
          sessionsByDay[d].push(attendedSessionIds.has(s.id)); // true if attended
        }
      });

      const calDays = Array.from({ length: daysInCurrentMonth }, (_, i) => {
        const day = i + 1;
        let status = 'future';
        if (day <= today) {
          if (sessionsByDay[day] !== undefined) {
            // If they had sessions this day, check if they attended at least one
            const attendedAny = sessionsByDay[day].some(att => att === true);
            status = attendedAny ? 'present' : 'absent';
          } else {
            status = 'none'; // No sessions that day
          }
        }
        return { day, status };
      });
      
      setDaysInMonth(calDays);

    } catch (err) {
      console.error('Error fetching attendance', err);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: 'Present', value: attendanceRate },
    { name: 'Absent', value: 100 - attendanceRate }
  ];
  const COLORS = ['#10b981', '#f1f5f9']; 

  const styles = {
    container: { padding: '40px 0', backgroundColor: '#f8fafc', minHeight: '100vh', direction: 'rtl' },
    wrapper: { maxWidth: '1000px', margin: '0 auto', padding: '0 20px' },
    pageTitle: { color: '#0f4c81', margin: '0 0 30px 0', fontSize: '2rem', fontWeight: '800' },
    topGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '30px' },
    card: { backgroundColor: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' },
    cardTitle: { margin: '0 0 20px 0', color: '#0f4c81', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' },
    calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' },
    dayLabel: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold', marginBottom: '10px' },
    dayCell: (status) => ({
      padding: '10px 0',
      borderRadius: '10px',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      color: status === 'present' ? '#059669' : status === 'absent' ? '#dc2626' : '#64748b',
      backgroundColor: status === 'present' ? '#ecfdf5' : status === 'absent' ? '#fef2f2' : 'transparent',
      border: status === 'future' ? '1px dashed #e2e8f0' : status === 'none' ? '1px solid #f1f5f9' : 'none',
      cursor: 'default'
    }),
    donutCenter: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' },
    donutValue: { fontSize: '2.5rem', fontWeight: '900', color: '#0f4c81', margin: 0, lineHeight: 1 },
    donutLabel: { fontSize: '0.85rem', color: '#64748b', margin: '5px 0 0 0', fontWeight: 'bold' },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' },
    listTitle: { margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: 'bold' },
    listDate: { fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' },
    badge: (status) => ({
      padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
      backgroundColor: status === 'مكتمل' ? '#ecfdf5' : '#fef2f2',
      color: status === 'مكتمل' ? '#10b981' : '#ef4444'
    })
  };

  const weekDays = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  if (loading) {
    return <div style={{padding: '50px', textAlign: 'center'}}>جاري تحميل التقرير...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper} className="fade-in">
        
        <h1 style={styles.pageTitle}>الحضور والتقدم (Attendance & Progress)</h1>

        <div style={styles.topGrid}>
          
          <div style={styles.card}>
            <h2 style={styles.cardTitle}><MdDateRange /> سجل الحضور الشهري</h2>
            <div style={styles.calendarGrid}>
              {weekDays.map((d, i) => <div key={i} style={styles.dayLabel}>{d}</div>)}
              {/* Offset calculation can be added here, currently simplified */}
              <div style={{...styles.dayCell('future'), border: 'none'}}></div>
              
              {daysInMonth.map((d) => (
                <div key={d.day} style={styles.dayCell(d.status)} title={d.status === 'none' ? 'لا يوجد فصول' : ''}>
                  {d.day}
                </div>
              ))}
            </div>
            
            <div style={{display: 'flex', gap: '20px', marginTop: '20px', justifyContent: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b'}}><span style={{width:'10px',height:'10px',borderRadius:'50%',backgroundColor:'#10b981'}}></span> حضور</div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b'}}><span style={{width:'10px',height:'10px',borderRadius:'50%',backgroundColor:'#ef4444'}}></span> غياب</div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b'}}><span style={{width:'10px',height:'10px',borderRadius:'50%',border:'1px solid #f1f5f9'}}></span> راحة</div>
            </div>
          </div>

          <div style={{...styles.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <h2 style={{...styles.cardTitle, alignSelf: 'flex-start'}}><MdTrendingUp /> معدل الالتزام</h2>
            <div style={{position: 'relative', width: '250px', height: '250px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none" cornerRadius={10} startAngle={90} endAngle={-270}>
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={styles.donutCenter}>
                <p style={styles.donutValue}>{attendanceRate}%</p>
                <p style={styles.donutLabel}>Attendance Rate</p>
              </div>
            </div>
            <div style={{textAlign: 'center', marginTop: '10px'}}>
              <h3 style={{margin: '0 0 5px 0', color: '#1e293b'}}>أداء {attendanceRate > 80 ? 'ممتاز! 🌟' : 'جيد'}</h3>
              <p style={{margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5'}}>
                {attendanceRate > 80 ? 'لقد حافظت على معدل حضور رائع هذا الشهر. استمر في تفوقك!' : 'حاول الالتزام بحضور الفصول المباشرة لتحقيق أقصى استفادة.'}
              </p>
            </div>
          </div>

        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}><MdPlayArrow /> الفصول الأخيرة (Recent Classes)</h2>
          <div>
            {recentClasses.length === 0 ? (
              <p style={{color: '#94a3b8', textAlign: 'center', padding: '20px 0'}}>لا توجد فصول سابقة في هذا الشهر.</p>
            ) : (
              recentClasses.map((cls, idx) => (
                <div key={cls.id} style={{...styles.listItem, borderBottom: idx === recentClasses.length - 1 ? 'none' : '1px solid #f1f5f9'}}>
                  <div>
                    <h3 style={styles.listTitle}>{cls.name}</h3>
                    <div style={styles.listDate}>{cls.date}</div>
                  </div>
                  <div style={styles.badge(cls.status)}>
                    {cls.status === 'مكتمل' ? <MdCheckCircle style={{verticalAlign: 'middle', marginLeft: '3px'}}/> : <MdCancel style={{verticalAlign: 'middle', marginLeft: '3px'}}/>}
                    {cls.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
