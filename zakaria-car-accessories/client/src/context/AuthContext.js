import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('zca_token'));
  const [adminEmail, setAdminEmail] = useState(localStorage.getItem('zca_email'));

  const login = (token, email) => {
    localStorage.setItem('zca_token', token);
    localStorage.setItem('zca_email', email);
    setToken(token);
    setAdminEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('zca_token');
    localStorage.removeItem('zca_email');
    setToken(null);
    setAdminEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, adminEmail, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
