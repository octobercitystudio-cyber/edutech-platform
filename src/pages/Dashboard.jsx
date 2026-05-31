import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const userName = localStorage.getItem('userName') || 'احمد';

  // Mock data for Line Chart (Learning Units)
  const lineData = [
    { name: 'day 1', value: 0 },
    { name: 'day 2', value: 0 },
    { name: 'day 3', value: 0 },
    { name: 'day 4', value: 0 },
    { name: 'day 5', value: 0 },
    { name: 'day 6', value: 0 },
    { name: 'day 7', value: 2.8 },
  ];

  // Mock data for Donut Chart (Learning Time)
  const pieData = [
    { name: 'webinar', value: 0, color: '#a5b4fc' },
    { name: 'test', value: 0, color: '#fcd34d' },
    { name: 'document', value: 0, color: '#fca5a5' },
    { name: 'video', value: 400, color: '#93c5fd' },
    { name: 'webcontent', value: 0, color: '#c4b5fd' },
    { name: 'assignment', value: 0, color: '#86efac' },
  ];

  return (
    <div className="fade-in" style={{padding: '20px 0'}}>
      
      {/* Top Row */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px'}}>
        
        {/* Calendar Card */}
        <div style={{...styles.card, textAlign: 'center', position: 'relative'}}>
          <div style={styles.calendarRings}>
            {[...Array(9)].map((_, i) => <div key={i} style={styles.ring}></div>)}
          </div>
          <h2 style={{marginTop: '20px', color: '#1e293b'}}>التقويم</h2>
          <p style={{color: '#94a3b8', fontSize: '1.2rem', margin: '10px 0'}}>قريبا...</p>
          <div style={{marginTop: '20px', display: 'flex', justifyContent: 'center'}}>
            <img src="https://illustrations.popsy.co/blue/engineer.svg" alt="calendar" style={{height: '100px'}} />
          </div>
        </div>

        {/* Rank Card */}
        <div style={{...styles.card, textAlign: 'center'}}>
          <h2 style={{color: '#1e293b', marginBottom: '20px'}}>ترتيب الطلبة</h2>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px'}}>
            <img src="https://illustrations.popsy.co/blue/student-going-to-school.svg" alt="student rank" style={{height: '100px'}} />
            <h2 style={{color: '#94a3b8'}}>قريبا...</h2>
          </div>
        </div>

        {/* Welcome Card */}
        <div style={{...styles.card, backgroundColor: '#33354b', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '30px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div style={{fontSize: '2.5rem'}}>🌙</div>
            <h2 style={{margin: 0, fontSize: '2rem', direction: 'ltr'}}>{userName} ,Hi</h2>
          </div>
          <h3 style={{margin: 0, fontSize: '1.3rem', fontWeight: 'normal', fontStyle: 'italic', direction: 'ltr'}}>Welcome to your dashboard</h3>
        </div>

      </div>

      {/* Middle Row (Charts) */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '20px'}}>
        
        {/* Line Chart */}
        <div style={styles.card}>
          <h3 style={{color: '#1e293b', textAlign: 'center', marginBottom: '20px'}}>وحدات التعلم</h3>
          <div style={{height: '250px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} ticks={[1, 2, 3]} />
                <RechartsTooltip />
                <Area type="linear" dataKey="value" stroke="#7dd3fc" fill="#bae6fd" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div style={styles.card}>
          <h3 style={{color: '#1e293b', textAlign: 'center', marginBottom: '20px'}}>وقت التعلم</h3>
          <div style={{display: 'flex', alignItems: 'center', height: '250px'}}>
            
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.85rem', color: '#64748b', textAlign: 'right', direction: 'ltr', alignItems: 'flex-end'}}>
              {pieData.map((entry, idx) => (
                <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  {entry.name} <span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: entry.color}}></span>
                </div>
              ))}
            </div>

            <div style={{flex: 1, height: '100%'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div style={styles.card}>
        <h3 style={{color: '#1e293b', marginBottom: '20px'}}>معاملات المحفظة</h3>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{color: '#94a3b8', borderBottom: '1px solid #f1f5f9', textAlign: 'right'}}>
                <th style={{padding: '10px'}}>Date</th>
                <th style={{padding: '10px'}}>After</th>
                <th style={{padding: '10px'}}>Amount</th>
                <th style={{padding: '10px'}}>Before</th>
                <th style={{padding: '10px'}}>Type</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty state or list */}
              <tr>
                <td colSpan="5" style={{textAlign: 'center', padding: '20px', color: '#cbd5e1'}}>لا توجد معاملات بعد</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    padding: '25px',
    border: '1px solid #f8fafc'
  },
  calendarRings: {
    position: 'absolute',
    top: '-10px',
    left: '20px',
    right: '20px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  ring: {
    width: '12px',
    height: '24px',
    border: '3px solid #cbd5e1',
    borderRadius: '6px',
    backgroundColor: '#f8fafc'
  }
};
