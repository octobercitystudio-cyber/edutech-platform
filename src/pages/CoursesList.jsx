import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import PublicNavbar from '../components/PublicNavbar';
import CourseCard from '../components/CourseCard';

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'نشط')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        // Map data to match CourseCard expectations
        const mappedCourses = data.map(course => ({
          id: course.id,
          title: course.title,
          teacher: course.instructor_name || 'معلم غير محدد',
          price: course.price,
          description: course.description,
          // Fallback image since image_url is missing from db
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80'
        }));
        setCourses(mappedCourses);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PublicNavbar />
      <div style={styles.container} className="fade-in">
        <h1 style={{color: 'var(--primary-color)'}}>متجر الكورسات</h1>
        <p className="text-muted">تصفح أحدث الكورسات واشترك الآن لتبدأ التعلم</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
            جاري تحميل الكورسات...
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
            لا توجد كورسات متاحة حالياً
          </div>
        ) : (
          <div style={styles.grid}>
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: 'var(--space-6)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: 'var(--space-6)',
    marginTop: 'var(--space-6)',
  }
};
