import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

import { getUserProfile } from '../services/api';
import type { UserProfile } from '../services/api';

const TOKEN_STORAGE_KEY = 'token';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<UserProfile | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)),
  );
  const requestIdRef = useRef(0);
  const profileRequestRef = useRef<Promise<UserProfile | null> | null>(null);
  const profileRequestTokenRef = useRef<string | null>(null);

  const logout = useCallback(() => {
    requestIdRef.current += 1;
    profileRequestRef.current = null;
    profileRequestTokenRef.current = null;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setLoading(false);
  }, []);

  const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    if (profileRequestRef.current && profileRequestTokenRef.current === token) {
      return profileRequestRef.current;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setLoading(true);

    const profileRequest = (async (): Promise<UserProfile | null> => {
      try {
        const profile = await getUserProfile();

        if (requestId === requestIdRef.current) {
          setUser(profile);
        }

        return profile;
      } catch (error) {
        if (requestId === requestIdRef.current) {
          const status = axios.isAxiosError(error) ? error.response?.status : undefined;

          if (status === 401 || status === 403) {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
          }

          setUser(null);
        }

        return null;
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          profileRequestRef.current = null;
          profileRequestTokenRef.current = null;
        }
      }
    })();

    profileRequestRef.current = profileRequest;
    profileRequestTokenRef.current = token;

    return profileRequest;
  }, []);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
