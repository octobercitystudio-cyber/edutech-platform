import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../supabaseClient';
import { MdCalendarToday, MdStar, MdTrendingUp } from 'react-icons/md';

export default function Dashboard() {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'طالب');
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calendar logic
  const today = new Date();
  const currentMonth = today.toLocaleString('ar-EG', { month: 'long' });
  const currentDay = today.getDate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        // Fetch wallet
        const { data: walletData } = await supabase
          .from('wallet')
          .select('*')
          .eq('student_id', userData.user.id)
          .single();
        
        if (walletData) {
          setWalletBalance(walletData.balance);
        }

        // Fetch name
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', userData.user.id)
          .single();
        
        if (profile) setUserName(profile.name.split(' ')[0]);

        // Note: Real transactions would be fetched from a 'transactions' table here
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const lineData = [
    { name: 'السبت', value: 0 },
    { name: 'الأحد', value: 1.2 },
    { name: 'الاثنين', value: 0.5 },
    { name: 'الثلاثاء', value: 2.1 },
    { name: 'الأربعاء', value: 0 },
    { name: 'الخميس', value: 3.4 },
    { name: 'الجمعة', value: 2.8 },
  ];

  const pieData = [
    { name: 'امتحانات', value: 20, color: '#fcd34d' },
    { name: 'مستندات', value: 15, color: '#fca5a5' },
    { name: 'فيديوهات', value: 65, color: '#93c5fd' },
  ];

  return (
    <div className="fade-in" style={{padding: '20px 0'}}>
      
      {/* Top Row */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px'}}>
        
        {/* Calendar Card */}
        <div style={{...styles.card, textAlign: 'center', position: 'relative', overflow: 'hidden'}}>
          <div style={styles.calendarRings}>
            {[...Array(9)].map((_, i) => <div key={i} style={styles.ring}></div>)}
          </div>
          <div style={{marginTop: '25px', color: 'var(--primary-color)'}}>
            <MdCalendarToday size={40} />
          </div>
          <h2 style={{color: '#1e293b', fontSize: '1.2rem', marginTop: '10px'}}>{currentMonth}</h2>
          <div style={{fontSize: '3rem', fontWeight: 'bold', color: 'var(--secondary-color)'}}>
            {currentDay}
          </div>
          <p style={{color: '#64748b', fontSize: '0.9rem', marginTop: '5px'}}>لديك مهمتان اليوم</p>
        </div>

        {/* Rank Card */}
        <div style={{...styles.card, textAlign: 'center'}}>
          <h2 style={{color: '#1e293b', marginBottom: '15px', fontSize: '1.2rem'}}>ترتيبك هذا الأسبوع</h2>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'}}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', 
              backgroundColor: '#fffbeb', border: '4px solid #fcd34d',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(252, 211, 77, 0.3)'
            }}>
              <span style={{fontSize: '2rem', fontWeight: 'bold', color: '#b45309'}}>#4</span>
            </div>
          </div>
          <div style={{marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#10b981'}}>
            <MdTrendingUp />
            <span>متقدم بـ 2 مركز عن الأسبوع الماضي!</span>
          </div>
        </div>

        {/* Welcome Card */}
        <div style={{...styles.card, backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '30px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div style={{fontSize: '2.5rem'}}>🎓</div>
            <h2 style={{margin: 0, fontSize: '2rem', direction: 'ltr'}}>{userName} ,مرحباً</h2>
          </div>
          <div>
            <h3 style={{margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: 'normal', opacity: 0.9}}>جاهز لرحلة تفوق جديدة اليوم؟</h3>
            <div style={{display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem'}}>
              الرصيد: {walletBalance} ج.م
            </div>
          </div>
        </div>

      </div>

      {/* Middle Row (Charts) */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '20px'}}>
        
        {/* Line Chart */}
        <div style={styles.card}>
          <h3 style={{color: '#1e293b', textAlign: 'center', marginBottom: '20px'}}>معدل التعلم (الساعات)</h3>
          <div style={{height: '250px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <RechartsTooltip />
                <Area type="monotone" dataKey="value" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div style={styles.card}>
          <h3 style={{color: '#1e293b', textAlign: 'center', marginBottom: '20px'}}>توزيع الأنشطة</h3>
          <div style={{display: 'flex', alignItems: 'center', height: '250px'}}>
            
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '1rem', color: '#64748b', textAlign: 'right', alignItems: 'flex-end'}}>
              {pieData.map((entry, idx) => (
                <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  {entry.name} <span style={{width: '12px', height: '12px', borderRadius: '50%', backgroundColor: entry.color}}></span>
                </div>
              ))}
            </div>

            <div style={{flex: 1, height: '100%'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
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
        <h3 style={{color: '#1e293b', marginBottom: '20px'}}>أحدث المعاملات</h3>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{color: '#94a3b8', borderBottom: '1px solid #f1f5f9', textAlign: 'right'}}>
                <th style={{padding: '12px'}}>التاريخ</th>
                <th style={{padding: '12px'}}>الوصف</th>
                <th style={{padding: '12px'}}>القيمة</th>
                <th style={{padding: '12px'}}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '30px', color: '#cbd5e1'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
                      <MdStar size={40} color="#e2e8f0" />
                      لا توجد معاملات مالية سابقة
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx, idx) => (
                  <tr key={idx} style={{borderBottom: '1px solid #f1f5f9'}}>
                    <td style={{padding: '12px'}}>{tx.date}</td>
                    <td style={{padding: '12px'}}>{tx.desc}</td>
                    <td style={{padding: '12px'}}>{tx.amount}</td>
                    <td style={{padding: '12px'}}>{tx.status}</td>
                  </tr>
                ))
              )}
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
