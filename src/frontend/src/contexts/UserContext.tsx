'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, UserContextType } from '@/types/user';

// Contextを作成
const UserContext = createContext<UserContextType | undefined>(undefined);

// Providerコンポーネント
interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初期化時にユーザー情報を取得
  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: 実際のAPIエンドポイントに置き換え
      // 現在はモックデータを使用
      const mockUser: Profile = {
        id: '1',
        username: 'テストユーザー',
        avatar_url: 'https://via.placeholder.com/150',
        role: 'REQUESTER',
        bio: 'テスト用のプロフィールです',
        created_at: new Date().toISOString(),
      };

      // ローカルストレージからユーザー情報を取得（実際の実装では認証トークンを使用）
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // デモ用にモックユーザーを設定
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ユーザー情報の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: 実際の認証APIに置き換え
      console.log('Login attempt:', { email, password });

      // モック認証
      const mockUser: Profile = {
        id: '1',
        username: email.split('@')[0],
        avatar_url: 'https://via.placeholder.com/150',
        role: 'REQUESTER',
        bio: 'ログインしたユーザーです',
        created_at: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: 実際のログアウトAPIに置き換え
      console.log('Logout');

      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログアウトに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      throw new Error('ユーザーがログインしていません');
    }

    try {
      setIsLoading(true);
      setError(null);

      // TODO: 実際のプロフィール更新APIに置き換え
      console.log('Profile update:', updates);

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プロフィールの更新に失敗しました');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: UserContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// カスタムフック
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
