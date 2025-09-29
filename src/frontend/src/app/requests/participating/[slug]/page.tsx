"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { databases, DATABASE_CONFIG, Query } from "@/lib/appwrite/appwrite";
import ChatPanel from "@/components/community/ChatPanel";
import UpdatesFeed from "@/components/community/UpdatesFeed";
import LinksPanel from "@/components/community/LinksPanel";
import PointsPanel from "@/components/community/PointsPanel";

export default function CommunityPage() {
  const { slug } = useParams();
  const projectId = String(slug || "");
  const { isAuthenticated, isLoading, user } = useAuth();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = useMemo(() => isAuthenticated && !!user, [isAuthenticated, user]);

  useEffect(() => {
    const run = async () => {
      if (!projectId) return;
      if (!isLoggedIn || !user) {
        setChecking(false);
        return;
      }
      try {
        const res = await databases.listDocuments({
          databaseId: DATABASE_CONFIG.databaseId,
          collectionId: DATABASE_CONFIG.projectParticipantsCollectionId,
          queries: [
            Query.equal("projectId", projectId),
            Query.equal("userId", user.$id),
          ],
        });
        setAllowed((res.total || 0) > 0);
      } catch (e) {
        setError((e as any)?.message ?? "確認に失敗しました");
      } finally {
        setChecking(false);
      }
    };
    run();
  }, [projectId, isLoggedIn, user?.$id]);

  if (isLoading || checking) return <div className="m-6">確認中...</div>;
  if (!isAuthenticated) return <div className="m-6">ログインが必要です</div>;
  if (error) return <div className="m-6 text-red-600">{error}</div>;
  if (!allowed) return <div className="m-6">このコミュニティに参加する権限がありません</div>;

  return (
    <div className="m-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <ChatPanel projectId={projectId} />
        <UpdatesFeed projectId={projectId} />
      </div>
      <div className="lg:col-span-1 space-y-6">
        <LinksPanel projectId={projectId} />
        <PointsPanel projectId={projectId} />
      </div>
    </div>
  );
}


