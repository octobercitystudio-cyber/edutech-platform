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
    { name: 'امتحانات', value: 20, color: 'var(--secondary-color)' },
    { name: 'مستندات', value: 15, color: '#fca5a5' },
    { name: 'فيديوهات', value: 65, color: 'var(--primary-color)' },
  ];

  return (
    <div className="fade-in" style={{padding: '20px 0'}}>
      
      {/* Top Row */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px'}}>
        
        {/* Calendar Card */}
        <div className="branded-card" style={{...styles.card, textAlign: 'center', position: 'relative', overflow: 'hidden'}}>
          <div style={styles.calendarRings}>
            {[...Array(9)].map((_, i) => <div key={i} style={styles.ring}></div>)}
          </div>
          <div style={{marginTop: '25px', color: 'var(--primary-color)'}}>
            <MdCalendarToday size={40} />
          </div>
          <h2 style={{color: 'var(--primary-color)', fontSize: '1.2rem', marginTop: '10px'}}>{currentMonth}</h2>
          <div style={{fontSize: '3rem', fontWeight: 'bold', color: 'var(--secondary-color)'}}>
            {currentDay}
          </div>
          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px'}}>لديك مهمتان اليوم</p>
        </div>

        {/* Rank Card */}
        <div className="branded-card" style={{...styles.card, textAlign: 'center'}}>
          <h2 style={{marginBottom: '15px', fontSize: '1.2rem', color: 'var(--primary-color)'}}>ترتيبك هذا الأسبوع</h2>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'}}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', 
              backgroundColor: '#fffbeb', border: '3px solid var(--secondary-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(255, 183, 3, 0.2)'
            }}>
              <span style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-hover)'}}>#4</span>
            </div>
          </div>
          <div style={{marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#10b981', fontWeight: 'bold'}}>
            <MdTrendingUp />
            <span>متقدم بـ 2 مركز عن الأسبوع الماضي!</span>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="branded-card" style={{...styles.card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '30px', backgroundColor: 'var(--primary-color)', color: '#ffffff'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div style={{fontSize: '2.5rem', color: 'var(--secondary-color)'}}>🎓</div>
            <h2 style={{margin: 0, fontSize: '2rem', direction: 'ltr', color: '#fff'}}>{userName} ,مرحباً</h2>
          </div>
          <div>
            <h3 style={{margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: 'normal', opacity: 0.9, color: '#fff'}}>جاهز لرحلة تفوق جديدة اليوم؟</h3>
            <div style={{display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem', color: '#fff'}}>
              الرصيد: {walletBalance} ج.م
            </div>
          </div>
        </div>

      </div>

      {/* Middle Row (Charts) */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '20px'}}>
        
        {/* Line Chart */}
        <div className="branded-card" style={styles.card}>
          <h3 style={{textAlign: 'center', marginBottom: '20px', color: 'var(--primary-color)'}}>معدل التعلم (الساعات)</h3>
          <div style={{height: '250px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-muted)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-muted)'}} />
                <RechartsTooltip contentStyle={{backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}} />
                <Area type="monotone" dataKey="value" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.1} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="branded-card" style={styles.card}>
          <h3 style={{textAlign: 'center', marginBottom: '20px', color: 'var(--primary-color)'}}>توزيع الأنشطة</h3>
          <div style={{display: 'flex', alignItems: 'center', height: '250px'}}>
            
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '1rem', color: 'var(--text-muted)', textAlign: 'right', alignItems: 'flex-end'}}>
              {pieData.map((entry, idx) => (
                <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600'}}>
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
      <div className="branded-card" style={styles.card}>
        <h3 style={{marginBottom: '20px', color: 'var(--primary-color)'}}>أحدث المعاملات</h3>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', textAlign: 'right'}}>
                <th style={{padding: '12px'}}>التاريخ</th>
                <th style={{padding: '12px'}}>الوصف</th>
                <th style={{padding: '12px'}}>القيمة</th>
                <th style={{padding: '12px'}}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
                      <MdStar size={40} color="#e2e8f0" />
                      لا توجد معاملات مالية سابقة
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx, idx) => (
                  <tr key={idx} style={{borderBottom: '1px solid var(--border-color)'}}>
                    <td style={{padding: '12px', color: 'var(--text-main)'}}>{tx.date}</td>
                    <td style={{padding: '12px', color: 'var(--text-main)'}}>{tx.desc}</td>
                    <td style={{padding: '12px', color: 'var(--text-main)', fontWeight: 'bold'}}>{tx.amount}</td>
                    <td style={{padding: '12px', color: 'var(--text-main)'}}>{tx.status}</td>
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
    padding: '25px',
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
    border: '3px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
  }
};
