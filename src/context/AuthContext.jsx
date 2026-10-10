import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authApi } from '../services/api';


const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);


  // modal states
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);


  const pendingActionRef = useRef(null);

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem('kinoxii_token');
      if (!token) {
        setLoadingUser(false);
        return;
      }

      try {
        const res = await authApi.getMe();
        setUser(res?.data || null);
      } catch (err) {
        localStorage.removeItem('kinoxii_token');
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }

    restoreSession();

    // listen for 401s from protected calls
    const handleAuthRequired = () => {
      setUser(null);
      openLogin();
    };

    window.addEventListener('kinoxii_auth_required', handleAuthRequired);
    return () => window.removeEventListener('kinoxii_auth_required', handleAuthRequired);
  }, []);

  // open login modal with optional replay callback
  const openLogin = (actionToReplay = null) => {
    if (typeof actionToReplay === 'function') {
      pendingActionRef.current = actionToReplay;
    }
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
    pendingActionRef.current = null;
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };


  const closeRegister = () => {
    setIsRegisterOpen(false);
  };


  const handleLoginSuccess = (userData, token) => {
    if (token) {
      localStorage.setItem('kinoxii_token', token);
    }

    setUser(userData);
    setIsLoginOpen(false);
    setIsRegisterOpen(false);

    // replay pending action if one was waiting
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      action(userData);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout API call failed:', err);
    } finally {
      localStorage.removeItem('kinoxii_token');
      setUser(null);
    }
  };


  const requireAuth = (callback) => {
    if (user) {
      callback?.(user);
    } else {
      openLogin(callback);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loadingUser,
        isLoginOpen,
        isRegisterOpen,
        openLogin,
        closeLogin,
        openRegister,
        closeRegister,
        handleLoginSuccess,
        logout,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

