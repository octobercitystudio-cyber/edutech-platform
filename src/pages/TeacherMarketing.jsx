import React, { useState, useEffect } from 'react';
import { MdLocalOffer, MdCardGiftcard, MdContentCopy, MdDelete } from 'react-icons/md';
import { supabase } from '../supabaseClient';

export default function TeacherMarketing() {
  const userName = localStorage.getItem('userName') || 'معلم';
  
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newCode, setNewCode] = useState({
    code: '',
    discount_percentage: 10,
    expires_at: ''
  });

  useEffect(() => {
    fetchPromoCodes();
  }, [userName]);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('instructor_name', userName)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setPromoCodes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCode = async (e) => {
    e.preventDefault();
    if (!newCode.code || newCode.discount_percentage <= 0 || newCode.discount_percentage > 100) {
      alert('البيانات غير صالحة');
      return;
    }

    try {
      const { data, error } = await supabase.from('promo_codes').insert([{
        code: newCode.code.toUpperCase(),
        discount_percentage: newCode.discount_percentage,
        expires_at: newCode.expires_at || null,
        instructor_name: userName
      }]).select();

      if (error) throw error;
      
      alert('تم إضافة الكوبون بنجاح!');
      setNewCode({ code: '', discount_percentage: 10, expires_at: '' });
      fetchPromoCodes();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أو قد يكون الكود مستخدماً من قبل');
    }
  };

  const handleDeleteCode = async (id) => {
    if(!window.confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;
    try {
      await supabase.from('promo_codes').delete().eq('id', id);
      setPromoCodes(promoCodes.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: 'var(--space-6)'}}>
        <div style={{width: '50px', height: '50px', backgroundColor: 'var(--secondary-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
          <MdLocalOffer size={28} />
        </div>
        <div>
          <h1 style={{color: 'var(--primary-color)', margin: 0}}>أدوات التسويق والمبيعات</h1>
          <p className="text-muted" style={{margin: '5px 0 0 0'}}>قم بزيادة مبيعاتك عبر أكواد الخصم والعروض الخاصة للطلاب.</p>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)'}}>
        
        {/* نموذج إضافة كوبون جديد */}
        <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0', height: 'fit-content'}}>
          <h2 style={{color: 'var(--primary-color)', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px'}}>
            <MdCardGiftcard /> إنشاء كود خصم جديد
          </h2>
          <form onSubmit={handleAddCode} style={{marginTop: '20px'}}>
            <div className="form-group">
              <label>كود الخصم (Promo Code)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="مثال: SUCCESS2026"
                required 
                value={newCode.code} 
                onChange={e => setNewCode({...newCode, code: e.target.value.toUpperCase()})}
                style={{textTransform: 'uppercase'}}
              />
            </div>
            <div className="form-group">
              <label>نسبة الخصم (%)</label>
              <input 
                type="number" 
                className="form-control" 
                min="1" max="100"
                required 
                value={newCode.discount_percentage} 
                onChange={e => setNewCode({...newCode, discount_percentage: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="form-group">
              <label>تاريخ الانتهاء (اختياري)</label>
              <input 
                type="date" 
                className="form-control" 
                value={newCode.expires_at} 
                onChange={e => setNewCode({...newCode, expires_at: e.target.value})}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}}>
              إنشاء الكود
            </button>
          </form>
        </div>

        {/* جدول الكوبونات */}
        <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
          <h2 style={{color: 'var(--primary-color)', marginTop: 0}}>الكوبونات النشطة</h2>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
              <thead>
                <tr style={{borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)'}}>
                  <th style={{padding: '12px'}}>الكود</th>
                  <th style={{padding: '12px'}}>نسبة الخصم</th>
                  <th style={{padding: '12px'}}>تاريخ الانتهاء</th>
                  <th style={{padding: '12px'}}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{textAlign: 'center', padding: '30px'}}>جاري التحميل...</td></tr>
                ) : promoCodes.length === 0 ? (
                  <tr><td colSpan="4" style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>لم تقم بإنشاء أي أكواد خصم بعد.</td></tr>
                ) : (
                  promoCodes.map((code) => {
                    const isExpired = code.expires_at && new Date(code.expires_at) < new Date();
                    return (
                      <tr key={code.id} style={{borderBottom: '1px solid var(--border-color)', opacity: isExpired ? 0.6 : 1}}>
                        <td style={{padding: '15px'}}>
                          <div style={{
                            display: 'inline-block', padding: '5px 15px', 
                            backgroundColor: '#0f4c81', color: 'white', 
                            borderRadius: '5px', fontWeight: 'bold', letterSpacing: '1px'
                          }}>
                            {code.code}
                          </div>
                        </td>
                        <td style={{padding: '15px', fontWeight: 'bold', color: 'var(--secondary-color)'}}>{code.discount_percentage}%</td>
                        <td style={{padding: '15px'}}>
                          {code.expires_at ? new Date(code.expires_at).toLocaleDateString('ar-EG') : 'مفتوح'}
                          {isExpired && <span style={{color: 'red', fontSize: '0.8rem', marginRight: '5px'}}>(منتهي)</span>}
                        </td>
                        <td style={{padding: '15px'}}>
                          <div style={{display: 'flex', gap: '10px'}}>
                            <button 
                              title="نسخ الكود" 
                              className="btn btn-outline" 
                              style={{padding: '5px 10px'}}
                              onClick={() => {navigator.clipboard.writeText(code.code); alert('تم نسخ الكود!');}}
                            >
                              <MdContentCopy />
                            </button>
                            <button 
                              title="حذف" 
                              className="btn btn-outline" 
                              style={{padding: '5px 10px', color: '#e74c3c', borderColor: '#e74c3c'}}
                              onClick={() => handleDeleteCode(code.id)}
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
