import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const RoleBasedComponent = ({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [],
  fallback = null 
}) => {
  const { hasRole, hasPermission } = useAuth();

  // Check if user has required roles
  const hasRequiredRole = requiredRoles.length === 0 || 
    requiredRoles.some(role => hasRole(role));

  // Check if user has required permissions
  const hasRequiredPermission = requiredPermissions.length === 0 ||
    requiredPermissions.some(permission => hasPermission(permission));

  if (hasRequiredRole && hasRequiredPermission) {
    return <>{children}</>;
  }

  return fallback;
};

export default RoleBasedComponent;