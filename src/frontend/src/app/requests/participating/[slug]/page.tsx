"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { databases, DATABASE_CONFIG, Query } from "@/lib/appwrite/appwrite";

export default function CommunityGate() {
  const { slug } = useParams();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!slug) return;
      if (!isAuthenticated || !user) {
        setChecking(false);
        return;
      }
      try {
        const res = await databases.listDocuments({
          databaseId: DATABASE_CONFIG.databaseId,
          collectionId: DATABASE_CONFIG.projectParticipantsCollectionId,
          queries: [
            Query.equal("projectId", String(slug)),
            Query.equal("userId", user.$id),
          ],
        });
        if ((res.total || 0) > 0) {
          // 参加者のみ外部コミュニティURLへリダイレクト
          if (typeof window !== "undefined") {
            window.location.replace("/community-url-to-be-provided");
          }
        } else {
          setError("このコミュニティに参加する権限がありません");
        }
      } catch (e) {
        setError((e as any)?.message ?? "確認に失敗しました");
      } finally {
        setChecking(false);
      }
    };
    run();
  }, [slug, isAuthenticated, user]);

  if (isLoading || checking) return <div className="m-6">確認中...</div>;
  if (!isAuthenticated) return <div className="m-6">ログインが必要です</div>;
  if (error) return <div className="m-6 text-red-600">{error}</div>;
  return <div className="m-6">リダイレクト中...</div>;
}


