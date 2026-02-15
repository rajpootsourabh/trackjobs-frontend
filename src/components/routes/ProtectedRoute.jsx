import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader/Loader';

const ProtectedRoute = ({ children, requiredRoles = [], requiredPermissions = [] }) => {
  const { 
    isAuthenticated, 
    loading, 
    hasRole, 
    hasPermission,
    user 
  } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const hasRequiredRole = requiredRoles.length === 0 || 
    requiredRoles.some(role => hasRole(role));

  const hasRequiredPermission = requiredPermissions.length === 0 ||
    requiredPermissions.some(permission => hasPermission(permission));

  if (!hasRequiredRole || !hasRequiredPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;