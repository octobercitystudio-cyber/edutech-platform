import React, { useState, useEffect } from 'react';
import { MdAccountBalanceWallet, MdHistory, MdPayment } from 'react-icons/md';
import { supabase } from '../supabaseClient';

export default function TeacherFinances() {
  const userName = localStorage.getItem('userName') || 'معلم';
  
  const [balance, setBalance] = useState({
    total: 0,
    available: 0,
    pending: 0
  });
  
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amountToWithdraw, setAmountToWithdraw] = useState('');

  useEffect(() => {
    fetchFinancials();
  }, [userName]);

  const fetchFinancials = async () => {
    try {
      setLoading(true);
      
      // Fetch Total Revenue
      const { data: myCourses } = await supabase.from('courses').select('id, price').eq('instructor_name', userName);
      let totalRev = 0;
      if (myCourses && myCourses.length > 0) {
        const courseIds = myCourses.map(c => c.id);
        const { data: enrollments } = await supabase.from('enrollments').select('course_id').in('course_id', courseIds);
        
        if (enrollments) {
          enrollments.forEach(en => {
            const course = myCourses.find(c => c.id === en.course_id);
            if (course && course.price) totalRev += parseFloat(course.price);
          });
        }
      }
      
      const netRev = totalRev * 0.90; // 10% platform fee

      // Fetch Withdrawals
      const { data: wList, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('instructor_name', userName)
        .order('created_at', { ascending: false });

      let withdrawnOrPending = 0;
      if (wList && !error) {
        setWithdrawals(wList);
        wList.forEach(w => withdrawnOrPending += parseFloat(w.amount));
      }

      setBalance({
        total: netRev,
        available: Math.max(0, netRev - withdrawnOrPending),
        pending: wList ? wList.filter(w => w.status === 'قيد الانتظار').reduce((sum, w) => sum + parseFloat(w.amount), 0) : 0
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = parseFloat(amountToWithdraw);
    if (amount <= 0 || amount > balance.available) {
      alert('المبلغ غير صالح أو يفوق الرصيد المتاح.');
      return;
    }

    try {
      const { data, error } = await supabase.from('withdrawals').insert([{
        instructor_name: userName,
        amount: amount,
        status: 'قيد الانتظار'
      }]).select();

      if (error) throw error;
      
      alert('تم تقديم طلب السحب بنجاح. قيد المراجعة.');
      setAmountToWithdraw('');
      fetchFinancials();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء طلب السحب');
    }
  };

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <h1 style={{color: 'var(--primary-color)', marginBottom: 'var(--space-2)'}}>الإدارة المالية</h1>
      <p className="text-muted" style={{marginBottom: 'var(--space-6)'}}>تتبع أرباحك الصافية بعد خصم عمولة المنصة (10%) واطلب سحب أرباحك بسهولة.</p>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)'}}>
        <div className="card" style={{padding: 'var(--space-6)', backgroundColor: '#0f4c81', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <MdAccountBalanceWallet size={40} style={{opacity: 0.8, marginBottom: '10px'}} />
          <h3 style={{margin: 0, opacity: 0.9, fontWeight: 'normal'}}>الرصيد المتاح للسحب</h3>
          <h1 style={{margin: '10px 0 0 0', fontSize: '2.5rem'}}>{balance.available.toFixed(2)} ج.م</h1>
        </div>
        
        <div className="card" style={{padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid #e2e8f0'}}>
          <MdHistory size={40} color="#ffb703" style={{marginBottom: '10px'}} />
          <h3 style={{margin: 0, color: 'var(--text-muted)', fontWeight: 'normal'}}>أرباح قيد الانتظار (سحوبات معلقة)</h3>
          <h1 style={{margin: '10px 0 0 0', fontSize: '2rem', color: 'var(--text-main)'}}>{balance.pending.toFixed(2)} ج.م</h1>
        </div>

        <div className="card" style={{padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid #e2e8f0'}}>
          <MdPayment size={40} color="#10b981" style={{marginBottom: '10px'}} />
          <h3 style={{margin: 0, color: 'var(--text-muted)', fontWeight: 'normal'}}>إجمالي صافي الأرباح الكلية</h3>
          <h1 style={{margin: '10px 0 0 0', fontSize: '2rem', color: 'var(--text-main)'}}>{balance.total.toFixed(2)} ج.م</h1>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)'}}>
        <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0', height: 'fit-content'}}>
          <h2 style={{color: 'var(--primary-color)', marginTop: 0}}>طلب سحب رصيد</h2>
          <form onSubmit={handleWithdraw}>
            <div className="form-group" style={{marginTop: '20px'}}>
              <label>المبلغ المطلوب (ج.م)</label>
              <input 
                type="number" 
                className="form-control" 
                max={balance.available}
                required 
                value={amountToWithdraw} 
                onChange={e => setAmountToWithdraw(e.target.value)} 
                placeholder="0.00"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}} disabled={loading || balance.available <= 0}>
              تأكيد السحب
            </button>
          </form>
          <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '5px', fontSize: '0.85rem', color: 'var(--text-muted)'}}>
            <strong>ملاحظة:</strong> تستغرق التحويلات البنكية أو المحافظ الإلكترونية من 3 إلى 5 أيام عمل لإتمامها بعد الموافقة عليها من قبل الإدارة.
          </div>
        </div>

        <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
          <h2 style={{color: 'var(--primary-color)', marginTop: 0}}>سجل السحوبات</h2>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
            <thead>
              <tr style={{borderBottom: '2px solid var(--border-color)'}}>
                <th style={{padding: '12px'}}>رقم الطلب</th>
                <th style={{padding: '12px'}}>المبلغ</th>
                <th style={{padding: '12px'}}>تاريخ الطلب</th>
                <th style={{padding: '12px'}}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>جاري التحميل...</td></tr>
              ) : withdrawals.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)'}}>لا توجد طلبات سحب سابقة</td></tr>
              ) : (
                withdrawals.map((w, idx) => (
                  <tr key={w.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                    <td style={{padding: '15px', color: 'var(--text-muted)'}}>#{w.id.substring(0,6)}</td>
                    <td style={{padding: '15px', fontWeight: 'bold'}}>{w.amount} ج.م</td>
                    <td style={{padding: '15px'}}>{new Date(w.created_at).toLocaleDateString('ar-EG')}</td>
                    <td style={{padding: '15px'}}>
                      <span style={{
                        backgroundColor: w.status === 'قيد الانتظار' ? '#fffbeb' : '#ecfdf5',
                        color: w.status === 'قيد الانتظار' ? '#d97706' : '#059669',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
