import { ID, Query, databases, DATABASE_CONFIG, type AuthUser } from './appwrite';

export interface LikeDoc {
  $id: string;
  targetType: 'update';
  targetId: string;
  userId: string;
  $createdAt: string;
}

export async function countLikes(targetType: 'update', targetId: string): Promise<number> {
  const res = await databases.listDocuments({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.likesCollectionId,
    queries: [Query.equal('targetType', targetType), Query.equal('targetId', targetId)],
  });
  return res.total || (res.documents?.length ?? 0);
}

export async function hasLiked(params: { targetType: 'update'; targetId: string; userId: string; }): Promise<boolean> {
  const { targetType, targetId, userId } = params;
  const res = await databases.listDocuments({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.likesCollectionId,
    queries: [
      Query.equal('targetType', targetType),
      Query.equal('targetId', targetId),
      Query.equal('userId', userId),
      Query.limit(1),
    ],
  });
  return (res.total || 0) > 0;
}

export async function like(params: { targetType: 'update'; targetId: string; user: AuthUser; }) {
  const { targetType, targetId, user } = params;
  try {
    const doc = await databases.createDocument({
      databaseId: DATABASE_CONFIG.databaseId,
      collectionId: DATABASE_CONFIG.likesCollectionId,
      documentId: ID.unique(),
      data: { targetType, targetId, userId: user.$id },
    });
    return doc as unknown as LikeDoc;
  } catch (e: any) {
    // unique制約違反などは無視（すでにLIKE済み）
    return null;
  }
}

export async function unlike(params: { targetType: 'update'; targetId: string; userId: string; }) {
  const { targetType, targetId, userId } = params;
  const res = await databases.listDocuments({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.likesCollectionId,
    queries: [
      Query.equal('targetType', targetType),
      Query.equal('targetId', targetId),
      Query.equal('userId', userId),
      Query.limit(1),
    ],
  });
  const doc = res.documents?.[0] as any;
  if (doc?.$id) {
    await databases.deleteDocument({
      databaseId: DATABASE_CONFIG.databaseId,
      collectionId: DATABASE_CONFIG.likesCollectionId,
      documentId: doc.$id,
    });
  }
}


