import { createContext, useContext, useState, useEffect } from 'react';
import {
  getToken,
  setToken,
  removeToken,
  loginUser,
  registerUser,
  getCurrentUser
} from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setAuthTokenState] = useState(getToken());
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [authNotification, setAuthNotification] = useState(null);

  // Initialize and verify user on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        try {
          const data = await getCurrentUser();
          setUser(data.user);
          localStorage.setItem('auth_user', JSON.stringify(data.user));
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initAuth();

    // Supplementary Problem 2: Listen for token expiry event from api.js
    const onAuthExpired = (event) => {
      handleLogout();
      setAuthNotification(event.detail?.message || 'Session expired. Please log in again.');
    };

    window.addEventListener('auth:expired', onAuthExpired);
    return () => window.removeEventListener('auth:expired', onAuthExpired);
  }, []);

  const handleLogin = async (email, password) => {
    const res = await loginUser({ email, password });
    setToken(res.token);
    setAuthTokenState(res.token);
    setUser(res.user);
    localStorage.setItem('auth_user', JSON.stringify(res.user));
    setAuthNotification(null);
    return res;
  };

  const handleRegister = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    setToken(res.token);
    setAuthTokenState(res.token);
    setUser(res.user);
    localStorage.setItem('auth_user', JSON.stringify(res.user));
    setAuthNotification(null);
    return res;
  };

  // Supplementary Problem 3: Add a logout mechanism that clears the token from the client
  const handleLogout = () => {
    removeToken();
    setAuthTokenState(null);
    setUser(null);
  };

  const clearAuthNotification = () => setAuthNotification(null);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loading,
        authNotification,
        clearAuthNotification,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
