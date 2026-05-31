import React, { useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import './student-theme.css'; // Add this import
import Sidebar from './components/Sidebar';
import StudentSidebar from './components/StudentSidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CoursesList from './pages/CoursesList';
import SingleCourse from './pages/SingleCourse';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Exams from './pages/Exams';
import TakeExam from './pages/TakeExam';
import MyCourses from './pages/MyCourses';
import LessonViewer from './pages/LessonViewer';
import Profile from './pages/Profile';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AssistantDashboard from './pages/AssistantDashboard';
import ParentDashboard from './pages/ParentDashboard';
import InstructorProfile from './pages/InstructorProfile';
import Assignments from './pages/Assignments';
import LiveSessions from './pages/LiveSessions';
import StudentReports from './pages/StudentReports';
import Support from './pages/Support';
import Settings from './pages/Settings';

function RoleDashboard() {
  const role = localStorage.getItem('userRole') || 'student';
  if (role === 'admin') return <AdminDashboard />;
  if (role === 'teacher') return <TeacherDashboard />;
  if (role === 'assistant') return <AssistantDashboard />;
  if (role === 'parent') return <ParentDashboard />;
  return <Dashboard />;
}

function StudentLayout() {
  const role = localStorage.getItem('userRole') || 'student';
  return (
    <div className={`app-layout ${role === 'student' ? 'student-theme-branded' : ''}`} style={role !== 'student' ? {backgroundColor: '#f8fafc'} : {}}>
      {role === 'student' ? <StudentSidebar /> : <Sidebar />}
      <div className="main-content">
        <Header />
        
        {/* Floating Wallet Button */}
        {role === 'student' && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#33354b',
            color: '#ef4444',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            <span style={{fontSize: '1.2rem', marginBottom: '2px'}}>👛</span>
            0 جنيه
          </div>
        )}

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    // 1. Disable Right Click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // 2. Disable DevTools shortcuts
    const handleKeyDown = (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
        (e.ctrlKey && e.keyCode === 85) || 
        (e.ctrlKey && e.keyCode === 67) // Prevent copy shortcut
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/instructor/:name" element={<InstructorProfile />} />
      <Route path="/courses" element={<CoursesList />} />
      <Route path="/courses/:id" element={<SingleCourse />} />
      
      <Route element={<StudentLayout />}>
        <Route path="/dashboard" element={<RoleDashboard />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/lesson/:id" element={<LessonViewer />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/:id" element={<TakeExam />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/live" element={<LiveSessions />} />
        <Route path="/reports" element={<StudentReports />} />
        <Route path="/support" element={<Support />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      <Route path="*" element={<div style={{padding: '50px', textAlign: 'center'}}>صفحة غير موجودة</div>} />
    </Routes>
  );
}

export default App;
