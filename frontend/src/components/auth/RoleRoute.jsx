import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

const RoleRoute = ({ allowedRoles = [], children }) => {
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default RoleRoute;
