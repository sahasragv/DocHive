import { Navigate, Outlet } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  return token ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;