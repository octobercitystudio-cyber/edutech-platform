import React from 'react';
import { MdSupportAgent, MdSend } from 'react-icons/md';

export default function Support() {
  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0', maxWidth: '800px'}}>
      <h1 style={{color: 'var(--primary-color)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '10px'}}>
        <MdSupportAgent /> الدعم الفني
      </h1>
      
      <div className="card" style={{padding: 'var(--space-6)'}}>
        <h3 style={{marginBottom: 'var(--space-4)'}}>تواصل مع فريق الدعم لحل أي مشكلة تواجهك</h3>
        
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">نوع المشكلة</label>
            <select className="form-control" defaultValue="technical">
              <option value="technical">مشكلة تقنية في الموقع</option>
              <option value="financial">استفسار بخصوص الدفع والاشتراكات</option>
              <option value="educational">سؤال لمعلم المادة</option>
              <option value="other">أخرى</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">عنوان الرسالة</label>
            <input type="text" className="form-control" placeholder="اكتب عنواناً يصف المشكلة..." />
          </div>
          
          <div className="form-group">
            <label className="form-label">التفاصيل</label>
            <textarea className="form-control" rows="5" placeholder="اكتب تفاصيل المشكلة هنا..."></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{display: 'flex', gap: '10px', width: '100%'}}>
            <MdSend /> إرسال التذكرة
          </button>
        </form>
      </div>
      
      <div style={{marginTop: 'var(--space-6)', padding: 'var(--space-4)', backgroundColor: '#f0f9ff', borderRadius: 'var(--radius-md)', border: '1px solid #bae6fd'}}>
        <h4 style={{color: '#0284c7', margin: '0 0 10px 0'}}>ملاحظة هامة</h4>
        <p style={{margin: 0, color: '#0369a1', fontSize: '0.9rem'}}>يتم الرد على التذاكر خلال 24 ساعة كحد أقصى. يمكنك متابعة حالة التذكرة من هذه الصفحة لاحقاً.</p>
      </div>
    </div>
  );
}
