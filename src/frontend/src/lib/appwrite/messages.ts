import { ID, Query, client, databases, DATABASE_CONFIG, type AuthUser } from './appwrite';

export interface MessageDoc {
  $id: string;
  projectId: string;
  userId: string;
  content: string;
  $createdAt: string;
}

export async function listMessages(projectId: string): Promise<MessageDoc[]> {
  const res = await databases.listDocuments({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.messagesCollectionId,
    queries: [
      Query.equal('projectId', projectId),
      Query.orderDesc('$createdAt'),
      Query.limit(50),
    ],
  });
  return res.documents as unknown as MessageDoc[];
}

export async function sendMessage(params: { projectId: string; user: AuthUser; content: string; }) {
  const { projectId, user, content } = params;
  const doc = await databases.createDocument({
    databaseId: DATABASE_CONFIG.databaseId,
    collectionId: DATABASE_CONFIG.messagesCollectionId,
    documentId: ID.unique(),
    data: { projectId, userId: user.$id, content },
  });
  return doc as unknown as MessageDoc;
}

export function subscribeMessages(projectId: string, onEvent: (msg: MessageDoc) => void) {
  // Appwrite Realtime v11+: client.subscribe('databases.{db}.collections.{col}.documents')
  const channel = `databases.${DATABASE_CONFIG.databaseId}.collections.${DATABASE_CONFIG.messagesCollectionId}.documents`;
  const unsubscribe = (client as any).subscribe(channel, (event: any) => {
    try {
      if (event.events?.some?.((e: string) => e.endsWith('.create'))) {
        const doc = event.payload as MessageDoc;
        if (doc.projectId === projectId) onEvent(doc);
      }
    } catch {}
  });
  return unsubscribe;
}


