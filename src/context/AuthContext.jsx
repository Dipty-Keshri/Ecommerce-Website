import { createContext, useState, useEffect } from 'react';
import { db } from '../db/db';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username, password) => {
    const user = await db.users
      .where('username')
      .equals(username)
      .and(user => user.password === password)
      .first();
    
    if (user) {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = async (username, password) => {
    const exists = await db.users.where('username').equals(username).count();
    if (exists > 0) return false;

    await db.users.add({
      username,
      password,
      role: 'user'
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}