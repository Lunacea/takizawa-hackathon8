"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    addReply(comment.id, replyText);
    setReplyText("");
    setShowReply(false);
  };

  const authorInitial = (comment.authorName || "?").slice(0, 1).toUpperCase();

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-0">
        <div className="flex items-start gap-3">
          <Avatar className="size-9">
            <AvatarImage alt={comment.authorName} />
            <AvatarFallback className="text-xs font-semibold">
              {authorInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="font-medium truncate">
                  {comment.authorName}
                </span>
                {comment.authorId && (
                  <span className="text-[10px] text-gray-400 truncate">
                    {comment.authorId}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {comment.timestamp || "今"}
              </span>
            </div>
            {/* タイプラベルは非表示に変更 */}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <p className="whitespace-pre-wrap leading-relaxed">{comment.content}</p>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-3">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="border-l-2 border-blue-200 pl-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium">{reply.authorName}</span>
                    {reply.authorId && (
                      <span className="text-[10px] text-gray-400 truncate">
                        {reply.authorId}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {reply.timestamp || "今"}
                  </span>
                </div>
                <p className="text-sm mt-1 whitespace-pre-wrap">
                  {reply.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        {isLoggedIn && (
          <div className="w-full">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="text-sm px-3 py-1"
                onClick={() => setShowReply(!showReply)}
              >
                返信
              </Button>
            </div>

            {showReply && (
              <div className="mt-3 space-y-2">
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
                    disabled={!replyText.trim()}
                  >
                    投稿
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
