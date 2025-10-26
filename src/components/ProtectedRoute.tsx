import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../services/store';
import { AuthState } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  // Get authentication state from Redux
  const authState = useSelector((state: RootState) => state.auth) as AuthState;
  const { isAuthenticated, user } = authState;
  
  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role-based access if required
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/log-task" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
