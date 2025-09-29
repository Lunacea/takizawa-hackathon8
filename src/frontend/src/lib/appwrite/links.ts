import { ID, Query, databases, DATABASE_CONFIG, type AuthUser } from './appwrite';

export interface CommunityLinkDoc {
  $id: string;
  projectId: string;
  title: string;
  url: string;
  addedBy: string;
  $createdAt: string;
}

export async function listLinks(projectId: string): Promise<CommunityLinkDoc[]> {
  const res = await databases.listDocuments({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.communityLinksCollectionId,
    queries: [Query.equal('projectId', projectId), Query.orderDesc('$createdAt')],
  });
  return res.documents as unknown as CommunityLinkDoc[];
}

export async function addLink(params: { projectId: string; title: string; url: string; user: AuthUser; }) {
  const { projectId, title, url, user } = params;
  const doc = await databases.createDocument({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.communityLinksCollectionId,
    documentId: ID.unique(),
    data: { projectId, title, url, addedBy: user.$id },
  });
  return doc as unknown as CommunityLinkDoc;
}


