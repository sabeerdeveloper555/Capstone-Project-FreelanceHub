import { createContext, useCallback, useEffect, useState } from 'react';
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '../services/authService';
import {
  getToken,
  removeToken,
  setToken,
} from '../utils/authStorage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    removeToken();
    setAuthToken(null);
    setUser(null);
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    setToken(data.token);
    setAuthToken(data.token);
    setUser(data.user);

    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);

    setToken(data.token);
    setAuthToken(data.token);
    setUser(data.user);

    return data;
  };

  const initializeAuth = useCallback(async () => {
    const storedToken = getToken();

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setAuthToken(storedToken);

    try {
      const data = await getCurrentUser();
      setUser(data.user);
    } catch {
      removeToken();
      setAuthToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();

    const handleForcedLogout = () => {
      logout();
    };

    window.addEventListener('auth:logout', handleForcedLogout);

    return () => {
      window.removeEventListener('auth:logout', handleForcedLogout);
    };
  }, [initializeAuth, logout]);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    register,
    logout,
    initializeAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}