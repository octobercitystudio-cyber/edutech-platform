import React, { useState, useEffect } from 'react';
import { MdMenuBook, MdSearch, MdPlayCircleFilled, MdAssignmentTurnedIn, MdFolder, MdCheckCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function MyCourses() {
  const [myCourses, setMyCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // All, Active, Completed
  
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedLessons: 0,
    testsPassed: 0,
    files: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, activeFilter, myCourses]);

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
          status: enrollment.courses.status, // نشط، مسودة، مغلق
          type: enrollment.courses.type || 'اونلاين',
          instructor: enrollment.courses.instructor_name || 'غير محدد',
          progress: enrollment.progress || 0,
          thumbnail: enrollment.courses.thumbnail_url || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        }));
        
        setMyCourses(formattedCourses);
        setFilteredCourses(formattedCourses);
        
        // Calculate basic stats
        let completed = 0;
        formattedCourses.forEach(c => {
          completed += Math.floor(c.progress / 10); // Mock: every 10% = 1 lesson
        });
        
        setStats({
          totalCourses: formattedCourses.length,
          completedLessons: completed,
          testsPassed: Math.floor(completed / 3), // Mock
          files: formattedCourses.length * 2 // Mock
        });
      } else {
        setMyCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let result = myCourses;
    
    // Search filter
    if (searchTerm) {
      result = result.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    // Tab filter
    if (activeFilter === 'Active') {
      result = result.filter(c => c.progress < 100);
    } else if (activeFilter === 'Completed') {
      result = result.filter(c => c.progress >= 100);
    }
    
    setFilteredCourses(result);
  };

  // Modern minimalist Blue/White styling
  const pageStyles = {
    container: { padding: '40px 0', backgroundColor: '#f8fafc', minHeight: '100vh', direction: 'rtl' },
    wrapper: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
    pageTitle: { color: '#0f4c81', margin: '0 0 30px 0', fontSize: '2rem', fontWeight: '800' },
    
    // Stats Bar
    statsBar: { display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' },
    statWidget: { 
      flex: '1 1 200px', backgroundColor: 'white', padding: '20px', borderRadius: '15px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center', gap: '15px'
    },
    statIcon: { width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#0f4c81', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' },
    statValue: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: 0 },
    statLabel: { fontSize: '0.9rem', color: '#64748b', margin: 0 },

    // Controls (Search & Filters)
    controlsBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' },
    searchBox: { 
      display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '1px solid #e2e8f0', 
      borderRadius: '30px', padding: '10px 20px', width: '100%', maxWidth: '400px'
    },
    searchInput: { border: 'none', outline: 'none', width: '100%', backgroundColor: 'transparent', marginLeft: '10px', fontSize: '0.95rem' },
    filterTabs: { display: 'flex', gap: '10px', backgroundColor: 'white', padding: '5px', borderRadius: '30px', border: '1px solid #e2e8f0' },
    tabBtn: (isActive) => ({
      padding: '8px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', transition: '0.3s',
      backgroundColor: isActive ? '#0f4c81' : 'transparent',
      color: isActive ? 'white' : '#64748b'
    }),

    // Grid
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' },
    
    // Course Card
    card: { 
      backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', 
      border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03)',
      display: 'flex', flexDirection: 'column', transition: 'transform 0.3s'
    },
    thumbnail: { width: '100%', height: '180px', objectFit: 'cover' },
    cardBody: { padding: '25px', display: 'flex', flexDirection: 'column', flex: 1 },
    tagsContainer: { display: 'flex', gap: '10px', marginBottom: '15px' },
    tag: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#f1f5f9', color: '#475569' },
    tagActive: { backgroundColor: '#ecfdf5', color: '#059669' },
    cardTitle: { fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: '0 0 20px 0', lineHeight: '1.4' },
    progressSection: { marginBottom: '25px', marginTop: 'auto' },
    progressHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' },
    progressBarBg: { height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' },
    progressBarFill: (progress) => ({ height: '100%', backgroundColor: progress === 100 ? '#10b981' : '#0f4c81', width: `${progress}%`, transition: 'width 0.5s' }),
    actionBtn: { 
      width: '100%', padding: '12px', border: 'none', borderRadius: '10px', 
      backgroundColor: '#0f4c81', color: 'white', fontWeight: 'bold', fontSize: '1rem',
      cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
      transition: 'background 0.2s'
    }
  };

  return (
    <div style={pageStyles.container}>
      <div style={pageStyles.wrapper} className="fade-in">
        
        <h1 style={pageStyles.pageTitle}>دوراتي التعليمية (My Courses)</h1>

        {/* Stats Bar */}
        <div style={pageStyles.statsBar}>
          <div style={pageStyles.statWidget}>
            <div style={pageStyles.statIcon}><MdMenuBook /></div>
            <div>
              <p style={pageStyles.statValue}>{stats.totalCourses}</p>
              <p style={pageStyles.statLabel}>Total Courses</p>
            </div>
          </div>
          <div style={pageStyles.statWidget}>
            <div style={pageStyles.statIcon}><MdPlayCircleFilled /></div>
            <div>
              <p style={pageStyles.statValue}>{stats.completedLessons}</p>
              <p style={pageStyles.statLabel}>Completed Lessons</p>
            </div>
          </div>
          <div style={pageStyles.statWidget}>
            <div style={pageStyles.statIcon}><MdCheckCircle /></div>
            <div>
              <p style={pageStyles.statValue}>{stats.testsPassed}</p>
              <p style={pageStyles.statLabel}>Tests Passed</p>
            </div>
          </div>
          <div style={pageStyles.statWidget}>
            <div style={pageStyles.statIcon}><MdFolder /></div>
            <div>
              <p style={pageStyles.statValue}>{stats.files}</p>
              <p style={pageStyles.statLabel}>Files</p>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div style={pageStyles.controlsBar}>
          <div style={pageStyles.searchBox}>
            <MdSearch size={24} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="ابحث عن كورس..." 
              style={pageStyles.searchInput} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div style={pageStyles.filterTabs}>
            <button style={pageStyles.tabBtn(activeFilter === 'All')} onClick={() => setActiveFilter('All')}>All</button>
            <button style={pageStyles.tabBtn(activeFilter === 'Active')} onClick={() => setActiveFilter('Active')}>Active</button>
            <button style={pageStyles.tabBtn(activeFilter === 'Completed')} onClick={() => setActiveFilter('Completed')}>Completed</button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{textAlign: 'center', padding: '50px', color: '#64748b'}}>جاري التحميل...</div>
        ) : filteredCourses.length === 0 ? (
          <div style={{textAlign: 'center', padding: '80px 20px', backgroundColor: 'white', borderRadius: '20px', border: '1px solid #e2e8f0'}}>
            <MdMenuBook size={60} color="#cbd5e1" style={{marginBottom: '20px'}} />
            <h2 style={{color: '#475569', margin: 0}}>لا توجد كورسات مطابقة</h2>
          </div>
        ) : (
          <div style={pageStyles.grid}>
            {filteredCourses.map(course => (
              <div 
                key={course.id} 
                style={pageStyles.card} 
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img src={course.thumbnail} alt={course.title} style={pageStyles.thumbnail} />
                
                <div style={pageStyles.cardBody}>
                  <div style={pageStyles.tagsContainer}>
                    <span style={{...pageStyles.tag, ...pageStyles.tagActive}}>{course.status === 'نشط' ? 'Active' : course.status}</span>
                    <span style={pageStyles.tag}>{course.type === 'اونلاين' ? 'Online' : 'Offline'}</span>
                  </div>
                  
                  <h3 style={pageStyles.cardTitle}>{course.title}</h3>
                  
                  <div style={pageStyles.progressSection}>
                    <div style={pageStyles.progressHeader}>
                      <span>مكتمل</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div style={pageStyles.progressBarBg}>
                      <div style={pageStyles.progressBarFill(course.progress)}></div>
                    </div>
                  </div>
                  
                  <button 
                    style={pageStyles.actionBtn}
                    onClick={() => navigate(`/lesson/${course.courseId}`)}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0a365c'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f4c81'}
                  >
                    Enter Class <MdPlayCircleFilled size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
