import React from 'react';
import { MdMenuBook, MdCheckCircle, MdCancel, MdDateRange, MdTrendingUp, MdPlayArrow } from 'react-icons/md';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function StudentReports() {
  // Calendar Mock Data (Simple 30-day grid)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    // Generate random status for demo: mostly present, some absent, some future
    let status = 'future';
    if (day <= 24) { // Let's say today is 24th
      status = Math.random() > 0.15 ? 'present' : 'absent';
    }
    return { day, status };
  });

  // Donut Chart Data
  const attendanceRate = 85;
  const pieData = [
    { name: 'Present', value: attendanceRate },
    { name: 'Absent', value: 100 - attendanceRate }
  ];
  const COLORS = ['#10b981', '#f1f5f9']; // Green, Light Gray

  // Recent Classes Mock Data
  const recentClasses = [
    { id: 1, name: 'الفيزياء الكلاسيكية', date: '23 يونيو 2026', status: 'مكتمل' },
    { id: 2, name: 'الكيمياء العضوية', date: '22 يونيو 2026', status: 'غياب' },
    { id: 3, name: 'تفاضل وتكامل', date: '20 يونيو 2026', status: 'مكتمل' },
    { id: 4, name: 'مقدمة في البرمجة', date: '18 يونيو 2026', status: 'مكتمل' },
  ];

  const styles = {
    container: { padding: '40px 0', backgroundColor: '#f8fafc', minHeight: '100vh', direction: 'rtl' },
    wrapper: { maxWidth: '1000px', margin: '0 auto', padding: '0 20px' },
    pageTitle: { color: '#0f4c81', margin: '0 0 30px 0', fontSize: '2rem', fontWeight: '800' },
    
    // Grid Layout
    topGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '30px' },
    
    // Cards
    card: { backgroundColor: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' },
    cardTitle: { margin: '0 0 20px 0', color: '#0f4c81', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' },
    
    // Calendar
    calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' },
    dayLabel: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold', marginBottom: '10px' },
    dayCell: (status) => ({
      padding: '10px 0',
      borderRadius: '10px',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      color: status === 'present' ? '#059669' : status === 'absent' ? '#dc2626' : '#64748b',
      backgroundColor: status === 'present' ? '#ecfdf5' : status === 'absent' ? '#fef2f2' : 'transparent',
      border: status === 'future' ? '1px dashed #e2e8f0' : 'none',
      cursor: 'default'
    }),

    // Donut Center Text
    donutCenter: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' },
    donutValue: { fontSize: '2.5rem', fontWeight: '900', color: '#0f4c81', margin: 0, lineHeight: 1 },
    donutLabel: { fontSize: '0.85rem', color: '#64748b', margin: '5px 0 0 0', fontWeight: 'bold' },

    // List
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f5f9' },
    listTitle: { margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: 'bold' },
    listDate: { fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' },
    badge: (status) => ({
      padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
      backgroundColor: status === 'مكتمل' ? '#ecfdf5' : '#fef2f2',
      color: status === 'مكتمل' ? '#10b981' : '#ef4444'
    })
  };

  const weekDays = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper} className="fade-in">
        
        <h1 style={styles.pageTitle}>الحضور والتقدم (Attendance & Progress)</h1>

        <div style={styles.topGrid}>
          
          {/* Calendar Widget */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}><MdDateRange /> سجل الحضور الشهري</h2>
            <div style={styles.calendarGrid}>
              {weekDays.map((d, i) => <div key={i} style={styles.dayLabel}>{d}</div>)}
              {/* Dummy offset for month start */}
              <div style={{...styles.dayCell('future'), border: 'none'}}></div>
              <div style={{...styles.dayCell('future'), border: 'none'}}></div>
              
              {daysInMonth.map((d) => (
                <div key={d.day} style={styles.dayCell(d.status)}>
                  {d.day}
                </div>
              ))}
            </div>
            
            <div style={{display: 'flex', gap: '20px', marginTop: '20px', justifyContent: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b'}}><span style={{width:'10px',height:'10px',borderRadius:'50%',backgroundColor:'#10b981'}}></span> حضور</div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b'}}><span style={{width:'10px',height:'10px',borderRadius:'50%',backgroundColor:'#ef4444'}}></span> غياب</div>
            </div>
          </div>

          {/* Donut Chart Widget */}
          <div style={{...styles.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <h2 style={{...styles.cardTitle, alignSelf: 'flex-start'}}><MdTrendingUp /> معدل الالتزام</h2>
            <div style={{position: 'relative', width: '250px', height: '250px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={10}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={styles.donutCenter}>
                <p style={styles.donutValue}>{attendanceRate}%</p>
                <p style={styles.donutLabel}>Attendance Rate</p>
              </div>
            </div>
            <div style={{textAlign: 'center', marginTop: '10px'}}>
              <h3 style={{margin: '0 0 5px 0', color: '#1e293b'}}>أداء ممتاز! 🌟</h3>
              <p style={{margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5'}}>لقد حافظت على معدل حضور رائع هذا الشهر. استمر في تفوقك!</p>
            </div>
          </div>

        </div>

        {/* Recent Classes List */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}><MdPlayArrow /> الفصول الأخيرة (Recent Classes)</h2>
          <div>
            {recentClasses.map((cls, idx) => (
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
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
