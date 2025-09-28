import { useState } from "react";
import { Button } from "@/components/ui/button";
import CommentCard from "./CommentCard";

const initialComments = [
  {
    id: 1,
    author: "山田太郎",
    type: "question",
    content: "このポスターはA3サイズですか？",
    timestamp: "2時間前",
    replies: [
      { 
        id: 11, 
        author: "県立太郎", 
        content: "はい、A3予定です。",
        timestamp: "1時間前"
      },
      { 
        id: 12, 
        author: "ABCD", 
        content: "印刷時の注意点も教えてください。",
        timestamp: "30分前"
      },
    ],
  },
  {
    id: 2,
    author: "XXYY",
    type: "comment",
    content: "デザイン楽しそうですね！参加してみたいです。",
    timestamp: "3時間前",
    replies: [],
  },
];

export default function CommentSection() {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [newType, setNewType] = useState("comment");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 開発用：実際はログイン状態に応じて

  // 新しいIDを安全に生成する関数
  const generateNewId = () => {
    const allIds = comments.flatMap(c => [c.id, ...c.replies.map(r => r.id)]);
    return allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    
    const commentObj = {
      id: generateNewId(),
      author: "自分",
      type: newType,
      content: newComment.trim(),
      timestamp: "今",
      replies: [],
    };
    
    setComments([commentObj, ...comments]);
    setNewComment("");
    setNewType("comment");
  };

  const addReply = (commentId, replyContent) => {
    if (!replyContent.trim()) return;
    
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
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
        <span className="text-sm text-gray-500">
          {comments.length}件のコメント
        </span>
      </div>

      {/* 投稿フォーム */}
      {isLoggedIn ? (
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-700">投稿タイプ:</span>
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
              <span className="text-sm font-semibold text-red-500">質問</span>
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
            <span className="text-xs text-gray-400">
              {newComment.length}/500文字
            </span>
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
          <p className="text-gray-500 mb-4">コメントを投稿するにはログインが必要です</p>
          <Button className="bg-blue-500 text-white px-6 py-2 hover:bg-blue-600">
            ログイン
          </Button>
        </div>
      )}

      {/* コメント一覧 */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard 
              key={comment.id} 
              comment={comment} 
              addReply={addReply} 
              isLoggedIn={isLoggedIn} 
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>まだコメントがありません</p>
            <p className="text-sm">最初のコメントを投稿してみましょう！</p>
          </div>
        )}
      </div>
    </div>
  );
}