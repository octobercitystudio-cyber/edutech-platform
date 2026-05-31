import React, { useState, useEffect } from 'react';
import { MdClass, MdCastForEducation, MdMenuBook, MdPlayCircleFilled, MdAssignment, MdPlayArrow, MdClose, MdCheck, MdTrendingUp, MdCheckCircle, MdCancel } from 'react-icons/md';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../supabaseClient';

export default function MyCourses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          progress,
          enrolled_at,
          courses (*)
        `)
        .eq('student_id', userData.user.id);

      if (data && data.length > 0) {
        const formattedCourses = data.map(enrollment => ({
          id: enrollment.id,
          courseId: enrollment.courses.id,
          title: enrollment.courses.title,
          status: enrollment.courses.status,
          type: 'اونلاين',
          instructor: enrollment.courses.instructor_name || 'غير محدد',
          attendance: enrollment.progress || 0,
          avgGrade: 0,
          completedLessons: Math.floor(enrollment.progress / 10) || 0,
          stats: { videos: 2, files: 0, exams: 0, seminars: 0, web: 1 },
          price: enrollment.courses.price
        }));
        setMyCourses(formattedCourses);
      } else {
        setMyCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const lineData = [
    { name: 'day 1', value: 0 },
    { name: 'day 2', value: 0 },
    { name: 'day 3', value: 0 },
    { name: 'day 4', value: 0 },
    { name: 'day 5', value: 0 },
    { name: 'day 6', value: 0 },
    { name: 'day 7', value: 2.8 },
  ];

  const pieData = [
    { name: 'webinar', value: 0, color: 'var(--primary-color)' },
    { name: 'test', value: 0, color: 'var(--secondary-color)' },
    { name: 'document', value: 0, color: '#fca5a5' },
    { name: 'video', value: 400, color: 'var(--cyan-accent)' },
    { name: 'webcontent', value: 100, color: '#c4b5fd' },
    { name: 'assignment', value: 0, color: '#86efac' },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'webinars':
        return (
          <div className="fade-in" style={{marginTop: '30px'}}>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
              <h3 className="neon-text-primary">الندوات المباشرة (Webinars)</h3>
            </div>
            
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
              <div className="glass-card" style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>لم تبدأ</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdPlayArrow /></div>
              </div>
              <div className="glass-card" style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>غياب</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdClose /></div>
              </div>
              <div className="glass-card" style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>حضور</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdCheck /></div>
              </div>
              <div className="glass-card" style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>تم التسجيل</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdAssignment /></div>
              </div>
            </div>
          </div>
        );
        
      case 'exams':
        return (
          <div className="fade-in" style={{marginTop: '30px'}}>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
              <h3 className="neon-text-primary">الامتحانات</h3>
            </div>
            
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
              <div className="glass-card" style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>لم يبدأ</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdPlayArrow /></div>
              </div>
              <div className="glass-card" style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>فشل الاختبار</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdClose /></div>
              </div>
              <div className="glass-card" style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>تم الاجتياز</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdCheck /></div>
              </div>
              <div className="glass-card" style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>متوسط درجة</div>
                  <div style={styles.statValue}>0.0%</div>
                </div>
                <div style={styles.darkIcon}><MdTrendingUp /></div>
              </div>
            </div>

            <div style={{marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div style={{display: 'flex', color: 'var(--text-muted)', fontSize: '0.9rem', padding: '0 20px', textAlign: 'center'}}>
                <div style={{flex: 1}}>تاريخ المحاولة</div>
                <div style={{flex: 1}}>النتيجة</div>
                <div style={{flex: 1}}>الحالة</div>
                <div style={{flex: 1}}>عدد المحاولات</div>
                <div style={{flex: 1}}>الاختبار</div>
              </div>
              <div style={{textAlign: 'center', color: 'var(--text-muted)', padding: '20px'}}>لا توجد امتحانات متاحة حالياً</div>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="fade-in" style={{marginTop: '30px'}}>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
              <h3 className="neon-text-primary">الحضور والغياب</h3>
            </div>
            
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
              <div className="glass-card" style={{...styles.statCard, flex: '1.5'}}>
                <div>
                  <div style={styles.statLabel}>وقت التعلم</div>
                  <div style={styles.statValue}>0 دقيقة</div>
                </div>
                <div style={styles.darkIcon}><MdCheckCircle /></div>
              </div>
              <div className="glass-card" style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>مكتمل</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdCheck /></div>
              </div>
              <div className="glass-card" style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>غياب</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdClose /></div>
              </div>
            </div>

            <div style={{marginTop: '30px', textAlign: 'center', color: 'var(--text-muted)', padding: '20px'}}>
              سجل الحضور فارغ حالياً
            </div>
          </div>
        );

      case 'summary':
      default:
        return (
          <div className="fade-in" style={{display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap'}}>
            <div style={{flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
              
              <div style={{display: 'flex', gap: '20px'}}>
                <div className="glass-card" style={{flex: 1, padding: '20px', textAlign: 'center'}}>
                  <h4 style={{margin: '0 0 15px 0', color: 'var(--text-main)'}}>نسبة الإنجاز (Progress)</h4>
                  <div style={{...styles.circleProgress, borderColor: 'var(--primary-color)', color: 'var(--primary-color)', boxShadow: '0 0 15px var(--primary-glow)'}}>{selectedCourse.attendance}%</div>
                </div>
                <div className="glass-card" style={{flex: 1, padding: '20px', textAlign: 'center'}}>
                  <h4 style={{margin: '0 0 15px 0', color: 'var(--text-main)'}}>متوسط الدرجة</h4>
                  <div style={{...styles.circleProgress, borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)', boxShadow: '0 0 15px var(--secondary-glow)'}}>{selectedCourse.avgGrade}%</div>
                </div>
              </div>

              <div className="glass-card" style={{padding: '20px'}}>
                <h4 style={{margin: '0 0 15px 0', color: 'var(--text-main)', textAlign: 'right'}}>وحدات مكتملة</h4>
                <div style={{height: '200px'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={lineData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--glass-border)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--text-muted)'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--text-muted)'}} ticks={[1, 2, 3]} />
                      <RechartsTooltip contentStyle={{backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff'}} />
                      <Area type="linear" dataKey="value" stroke="var(--cyan-accent)" fill="var(--cyan-glow)" fillOpacity={0.4} strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
            </div>

            <div style={{flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
              
              <div className="glass-card" style={{overflow: 'hidden'}}>
                <div style={{backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', padding: '15px', textAlign: 'center', fontWeight: 'bold'}}>
                  {selectedCourse.type}
                </div>
                <div style={{padding: '20px', textAlign: 'center', backgroundColor: 'transparent'}}>
                  <span style={{color: 'var(--secondary-color)', fontSize: '0.8rem', fontWeight: 'bold', textShadow: '0 0 8px var(--secondary-glow)'}}>مدرس المادة 📌</span>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', margin: '10px 0'}}>يتم تدريسه من قبل</div>
                  <h3 style={{margin: 0, color: 'var(--text-main)'}}>{selectedCourse.instructor}</h3>
                </div>
                <div style={{backgroundColor: 'var(--primary-glow)', color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold'}}>
                  {selectedCourse.status}
                </div>
              </div>

            </div>
          </div>
        );
    }
  };

  return (
    <div className="fade-in" style={{padding: '20px 0', display: 'flex', gap: '20px', alignItems: 'flex-start'}}>
      
      {/* Main Content Area */}
      <div style={{flex: 1}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          {loading && <span className="neon-text-primary">جاري جلب بيانات الكورسات...</span>}
          <h2 style={{margin: 0, color: 'var(--text-main)', marginLeft: 'auto'}}>فصولي الحالية</h2>
        </div>

        {/* Course List */}
        {!selectedCourse && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            {!loading && myCourses.length === 0 ? (
              <div className="glass-card" style={{textAlign: 'center', padding: '40px'}}>
                <MdMenuBook size={50} color="var(--text-muted)" />
                <h3 style={{color: 'var(--text-muted)', marginTop: '10px'}}>أنت لست مشتركاً في أي كورس حالياً.</h3>
              </div>
            ) : (
              myCourses.map(course => (
                <div key={course.id} className="glass-card" style={styles.courseItemCard}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '20px', flex: 1, justifyContent: 'flex-end'}}>
                    <div style={{textAlign: 'right'}}>
                      <h3 style={{margin: 0, fontSize: '1.1rem', color: 'var(--text-main)'}}>{course.title}</h3>
                    </div>
                    <span style={styles.badgeBlue}>{course.status}</span>
                    <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>{course.type}</span>
                  </div>
                  
                  <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                    <button style={styles.btnOutline} onClick={() => { setSelectedCourse(course); setActiveTab('summary'); }}>عرض المحتوى</button>
                    <span className="neon-text-primary" style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold'}}>
                      دخول الفصل ⬅️
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Course Details */}
        {selectedCourse && (
          <div className="glass-card" style={styles.card}>
            {/* Header Tabs */}
            <div style={styles.tabsContainer}>
              <span 
                style={{color: 'var(--text-main)', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}
                onClick={() => setSelectedCourse(null)}
              >
                {selectedCourse.title} ⬅️
              </span>
              <div style={{display: 'flex', gap: '15px'}}>
                <span style={styles.tabItem}>الملاحظات</span>
                <span style={styles.tabItem}>الاسئلة</span>
                <span style={activeTab === 'webinars' ? styles.activeTabItem : styles.tabItem} onClick={() => setActiveTab('webinars')}>الندوات</span>
                <span style={activeTab === 'exams' ? styles.activeTabItem : styles.tabItem} onClick={() => setActiveTab('exams')}>الامتحانات</span>
                <span style={activeTab === 'attendance' ? styles.activeTabItem : styles.tabItem} onClick={() => setActiveTab('attendance')}>الحضور</span>
                <span style={activeTab === 'summary' ? styles.activeTabItem : styles.tabItem} onClick={() => setActiveTab('summary')}>ملخص الفصل</span>
              </div>
            </div>

            {renderTabContent()}
          </div>
        )}
      </div>

      {/* Achievements Sidebar */}
      <div className="glass-card" style={styles.achievementsSidebar}>
        <h3 style={{textAlign: 'center', margin: '0 0 30px 0', color: 'var(--text-main)', fontSize: '1.1rem'}}>انجازاتي</h3>
        
        <div style={styles.achievementItem}>
          <div style={{...styles.iconWrapper, backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--cyan-accent)', boxShadow: '0 0 15px var(--cyan-glow)'}}>
            <MdClass size={30} />
          </div>
          <div style={{...styles.achieveValue, color: 'var(--cyan-accent)'}}>{myCourses.length}</div>
          <div style={styles.achieveLabel}>كورس مشترك</div>
        </div>

        <div style={styles.achievementItem}>
          <div style={{...styles.iconWrapper, backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--cyan-accent)', boxShadow: '0 0 15px var(--cyan-glow)'}}>
            <MdCastForEducation size={30} />
          </div>
          <div style={{...styles.achieveValue, color: 'var(--cyan-accent)'}}>
            {selectedCourse ? selectedCourse.completedLessons : 0}
          </div>
          <div style={styles.achieveLabel}>حصص مكتملة</div>
        </div>

        {/* Small bottom icons */}
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '30px', borderTop: '1px solid var(--glass-border)'}}>
          <div style={styles.smallAchieve}>
            <div style={{...styles.smallIcon, backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--secondary-color)'}}><MdMenuBook /></div>
            <div style={{...styles.achieveValueSmall, color: 'var(--secondary-color)'}}>0</div>
            <div style={styles.achieveLabelSmall}>ملفات</div>
          </div>
          <div style={styles.smallAchieve}>
            <div style={{...styles.smallIcon, backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--secondary-color)'}}><MdPlayCircleFilled /></div>
            <div style={{...styles.achieveValueSmall, color: 'var(--secondary-color)'}}>0</div>
            <div style={styles.achieveLabelSmall}>فيديوهات</div>
          </div>
          <div style={styles.smallAchieve}>
            <div style={{...styles.smallIcon, backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--secondary-color)'}}><MdAssignment /></div>
            <div style={{...styles.achieveValueSmall, color: 'var(--secondary-color)'}}>0</div>
            <div style={styles.achieveLabelSmall}>اختبارات</div>
          </div>
        </div>

      </div>

    </div>
  );
}

const styles = {
  achievementsSidebar: {
    width: '280px',
    padding: '25px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80vh'
  },
  achievementItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px'
  },
  iconWrapper: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15px'
  },
  achieveValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '5px',
    textShadow: '0 0 10px rgba(255,255,255,0.3)'
  },
  achieveLabel: {
    fontSize: '1rem',
    color: 'var(--text-muted)',
    fontWeight: 'bold'
  },
  smallAchieve: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  smallIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    marginBottom: '10px'
  },
  achieveValueSmall: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  achieveLabelSmall: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    textAlign: 'center'
  },
  courseItemCard: {
    padding: '20px 30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'transform 0.2s',
    cursor: 'pointer'
  },
  badgeBlue: {
    backgroundColor: 'var(--primary-glow)',
    color: '#fff',
    border: '1px solid var(--primary-color)',
    padding: '5px 15px',
    borderRadius: '8px',
    fontSize: '0.85rem'
  },
  btnOutline: {
    border: '1px solid var(--cyan-accent)',
    color: 'var(--cyan-accent)',
    backgroundColor: 'transparent',
    padding: '8px 30px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textShadow: '0 0 5px var(--cyan-glow)',
    boxShadow: 'inset 0 0 5px var(--cyan-glow)'
  },
  card: {
    padding: '25px',
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--glass-border)',
    paddingBottom: '15px'
  },
  tabItem: {
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    padding: '8px 15px',
    transition: '0.2s'
  },
  activeTabItem: {
    color: 'var(--cyan-accent)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--glass-border)',
    padding: '8px 15px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    textShadow: '0 0 5px var(--cyan-glow)'
  },
  circleProgress: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    borderWidth: '8px',
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0 auto',
    textShadow: '0 0 10px rgba(255,255,255,0.3)'
  },
  statCard: {
    flex: 1,
    minWidth: '150px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statLabel: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    marginBottom: '5px'
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: 'var(--text-main)'
  },
  darkIcon: {
    width: '45px',
    height: '45px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'var(--text-main)',
    border: '1px solid var(--glass-border)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem'
  }
};
