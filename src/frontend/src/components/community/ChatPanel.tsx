"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { listMessages, sendMessage, subscribeMessages, type MessageDoc } from "@/lib/appwrite/messages";
import { getUsernames } from "@/lib/appwrite/profiles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

interface Props { projectId: string }

export default function ChatPanel({ projectId }: Props) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [messages, setMessages] = useState<MessageDoc[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const isLoggedIn = useMemo(() => isAuthenticated && !!user, [isAuthenticated, user]);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    const run = async () => {
      if (!projectId) return;
      const initial = await listMessages(projectId);
      // ユーザー名解決
      const idMap = await getUsernames(initial.map((m) => m.userId));
      const enriched = initial.map((m) => ({ ...m, __name: idMap[m.userId] } as any));
      setMessages([...enriched].sort((a, b) => (a.$createdAt < b.$createdAt ? -1 : 1)));
      unsub = subscribeMessages(projectId, (msg) => {
        getUsernames([msg.userId]).then((idMap2) => {
          const em = { ...(msg as any), __name: idMap2[msg.userId] } as MessageDoc & { __name?: string };
          setMessages((prev) => {
            const next = [...prev, em];
            return next.sort((a, b) => (a.$createdAt < b.$createdAt ? -1 : 1));
          });
        });
      });
    };
    run();
    return () => { if (unsub) unsub(); };
  }, [projectId]);

  useEffect(() => {
    // 最新メッセージへオートスクロール
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length]);

  const onSend = async () => {
    if (!draft.trim() || !isLoggedIn || !user) return;
    setSending(true);
    try {
      await sendMessage({ projectId, user, content: draft.trim() });
      setDraft("");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">チャット</h2>
      </CardHeader>
      <CardContent>
        <div ref={listRef} className="h-72 overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 ? (
            <div className="text-sm text-gray-500">まだメッセージがありません</div>
          ) : (
            messages.map((m: any) => (
              <div key={m.$id} className="flex flex-col">
                <span className="text-xs text-gray-500">{new Date(m.$createdAt).toLocaleString()} • {m.userId === user?.$id ? (m.__name || "自分") : (m.__name || "ユーザー")}</span>
                <span className="whitespace-pre-wrap">{m.content}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        {isLoggedIn ? (
          <>
            <textarea
              className="flex-1 border border-gray-300 rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="メッセージを入力..."
              maxLength={500}
            />
            <Button disabled={!draft.trim() || sending || isLoading} onClick={onSend}>送信</Button>
          </>
        ) : (
          <div className="text-sm text-gray-600">チャットにはログインが必要です</div>
        )}
      </CardFooter>
    </Card>
  );
}


