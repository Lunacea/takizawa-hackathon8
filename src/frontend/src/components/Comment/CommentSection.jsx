"use client"; // これを一番上に書く

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import CommentCard from "./CommentCard.jsx";
import { useAuth } from "@/contexts/AuthContext";
import { listComments, createComment } from "@/lib/appwrite/comments";

export default function CommentSection({ projectId }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [comments, setComments] = useState([]); // ルートコメント（配下にreplies）
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLoggedIn = useMemo(
    () => isAuthenticated && !!user,
    [isAuthenticated, user]
  );

  const toUiComment = (c) => ({
    id: c.$id,
    authorName:
      c.authorName || (c.userId === user?.$id ? "自分" : c.userId.slice(0, 8)),
    authorId: c.userId,
    type: c.type,
    content: c.content,
    timestamp: new Date(c.$createdAt).toLocaleString(),
    replies: (c.replies || []).map((r) => ({
      id: r.$id,
      authorName:
        r.authorName ||
        (r.userId === user?.$id ? "自分" : r.userId.slice(0, 8)),
      authorId: r.userId,
      content: r.content,
      timestamp: new Date(r.$createdAt).toLocaleString(),
    })),
  });

  const refresh = async () => {
    if (!projectId) return;
    setLoading(true);
    setError("");
    try {
      const data = await listComments(String(projectId));
      setComments(data.map(toUiComment));
    } catch (e) {
      setError(e?.message || "コメントの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const addComment = async () => {
    if (!newComment.trim() || !isLoggedIn) return;
    setLoading(true);
    setError("");
    try {
      await createComment({
        projectId: String(projectId),
        user,
        content: newComment.trim(),
        type: "comment",
      });
      setNewComment("");
      await refresh();
    } catch (e) {
      setError(e?.message || "コメントの投稿に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const addReply = async (commentId, replyContent) => {
    if (!replyContent.trim() || !isLoggedIn) return;
    setLoading(true);
    setError("");
    try {
      await createComment({
        projectId: String(projectId),
        user,
        content: replyContent.trim(),
        type: "comment",
        parentId: commentId,
      });
      await refresh();
    } catch (e) {
      setError(e?.message || "返信の投稿に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">コメント欄</h2>
        <span className="text-sm">{comments.length}件のコメント</span>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      {/* 投稿フォーム */}
      {isLoggedIn ? (
        <div className="space-y-3 p-0">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder={"コメントを入力してください..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={500}
          />

          <div className="flex justify-between items-center">
            <span className="text-xs ">{newComment.length}/500文字</span>
            <Button
              className="bg-blue-500 text-white px-6 py-2 hover:bg-blue-600 disabled:bg-gray-300"
              onClick={addComment}
              disabled={!newComment.trim() || loading || isLoading}
            >
              {loading ? "送信中..." : "投稿"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6 border border-gray-200 rounded-lg text-center">
          <p className="mb-4">コメントを投稿するにはログインが必要です</p>
          <Button
            className="bg-blue-500 text-white px-6 py-2 hover:bg-blue-600"
            onClick={() => {
              if (typeof window !== "undefined") {
                const current = window.location.pathname;
                window.location.href = `/login?redirect=${encodeURIComponent(
                  current
                )}`;
              }
            }}
          >
            ログイン
          </Button>
        </div>
      )}

      {/* コメント一覧 */}
      <div className="space-y-4">
        {loading && comments.length === 0 ? (
          <div className="text-center py-8">読み込み中...</div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              addReply={addReply}
              isLoggedIn={isLoggedIn}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p>まだコメントがありません</p>
            <p className="text-sm">最初のコメントを投稿してみましょう！</p>
          </div>
        )}
      </div>
    </div>
  );
}
