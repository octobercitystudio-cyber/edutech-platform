import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MdAccountBalanceWallet, MdAdd } from 'react-icons/md';

export default function AdminFinances() {
  const [studentWallets, setStudentWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      
      // Fetch all students
      const { data: students, error: studentsError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .eq('role', 'student');

      if (studentsError) throw studentsError;

      // Fetch all wallets
      const { data: wallets, error: walletsError } = await supabase
        .from('wallet')
        .select('id, balance, student_id');

      if (walletsError) throw walletsError;

      // Merge
      const merged = (students || []).map(student => {
        const wallet = wallets?.find(w => w.student_id === student.id);
        return {
          student_id: student.id,
          name: student.name,
          email: student.email,
          wallet_id: wallet?.id || null,
          balance: wallet?.balance || 0
        };
      });

      setStudentWallets(merged);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async (student) => {
    if (!rechargeAmount || isNaN(rechargeAmount)) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }
    
    const amount = parseFloat(rechargeAmount);
    const newBalance = student.balance + amount;

    try {
      if (student.wallet_id) {
        // Update existing wallet
        const { error } = await supabase
          .from('wallet')
          .update({ balance: newBalance })
          .eq('id', student.wallet_id);
          
        if (error) throw error;
        
        setStudentWallets(studentWallets.map(s => 
          s.student_id === student.student_id ? { ...s, balance: newBalance } : s
        ));
      } else {
        // Insert new wallet
        const { data, error } = await supabase
          .from('wallet')
          .insert([{ student_id: student.student_id, balance: newBalance }])
          .select();
          
        if (error) throw error;
        
        // Update the UI regardless of whether Supabase returned the row
        // (RLS policies often block select for anon users even if insert succeeds)
        setStudentWallets(studentWallets.map(s => 
          s.student_id === student.student_id 
            ? { ...s, balance: newBalance, wallet_id: data?.[0]?.id || 'temp-id' } 
            : s
        ));
      }
      
      setSelectedStudentId(null);
      setRechargeAmount('');
      alert('تم شحن الرصيد بنجاح!');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الشحن');
    }
  };

  return (
    <div className="fade-in container" style={{padding: 'var(--space-6) 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{color: 'var(--primary-color)', margin: 0}}>التقارير المالية والمحافظ</h1>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--surface-color)', padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)'}}>
          <MdAccountBalanceWallet size={24} color="var(--primary-color)" />
          <span style={{fontWeight: 'bold'}}>إجمالي الأرصدة:</span>
          <span style={{color: 'var(--secondary-color)', fontSize: '1.2rem', fontWeight: 'bold'}}>
            {studentWallets.reduce((sum, s) => sum + s.balance, 0)} ج.م
          </span>
        </div>
      </div>

      <div className="card" style={{padding: 'var(--space-6)', border: '1px solid #e2e8f0'}}>
        <h2 style={{margin: '0 0 20px 0', color: 'var(--primary-color)'}}>محافظ الطلاب</h2>
        
        {loading ? (
          <div style={{textAlign: 'center', padding: '40px'}}>جاري تحميل بيانات المحافظ...</div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'right'}}>
              <thead>
                <tr style={{borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-light)'}}>
                  <th style={{padding: '15px'}}>اسم الطالب</th>
                  <th style={{padding: '15px'}}>البريد الإلكتروني</th>
                  <th style={{padding: '15px'}}>الرصيد الحالي</th>
                  <th style={{padding: '15px', textAlign: 'center'}}>شحن المحفظة</th>
                </tr>
              </thead>
              <tbody>
                {studentWallets.length === 0 ? (
                  <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>لا يوجد طلاب مسجلين</td></tr>
                ) : (
                  studentWallets.map(student => (
                    <tr key={student.student_id} style={{borderBottom: '1px solid var(--border-color)'}}>
                      <td style={{padding: '15px', fontWeight: 'bold'}}>{student.name || 'غير معروف'}</td>
                      <td style={{padding: '15px', color: 'var(--text-muted)'}}>{student.email || 'غير متوفر'}</td>
                      <td style={{padding: '15px', fontWeight: 'bold', color: 'var(--secondary-color)', fontSize: '1.1rem'}}>{student.balance} ج.م</td>
                      <td style={{padding: '15px', textAlign: 'center'}}>
                        {selectedStudentId === student.student_id ? (
                          <div style={{display: 'flex', justifyContent: 'center', gap: '5px'}}>
                            <input 
                              type="number" 
                              value={rechargeAmount} 
                              onChange={(e) => setRechargeAmount(e.target.value)} 
                              placeholder="المبلغ"
                              style={{padding: '5px', width: '80px', borderRadius: '5px', border: '1px solid var(--border-color)'}}
                            />
                            <button className="btn btn-primary" style={{padding: '5px 10px'}} onClick={() => handleRecharge(student)}>شحن</button>
                            <button className="btn btn-outline" style={{padding: '5px 10px'}} onClick={() => setSelectedStudentId(null)}>إلغاء</button>
                          </div>
                        ) : (
                          <button 
                            className="btn btn-outline" 
                            style={{display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 15px'}}
                            onClick={() => setSelectedStudentId(student.student_id)}
                          >
                            <MdAdd /> شحن رصيد
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
