"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock checking session
  useEffect(() => {
    const storedUser = localStorage.getItem("campus_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (email, password) => {
    // Mock login logic
    const mockUser = {
      id: "u1",
      name: "Alex Doe",
      email: email,
      college: "State University",
      department: "Computer Science",
      year: "Junior",
      campus: "Main Campus",
      rating: { average: 4.8, count: 12 },
      isAdmin: false,
    };
    setUser(mockUser);
    localStorage.setItem("campus_user", JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("campus_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
