import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { LoadingScreen } from '../common';

const PublicRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    if (user?.role === 'client') {
      return <Navigate to="/client" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
