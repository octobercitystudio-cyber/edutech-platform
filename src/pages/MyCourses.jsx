import React, { useState } from 'react';
import { MdClass, MdCastForEducation, MdMenuBook, MdPlayCircleFilled, MdAssignment, MdPlayArrow, MdClose, MdCheck, MdTrendingUp, MdCheckCircle, MdCancel } from 'react-icons/md';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function MyCourses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); // summary, attendance, exams, webinars
  
  const courses = [
    { 
      id: 1, 
      title: 'English - 3rd secondary (Online) - Mr. Ramy Muhammed', 
      status: 'جديد', 
      type: 'اونلاين',
      instructor: 'Ramy Muhammed',
      attendance: 8,
      avgGrade: 0,
      completedLessons: 1,
      stats: { videos: 2, files: 0, exams: 0, seminars: 0, web: 1 }
    }
  ];

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
    { name: 'video', value: 400, color: '#93c5fd' },
    { name: 'webcontent', value: 100, color: '#c4b5fd' },
    { name: 'assignment', value: 0, color: '#86efac' },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'webinars':
        return (
          <div className="fade-in" style={{marginTop: '30px'}}>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
              <h3 style={{color: 'var(--primary-color)'}}>Webinars</h3>
            </div>
            
            {/* Webinar Stats */}
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
              <div style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>Not Started</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdPlayArrow /></div>
              </div>
              <div style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>Not Attended</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdClose /></div>
              </div>
              <div style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>Attended</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdCheck /></div>
              </div>
              <div style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>Registered</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdAssignment /></div>
              </div>
            </div>
            
            <div style={{marginTop: '20px'}}>
              <button style={styles.resetBtn}>Reset</button>
            </div>
          </div>
        );
        
      case 'exams':
        return (
          <div className="fade-in" style={{marginTop: '30px'}}>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
              <h3 style={{color: 'var(--primary-color)'}}>الامتحانات</h3>
            </div>
            
            {/* Exam Stats */}
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
              <div style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>لم يبدأ</div>
                  <div style={styles.statValue}>8</div>
                </div>
                <div style={styles.darkIcon}><MdPlayArrow /></div>
              </div>
              <div style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>فشل الاختبار</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdClose /></div>
              </div>
              <div style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>تم الاجتياز</div>
                  <div style={styles.statValue}>0</div>
                </div>
                <div style={styles.darkIcon}><MdCheck /></div>
              </div>
              <div style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>متوسط درجة</div>
                  <div style={styles.statValue}>0.0%</div>
                </div>
                <div style={styles.darkIcon}><MdTrendingUp /></div>
              </div>
            </div>

            <div style={{marginTop: '20px'}}>
              <button style={styles.resetBtn}>Reset</button>
            </div>

            {/* Exam List */}
            <div style={{marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
              {/* Table Header like */}
              <div style={{display: 'flex', color: '#94a3b8', fontSize: '0.9rem', padding: '0 20px', textAlign: 'center'}}>
                <div style={{flex: 1}}>تاريخ المحاولة</div>
                <div style={{flex: 1}}>النتيجة</div>
                <div style={{flex: 1}}>الحالة</div>
                <div style={{flex: 1}}>عدد المحاولات</div>
                <div style={{flex: 1}}></div>
              </div>
              
              {/* Lecture Item */}
              {[7, 2, 3, 5].map(lec => (
                <div key={lec}>
                  <div style={{color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px', textAlign: 'right', paddingRight: '20px'}}>Lecture {lec}</div>
                  <div style={styles.examListItem}>
                    <div style={{flex: 1}}></div>
                    <div style={{flex: 1}}></div>
                    <div style={{flex: 1, color: 'var(--secondary-color)', fontWeight: 'bold'}}>لم يبدأ</div>
                    <div style={{flex: 1}}></div>
                    <div style={{flex: 1, fontWeight: 'bold', color: '#1e293b'}}>Quiz {lec === 7 ? 6 : lec}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="fade-in" style={{marginTop: '30px'}}>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
              <h3 style={{color: 'var(--primary-color)'}}>Attendance</h3>
            </div>
            
            {/* Attendance Stats */}
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
              <div style={{...styles.statCard, flex: '1.5'}}>
                <div>
                  <div style={styles.statLabel}>Learning Time</div>
                  <div style={styles.statValue}>1m</div>
                </div>
                <div style={styles.darkIcon}><MdCheckCircle /></div>
              </div>
              <div style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>Completed</div>
                  <div style={styles.statValue}>1</div>
                </div>
                <div style={styles.darkIcon}><MdCheck /></div>
              </div>
              <div style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>Not Attended</div>
                  <div style={styles.statValue}>12</div>
                </div>
                <div style={styles.darkIcon}><MdClose /></div>
              </div>
              <div style={styles.statCard}>
                <div>
                  <div style={styles.statLabel}>Attended</div>
                  <div style={styles.statValue}>1</div>
                </div>
                <div style={styles.darkIcon}><MdCheckCircle /></div>
              </div>
            </div>

            {/* Attendance Table */}
            <div style={{marginTop: '30px'}}>
              <div style={{color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px', textAlign: 'right', paddingRight: '20px'}}>Section 1</div>
              
              <table style={styles.table}>
                <thead>
                  <tr style={{color: '#94a3b8'}}>
                    <th></th>
                    <th>Learning Time</th>
                    <th>My Status</th>
                    <th>State</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={styles.tableRow}>
                    <td><button style={{...styles.actionBtn, borderColor: 'var(--primary-color)', color: 'var(--primary-color)'}}>Go to lesson</button></td>
                    <td style={{fontWeight: 'bold'}}>1m</td>
                    <td style={{color: 'var(--primary-color)', fontWeight: 'bold'}}><span style={{backgroundColor: '#e0f2fe', padding: '2px 5px', borderRadius: '10px', fontSize: '0.8rem'}}>100%</span> Attended</td>
                    <td style={{fontWeight: 'bold'}}>Active <span style={{color: '#10b981'}}>●</span></td>
                    <td style={{fontWeight: 'bold'}}>Preparatory Course (free)</td>
                  </tr>
                  <tr style={styles.tableRow}>
                    <td><button style={styles.actionBtn}>Buy Now</button></td>
                    <td>-</td>
                    <td style={{color: '#ef4444', fontWeight: 'bold'}}><MdCancel /> Absent</td>
                    <td></td>
                    <td style={{fontWeight: 'bold'}}>Online Registration Fees</td>
                  </tr>
                  {[1, 2, 3, 4].map(lec => (
                    <tr key={lec} style={styles.tableRow}>
                      <td><button style={styles.actionBtn}>Buy Now</button></td>
                      <td>-</td>
                      <td style={{color: '#ef4444', fontWeight: 'bold'}}><MdCancel /> Absent</td>
                      <td></td>
                      <td style={{fontWeight: 'bold'}}>Lecture {lec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'summary':
      default:
        return (
          <div className="fade-in" style={{display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap'}}>
            {/* Left Column (Line Chart + Donut) */}
            <div style={{flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
              
              <div style={{display: 'flex', gap: '20px'}}>
                {/* Attendance */}
                <div style={{flex: 1, border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', textAlign: 'center'}}>
                  <h4 style={{margin: '0 0 15px 0', color: '#1e293b'}}>معدل الحضور</h4>
                  <div style={{...styles.circleProgress, borderColor: 'var(--primary-color)', color: 'var(--primary-color)'}}>{selectedCourse.attendance}%</div>
                </div>
                {/* Avg Grade */}
                <div style={{flex: 1, border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', textAlign: 'center'}}>
                  <h4 style={{margin: '0 0 15px 0', color: '#1e293b'}}>متوسط الدرجة</h4>
                  <div style={{...styles.circleProgress, borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)'}}>{selectedCourse.avgGrade}%</div>
                </div>
              </div>

              {/* Line Chart */}
              <div style={{border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px'}}>
                <h4 style={{margin: '0 0 15px 0', color: '#1e293b', textAlign: 'right'}}>وحدات مكتملة</h4>
                <div style={{height: '200px'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={lineData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} ticks={[1, 2, 3]} />
                      <RechartsTooltip />
                      <Area type="linear" dataKey="value" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.2} strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
            </div>

            {/* Right Column (Course Info & Donut) */}
            <div style={{flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
              
              {/* Course Banner */}
              <div style={{border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden'}}>
                <div style={{backgroundColor: '#33354b', color: 'white', padding: '15px', textAlign: 'center', fontWeight: 'bold'}}>
                  اونلاين
                </div>
                <div style={{padding: '20px', textAlign: 'center', backgroundColor: '#fff'}}>
                  <span style={{color: 'var(--secondary-color)', fontSize: '0.8rem', fontWeight: 'bold'}}>حصة الأسبوع 📌</span>
                  <div style={{fontSize: '0.8rem', color: '#94a3b8', margin: '10px 0'}}>يتم تدريسه من قبل</div>
                  <h3 style={{margin: 0, color: '#1e293b'}}>{selectedCourse.instructor}</h3>
                </div>
                <div style={{backgroundColor: 'var(--primary-color)', color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold'}}>
                  جديد
                </div>
              </div>

              {/* Donut Chart */}
              <div style={{border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px'}}>
                <h4 style={{margin: '0 0 15px 0', color: '#1e293b', textAlign: 'center'}}>وقت التعلم</h4>
                <div style={{height: '150px'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={40} outerRadius={60} paddingAngle={0} dataKey="value" stroke="none">
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
        );
    }
  };

  return (
    <div className="fade-in" style={{padding: '20px 0', display: 'flex', gap: '20px', alignItems: 'flex-start'}}>
      
      {/* Main Content Area */}
      <div style={{flex: 1}}>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
          <h2 style={{margin: 0, color: '#1e293b'}}>فصولي</h2>
        </div>

        {/* Course List */}
        {!selectedCourse && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            {courses.map(course => (
              <div key={course.id} style={styles.courseItemCard}>
                <div style={{display: 'flex', alignItems: 'center', gap: '20px', flex: 1, justifyContent: 'flex-end'}}>
                  <div style={{textAlign: 'right'}}>
                    <h3 style={{margin: 0, fontSize: '1rem', color: '#1e293b'}}>{course.title.substring(0, 30)}...</h3>
                  </div>
                  <span style={styles.badgeBlue}>{course.status}</span>
                  <span style={{color: '#64748b', fontSize: '0.9rem'}}>{course.type}</span>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                  <button style={styles.btnOutline} onClick={() => { setSelectedCourse(course); setActiveTab('summary'); }}>عرض</button>
                  <span style={{color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold'}}>
                    الذهاب الى الفصل ⬅️
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Details */}
        {selectedCourse && (
          <div style={styles.card}>
            {/* Header Tabs */}
            <div style={styles.tabsContainer}>
              <span 
                style={{color: '#1e293b', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer'}}
                onClick={() => setSelectedCourse(null)}
              >
                {selectedCourse.title.substring(0, 30)}... ⬅️
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
      <div style={styles.achievementsSidebar}>
        <h3 style={{textAlign: 'center', margin: '0 0 30px 0', color: '#1e293b', fontSize: '1.1rem'}}>انجازات</h3>
        
        <div style={styles.achievementItem}>
          <div style={{...styles.iconWrapper, backgroundColor: 'rgba(15,76,129,0.1)', color: 'var(--primary-color)'}}>
            <MdClass size={30} />
          </div>
          <div style={{...styles.achieveValue, color: 'var(--primary-color)'}}>1</div>
          <div style={styles.achieveLabel}>اشتراك في فصل</div>
        </div>

        <div style={styles.achievementItem}>
          <div style={{...styles.iconWrapper, backgroundColor: 'rgba(15,76,129,0.1)', color: 'var(--primary-color)'}}>
            <MdCastForEducation size={30} />
          </div>
          <div style={{...styles.achieveValue, color: 'var(--primary-color)'}}>{selectedCourse ? selectedCourse.completedLessons : 1}</div>
          <div style={styles.achieveLabel}>حصص مكتملة</div>
        </div>

        {/* Small bottom icons */}
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '30px', borderTop: '1px solid #f1f5f9'}}>
          <div style={styles.smallAchieve}>
            <div style={{...styles.smallIcon, backgroundColor: 'rgba(255,183,3,0.15)', color: 'var(--secondary-color)'}}><MdMenuBook /></div>
            <div style={{...styles.achieveValueSmall, color: 'var(--secondary-color)'}}>0</div>
            <div style={styles.achieveLabelSmall}>ملفات مقروءة</div>
          </div>
          <div style={styles.smallAchieve}>
            <div style={{...styles.smallIcon, backgroundColor: 'rgba(255,183,3,0.15)', color: 'var(--secondary-color)'}}><MdPlayCircleFilled /></div>
            <div style={{...styles.achieveValueSmall, color: 'var(--secondary-color)'}}>2</div>
            <div style={styles.achieveLabelSmall}>فيديوهات مشاهدة</div>
          </div>
          <div style={styles.smallAchieve}>
            <div style={{...styles.smallIcon, backgroundColor: 'rgba(255,183,3,0.15)', color: 'var(--secondary-color)'}}><MdAssignment /></div>
            <div style={{...styles.achieveValueSmall, color: 'var(--secondary-color)'}}>0</div>
            <div style={styles.achieveLabelSmall}>اختبارات ممتحنة</div>
          </div>
        </div>

      </div>

    </div>
  );
}

const styles = {
  achievementsSidebar: {
    width: '280px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    border: '1px solid #f8fafc',
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
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  achieveLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
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
    fontSize: '0.7rem',
    color: '#64748b',
    textAlign: 'center'
  },
  courseItemCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px 30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
    border: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  badgeBlue: {
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '8px',
    fontSize: '0.85rem'
  },
  btnOutline: {
    border: '1px solid #38bdf8',
    color: '#38bdf8',
    backgroundColor: 'transparent',
    padding: '8px 30px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    border: '1px solid #f8fafc'
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '15px'
  },
  tabItem: {
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    padding: '5px 10px'
  },
  activeTabItem: {
    color: 'var(--primary-color)',
    backgroundColor: 'rgba(15,76,129,0.1)',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    cursor: 'pointer'
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
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '0 auto'
  },
  statCard: {
    flex: 1,
    minWidth: '150px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: '0.8rem',
    marginBottom: '5px'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b'
  },
  darkIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#1e293b',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem'
  },
  resetBtn: {
    border: '1px solid var(--secondary-color)',
    color: 'var(--secondary-color)',
    backgroundColor: 'transparent',
    padding: '8px 30px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  examListItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    textAlign: 'center'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 10px',
    textAlign: 'center'
  },
  tableRow: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    border: '1px solid #e2e8f0',
    borderRadius: '12px'
  },
  actionBtn: {
    border: '1px solid #38bdf8',
    color: '#38bdf8',
    backgroundColor: 'transparent',
    padding: '8px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.85rem'
  }
};
