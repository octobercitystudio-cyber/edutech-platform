const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// مسار استرجاع جميع الكورسات
app.get('/api/courses', (req, res) => {
  db.all("SELECT * FROM courses", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'خطأ في جلب الكورسات' });
    }
    res.json({ success: true, data: rows });
  });
});

// مسار استرجاع تفاصيل المعلم وكورساته
app.get('/api/instructors/:name', (req, res) => {
  const teacherName = decodeURIComponent(req.params.name);
  
  // Get teacher details from users table
  db.get("SELECT id, name, email FROM users WHERE role = 'teacher' AND name = ?", [teacherName], (err, user) => {
    if (err) return res.status(500).json({ success: false, message: 'خطأ بالخادم' });
    
    // Fallback if teacher user not found, we still return their courses
    const instructor = user || { name: teacherName, email: 'غير متوفر' };
    
    // Get their courses
    db.all("SELECT * FROM courses WHERE teacher = ?", [teacherName], (err, courses) => {
      if (err) return res.status(500).json({ success: false, message: 'خطأ في جلب كورسات المعلم' });
      
      res.json({ success: true, data: { instructor, courses } });
    });
  });
});

// مسار استرجاع تفاصيل كورس محدد
app.get('/api/courses/:id', (req, res) => {
  db.get("SELECT * FROM courses WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'خطأ في جلب الكورس' });
    }
    if (row) {
      res.json({ success: true, data: row });
    } else {
      res.status(404).json({ success: false, message: 'الكورس غير موجود' });
    }
  });
});

// مسار الدفع
app.post('/api/payment/checkout', (req, res) => {
  const { courseId, method } = req.body;
  // Use a hardcoded student ID for now (1) since auth is simple
  const studentId = 1; 
  
  db.get("SELECT * FROM courses WHERE id = ?", [courseId], (err, course) => {
    if (err || !course) {
      return res.status(404).json({ success: false, message: 'الكورس غير موجود' });
    }

    if (method === 'wallet') {
      db.get("SELECT balance FROM wallet WHERE student_id = ?", [studentId], (err, wallet) => {
        if (err || !wallet) {
          return res.status(400).json({ success: false, message: 'المحفظة غير موجودة' });
        }
        
        if (wallet.balance >= course.price) {
          const newBalance = wallet.balance - course.price;
          db.run("UPDATE wallet SET balance = ? WHERE student_id = ?", [newBalance, studentId], (err) => {
            if (!err) {
              db.run("INSERT INTO payments (course_id, student_id, amount, method, status) VALUES (?, ?, ?, ?, ?)",
                [courseId, studentId, course.price, method, 'completed']);
              return res.json({ success: true, message: `تم خصم ${course.price} ج.م من المحفظة بنجاح`, newBalance });
            }
          });
        } else {
          return res.status(400).json({ success: false, message: 'رصيد المحفظة غير كافٍ' });
        }
      });
    } else {
      // بالنسبة لباقي وسائل الدفع
      db.run("INSERT INTO payments (course_id, student_id, amount, method, status) VALUES (?, ?, ?, ?, ?)",
        [courseId, studentId, course.price, method, 'pending']);
      res.json({ success: true, message: `تم تأكيد الدفع بنجاح عبر ${method}` });
    }
  });
});

// --- In-Memory Security & Rate Limiting ---
const crypto = require('crypto');
const loginAttempts = {};

// Auth: Register
app.post('/api/auth/register', (req, res) => {
  const { name, phone, parentPhone, grade, governorate, gender, email, password, deviceId } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ success: false, message: 'يرجى إكمال جميع البيانات الأساسية.' });
  }

  const sessionToken = crypto.randomBytes(16).toString('hex');
  
  db.run(`INSERT INTO users (name, phone, parent_phone, grade, governorate, gender, email, password, session_token, device_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
    [name, phone, parentPhone, grade, governorate, gender, email, password, sessionToken, deviceId || null], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجل مسبقاً.' });
      }
      return res.status(500).json({ success: false, message: 'حدث خطأ أثناء إنشاء الحساب.' });
    }
    db.run(`INSERT INTO wallet (student_id, balance) VALUES (?, ?)`, [this.lastID, 0]);
    res.json({ success: true, message: 'تم إنشاء الحساب بنجاح!', sessionToken, user: { id: this.lastID, name, email, role: 'student' } });
  });
});

// Auth: Login with Rate Limiting and Session Token
app.post('/api/auth/login', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  
  // Rate limiter (Max 5 attempts per minute)
  if (loginAttempts[ip] && loginAttempts[ip].count >= 5 && (now - loginAttempts[ip].lastAttempt < 60000)) {
    return res.status(429).json({ success: false, message: 'تم حظرك مؤقتاً لمحاولات الدخول المتكررة. حاول بعد دقيقة.' });
  }

  const { email, password, deviceId } = req.body;
  db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'حدث خطأ بالخادم.' });
    
    if (!row) {
      if (!loginAttempts[ip]) loginAttempts[ip] = { count: 1, lastAttempt: now };
      else { loginAttempts[ip].count++; loginAttempts[ip].lastAttempt = now; }
      return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
    }

    // Reset rate limit on success
    delete loginAttempts[ip];

    // Single Session & Device Binding logic
    const sessionToken = crypto.randomBytes(16).toString('hex');
    const userDeviceId = deviceId || 'unknown_device';

    // Update session (logs out any other active session)
    db.run(`UPDATE users SET session_token = ?, device_id = ? WHERE id = ?`, [sessionToken, userDeviceId, row.id], () => {
      res.json({ success: true, message: 'تم تسجيل الدخول بنجاح.', sessionToken, user: { id: row.id, name: row.name, email: row.email, role: row.role } });
    });
  });
});

// Lesson View Tracking (Security API)
app.post('/api/lesson/view', (req, res) => {
  const { lessonId, sessionToken } = req.body;
  
  // 1. Verify session (Anti-Sharing check)
  db.get(`SELECT id FROM users WHERE session_token = ?`, [sessionToken], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ success: false, message: 'تم تسجيل الدخول من جهاز آخر. سيتم إيقاف العرض.' });
    }

    // 2. Increment and check View Limit
    db.get(`SELECT views_count FROM video_views WHERE student_id = ? AND lesson_id = ?`, [user.id, lessonId], (err, row) => {
      if (row && row.views_count >= 3) {
        return res.status(403).json({ success: false, message: 'لقد استنفدت الحد الأقصى لمشاهدات هذا الدرس (3 مرات).' });
      }

      if (row) {
        db.run(`UPDATE video_views SET views_count = views_count + 1 WHERE student_id = ? AND lesson_id = ?`, [user.id, lessonId], (err) => {
          if (err) console.error('Update view error:', err.message);
        });
      } else {
        db.run(`INSERT INTO video_views (student_id, lesson_id, views_count) VALUES (?, ?, 1)`, [user.id, lessonId], (err) => {
          if (err) console.error('Insert view error:', err.message);
        });
      }
      
      res.json({ success: true, message: 'تم تسجيل المشاهدة بنجاح.' });
    });
  });
});

// Exams List
app.get('/api/exams', (req, res) => {
  db.all("SELECT exams.*, courses.title as course_title FROM exams JOIN courses ON exams.course_id = courses.id", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error fetching exams' });
    }
    res.json({ success: true, data: rows });
  });
});

// Single Exam details (Mock questions)
app.get('/api/exams/:id', (req, res) => {
  db.get("SELECT * FROM exams WHERE id = ?", [req.params.id], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    // Mock questions for the exam
    const questions = [
      { id: 1, text: "ما هي وحدة قياس القوة؟", options: ["نيوتن", "جول", "وات", "باسكال"], answer: "نيوتن" },
      { id: 2, text: "ما هو الرمز الكيميائي للماء؟", options: ["CO2", "H2O", "O2", "NaCl"], answer: "H2O" },
      { id: 3, text: "كم عدد الكواكب في المجموعة الشمسية؟", options: ["7", "8", "9", "10"], answer: "8" }
    ];
    res.json({ success: true, data: { exam: row, questions } });
  });
});

// Submit Exam
app.post('/api/exams/submit', (req, res) => {
  const { examId, score, studentId } = req.body;
  // In a real app, save to db
  res.json({ success: true, message: `تم تسليم الامتحان بنجاح. نتيجتك: ${score}` });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
