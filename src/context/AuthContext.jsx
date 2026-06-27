import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        api.setToken(token);
        const response = await api.get('/auth/profile');
        setUser(response.data.data.user);
      } catch (error) {
        localStorage.removeItem('taskflow_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [token]);

  const login = async (authToken, authUser) => {
    localStorage.setItem('taskflow_token', authToken);
    api.setToken(authToken);
    setToken(authToken);
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    api.clearToken();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, loading, login, logout, isAuthenticated: Boolean(user) }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
