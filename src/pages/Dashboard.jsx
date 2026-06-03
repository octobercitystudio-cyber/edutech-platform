import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MdPlayCircleFilled, MdCalendarToday, MdStar, MdMenuBook, MdAccessTime, MdTrendingUp, MdAssignment } from 'react-icons/md';
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

  const today = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fade-in" style={{padding: '20px 0', maxWidth: '1200px', margin: '0 auto'}}>
      
      {/* 1. Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-color) 0%, #1e88e5 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        boxShadow: '0 10px 25px rgba(15, 76, 129, 0.15)'
      }}>
        <div>
          <h1 style={{margin: '0 0 10px 0', fontSize: '2.2rem', color: '#fff'}}>مرحباً بعودتك، {userName}! 👋</h1>
          <p style={{margin: 0, fontSize: '1.1rem', opacity: 0.9}}>مستعد لاستكمال مسيرتك التعليمية اليوم؟ ({today})</p>
        </div>
        <div style={{textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.15)', padding: '15px 30px', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(5px)'}}>
          <div style={{fontSize: '0.9rem', marginBottom: '5px'}}>رصيد المحفظة</div>
          <div style={{fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--secondary-color)'}}>{walletBalance} ج.م</div>
        </div>
      </div>

      {/* 2. Quick Stats */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px'}}>
        <div className="branded-card" style={styles.statCard}>
          <div style={{...styles.iconBox, backgroundColor: 'rgba(15, 76, 129, 0.1)', color: 'var(--primary-color)'}}>
            <MdMenuBook size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>الكورسات المشترك بها</div>
            <div style={styles.statValue}>{myCourses.length}</div>
          </div>
        </div>
        
        <div className="branded-card" style={styles.statCard}>
          <div style={{...styles.iconBox, backgroundColor: 'rgba(255, 183, 3, 0.15)', color: '#b45309'}}>
            <MdTrendingUp size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>الترتيب (Rank)</div>
            <div style={styles.statValue}>-</div>
          </div>
        </div>

        <div className="branded-card" style={styles.statCard}>
          <div style={{...styles.iconBox, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981'}}>
            <MdAccessTime size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>ساعات التعلم</div>
            <div style={styles.statValue}>0</div>
          </div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px'}}>
        
        {/* Main Column */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
          
          {/* 3. Continue Learning */}
          <div className="branded-card" style={{padding: '25px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{margin: 0, fontSize: '1.4rem', color: 'var(--primary-color)'}}>متابعة التعلم</h2>
              <button style={{background: 'none', border: 'none', color: 'var(--secondary-color)', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigate('/my-courses')}>
                عرض الكل
              </button>
            </div>
            
            {loading ? (
              <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>جاري التحميل...</div>
            ) : myCourses.length === 0 ? (
              <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)'}}>
                <MdMenuBook size={40} style={{marginBottom: '10px', color: '#cbd5e1'}} />
                <div>أنت لست مشتركاً في أي كورس حالياً.</div>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                {myCourses.map((enrollment) => (
                  <div key={enrollment.id} style={styles.courseRow}>
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px'}}>
                        <span className="badge badge-primary">{enrollment.courses.type || 'اونلاين'}</span>
                        <h3 style={{margin: 0, fontSize: '1.1rem'}}>{enrollment.courses.title}</h3>
                      </div>
                      <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>المعلم: {enrollment.courses.instructor_name || 'غير محدد'}</div>
                      <div className="progress-container">
                        <div className="progress-bar" style={{width: `${enrollment.progress || 0}%`}}></div>
                      </div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px', textAlign: 'left'}}>{enrollment.progress || 0}% مكتمل</div>
                    </div>
                    <button 
                      style={styles.playBtn}
                      onClick={() => navigate('/my-courses')}
                    >
                      <MdPlayCircleFilled size={20} /> استئناف
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Recent Transactions */}
          <div className="branded-card" style={{padding: '25px'}}>
            <h2 style={{margin: '0 0 20px 0', fontSize: '1.4rem', color: 'var(--primary-color)'}}>أحدث المعاملات</h2>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
                <thead>
                  <tr>
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
        <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
          
          {/* 4. Upcoming Tasks */}
          <div className="branded-card" style={{padding: '25px'}}>
            <h2 style={{margin: '0 0 20px 0', fontSize: '1.4rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <MdAssignment /> المهام القادمة
            </h2>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>
                لا توجد مهام قادمة
              </div>
            </div>
            
            <button style={{width: '100%', padding: '10px', marginTop: '20px', backgroundColor: 'transparent', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold'}}>
              عرض الجدول الزمني
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

const styles = {
  statCard: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  iconBox: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    marginBottom: '5px'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'var(--text-main)'
  },
  courseRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    transition: 'background-color 0.2s',
  },
  playBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '10px 20px',
    backgroundColor: 'var(--secondary-color)',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(255, 183, 3, 0.3)'
  },
  taskItem: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid var(--border-color)',
    borderLeft: '4px solid var(--secondary-color)',
    paddingLeft: '10px'
  },
  taskDate: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    width: '50px',
    height: '50px',
    color: 'var(--primary-color)'
  }
};
