import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks';
import { ProtectedRoute, RoleRoute, PublicRoute } from './components/auth';
import {
  Login,
  Register,
  Dashboard,
  ClientHome,
  Clients,
  Projects,
  Unauthorized,
} from './pages';

const RootRedirect = () => {
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

  if (user?.role === 'client') {
    return <Navigate to="/client" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['freelancer']}>
              <Dashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['freelancer']}>
              <Clients />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['freelancer']}>
              <Projects />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/client"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['client']}>
              <ClientHome />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route path="/403" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
