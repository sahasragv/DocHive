import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
