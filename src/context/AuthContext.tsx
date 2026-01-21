import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "@/types/AuthTypes";
import { decodeJwt } from "@/lib/helpers/jwt";
import { AxiosError } from "axios";
import { setAccessToken, registerLogout } from "@/lib/helpers/authStore";
import axiosInstance from "@/api/axios";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateToken = (newToken: string | null) => {
    setToken(newToken);
    setAccessToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch (error: AxiosError | any) {
      console.error("Logout failed", error.response?.data?.message);
    }
    setUser(null);
    updateToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const login = (userData: AuthUser, jwtToken: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    updateToken(jwtToken);
  };

  useEffect(() => {
    registerLogout(logout);

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

      if (!document.cookie.includes("refreshToken")) {
        setIsLoading(false); 
        return;
      }

      try {
        const { data } = await axiosInstance.post("/auth/refresh");
        if (data.accessToken && data.user) {
          setUser(data.user as AuthUser);
          localStorage.setItem("user", JSON.stringify(data.user));
          updateToken(data.accessToken as string);
        }
      } catch (error) {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    void initAuth();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    updateUser,
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
