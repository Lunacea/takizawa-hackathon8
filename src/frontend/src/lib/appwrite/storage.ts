import { storage, BUCKETS, ID } from '@/lib/appwrite/appwrite';

export async function uploadAvatar(file: File) {
  const res = await storage.createFile(BUCKETS.avatarsBucketId, ID.unique(), file as any);
  return res.$id as string;
}

export async function uploadProjectImage(file: File) {
  const res = await storage.createFile(BUCKETS.projectImagesBucketId, ID.unique(), file as any);
  return res.$id as string;
}

export function getAvatarPreviewUrl(fileId: string) {
  return storage.getFileView(BUCKETS.avatarsBucketId, fileId).toString();
}

export function getProjectImagePreviewUrl(fileId: string) {
  return storage.getFileView(BUCKETS.projectImagesBucketId, fileId).toString();
}


