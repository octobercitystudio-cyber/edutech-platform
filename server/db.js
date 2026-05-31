const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create tables if they don't exist
    db.serialize(() => {
      // Courses Table
      db.run(`CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        teacher TEXT,
        price INTEGER,
        image TEXT,
        lessons INTEGER,
        duration TEXT
      )`);

      // Payments Table
      db.run(`CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER,
        student_id INTEGER,
        amount INTEGER,
        method TEXT,
        status TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create Users Table (Security Added)
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        parent_phone TEXT,
        grade TEXT,
        governorate TEXT,
        gender TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'student',
        session_token TEXT,
        device_id TEXT
      )`);

      // Create Wallet Table
      db.run(`CREATE TABLE IF NOT EXISTS wallet (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        balance INTEGER DEFAULT 0
      )`);

      // Create Video Views Table
      db.run(`CREATE TABLE IF NOT EXISTS video_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        lesson_id INTEGER,
        views_count INTEGER DEFAULT 1,
        UNIQUE(student_id, lesson_id)
      )`);

      // Exams Table
      db.run(`CREATE TABLE IF NOT EXISTS exams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        course_id INTEGER,
        duration_minutes INTEGER,
        total_marks INTEGER
      )`);

      // Insert mock users if none
      db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (row.count === 0) {
          db.run("INSERT INTO users (name, phone, email, password, role) VALUES ('أحمد طالب', '01012345678', 'student@alemni.com', '123456', 'student')");
          db.run("INSERT INTO wallet (student_id, balance) VALUES (1, 1500)");

          db.run("INSERT INTO users (name, phone, email, password, role) VALUES ('أ. محمود حمدي', '01011111111', 'teacher@alemni.com', '123456', 'teacher')");
          db.run("INSERT INTO users (name, phone, email, password, role) VALUES ('إدارة علمني', '01000000000', 'admin@alemni.com', '123456', 'admin')");
          db.run("INSERT INTO users (name, phone, email, password, role) VALUES ('مساعد المعلم', '01022222222', 'assistant@alemni.com', '123456', 'assistant')");
          db.run("INSERT INTO users (name, phone, email, password, role) VALUES ('ولي أمر أحمد', '01033333333', 'parent@alemni.com', '123456', 'parent')");
        }
      });

      // Insert mock exams if none
      db.get("SELECT COUNT(*) as count FROM exams", (err, row) => {
        if (row.count === 0) {
          db.run(`INSERT INTO exams (title, course_id, duration_minutes, total_marks) VALUES 
            ('امتحان شامل فيزياء', 1, 60, 50),
            ('كويز الباب الأول كيمياء', 2, 30, 20),
            ('تطبيق لغة عربية', 3, 45, 30)
          `);
        }
      });

      // Insert some mock data for courses if empty
      db.get("SELECT COUNT(*) as count FROM courses", (err, row) => {
        if (row && row.count === 0) {
          const stmt = db.prepare("INSERT INTO courses (title, teacher, price, image, lessons, duration) VALUES (?, ?, ?, ?, ?, ?)");
          stmt.run("الفيزياء الشاملة للثانوية العامة", "أ. محمود حمدي", 250, "https://placehold.co/600x400/0f4c81/ffffff?text=Physics", 45, "60 ساعة");
          stmt.run("الكيمياء العضوية المبسطة", "أ. سامح عبد الله", 200, "https://placehold.co/600x400/ffb703/ffffff?text=Chemistry", 30, "40 ساعة");
          stmt.run("اللغة العربية - النحو والبلاغة", "أ. إبراهيم محمد", 150, "https://placehold.co/600x400/1a1a24/ffffff?text=Arabic", 50, "70 ساعة");
          stmt.finalize();
        }
      });
    });
  }
});

module.exports = db;
