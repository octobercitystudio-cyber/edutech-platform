import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdEmail, MdLockOutline } from 'react-icons/md';
import { supabase } from '../supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        alert('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        return;
      }

      const user = authData.user;
      
      // 2. Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Profile Error:", profileError);
        alert('تم تسجيل الدخول لكن حدث خطأ في جلب بيانات الملف الشخصي.');
        return;
      }

      // Success
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', profileData?.name || 'مستخدم');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', profileData?.role || 'student');
      
      alert('تم تسجيل الدخول بنجاح!');
      const from = location.state?.from || '/dashboard';
      navigate(from);
      
    } catch (err) {
      alert('خطأ في الاتصال بقاعدة البيانات');
      console.error(err);
    }
  };

  const quickLogin = (email, password) => {
    document.getElementById('emailInput').value = email;
    document.getElementById('passwordInput').value = password;
  };

  return (
    <div className="auth-layout">
      <div className="auth-form-container">
        <div className="auth-form-box">
          <div style={{textAlign: 'center', marginBottom: 'var(--space-6)'}}>
            <h2 style={{color: 'var(--primary-color)', fontSize: '2.5rem', marginBottom: '10px'}}>علمني</h2>
            <h3 style={{color: 'var(--text-main)'}}>مرحباً بك مجدداً 👋</h3>
            <p className="text-muted">قم بتسجيل الدخول لمواصلة رحلة التفوق</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني</label>
              <div style={{position: 'relative'}}>
                <input id="emailInput" type="email" className="form-control" placeholder="أدخل بريدك الإلكتروني" required />
                <MdEmail style={{position: 'absolute', left: '15px', top: '15px', color: 'var(--text-muted)'}} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">كلمة المرور</label>
              <div style={{position: 'relative'}}>
                <input id="passwordInput" type="password" className="form-control" placeholder="أدخل كلمة المرور" required />
                <MdLockOutline style={{position: 'absolute', left: '15px', top: '15px', color: 'var(--text-muted)'}} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%', padding: '15px', fontSize: '1.2rem', marginTop: 'var(--space-4)'}}>
              تسجيل الدخول
            </button>
            
            <div style={{marginTop: '20px', padding: '15px', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-md)'}}>
              <p style={{margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center'}}>دخول سريع للتجربة (Quick Login)</p>
              <div style={{display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap'}}>
                <button type="button" className="btn btn-outline" style={{padding: '5px 10px', fontSize: '0.8rem'}} onClick={() => quickLogin('student@alemni.com', '123456')}>حساب طالب</button>
                <button type="button" className="btn btn-outline" style={{padding: '5px 10px', fontSize: '0.8rem'}} onClick={() => quickLogin('parent@alemni.com', '123456')}>حساب ولي أمر</button>
                <button type="button" className="btn btn-outline" style={{padding: '5px 10px', fontSize: '0.8rem'}} onClick={() => quickLogin('teacher@alemni.com', '123456')}>حساب معلم</button>
                <button type="button" className="btn btn-outline" style={{padding: '5px 10px', fontSize: '0.8rem'}} onClick={() => quickLogin('assistant@alemni.com', '123456')}>حساب مساعد</button>
                <button type="button" className="btn btn-outline" style={{padding: '5px 10px', fontSize: '0.8rem'}} onClick={() => quickLogin('admin@alemni.com', '123456')}>حساب مدير</button>
              </div>
            </div>
          </form>

          <div style={{textAlign: 'center', marginTop: 'var(--space-6)'}}>
            <p className="text-muted">
              ليس لديك حساب؟ <Link to="/register" className="form-link">إنشاء حساب جديد</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="auth-image-container">
        <div style={{position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '400px'}}>
          <h1 style={{fontSize: '3rem', marginBottom: '20px', color: 'white'}}>مستقبلك يبدأ هنا</h1>
          <p style={{fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.8}}>
            انضم لآلاف الطلاب في منصة علمني، وابدأ في تحقيق أهدافك الأكاديمية مع أفضل أدوات التعلم عن بعد.
          </p>
        </div>
      </div>
    </div>
  );
}
