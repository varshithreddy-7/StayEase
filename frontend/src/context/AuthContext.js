import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Verify token is still valid
      API.get('/auth/me').then(res => {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }).catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await API.post('/auth/register', { name, email, password, phone });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const toggleWishlist = async (hotelId) => {
    if (!user) return false;
    try {
      const { data } = await API.post(`/users/wishlist/${hotelId}`);
      const newWishlist = data.wishlist;
      const updated = { ...user, wishlist: newWishlist };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      toast.success(data.message);
      return true;
    } catch {
      return false;
    }
  };

  const isInWishlist = (hotelId) => {
    if (!user?.wishlist) return false;
    return user.wishlist.includes(hotelId) || user.wishlist.some(h => h._id === hotelId || h === hotelId);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, toggleWishlist, isInWishlist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
