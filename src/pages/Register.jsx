import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdEmail, MdLockOutline, MdPerson, MdPhone } from 'react-icons/md';
import { supabase } from '../supabaseClient';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const phone = e.target[1].value;
    const parentPhone = e.target[2].value;
    const grade = e.target[3].value;
    const governorate = e.target[4].value;
    const gender = e.target[5].checked ? 'ذكر' : 'أنثى'; // Simplistic gender check based on radio
    const email = e.target[7].value;
    const password = e.target[8].value;

    try {
      // 1. Sign up user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        alert('خطأ في إنشاء الحساب: ' + authError.message);
        return;
      }

      // 2. Insert extra user details into 'profiles' table
      const user = authData.user;
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: user.id, 
              name, 
              phone, 
              parent_phone: parentPhone, 
              grade, 
              governorate, 
              gender, 
              email,
              role: 'student'
            }
          ]);

        if (profileError) {
          console.error("Profile Error:", profileError);
          // If inserting profile fails, we might still have the auth user, but let's notify
          alert('تم إنشاء الحساب ولكن حدث خطأ في حفظ البيانات الإضافية.');
        } else {
          // Success
          localStorage.setItem('userId', user.id);
          localStorage.setItem('userName', name);
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userRole', 'student');
          
          alert('تم إنشاء الحساب بنجاح!');
          const from = location.state?.from || '/dashboard';
          navigate(from);
        }
      }

    } catch (err) {
      alert('خطأ في الاتصال بقاعدة البيانات');
      console.error(err);
    }
  };

  return (
    <div className="auth-layout">
      
      {/* جزء الصورة في اليمين للمظهر الجمالي */}
      <div className="auth-image-container">
        <div style={{position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '400px'}}>
          <h1 style={{fontSize: '3rem', marginBottom: '20px', color: 'white'}}>مرحباً بك في عائلتنا</h1>
          <p style={{fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.8}}>
            خطوة واحدة تفصلك عن الانضمام لأكبر منصة تعليمية تفاعلية. سجل الآن وابدأ رحلتك نحو القمة.
          </p>
        </div>
      </div>

      {/* جزء الفورم في اليسار */}
      <div className="auth-form-container">
        <div className="auth-form-box" style={{maxWidth: '450px'}}>
          <div style={{textAlign: 'center', marginBottom: 'var(--space-6)'}}>
            <h2 style={{color: 'var(--primary-color)', fontSize: '2.5rem', marginBottom: '5px'}}>علمني</h2>
            <h3 style={{color: 'var(--text-main)'}}>إنشاء حساب جديد 🎓</h3>
          </div>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">الاسم الرباعي</label>
              <div style={{position: 'relative'}}>
                <input type="text" className="form-control" placeholder="أدخل اسمك بالكامل" required />
                <MdPerson style={{position: 'absolute', left: '15px', top: '15px', color: 'var(--text-muted)'}} />
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
              <div className="form-group">
                <label className="form-label">رقم الهاتف (الطالب)</label>
                <div style={{position: 'relative'}}>
                  <input type="tel" className="form-control" placeholder="01X XXXX XXXX" required />
                  <MdPhone style={{position: 'absolute', left: '15px', top: '15px', color: 'var(--text-muted)'}} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">رقم ولي الأمر</label>
                <div style={{position: 'relative'}}>
                  <input type="tel" className="form-control" placeholder="01X XXXX XXXX" required />
                  <MdPhone style={{position: 'absolute', left: '15px', top: '15px', color: 'var(--text-muted)'}} />
                </div>
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
              <div className="form-group">
                <label className="form-label">الصف الدراسي</label>
                <select className="form-control" required style={{appearance: 'auto'}}>
                  <option value="">اختر الصف...</option>
                  <option value="الأول الثانوي">الأول الثانوي</option>
                  <option value="الثاني الثانوي">الثاني الثانوي</option>
                  <option value="الثالث الثانوي">الثالث الثانوي</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">المحافظة</label>
                <select className="form-control" required style={{appearance: 'auto'}}>
                  <option value="">اختر المحافظة...</option>
                  <option value="القاهرة">القاهرة</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="الجيزة">الجيزة</option>
                  <option value="الشرقية">الشرقية</option>
                  <option value="الدقهلية">الدقهلية</option>
                  <option value="الغربية">الغربية</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">النوع</label>
              <div style={{display: 'flex', gap: '20px', padding: '10px 0'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}}><input type="radio" name="gender" value="ذكر" required /> ذكر</label>
                <label style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}}><input type="radio" name="gender" value="أنثى" required /> أنثى</label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">البريد الإلكتروني</label>
              <div style={{position: 'relative'}}>
                <input type="email" className="form-control" placeholder="أدخل بريدك الإلكتروني" required />
                <MdEmail style={{position: 'absolute', left: '15px', top: '15px', color: 'var(--text-muted)'}} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">كلمة المرور</label>
              <div style={{position: 'relative'}}>
                <input type="password" className="form-control" placeholder="أدخل كلمة مرور قوية" required />
                <MdLockOutline style={{position: 'absolute', left: '15px', top: '15px', color: 'var(--text-muted)'}} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%', padding: '15px', fontSize: '1.2rem', marginTop: 'var(--space-4)'}}>
              إنشاء حساب
            </button>
          </form>

          <div style={{textAlign: 'center', marginTop: 'var(--space-6)'}}>
            <p className="text-muted">
              لديك حساب بالفعل؟ <Link to="/login" className="form-link">سجل دخولك من هنا</Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
