import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/exams/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setExamData(data.data);
        }
      });
  }, [id]);

  const handleOptionChange = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let score = 0;
    examData.questions.forEach(q => {
      if (answers[q.id] === q.answer) {
        score += 1;
      }
    });

    fetch('http://localhost:3000/api/exams/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId: id, score, studentId: 1 })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setResult({ score, total: examData.questions.length, message: data.message });
          setIsSubmitted(true);
        }
      });
  };

  if (!examData) return <div style={{padding: '50px', textAlign: 'center'}}>جاري التحميل...</div>;

  if (isSubmitted) {
    return (
      <div className="container" style={{padding: 'var(--space-6) 0', textAlign: 'center'}}>
        <div className="card" style={{padding: 'var(--space-8)', maxWidth: '600px', margin: '0 auto'}}>
          <h2 style={{color: 'var(--primary-color)'}}>نتيجة الامتحان</h2>
          <div style={{fontSize: '4rem', fontWeight: 'bold', color: 'var(--secondary-color)', margin: 'var(--space-4) 0'}}>
            {result.score} / {result.total}
          </div>
          <p style={{fontSize: '1.2rem', marginBottom: 'var(--space-6)'}}>{result.message}</p>
          <button className="btn btn-primary" onClick={() => navigate('/exams')}>
            العودة للامتحانات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{padding: 'var(--space-6) 0', maxWidth: '800px'}}>
      <div className="card" style={{padding: 'var(--space-4)', marginBottom: 'var(--space-6)', borderBottom: '4px solid var(--primary-color)'}}>
        <h1 style={{margin: 0, color: 'var(--primary-color)'}}>{examData.exam.title}</h1>
        <p className="text-muted" style={{marginTop: '10px'}}>
          المدة: {examData.exam.duration_minutes} دقيقة | الدرجة الكلية: {examData.exam.total_marks}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {examData.questions.map((q, index) => (
          <div key={q.id} className="card" style={{padding: 'var(--space-6)', marginBottom: 'var(--space-4)'}}>
            <h3 style={{marginBottom: 'var(--space-4)'}}>السؤال {index + 1}: {q.text}</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              {q.options.map((opt, i) => (
                <label 
                  key={i} 
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '15px', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    backgroundColor: answers[q.id] === opt ? 'rgba(15, 76, 129, 0.05)' : 'transparent',
                    borderColor: answers[q.id] === opt ? 'var(--primary-color)' : 'var(--border-color)'
                  }}
                >
                  <input 
                    type="radio" 
                    name={`question_${q.id}`} 
                    value={opt}
                    onChange={() => handleOptionChange(q.id, opt)}
                    required
                    style={{transform: 'scale(1.2)'}}
                  />
                  <span style={{fontSize: '1.1rem'}}>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        <div style={{textAlign: 'center', marginTop: 'var(--space-6)'}}>
          <button type="submit" className="btn btn-secondary" style={{padding: '15px 40px', fontSize: '1.2rem'}}>
            تسليم الامتحان
          </button>
        </div>
      </form>
    </div>
  );
}
