import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
  createdAt: string;
  lastSignInAt?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Initialize Clerk auth here
    setLoading(false);
  }, []);

  const signOut = async () => {
    // TODO: Implement Clerk sign out
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
