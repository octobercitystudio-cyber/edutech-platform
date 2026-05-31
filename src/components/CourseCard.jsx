import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div 
      className="course-card-compact"
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '280px',
        margin: '0 auto',
        transition: 'transform 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      <div style={{ position: 'relative' }}>
        <img 
          src={course.image} 
          alt={course.title} 
          style={{ width: '100%', height: '160px', objectFit: 'cover' }} 
        />
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: '#000',
          color: '#fff',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}>
          اونلاين
        </div>
      </div>

      <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          margin: '0 0 5px 0',
          fontSize: '1rem',
          color: 'var(--text-main)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {course.title}
        </h3>
        
        <p style={{
          margin: '0 0 15px 0',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          {course.teacher}
        </p>

        <div style={{
          marginTop: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '1.2rem' }}>🌍</span>
            المنهج كامل
          </span>
          <span style={{
            backgroundColor: '#f0f2f5',
            padding: '4px 10px',
            borderRadius: '10px'
          }}>
            {course.price} ج.م
          </span>
        </div>
      </div>

      <div 
        style={{
          backgroundColor: 'var(--primary-color)',
          color: '#fff',
          textAlign: 'center',
          padding: '12px',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}
      >
        عرض
      </div>
    </div>
  );
}
