import React from 'react';
import { MdConstruction } from 'react-icons/md';

export default function PlaceholderPage({ title }) {
  return (
    <div className="fade-in container" style={{padding: 'var(--space-8) 0', textAlign: 'center'}}>
      <div className="card" style={{padding: '50px', display: 'inline-block', maxWidth: '600px'}}>
        <MdConstruction size={80} color="var(--primary-color)" style={{opacity: 0.5, marginBottom: '20px'}} />
        <h1 style={{color: 'var(--primary-color)'}}>{title}</h1>
        <p className="text-muted" style={{fontSize: '1.2rem', lineHeight: '1.6'}}>
          هذه الصفحة قيد التطوير حالياً وسيتم إطلاقها قريباً! 🚀
        </p>
      </div>
    </div>
  );
}
