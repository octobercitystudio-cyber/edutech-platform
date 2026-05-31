import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MdAccountBalanceWallet, MdAdd } from 'react-icons/md';

export default function AdminFinances() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      // Join wallet with profiles to get student names
      const { data, error } = await supabase
        .from('wallet')
        .select(`
          id,
          balance,
          student_id,
          profiles!inner(name, email)
        `);
      if (data) setWallets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async (walletId, currentBalance) => {
    if (!rechargeAmount || isNaN(rechargeAmount)) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }
    
    const amount = parseFloat(rechargeAmount);
    const newBalance = currentBalance + amount;

    try {
      const { error } = await supabase
        .from('wallet')
        .update({ balance: newBalance })
        .eq('id', walletId);
        
      if (!error) {
        setWallets(wallets.map(w => w.id === walletId ? { ...w, balance: newBalance } : w));
        setSelectedWalletId(null);
        setRechargeAmount('');
        alert('تم شحن الرصيد بنجاح!');
      } else {
        alert('حدث خطأ أثناء الشحن');
      }
    } catch (err) {
      console.error(err);
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
            {wallets.reduce((sum, w) => sum + w.balance, 0)} ج.م
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
                {wallets.length === 0 ? (
                  <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>لا توجد محافظ</td></tr>
                ) : (
                  wallets.map(wallet => (
                    <tr key={wallet.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                      <td style={{padding: '15px', fontWeight: 'bold'}}>{wallet.profiles?.name || 'غير معروف'}</td>
                      <td style={{padding: '15px', color: 'var(--text-muted)'}}>{wallet.profiles?.email || 'غير معروف'}</td>
                      <td style={{padding: '15px', fontWeight: 'bold', color: 'var(--secondary-color)', fontSize: '1.1rem'}}>{wallet.balance} ج.م</td>
                      <td style={{padding: '15px', textAlign: 'center'}}>
                        {selectedWalletId === wallet.id ? (
                          <div style={{display: 'flex', justifyContent: 'center', gap: '5px'}}>
                            <input 
                              type="number" 
                              value={rechargeAmount} 
                              onChange={(e) => setRechargeAmount(e.target.value)} 
                              placeholder="المبلغ"
                              style={{padding: '5px', width: '80px', borderRadius: '5px', border: '1px solid var(--border-color)'}}
                            />
                            <button className="btn btn-primary" style={{padding: '5px 10px'}} onClick={() => handleRecharge(wallet.id, wallet.balance)}>شحن</button>
                            <button className="btn btn-outline" style={{padding: '5px 10px'}} onClick={() => setSelectedWalletId(null)}>إلغاء</button>
                          </div>
                        ) : (
                          <button 
                            className="btn btn-outline" 
                            style={{display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 15px'}}
                            onClick={() => setSelectedWalletId(wallet.id)}
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
