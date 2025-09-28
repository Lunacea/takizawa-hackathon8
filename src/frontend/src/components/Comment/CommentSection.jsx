"use client"; // これを一番上に書く

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CommentCard from "./CommentCard.jsx";

const initialComments = [];

export default function CommentSection() {
  const [comments, setComments] = useState(initialComments); // コメント一覧を保持
  const [newComment, setNewComment] = useState(""); // 投稿フォームのテキスト
  const [newType, setNewType] = useState("comment"); // 投稿タイプ（質問かコメントか）
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 開発用のもの。実際はログイン状態に応じて

  // 新しいIDを安全に生成する関数
  const generateNewId = () => {
    const allIds = comments.flatMap((c) => [c.id, ...c.replies.map((r) => r.id)]);
    return allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
  };

  const addComment = () => {
    if (!newComment.trim()) return; // 空なら投稿できない

    const commentObj = {
      id: generateNewId(),
      author: "自分",
      type: newType,
      content: newComment.trim(),
      timestamp: "今",
      replies: [], // 返信コメント用。最初は空
    };

    setComments([commentObj, ...comments]); // スプレッド構文で新しいコメントが配列の最初に来るようにする
    setNewComment("");
    setNewType("comment");
  };

  const addReply = (commentId, replyContent) => {
    if (!replyContent.trim()) return;

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId // commentId に紐づくコメントにリプライを追加
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: generateNewId(),
                  author: "自分",
                  content: replyContent.trim(),
                  timestamp: "今",
                },
              ],
            }
          : comment
      )
    );
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">コメント欄</h2>
        <span className="text-sm">{comments.length}件のコメント</span>
      </div>

      {/* 投稿フォーム */}
      {isLoggedIn ? (
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium">投稿タイプ:</span>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="commentType"
                value="comment"
                checked={newType === "comment"}
                onChange={() => setNewType("comment")}
                className="mr-2"
              />
              <span className="text-sm">コメント</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="commentType"
                value="question"
                checked={newType === "question"}
                onChange={() => setNewType("question")}
                className="mr-2"
              />
              <span className="text-sm font-semibold">質問</span>
            </label>
          </div>

          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder={newType === "question" ? "質問を入力してください..." : "コメントを入力してください..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={500}
          />

          <div className="flex justify-between items-center">
            <span className="text-xs ">{newComment.length}/500文字</span>
            <Button
              className="bg-blue-500 text-white px-6 py-2 hover:bg-blue-600 disabled:bg-gray-300"
              onClick={addComment}
              disabled={!newComment.trim()}
            >
              投稿
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6 border border-gray-200 rounded-lg text-center">
          <p className="mb-4">コメントを投稿するにはログインが必要です</p>
          <Button className="bg-blue-500 text-white px-6 py-2 hover:bg-blue-600">ログイン</Button>
        </div>
      )}

      {/* コメント一覧 */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} addReply={addReply} isLoggedIn={isLoggedIn} />
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
