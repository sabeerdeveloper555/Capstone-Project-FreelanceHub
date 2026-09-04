import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

const PublicRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300">
        <div className="text-center">
          <p className="text-sm font-medium">Checking authentication...</p>
        </div>
      </div>
    );
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
