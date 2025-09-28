import { Client, Account, Databases, ID, type Models } from 'appwrite';
import appwriteConfig from '../../../appwrite.config.json';

// 型: appwrite.config.json の最小限の構造
interface AppwriteDatabaseConfig { $id: string; name?: string; enabled?: boolean }
interface AppwriteCollectionConfig { $id: string; databaseId?: string; name?: string; enabled?: boolean }
interface AppwriteCliConfig {
  endpoint: string;
  projectId: string;
  databases: AppwriteDatabaseConfig[];
  collections: AppwriteCollectionConfig[];
}

// 再エクスポート
export { ID };

// Appwriteクライアントの初期化（appwrite.config.json を参照）
const cfg = appwriteConfig as unknown as AppwriteCliConfig;
const client = new Client()
  .setEndpoint(cfg.endpoint)
  .setProject(cfg.projectId);

// サービス
export const account = new Account(client);
export const databases = new Databases(client);

// データベースとコレクションのID（config から解決）
const resolvedDatabaseId = cfg.databases.find((d: AppwriteDatabaseConfig) => d.$id === 'our-knot-db')?.$id
  ?? cfg.databases[0].$id;
const resolvedProfilesCollectionId = cfg.collections.find((c: AppwriteCollectionConfig) => c.$id === 'profiles')?.$id
  ?? 'profiles';
const resolvedProjectsCollectionId = cfg.collections.find((c: AppwriteCollectionConfig) => c.$id === 'projects')?.$id
  ?? 'projects';

export const DATABASE_CONFIG = {
  databaseId: resolvedDatabaseId,
  profilesCollectionId: resolvedProfilesCollectionId,
  projectsCollectionId: resolvedProjectsCollectionId,
} as const;

// ユーザープロファイルの型定義
export interface UserProfile {
  $id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  role: 'REQUESTER' | 'PARTICIPANT';
  $createdAt: string;
  $updatedAt: string;
}

// 認証関連の型定義（SDKの型を準拠）
export type AuthUser = Models.User<Models.Preferences>;

export interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
