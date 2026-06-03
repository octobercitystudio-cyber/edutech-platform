import React, { useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import './student-theme.css'; 
import Sidebar from './components/Sidebar';
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
import TeacherCourses from './pages/TeacherCourses';
import TeacherExams from './pages/TeacherExams';
import TeacherStudents from './pages/TeacherStudents';
import TeacherFinances from './pages/TeacherFinances';
import TeacherMarketing from './pages/TeacherMarketing';
import PlaceholderPage from './pages/PlaceholderPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import AdminFinances from './pages/AdminFinances';
import AssistantDashboard from './pages/AssistantDashboard';
import ParentDashboard from './pages/ParentDashboard';
import InstructorProfile from './pages/InstructorProfile';
import Assignments from './pages/Assignments';
import LiveSessions from './pages/LiveSessions';
import StudentReports from './pages/StudentReports';
import Support from './pages/Support';
import Settings from './pages/Settings';

import AdminSettings from './pages/AdminSettings';

import SuperAdminLayout from './components/SuperAdminLayout';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminSettings from './pages/SuperAdminSettings';

function RoleDashboard() {
  const role = localStorage.getItem('userRole') || 'student';
  if (role === 'admin') return <AdminDashboard />;
  if (role === 'teacher') return <TeacherDashboard />;
  if (role === 'assistant') return <AssistantDashboard />;
  if (role === 'parent') return <ParentDashboard />;
  return <Dashboard />;
}

function RoleSettings() {
  const role = localStorage.getItem('userRole') || 'student';
  if (role === 'admin') return <AdminSettings />;
  return <Settings />;
}

function StudentLayout() {
  const role = localStorage.getItem('userRole') || 'student';
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
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
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/admin-courses" element={<AdminCourses />} />
        <Route path="/finances" element={<AdminFinances />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/lesson/:id" element={<LessonViewer />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/:id" element={<TakeExam />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Common Modules */}
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/live" element={<LiveSessions />} />
        <Route path="/reports" element={<StudentReports />} />
        <Route path="/support" element={<Support />} />
        <Route path="/settings" element={<RoleSettings />} />
        
        {/* Teacher Specific Routes */}
        <Route path="/teacher-courses" element={<TeacherCourses />} />
        <Route path="/teacher-exams" element={<TeacherExams />} />
        <Route path="/teacher-students" element={<TeacherStudents />} />
        <Route path="/teacher-finances" element={<TeacherFinances />} />
        <Route path="/teacher-marketing" element={<TeacherMarketing />} />
        
        {/* Placeholder Routes for pending features */}
        <Route path="/teacher-assignments" element={<PlaceholderPage title="إدارة الواجبات والتكليفات" />} />
        <Route path="/teacher-live" element={<PlaceholderPage title="إدارة الفصول المباشرة" />} />
        <Route path="/teacher-announcements" element={<PlaceholderPage title="إرسال الإعلانات للطلاب" />} />
        <Route path="/teacher-reports" element={<PlaceholderPage title="التقارير الشاملة" />} />
      </Route>
      
      {/* Super Admin Routes */}
      <Route path="/super-admin" element={<SuperAdminLayout />}>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="settings" element={<SuperAdminSettings />} />
        <Route path="*" element={<div style={{padding: '50px', textAlign: 'center'}}>صفحة غير موجودة في إدارة النظام</div>} />
      </Route>
      
      <Route path="*" element={<div style={{padding: '50px', textAlign: 'center'}}>صفحة غير موجودة</div>} />
    </Routes>
  );
}

export default App;
