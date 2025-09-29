import { ID, Query, databases, DATABASE_CONFIG, type AuthUser } from './appwrite';

export interface PointTransactionDoc {
  $id: string;
  projectId?: string;
  userId: string;
  amount: number;
  description: string; // e.g., COMPLETION_REWARD, BONUS_REWARD
  $createdAt: string;
}

export async function grantPoints(params: { projectId?: string; userId: string; amount: number; description: string; }) {
  const { projectId, userId, amount, description } = params;
  const doc = await databases.createDocument({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.pointTransactionsCollectionId,
    documentId: ID.unique(),
    data: { projectId: projectId ?? null, userId, amount, description },
  });
  return doc as unknown as PointTransactionDoc;
}

export async function getProjectPointsTotal(projectId: string): Promise<number> {
  const res = await databases.listDocuments({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.pointTransactionsCollectionId,
    queries: [Query.equal('projectId', projectId), Query.limit(100)],
  });
  const docs = res.documents as unknown as PointTransactionDoc[];
  // NOTE: 100件超の場合の合計は必要に応じてページング
  return docs.reduce((sum, d) => sum + (d.amount || 0), 0);
}

export async function getUserPointsTotal(userId: string): Promise<number> {
  const res = await databases.listDocuments({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.pointTransactionsCollectionId,
    queries: [Query.equal('userId', userId), Query.limit(100)],
  });
  const docs = res.documents as unknown as PointTransactionDoc[];
  return docs.reduce((sum, d) => sum + (d.amount || 0), 0);
}

export async function listProjectParticipants(projectId: string): Promise<{ userId: string }[]> {
  const res = await databases.listDocuments({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.projectParticipantsCollectionId,
    queries: [Query.equal('projectId', projectId), Query.limit(100)],
  });
  return (res.documents as any[]).map((d) => ({ userId: d.userId }));
}

// 交換（ポイント消費）
export interface RedemptionItem { id: string; title: string; cost: number; description?: string }

export async function redeemPoints(params: { userId: string; item: RedemptionItem }) {
  const { userId, item } = params;
  // 消費は負のamountで記録
  return await grantPoints({ projectId: undefined, userId, amount: -Math.abs(item.cost), description: `REDEEM:${item.id}` });
}

export async function listUserPointHistory(userId: string): Promise<PointTransactionDoc[]> {
  const res = await databases.listDocuments({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.pointTransactionsCollectionId,
    queries: [Query.equal('userId', userId), Query.orderDesc('$createdAt'), Query.limit(50)],
  });
  return res.documents as unknown as PointTransactionDoc[];
}


