import { databases, DATABASE_CONFIG, ID, Query, type AuthUser } from '@/lib/appwrite/appwrite';

export type CommentType = 'comment' | 'question';

export interface CommentDocument {
  $id: string;
  projectId: string;
  userId: string;
  content: string;
  type: CommentType;
  parentId?: string | null;
  $createdAt: string;
}

export interface PopulatedComment extends CommentDocument {
  authorName?: string;
  replies?: PopulatedComment[];
}

export async function listComments(projectId: string): Promise<PopulatedComment[]> {
  const res = await databases.listDocuments({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.commentsCollectionId,
    queries: [
      Query.equal('projectId', projectId),
      Query.orderDesc('$createdAt'),
    ],
  });

  const docs = res.documents as unknown as CommentDocument[];

  // プロファイル解決（userId -> username）
  const uniqueUserIds = Array.from(new Set(docs.map((d) => d.userId).filter(Boolean)));
  const idToUsername = new Map<string, string>();
  await Promise.all(
    uniqueUserIds.map(async (uid) => {
      try {
        const prof = await databases.getDocument({
          databaseId: DATABASE_CONFIG.databaseId,
          collectionId: DATABASE_CONFIG.profilesCollectionId,
          documentId: uid,
        });
        const username = (prof as any)?.username as string | undefined;
        if (username) idToUsername.set(uid, username);
      } catch {
        // ignore missing profiles
      }
    })
  );

  // ツリー整形（parentIdでネスト）
  const byId = new Map<string, PopulatedComment>();
  docs.forEach((d) => byId.set(d.$id, { ...d, replies: [], authorName: idToUsername.get(d.userId) }));

  const roots: PopulatedComment[] = [];
  docs.forEach((d) => {
    if (d.parentId) {
      const parent = byId.get(d.parentId);
      if (parent) parent.replies!.push(byId.get(d.$id)!);
      else roots.push(byId.get(d.$id)!);
    } else {
      roots.push(byId.get(d.$id)!);
    }
  });

  // 返信は昇順で安定表示、親は降順（新しい順）
  roots.sort((a, b) => (a.$createdAt < b.$createdAt ? 1 : -1));
  roots.forEach((r) => r.replies?.sort((a, b) => (a.$createdAt < b.$createdAt ? -1 : 1)));

  return roots;
}

export async function createComment(params: {
  projectId: string;
  user: AuthUser;
  content: string;
  type: CommentType;
  parentId?: string;
}) {
  const { projectId, user, content, type, parentId } = params;
  const doc = await databases.createDocument({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.commentsCollectionId,
    documentId: ID.unique(),
    data: {
      projectId,
      userId: user.$id,
      content,
      type,
      parentId: parentId ?? undefined,
    },
  });
  return doc as unknown as CommentDocument;
}


