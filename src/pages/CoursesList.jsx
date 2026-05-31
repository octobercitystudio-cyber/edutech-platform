import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import CourseCard from '../components/CourseCard';

export default function CoursesList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCourses(data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <PublicNavbar />
      <div style={styles.container} className="fade-in">
        <h1 style={{color: 'var(--primary-color)'}}>متجر الكورسات</h1>
        <p className="text-muted">تصفح أحدث الكورسات واشترك الآن لتبدأ التعلم</p>

        <div style={styles.grid}>
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
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
