import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useContext(AuthContext); // 🔥 ahora usamos el AuthContext directamente

  if (!user) {
    // 🔒 Si no hay usuario logueado, redirigir al login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // 🔒 Si necesita un rol específico y el usuario no lo tiene, redirigir al Home
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
