import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * コメントカードコンポーネント
 * - 親コメント表示
 * - タイプラベル（質問 / コメント）
 * - リプライ表示（インデント）
 * - リプライ投稿フォーム
 */

/**
comment : 表示するコメントのデータ（id, content, author, type, replies）
addReply : 親コンポーネントから渡される「返信を追加する関数」
isLoggedIn : ログイン状態の判定
*/
export default function CommentCard({ comment, addReply, isLoggedIn }) {
  const [replyText, setReplyText] = useState(""); // 返信フォームの入力値を保持するため
  const [showReply, setShowReply] = useState(false);

  const handleReplySubmit = () => {
    if (!replyText.trim()) return; // 空白だけなら送れないように
    addReply(comment.id, replyText); // 親の addReply に送信
    setReplyText(""); // フォームを空白に
    setShowReply(false); // フォームを閉じる
  };

  return (
    <div className="border border-gray-300 rounded p-3">

      {/* コメントタイプラベル */}
      <div className="flex items-center gap-2 mb-1">
        {comment.type === "question" && (
          <span className="font-semibold text-sm px-2 py-1 bg-red-50 rounded">質問</span>
        )}
        {comment.type === "comment" && (
          <span className="font-medium text-sm px-2 py-1 bg-gray-50 rounded">コメント</span>
        )}
        <span className="ml-auto text-sm text-gray-400">{comment.author}</span>
      </div>

      {/* コメント本文 */}
      <p className="mb-2">{comment.content}</p>

      {/* リプライボタン */}
      {isLoggedIn && (
        <Button
          className="mb-2 text-sm px-3 py-1 bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
          onClick={() => setShowReply(!showReply)} // toggle
        >
          返信
        </Button>
      )}

      {/* 返信フォーム */}
      {showReply && isLoggedIn && (
        <div className="ml-6 space-y-2 mt-3 p-3 bg-gray-50 rounded">
          <textarea
            className="w-full border border-gray-300 rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="返信を入力してください..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              className="text-sm px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => {
                setReplyText("");
                setShowReply(false);
              }}
            >
              キャンセル
            </Button>
            <Button
              className="text-sm bg-green-500 text-white px-4 py-1 hover:bg-green-600"
              onClick={handleReplySubmit}
            >
              投稿
            </Button>
          </div>
        </div>
      )}

      {/* リプライ一覧（インデント） */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 mt-3 space-y-2">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="border-l-2 border-blue-200 pl-3 py-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-medium">{reply.author}</span>
                <span className="text-xs">{reply.timestamp || "今"}</span>
              </div>
              <p className="text-sm">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}