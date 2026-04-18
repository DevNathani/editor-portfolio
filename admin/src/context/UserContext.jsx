import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [isLoaded, setIsLoaded] = useState(false);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });

    instance.interceptors.request.use(async (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [token]);

  useEffect(() => {
    // If token exists, we simulate a loaded state instantly. In a full app, you might hit a /me endpoint to verify it.
    if (token) {
      setUser({ role: 'admin' }); // Quick stub since we assume everyone logged into admin UI is admin
    } else {
      setUser(null);
    }
    setIsLoaded(true);
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data);
    localStorage.setItem('adminToken', res.data.token);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    return res.data;
  };

  const verifyOtp = async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    setToken(res.data.token);
    setUser(res.data);
    localStorage.setItem('adminToken', res.data.token);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('adminToken');
  };

  return (
    <UserContext.Provider value={{ api, isLoaded, isSignedIn: !!token, user, token, login, register, verifyOtp, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
