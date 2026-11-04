import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AuthResponse, AuthUser } from "../types/api";
import { apiRequest } from "../services/api";

const TOKEN_STORAGE_KEY = "heroforce.access-token";
const USER_STORAGE_KEY = "heroforce.user";

interface AuthContextValue {
  isInitializing: boolean;
  token: string | null;
  user: AuthUser | null;
  signIn: (response: AuthResponse) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  const serialized = localStorage.getItem(USER_STORAGE_KEY);

  if (!serialized) {
    return null;
  }

  try {
    return JSON.parse(serialized) as AuthUser;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const [isInitializing, setIsInitializing] = useState(true);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const signIn = useCallback((response: AuthResponse) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
    setToken(response.accessToken);
    setUser(response.user);
  }, []);

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const restoredUser = await apiRequest<AuthUser>("/auth/me", {}, token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(restoredUser));
        setUser(restoredUser);
      } catch {
        signOut();
      } finally {
        setIsInitializing(false);
      }
    }

    void restoreSession();
  }, [signOut, token]);

  const value = useMemo(
    () => ({ isInitializing, token, user, signIn, signOut }),
    [isInitializing, signIn, signOut, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
