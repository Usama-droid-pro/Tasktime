import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './services/store';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import LogTask from './pages/LogTask';
import Projects from './pages/Projects';
import Report from './pages/Report';
import Employees from './pages/Employees';
import EmployeeReport from './pages/EmployeeReport';
import './App.css';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/log-task" 
        element={
          <ProtectedRoute>
            <LogTask />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/report" 
        element={
          <ProtectedRoute>
            <Report />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects" 
        element={
          <ProtectedRoute requiredRole="Admin">
            <Projects />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employees" 
        element={
          <ProtectedRoute requiredRole="Admin">
            <Employees />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employee-report/:userId" 
        element={
          <ProtectedRoute requiredRole="Admin">
            <EmployeeReport />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/log-task" replace />} />
      <Route path="*" element={<Navigate to="/log-task" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#323130',
                border: '1px solid #D0D7DE',
                borderRadius: '2px',
                fontSize: '14px',
                fontFamily: 'Segoe UI, Tahoma, Arial, sans-serif',
              },
              success: {
                iconTheme: {
                  primary: '#107C10',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#D13438',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
