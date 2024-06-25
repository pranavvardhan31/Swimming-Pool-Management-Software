// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('member'); // Default role is 'member'

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserRole(parsedUser.role); // Set user role from stored data
    }
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    setUserRole(userData.role); // Set user role from logged-in user data
    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    setUserRole('member'); // Reset user role to 'member' on logout
    // Remove user data from localStorage
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
