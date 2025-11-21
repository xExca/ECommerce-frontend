import { decodeJwt } from "@/lib/helpers/jwt";
import type { AuthUser } from "@/types/AuthTypes";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";


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

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      setIsLoading(false);
      return;
    }

    const payload = decodeJwt(storedToken);

    if (!payload || !payload.exp || payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    const payload = decodeJwt(token);
    if (!payload || !payload.exp) return;

    const timeout = payload.exp * 1000 - Date.now();
    if (timeout <= 0) {
      handleLogout();
      return;
    }

    const id = setTimeout(() => {
      handleLogout();
    }, timeout);

    return () => clearTimeout(id);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const login = (userData: AuthUser, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
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
