'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { AppwriteException } from 'appwrite';
import { account, databases, DATABASE_CONFIG, ID, type AuthUser, type UserProfile, type AuthState } from '@/lib/appwrite/appwrite';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const getUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const document = await databases.getDocument({
        databaseId: DATABASE_CONFIG.databaseId,
        collectionId: DATABASE_CONFIG.profilesCollectionId,
        documentId: userId,
      });
      return document as unknown as UserProfile;
    } catch (err) {
      if (err instanceof AppwriteException && err.code === 404) {
        return null;
      }
      return null;
    }
  }, []);

  const ensureProfile = useCallback(async (user: AuthUser): Promise<UserProfile> => {
    try {
      const existing = await getUserProfile(user.$id);
      if (existing) return existing;
      const created = await databases.createDocument({
        databaseId: DATABASE_CONFIG.databaseId,
        collectionId: DATABASE_CONFIG.profilesCollectionId,
        documentId: user.$id,
        data: {
          username: user.name || (user.email ? user.email.split('@')[0] : `user-${user.$id.slice(-6)}`),
          role: 'PARTICIPANT',
        },
      });
      return created as unknown as UserProfile;
    } catch (err) {
      // If document exists (conflict) or permission issue, try reading again
      const doc = await getUserProfile(user.$id);
      if (doc) return doc;
      throw err;
    }
  }, [getUserProfile]);

  const checkAuthState = useCallback(async () => {
    try {
      const user = await account.get();
      const profile = await ensureProfile(user);
      setAuthState({ user, profile, isLoading: false, isAuthenticated: true });
    } catch {
      setAuthState({ user: null, profile: null, isLoading: false, isAuthenticated: false });
    }
  }, [ensureProfile]);

  const login = useCallback(async (email: string, password: string) => {
    await account.createEmailPasswordSession({ email, password });
    await checkAuthState();
  }, [checkAuthState]);

  const register = useCallback(async (email: string, password: string, username: string) => {
    await account.create({ userId: ID.unique(), email, password, name: username });
    await account.createEmailPasswordSession({ email, password });
    await checkAuthState();
  }, [checkAuthState]);

  const loginWithGoogle = useCallback(async () => {
    const success = `${window.location.origin}/`;
    const failure = `${window.location.origin}/login`;
    account.createOAuth2Session({ provider: 'google' as any, success, failure });
  }, []);

  const logout = useCallback(async () => {
    await account.deleteSession({ sessionId: 'current' });
    setAuthState({ user: null, profile: null, isLoading: false, isAuthenticated: false });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!authState.user) return;
    const profile = await getUserProfile(authState.user.$id);
    setAuthState((prev) => ({ ...prev, profile }));
  }, [authState.user, getUserProfile]);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
