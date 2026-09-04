import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300">
        <div className="text-center">
          <p className="text-sm font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
