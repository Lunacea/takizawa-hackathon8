import { databases, DATABASE_CONFIG } from './appwrite';

export async function getUsernames(userIds: string[]): Promise<Record<string, string>> {
  const unique = Array.from(new Set(userIds.filter(Boolean)));
  const map: Record<string, string> = {};
  await Promise.all(
    unique.map(async (uid) => {
      try {
        const doc = await databases.getDocument({
          databaseId: DATABASE_CONFIG.databaseId,
          collectionId: DATABASE_CONFIG.profilesCollectionId,
          documentId: uid,
        });
        const username = (doc as any)?.username as string | undefined;
        if (username) map[uid] = username;
      } catch {
        // ignore
      }
    })
  );
  return map;
}


