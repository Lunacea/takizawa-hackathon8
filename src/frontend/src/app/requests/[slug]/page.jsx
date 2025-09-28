"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { databases, DATABASE_CONFIG } from "@/lib/appwrite/appwrite";
import { Button } from "@/components/ui/button";
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
      } catch (e) {
        setError(e?.message ?? "読み込みに失敗しました");
      }
    };
    if (slug) fetchData();
  }, [slug]);

  if (error) return <div className="m-8 text-red-600">{error}</div>;
  if (!data) return <div className="m-8">読み込み中...</div>;

  return (
    <div className="m-8 space-y-6">
      <div className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-4xl font-bold p-4">{data.title}</h1>
          <h2 className="text-2xl font-bold p-4">{data.status}</h2>
        </div>
        <Button className="bg-red-400 text-white font-bold px-8 py-3 rounded hover:bg-red-300">
          応募する
        </Button>
      </div>

      <div className="space-y-2 p-4">
        <h2 className="text-xl font-semibold">説明</h2>
        <p>{data.description}</p>
      </div>

      {data.image_url && (
        <div className="p-4">
          <img
            className="w-full max-w-2xl rounded"
            src={data.image_url}
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
    </div>
  );
}
