// ユーザーの役割を定義
export type UserRole = 'REQUESTER' | 'PARTICIPANT';

// プロジェクトの状態を定義
export type ProjectStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'COMPLETED';

// プロフィール情報の型定義
export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  role: UserRole;
  bio?: string;
  created_at: string;
}

// ユーザーコンテキストで使用する型
export interface UserContextType {
  user: Profile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}
