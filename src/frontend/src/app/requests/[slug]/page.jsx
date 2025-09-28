"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { databases, DATABASE_CONFIG, ID, Query } from "@/lib/appwrite/appwrite";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { getProjectImagePreviewUrl } from "@/lib/appwrite/storage";
import CommentSection from "@/components/comment/CommentSection.jsx";
import {
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function RequestDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doc = await databases.getDocument({
          databaseId: DATABASE_CONFIG.databaseId,
          collectionId: DATABASE_CONFIG.projectsCollectionId,
          documentId: String(slug),
        });
        setData(doc);
        try {
          const prof = await databases.getDocument({
            databaseId: DATABASE_CONFIG.databaseId,
            collectionId: DATABASE_CONFIG.profilesCollectionId,
            documentId: doc.requesterId,
          });
          setProfile(prof);
        } catch (_) {
          setProfile(null);
        }
        // 参加済みチェック
        try {
          if (isAuthenticated && user) {
            const res = await databases.listDocuments({
              databaseId: DATABASE_CONFIG.databaseId,
              collectionId: DATABASE_CONFIG.projectParticipantsCollectionId,
              queries: [
                Query.equal("projectId", String(slug)),
                Query.equal("userId", user.$id),
              ],
            });
            setAlreadyJoined((res.total || 0) > 0);
          } else {
            setAlreadyJoined(false);
          }
        } catch (_) {
          setAlreadyJoined(false);
        }
      } catch (e) {
        setError(e?.message ?? "読み込みに失敗しました");
      }
    };
    if (slug) fetchData();
  }, [slug, isAuthenticated, user]);

  if (error) return <div className="m-8 text-red-600">{error}</div>;
  if (!data) return <div className="m-8">読み込み中...</div>;

  return (
    <div className="m-8 space-y-6">
      <div className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-4xl font-bold p-4">{data.title}</h1>
          <h2 className="text-2xl font-bold p-4">{data.status}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="bg-red-400 text-white font-bold px-8 py-3 rounded hover:bg-red-300 disabled:opacity-60"
            disabled={isJoining || isLoading || alreadyJoined}
            onClick={async () => {
              setJoinMessage("");
              if (!isAuthenticated) {
                if (typeof window !== "undefined") {
                  window.location.href = `/login?redirect=/requests/${slug}`;
                }
                return;
              }
              if (!slug) {
                setJoinMessage(
                  "プロジェクトIDが不明です。ページを再読み込みしてください。"
                );
                return;
              }
              if (!user || !user.$id) {
                setJoinMessage(
                  "ユーザー情報の取得に失敗しました。再度ログインしてください。"
                );
                return;
              }
              try {
                setIsJoining(true);
                await databases.createDocument({
                  databaseId: DATABASE_CONFIG.databaseId,
                  collectionId: DATABASE_CONFIG.projectParticipantsCollectionId,
                  documentId: ID.unique(),
                  data: { projectId: String(slug), userId: String(user.$id) },
                });
                setJoinMessage("参加申請を受け付けました");
                setAlreadyJoined(true);
              } catch (e) {
                const code = e && e.code ? e.code : undefined;
                const msg = e?.message || "参加に失敗しました";
                // 一意制約違反（既に参加済み）
                if (
                  code === 409 ||
                  (typeof msg === "string" &&
                    /unique|already|exists|duplicate/i.test(msg))
                ) {
                  setJoinMessage("既に参加済みです");
                  setAlreadyJoined(true);
                } else {
                  setJoinMessage(msg);
                }
              } finally {
                setIsJoining(false);
              }
            }}
          >
            {alreadyJoined ? "応募済み" : isJoining ? "送信中..." : "応募する"}
          </Button>
          {alreadyJoined && (
            <Button
              className="bg-blue-500 text-white font-bold px-8 py-3 rounded hover:bg-blue-400"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = `/requests/participating/${slug}`;
                }
              }}
            >
              コミュニティに入る
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2 p-4">
        <h2 className="text-xl font-semibold">説明</h2>
        <p>{data.description}</p>
      </div>

      {data.image_url && (
        <div className="p-4">
          <img
            className="w-full max-w-2xl rounded"
            src={
              typeof data.image_url === "string" &&
              data.image_url.startsWith("http")
                ? data.image_url
                : getProjectImagePreviewUrl(String(data.image_url))
            }
            alt={data.title}
          />
        </div>
      )}

      <Table className="border border-gray-300">
        <TableBody>
          <TableRow className="border-b border-gray-300">
            <TableHead className="w-32 text-left">依頼者</TableHead>
            <TableCell>{profile?.username || data.requesterId}</TableCell>
          </TableRow>
          <TableRow className="border-b border-gray-300">
            <TableHead className="w-32 text-left">参加報酬</TableHead>
            <TableCell>{data.participation_reward}</TableCell>
          </TableRow>
          {data.category && (
            <TableRow className="border-b border-gray-300">
              <TableHead className="w-32 text-left">カテゴリ</TableHead>
              <TableCell>{data.category}</TableCell>
            </TableRow>
          )}
          {data.deadline && (
            <TableRow className="border-b border-gray-300">
              <TableHead className="w-32 text-left">期限</TableHead>
              <TableCell>{data.deadline}</TableCell>
            </TableRow>
          )}
          {typeof data.headcount !== "undefined" && (
            <TableRow className="border-b border-gray-300">
              <TableHead className="w-32 text-left">募集人数</TableHead>
              <TableCell>{String(data.headcount)}</TableCell>
            </TableRow>
          )}
          {data.bonus_reward && (
            <TableRow className="border-b border-gray-300">
              <TableHead className="w-32 text-left">ボーナス報酬</TableHead>
              <TableCell>{data.bonus_reward}</TableCell>
            </TableRow>
          )}
          {data.bonus_condition && (
            <TableRow className="border-b border-gray-300">
              <TableHead className="w-32 text-left">ボーナス条件</TableHead>
              <TableCell>{data.bonus_condition}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {joinMessage && (
        <div className="p-4 text-sm text-blue-700 bg-blue-50 rounded">
          {joinMessage}
        </div>
      )}

      {/* コメント欄 */}
      <CommentSection projectId={String(slug)} />
    </div>
  );
}
