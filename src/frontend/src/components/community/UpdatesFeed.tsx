"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { listUpdates, createUpdate, type CommunityUpdateDoc } from "@/lib/appwrite/updates";
import { countLikes, hasLiked, like, unlike } from "@/lib/appwrite/likes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getUsernames } from "@/lib/appwrite/profiles";

interface Props { projectId: string }

export default function UpdatesFeed({ projectId }: Props) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [items, setItems] = useState<CommunityUpdateDoc[]>([]);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const isLoggedIn = useMemo(() => isAuthenticated && !!user, [isAuthenticated, user]);

  const refresh = async () => {
    if (!projectId) return;
    setLoading(true);
    const data = await listUpdates(projectId);
    const idMap = await getUsernames(data.map((d) => d.userId));
    const enriched = data.map((d) => ({ ...(d as any), __name: idMap[d.userId] }));
    setItems(enriched as any);
    const likesEntries = await Promise.all(data.map(async (d) => [d.$id, await countLikes('update', d.$id)] as const));
    setLikesMap(Object.fromEntries(likesEntries));
    if (user) {
      const likedEntries = await Promise.all(data.map(async (d) => [d.$id, await hasLiked({ targetType: 'update', targetId: d.$id, userId: user.$id })] as const));
      setLikedMap(Object.fromEntries(likedEntries));
    } else {
      setLikedMap({});
    }
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [projectId, user?.$id]);

  const onPost = async () => {
    if (!draft.trim() || !isLoggedIn || !user) return;
    setPosting(true);
    try {
      await createUpdate({ projectId, user, content: draft.trim() });
      setDraft("");
      await refresh();
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = async (id: string) => {
    if (!user) return;
    const liked = likedMap[id];
    if (liked) {
      await unlike({ targetType: 'update', targetId: id, userId: user.$id });
    } else {
      await like({ targetType: 'update', targetId: id, user: user });
    }
    await refresh();
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">最新フィード</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-sm text-gray-500">読み込み中...</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-gray-500">まだ投稿がありません</div>
        ) : (
          items.map((it: any) => (
            <div key={it.$id} className="border rounded p-3">
              <div className="text-xs text-gray-500 mb-1">
                {new Date(it.$createdAt).toLocaleString()} • {it.__name || "ユーザー"}
              </div>
              <div className="whitespace-pre-wrap">{it.content}</div>
              <div className="mt-2 flex items-center gap-2">
                <Button size="sm" variant={likedMap[it.$id] ? "default" : "outline"} disabled={isLoading} onClick={() => toggleLike(it.$id)}>
                  いいね {likesMap[it.$id] ?? 0}
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter className="gap-2">
        {isLoggedIn ? (
          <>
            <textarea
              className="flex-1 border border-gray-300 rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="共有したい最新情報を入力..."
              maxLength={1000}
            />
            <Button disabled={!draft.trim() || posting || isLoading} onClick={onPost}>投稿</Button>
          </>
        ) : (
          <div className="text-sm text-gray-600">投稿にはログインが必要です</div>
        )}
      </CardFooter>
    </Card>
  );
}


