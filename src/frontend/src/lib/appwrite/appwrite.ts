import { Client, Account, Databases, Storage, ID, Query, type Models } from 'appwrite';
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
export { ID, Query };

// Appwriteクライアントの初期化（appwrite.config.json を参照）
const cfg = appwriteConfig as unknown as AppwriteCliConfig;
export const client = new Client()
  .setEndpoint(cfg.endpoint)
  .setProject(cfg.projectId);

// サービス
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// データベースとコレクションのID（config から解決）
const resolvedDatabaseId = cfg.databases.find((d: AppwriteDatabaseConfig) => d.$id === 'our-knot-db')?.$id
  ?? cfg.databases[0].$id;
const resolvedProfilesCollectionId = cfg.collections.find((c: AppwriteCollectionConfig) => c.$id === 'profiles')?.$id
  ?? 'profiles';
const resolvedProjectsCollectionId = cfg.collections.find((c: AppwriteCollectionConfig) => c.$id === 'projects')?.$id
  ?? 'projects';
const resolvedProjectParticipantsCollectionId = cfg.collections.find((c: AppwriteCollectionConfig) => c.$id === 'project_participants')?.$id
  ?? 'project_participants';
const resolvedCommentsCollectionId = cfg.collections.find((c: AppwriteCollectionConfig) => c.$id === 'comments')?.$id
  ?? 'comments';
const resolvedCommunityUpdatesCollectionId = cfg.collections.find((c: AppwriteCollectionConfig) => c.$id === 'community_updates')?.$id
  ?? 'community_updates';
const resolvedLikesCollectionId = cfg.collections.find((c: AppwriteCollectionConfig) => c.$id === 'likes')?.$id
  ?? 'likes';
const resolvedCommunityLinksCollectionId = cfg.collections.find((c: AppwriteCollectionConfig) => c.$id === 'community_links')?.$id
  ?? 'community_links';
const resolvedMessagesCollectionId = cfg.collections.find((c: AppwriteCollectionConfig) => c.$id === 'messages')?.$id
  ?? 'messages';
const resolvedPointTransactionsCollectionId = cfg.collections.find((c: AppwriteCollectionConfig) => c.$id === 'point_transactions')?.$id
  ?? 'point_transactions';

export const DATABASE_CONFIG = {
  databaseId: resolvedDatabaseId,
  profilesCollectionId: resolvedProfilesCollectionId,
  projectsCollectionId: resolvedProjectsCollectionId,
  projectParticipantsCollectionId: resolvedProjectParticipantsCollectionId,
  commentsCollectionId: resolvedCommentsCollectionId,
  communityUpdatesCollectionId: resolvedCommunityUpdatesCollectionId,
  likesCollectionId: resolvedLikesCollectionId,
  communityLinksCollectionId: resolvedCommunityLinksCollectionId,
  messagesCollectionId: resolvedMessagesCollectionId,
  pointTransactionsCollectionId: resolvedPointTransactionsCollectionId,
} as const;

// バケットID解決
interface AppwriteBucketConfig { $id: string; name?: string }
const imagesBucket = (cfg as any).buckets?.find((b: AppwriteBucketConfig) => b.$id === 'images')?.$id ?? 'images';
// 単一バケット運用: 両用途とも images を使う
const resolvedAvatarsBucketId = imagesBucket;
const resolvedProjectImagesBucketId = imagesBucket;

export const BUCKETS = {
  avatarsBucketId: resolvedAvatarsBucketId,
  projectImagesBucketId: resolvedProjectImagesBucketId,
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
