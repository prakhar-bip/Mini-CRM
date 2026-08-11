import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/authContext';
import type { Permission } from '../../auth/permissions';
import { hasPermission } from '../../auth/permissions';
import type { Role } from '../../types/auth';
import { UnauthorizedPage } from '../../pages/UnauthorizedPage';

interface ProtectedRouteProps {
  requiredPermission?: Permission;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredPermission,
  allowedRoles,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  if (!isAuthenticated || !user) {
    // Open auth modal and redirect to home
    setTimeout(() => openAuthModal(), 50);
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <UnauthorizedPage />;
  }

  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    return <UnauthorizedPage />;
  }

  return <Outlet />;
};
