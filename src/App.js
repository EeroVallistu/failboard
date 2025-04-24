import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './components/auth/SignUp';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { isAuthenticated, getCurrentUser } from './services/authService';
import './App.css';

// Protected route component for teachers
const TeacherRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  const user = getCurrentUser();
  if (user && user.role === 'teacher') {
    return children;
  }
  
  return <Navigate to="/login" />;
};

// Protected route component for students
const StudentRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  const user = getCurrentUser();
  if (user && user.role === 'student') {
    return children;
  }
  
  return <Navigate to="/login" />;
};

// Redirect to appropriate dashboard based on role
const DashboardRedirect = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  const user = getCurrentUser();
  if (user && user.role === 'teacher') {
    return <Navigate to="/teacher/dashboard" />;
  } else if (user && user.role === 'student') {
    return <Navigate to="/student/dashboard" />;
  }
  
  return <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          
          {/* Teacher routes */}
          <Route 
            path="/teacher/dashboard" 
            element={
              <TeacherRoute>
                <TeacherDashboard />
              </TeacherRoute>
            } 
          />
          
          {/* Student routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            } 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;