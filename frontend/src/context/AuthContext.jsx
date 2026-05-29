import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Validate required fields
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    // Check credentials
    if (email === 'user123@gmail.com' && password === 'user123') {
      const userData = {
        id: Date.now(),
        email,
        name: 'User',
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, message: 'Logged in successfully' };
    }

    return { success: false, message: 'Invalid email or password' };
  };

  const signup = (email, password, confirmPassword) => {
    // Only allow signup with the default credentials
    if (email === 'user123@gmail.com' && password === 'user123' && confirmPassword === 'user123') {
      const userData = {
        id: Date.now(),
        email,
        name: 'User',
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, message: 'Account created successfully' };
    }

    return { success: false, message: 'Signup is limited to user123@gmail.com with password user123' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
