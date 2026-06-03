import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdPayment, MdOutlineCreditCard, MdAccountBalanceWallet } from 'react-icons/md';

import { supabase } from '../supabaseClient';

export default function Checkout() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const courseDetails = location.state;

  // Redirect back if no course details
  React.useEffect(() => {
    if (!courseDetails) {
      navigate('/courses');
    }
  }, [courseDetails, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedMethod) {
      alert('يرجى اختيار وسيلة الدفع أولاً');
      return;
    }

    if (selectedMethod !== 'wallet') {
      alert('وسيلة الدفع هذه غير مفعلة حالياً. الرجاء استخدام المحفظة.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error('يجب تسجيل الدخول لإتمام الشراء');
      }
      const userId = userData.user.id;

      // 2. Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('student_id', userId)
        .eq('course_id', courseDetails.courseId)
        .single();

      if (existingEnrollment) {
        alert('أنت مشترك بالفعل في هذا الكورس!');
        navigate('/my-courses');
        return;
      }

      // 3. Get wallet balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallet')
        .select('*')
        .eq('student_id', userId)
        .single();

      if (walletError && walletError.code !== 'PGRST116') {
        throw new Error('خطأ في استرجاع بيانات المحفظة');
      }

      const balance = walletData ? walletData.balance : 0;
      const price = courseDetails.price || 0;

      if (balance < price) {
        throw new Error('رصيد المحفظة غير كافٍ لإتمام عملية الشراء');
      }

      // 4. Deduct balance
      const newBalance = balance - price;
      
      // If wallet doesn't exist, we can't deduct (though it should exist per trigger)
      if (walletData) {
        const { error: updateError } = await supabase
          .from('wallet')
          .update({ balance: newBalance })
          .eq('student_id', userId);
          
        if (updateError) throw updateError;
      } else {
        throw new Error('محفظتك غير مفعلة');
      }

      // 5. Insert enrollment
      const { error: enrollError } = await supabase
        .from('enrollments')
        .insert([{
          student_id: userId,
          course_id: courseDetails.courseId,
          progress: 0
        }]);

      if (enrollError) throw enrollError;

      alert('تم شراء الكورس بنجاح!');
      navigate('/my-courses');

    } catch (error) {
      console.error(error);
      alert(error.message || 'فشلت عملية الدفع');
    } finally {
      setIsProcessing(false);
    }
  };



  if (!courseDetails) return null;

  return (
    <div style={styles.container}>
      <h1 style={{color: 'var(--primary-color)', textAlign: 'center'}}>إتمام عملية الدفع</h1>
      <p className="text-muted" style={{textAlign: 'center', marginBottom: 'var(--space-8)'}}>اختر وسيلة الدفع الأنسب لك</p>

      <div style={styles.layout}>
        <div className="card" style={{padding: 'var(--space-6)'}}>
          <h3>طرق الدفع المتاحة</h3>
          <form onSubmit={handlePayment}>
            
            <label style={styles.radioLabel(selectedMethod === 'wallet')}>
              <input 
                type="radio" 
                name="payment" 
                value="wallet" 
                onChange={(e) => setSelectedMethod(e.target.value)} 
                style={styles.radioInput}
              />
              <MdAccountBalanceWallet style={styles.icon} />
              الدفع من المحفظة (خصم من الرصيد)
            </label>

            <label style={styles.radioLabel(selectedMethod === 'fawry')}>
              <input 
                type="radio" 
                name="payment" 
                value="fawry" 
                onChange={(e) => setSelectedMethod(e.target.value)} 
                style={styles.radioInput}
              />
              <MdPayment style={styles.icon} />
              الدفع عبر فوري (Fawry)
            </label>

            <label style={styles.radioLabel(selectedMethod === 'paymob')}>
              <input 
                type="radio" 
                name="payment" 
                value="paymob" 
                onChange={(e) => setSelectedMethod(e.target.value)} 
                style={styles.radioInput}
              />
              <MdOutlineCreditCard style={styles.icon} />
              البطاقة البنكية (Paymob)
            </label>

            <label style={styles.radioLabel(selectedMethod === 'vodafone')}>
              <input 
                type="radio" 
                name="payment" 
                value="vodafone" 
                onChange={(e) => setSelectedMethod(e.target.value)} 
                style={styles.radioInput}
              />
              <img src="https://placehold.co/40x40/ff0000/ffffff?text=V" alt="Vodafone" style={styles.imgIcon} />
              فودافون كاش
            </label>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{width: '100%', marginTop: 'var(--space-6)', padding: '15px', fontSize: '1.2rem', opacity: isProcessing ? 0.7 : 1}}
              disabled={isProcessing}
            >
              {isProcessing ? 'جاري المعالجة...' : `تأكيد الدفع (${courseDetails.price} ج.م)`}
            </button>
          </form>
        </div>

        <div className="card" style={{padding: 'var(--space-6)', height: 'fit-content'}}>
          <h3>ملخص الطلب</h3>
          <div style={styles.summaryItem}>
            <span>{courseDetails.title}</span>
            <span>{courseDetails.price} ج.م</span>
          </div>
          <div style={{...styles.summaryItem, borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-4)', fontWeight: 'bold', fontSize: '1.2rem'}}>
            <span>الإجمالي:</span>
            <span style={{color: 'var(--secondary-hover)'}}>{courseDetails.price} ج.م</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: 'var(--space-6)',
  },
  radioLabel: (isSelected) => ({
    display: 'flex',
    alignItems: 'center',
    padding: 'var(--space-4)',
    border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-4)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: isSelected ? 'rgba(15, 76, 129, 0.05)' : 'transparent',
    fontWeight: isSelected ? 'bold' : 'normal',
  }),
  radioInput: {
    marginLeft: 'var(--space-4)',
    transform: 'scale(1.5)',
  },
  icon: {
    fontSize: '2rem',
    marginLeft: 'var(--space-4)',
    color: 'var(--text-muted)',
  },
  imgIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    marginLeft: 'var(--space-4)',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 'var(--space-4) 0',
  }
};
