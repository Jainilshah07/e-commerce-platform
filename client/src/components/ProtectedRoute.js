import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Wrap any private route with <ProtectedRoute allowedRoles={['seller_admin']} />
 * to restrict access.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.user);

  // 1️⃣ Not logged in
  if (!user) return <Navigate to="/views/public/login" replace />;

  // 2️⃣ Logged in but not allowed
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />; 

  // 3️⃣ Authorized
  return children;
};

export default ProtectedRoute;
