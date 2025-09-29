import { ID, Query, databases, DATABASE_CONFIG, type AuthUser } from './appwrite';

export interface CommunityUpdateDoc {
  $id: string;
  projectId: string;
  userId: string;
  content: string;
  $createdAt: string;
}

export async function listUpdates(projectId: string): Promise<CommunityUpdateDoc[]> {
  const res = await databases.listDocuments({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.communityUpdatesCollectionId,
    queries: [
      Query.equal('projectId', projectId),
      Query.orderDesc('$createdAt'),
    ],
  });
  return res.documents as unknown as CommunityUpdateDoc[];
}

export async function createUpdate(params: { projectId: string; user: AuthUser; content: string; }) {
  const { projectId, user, content } = params;
  const doc = await databases.createDocument({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.communityUpdatesCollectionId,
    documentId: ID.unique(),
    data: { projectId, userId: user.$id, content },
  });
  return doc as unknown as CommunityUpdateDoc;
}


