import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      toast.error('Session expired. Please login again.');
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:4000/api/auth/login', {
      email,
      password,
    });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);

    toast.success(`Welcome back, ${user.name}!`);

    // Return redirect path based on role
    return user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard';
  };

  const register = async (userData) => {
    const response = await axios.post('http://localhost:4000/api/auth/register', userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);

    toast.success(`Welcome to RideSync, ${user.name}!`);

    // Return redirect path based on role
    return user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard';
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info('You have been logged out.');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
