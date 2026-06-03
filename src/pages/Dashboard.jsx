import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MdPlayCircleFilled, MdMenuBook, MdAccessTime, MdTrendingUp, MdAssignment, MdAccountBalanceWallet } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'طالب');
  const [walletBalance, setWalletBalance] = useState(0);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      // Fetch wallet
      const { data: walletData } = await supabase
        .from('wallet')
        .select('balance')
        .eq('student_id', userData.user.id)
        .single();
      if (walletData) setWalletBalance(walletData.balance);

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', userData.user.id)
        .single();
      if (profile) setUserName(profile.name.split(' ')[0]);

      // Fetch recent courses
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          id,
          progress,
          courses (id, title, instructor_name, type)
        `)
        .eq('student_id', userData.user.id)
        .limit(3);

      if (enrollments) {
        setMyCourses(enrollments);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'الكورسات المشترك بها', value: myCourses.length, icon: <MdMenuBook />, color: '#0f4c81' },
    { title: 'الرصيد الحالي', value: `${walletBalance} ج.م`, icon: <MdAccountBalanceWallet />, color: '#ffb703' },
    { title: 'ساعات التعلم', value: '0', icon: <MdAccessTime />, color: '#10b981' },
    { title: 'الترتيب (Rank)', value: '-', icon: <MdTrendingUp />, color: '#e74c3c' },
  ];

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)'}}>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: '0 0 10px 0'}}>لوحة تحكم الطالب</h1>
          <p className="text-muted" style={{margin: 0}}>مرحباً بك يا {userName} في منصتك التعليمية.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/courses')}>
          تصفح الكورسات
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
              <h3 style={{margin: 0, color: 'var(--text-muted)', fontSize: '1rem'}}>{stat.title}</h3>
              <h2 style={{margin: '5px 0 0 0', fontSize: '1.8rem', color: 'var(--text-main)'}}>{stat.value}</h2>
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
              <button style={{background: 'none', border: 'none', color: 'var(--secondary-color)', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigate('/my-courses')}>
                عرض الكل
              </button>
            </div>
            
            {loading ? (
              <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>جاري التحميل...</div>
            ) : myCourses.length === 0 ? (
              <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
                أنت لست مشتركاً في أي كورس حالياً.
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                {myCourses.map((enrollment) => (
                  <div key={enrollment.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '15px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px'}}>
                        <span className="badge badge-primary">{enrollment.courses?.type || 'اونلاين'}</span>
                        <h3 style={{margin: 0, fontSize: '1.1rem'}}>{enrollment.courses?.title}</h3>
                      </div>
                      <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>المعلم: {enrollment.courses?.instructor_name || 'غير محدد'}</div>
                      <div className="progress-container" style={{marginTop: '10px'}}>
                        <div className="progress-bar" style={{width: `${enrollment.progress || 0}%`}}></div>
                      </div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px', textAlign: 'left'}}>{enrollment.progress || 0}% مكتمل</div>
                    </div>
                    <button 
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 20px',
                        backgroundColor: 'var(--secondary-color)', color: '#fff', border: 'none',
                        borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer'
                      }}
                      onClick={() => navigate('/my-courses')}
                    >
                      <MdPlayCircleFilled size={20} /> استئناف
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
            <h2 style={{margin: '0 0 20px 0', color: 'var(--primary-color)'}}>أحدث المعاملات</h2>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
                <thead>
                  <tr style={{borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)'}}>
                    <th style={{padding: '12px'}}>التاريخ</th>
                    <th style={{padding: '12px'}}>الوصف</th>
                    <th style={{padding: '12px'}}>القيمة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="3" style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)'}}>
                      لا توجد معاملات مالية سابقة
                    </td>
                  </tr>
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
              <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>
                لا توجد مهام قادمة
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
