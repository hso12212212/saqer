import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { loginAdmin, verifyAdmin } from '../lib/api';

interface AuthState {
  email: string | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const TOKEN_KEY = 'al-saqer-token';
const EMAIL_KEY = 'al-saqer-email';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(
    () => localStorage.getItem(EMAIL_KEY),
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    verifyAdmin().then((ok) => {
      setIsAdmin(ok);
      if (!ok) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EMAIL_KEY);
        setEmail(null);
      }
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (emailArg: string, password: string) => {
    const data = await loginAdmin(emailArg, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(EMAIL_KEY, data.email);
    setEmail(data.email);
    setIsAdmin(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setEmail(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo(
    () => ({ email, isAdmin, loading, login, logout }),
    [email, isAdmin, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
