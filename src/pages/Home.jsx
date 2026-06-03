import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdSchool, MdGroups, MdOndemandVideo, MdCheckCircle, MdFormatQuote, MdStar } from 'react-icons/md';
import { supabase } from '../supabaseClient';

import PublicNavbar from '../components/PublicNavbar';
import CourseCard from '../components/CourseCard';

export default function Home() {
  const navigate = useNavigate();
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('status', 'نشط')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        if (data) {
          const mappedCourses = data.map(course => ({
            id: course.id,
            title: course.title,
            teacher: course.instructor_name || 'معلم غير محدد',
            price: course.price,
            description: course.description,
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80'
          }));
          setFeaturedCourses(mappedCourses);
        }
      } catch (err) {
        console.error('Error fetching featured courses:', err);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return (
    <div style={{minHeight: '100vh', backgroundColor: 'var(--bg-color)'}}>
      
      {/* Navbar */}
      <PublicNavbar />

      {/* Hero Section */}
      <header id="home" className="hero-section">
        <div className="hero-text">
          <h1 className="hero-title">منصتك التعليمية المتكاملة نحو <span style={{color: 'var(--secondary-color)'}}>التفوق</span></h1>
          <p className="hero-subtitle">
            نقدم لك تجربة تعليمية فريدة تحاكي الدروس الخصوصية ولكن بمرونة التعلم عن بعد. مع نخبة من أفضل معلمي مصر، نضمن لك فهماً أعمق ودرجات أعلى.
          </p>
          <div style={{display: 'flex', gap: '15px'}}>
            <button className="btn btn-secondary pulse-anim" style={{padding: '15px 30px', fontSize: '1.2rem'}} onClick={() => navigate('/dashboard')}>
              ابدأ رحلتك الآن
            </button>
            <button className="btn btn-outline" style={{padding: '15px 30px', fontSize: '1.2rem'}} onClick={() => document.getElementById('courses').scrollIntoView()}>
              تصفح الكورسات
            </button>
          </div>
        </div>
        <div className="hero-image">
          {/* صورة تعبيرية توحي بالتعليم والتفوق */}
          <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Students learning" className="hero-img-element" />
        </div>
      </header>

      {/* Stats Strip */}
      <div className="stats-strip">
        <div className="stat-item">
          <div className="stat-number">+10,000</div>
          <div className="stat-label">طالب مسجل</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">+50</div>
          <div className="stat-label">كورس تفاعلي</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">+20</div>
          <div className="stat-label">معلم خبير</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">+500</div>
          <div className="stat-label">ساعة شرح</div>
        </div>
      </div>

      {/* Features Section */}
      <section id="about" className="section-padding">
        <div className="container">
          <h2 className="section-title">لماذا تختار علمني؟</h2>
          <p className="section-subtitle">نجمع بين التكنولوجيا المتطورة والخبرة التعليمية لنقدم لك أفضل تجربة</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><MdOndemandVideo /></div>
              <h3>بث مباشر ومسجل</h3>
              <p className="text-muted">احضر الحصص بث مباشر لتتفاعل مع معلمك، ويمكنك مشاهدة التسجيل في أي وقت لاحق.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><MdSchool /></div>
              <h3>امتحانات إلكترونية</h3>
              <p className="text-muted">تدرب على امتحانات تحاكي امتحانات التابلت ونظام البابل شيت الحديث لتقييم مستواك.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><MdGroups /></div>
              <h3>متابعة مع ولي الأمر</h3>
              <p className="text-muted">تقارير دورية لمستوى الطالب ترسل لولي الأمر لضمان المتابعة والالتزام بالخطة.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section id="instructors" className="section-padding" style={{backgroundColor: 'var(--surface-color)'}}>
        <div className="container">
          <h2 className="section-title">نخبة من أفضل المعلمين</h2>
          <p className="section-subtitle">تعلم على يد خبراء المادة لضمان التفوق</p>
          
          <div className="instructors-grid">
            <Link to="/instructor/أ. محمود حمدي" style={{textDecoration: 'none', color: 'inherit'}} className="instructor-card">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Instructor" className="instructor-img" />
              <h3>أ. محمود حمدي</h3>
              <p className="text-muted">أستاذ الفيزياء - خبرة 15 عاماً</p>
            </Link>
            <Link to="/instructor/أ. سامح عبد الله" style={{textDecoration: 'none', color: 'inherit'}} className="instructor-card">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Instructor" className="instructor-img" />
              <h3>أ. سامح عبد الله</h3>
              <p className="text-muted">كبير معلمي الكيمياء</p>
            </Link>
            <Link to="/instructor/أ. إبراهيم محمد" style={{textDecoration: 'none', color: 'inherit'}} className="instructor-card">
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Instructor" className="instructor-img" />
              <h3>أ. إبراهيم محمد</h3>
              <p className="text-muted">خبير اللغة العربية</p>
            </Link>
            <Link to="/instructor/أ. علي محمود" style={{textDecoration: 'none', color: 'inherit'}} className="instructor-card">
              <img src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Instructor" className="instructor-img" />
              <h3>أ. علي محمود</h3>
              <p className="text-muted">مؤلف سلسلة المتميز في الرياضيات</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section id="courses" className="section-padding">
        <div className="container">
          <h2 className="section-title">أحدث الكورسات</h2>
          <p className="section-subtitle">اختر من بين أقوى الكورسات المتاحة وابدأ رحلة نجاحك</p>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px'}}>
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div style={{textAlign: 'center', marginTop: '40px'}}>
            <button className="btn btn-outline" style={{padding: '12px 40px', fontSize: '1.1rem'}} onClick={() => navigate('/courses')}>
              عرض المزيد من الكورسات
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding" style={{backgroundColor: 'var(--surface-color)'}}>
        <div className="container">
          <h2 className="section-title">ماذا يقول طلابنا؟</h2>
          <p className="section-subtitle">قصص نجاح أبطال علمني</p>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <MdFormatQuote className="quote-icon" />
              <div style={{position: 'relative', zIndex: 1}}>
                <div style={{color: 'var(--secondary-color)', marginBottom: '10px', fontSize: '1.2rem'}}>
                  <MdStar/><MdStar/><MdStar/><MdStar/><MdStar/>
                </div>
                <p style={{fontStyle: 'italic', marginBottom: '20px'}}>
                  "منصة علمني وفرت علي وقت ومجهود كبير جداً. الشرح ممتاز والامتحانات بتعرفني مستواي الحقيقي. بفضل الله ثم مستر محمود حمدي قفلت الفيزياء!"
                </p>
                <strong>أحمد سمير</strong>
                <span className="text-muted" style={{display: 'block', fontSize: '0.9rem'}}>طالب ثانوية عامة - طب عين شمس</span>
              </div>
            </div>
            <div className="testimonial-card">
              <MdFormatQuote className="quote-icon" />
              <div style={{position: 'relative', zIndex: 1}}>
                <div style={{color: 'var(--secondary-color)', marginBottom: '10px', fontSize: '1.2rem'}}>
                  <MdStar/><MdStar/><MdStar/><MdStar/><MdStar/>
                </div>
                <p style={{fontStyle: 'italic', marginBottom: '20px'}}>
                  "أحسن حاجة في المنصة هي المتابعة مع ولي الأمر، بابا كان دايماً مطمن وأنا كنت بذاكر وأنا مرتاحة. المذكرات الـ PDF كمان منظمة جداً."
                </p>
                <strong>سارة جمال</strong>
                <span className="text-muted" style={{display: 'block', fontSize: '0.9rem'}}>طالبة ثانوية عامة - هندسة القاهرة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h2 style={{color: 'white', marginBottom: '15px'}}>علمني</h2>
              <p style={{opacity: 0.8, lineHeight: '1.8'}}>
                المنصة التعليمية الأولى لطلاب الثانوية العامة في مصر. نحن نهدف إلى تغيير مفهوم التعليم عن بعد ليكون أكثر تفاعلاً وفعالية.
              </p>
            </div>
            <div>
              <h3 className="footer-title">روابط هامة</h3>
              <ul className="footer-links">
                <li><a href="#home">الرئيسية</a></li>
                <li><a href="#about">لماذا تختارنا</a></li>
                <li><a href="#courses">الكورسات</a></li>
                <li><a href="#instructors">المعلمين</a></li>
              </ul>
            </div>
            <div>
              <h3 className="footer-title">المساعدة والدعم</h3>
              <ul className="footer-links">
                <li><a href="#">الأسئلة الشائعة</a></li>
                <li><a href="#">شروط الاستخدام</a></li>
                <li><a href="#">سياسة الخصوصية</a></li>
                <li><a href="#">تواصل معنا</a></li>
              </ul>
            </div>
            <div>
              <h3 className="footer-title">تواصل معنا</h3>
              <ul className="footer-links">
                <li style={{opacity: 0.8}}>📞 01012345678</li>
                <li style={{opacity: 0.8}}>✉️ support@alemni.com</li>
                <li style={{opacity: 0.8}}>📍 القاهرة، مصر</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 جميع الحقوق محفوظة لمنصة علمني.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
