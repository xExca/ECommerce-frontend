import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "@/types/AuthTypes";
import { decodeJwt } from "@/lib/helpers/jwt";
import axios from "@/api/axios";
import { registerLogout, setAccessToken } from "@/lib/helpers/authStore";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateToken = (newToken: string | null) => {
    setToken(newToken);
    setAccessToken (newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch{
      console.error("Logout failed");
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    updateToken(null);
  };

  useEffect(() => {
    registerLogout(handleLogout);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        const payload = decodeJwt(storedToken);
        if (payload?.exp && payload.exp * 1000 > Date.now()) {
          setUser(JSON.parse(storedUser));
          updateToken(storedToken);
          setIsLoading(false);
          return;
        }
      }

      try {
        const { data } = await axios.post(
          "/api/auth/refresh" 
        );

        const newAccessToken = data.accessToken as string;
        const refreshedUser = data.user as AuthUser;

        setUser(refreshedUser);
        localStorage.setItem("user", JSON.stringify(refreshedUser));
        updateToken(newAccessToken);
      } catch {
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    void initAuth();
  }, []);

  const login = (userData: AuthUser, jwtToken: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    updateToken(jwtToken);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
