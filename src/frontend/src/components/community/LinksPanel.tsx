"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { addLink, listLinks, type CommunityLinkDoc } from "@/lib/appwrite/links";
import { getUsernames } from "@/lib/appwrite/profiles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface Props { projectId: string }

export default function LinksPanel({ projectId }: Props) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [items, setItems] = useState<CommunityLinkDoc[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const isLoggedIn = useMemo(() => isAuthenticated && !!user, [isAuthenticated, user]);

  const refresh = async () => {
    if (!projectId) return;
    setLoading(true);
    const data = await listLinks(projectId);
    const idMap = await getUsernames(data.map((d) => d.addedBy));
    const enriched = data.map((d) => ({ ...(d as any), __name: idMap[d.addedBy] }));
    setItems(enriched as any);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [projectId]);

  const onAdd = async () => {
    if (!title.trim() || !url.trim() || !isLoggedIn || !user) return;
    try {
      setAdding(true);
      await addLink({ projectId, title: title.trim(), url: url.trim(), user });
      setTitle("");
      setUrl("");
      await refresh();
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">関連リンク</h2>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="text-sm text-gray-500">読み込み中...</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-gray-500">まだリンクがありません</div>
        ) : (
          <ul className="list-disc pl-6">
            {items.map((l: any) => (
              <li key={l.$id} className="break-all">
                <a className="text-blue-600 hover:underline" href={l.url} target="_blank" rel="noreferrer">
                  {l.title}
                </a>
                <span className="text-xs text-gray-500 ml-2">by {l.__name || "ユーザー"}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {isLoggedIn ? (
          <>
            <input
              className="flex-1 border border-gray-300 rounded p-2 text-sm"
              placeholder="タイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="flex-[2] border border-gray-300 rounded p-2 text-sm"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button disabled={!title.trim() || !url.trim() || adding || isLoading} onClick={onAdd}>追加</Button>
          </>
        ) : (
          <div className="text-sm text-gray-600">リンク追加にはログインが必要です</div>
        )}
      </CardFooter>
    </Card>
  );
}


