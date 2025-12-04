"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
  uid: string;
  email: string | null;
  role: string;
  name: string;
  phone?: string;
  isDemo: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, role: string, password?: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setDemoUser: (role: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  setDemoUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage (for persistence across reloads)
    // In a real app, you might verify the token with the server here.
    const storedUser = localStorage.getItem("mock_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, role: string, password?: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setUser(data.user);
      localStorage.setItem("mock_user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Registration failed");
      }

      // Do not auto-login after register
      // setUser(resData.user);
      // localStorage.setItem("mock_user", JSON.stringify(resData.user));
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("mock_user");
  };

  const setDemoUser = (role: string) => {
    const demoUser: UserProfile = {
      uid: "DEMO-" + Date.now(),
      email: "demo@unand.edu",
      name: "Pengguna Demo",
      role: role,
      isDemo: true,
    };
    setUser(demoUser);
    localStorage.setItem("mock_user", JSON.stringify(demoUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setDemoUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
