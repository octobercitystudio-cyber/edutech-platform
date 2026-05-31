import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdPayment, MdOutlineCreditCard, MdAccountBalanceWallet } from 'react-icons/md';

export default function Checkout() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // جلب تفاصيل الكورس من state إذا وجدت
  const courseDetails = location.state || { courseId: 1, title: 'الفيزياء الشاملة للثانوية العامة', price: 250 };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedMethod) {
      alert('يرجى اختيار وسيلة الدفع أولاً');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:3000/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseId: courseDetails.courseId,
          method: selectedMethod
        })
      });

      const data = await response.json();
      setIsProcessing(false);

      if (data.success) {
        alert(data.message);
        navigate('/my-courses');
      } else {
        alert('حدث خطأ: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      alert('فشل الاتصال بالخادم، يرجى التأكد من تشغيل السيرفر.');
    }
  };

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
