"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { databases, DATABASE_CONFIG, Query } from "@/lib/appwrite/appwrite";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";

export default function Participating() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!isAuthenticated || !user) return;
      setLoading(true);
      setError(null);
      try {
        const pp = await databases.listDocuments({
          databaseId: DATABASE_CONFIG.databaseId,
          collectionId: DATABASE_CONFIG.projectParticipantsCollectionId,
          queries: [Query.equal("userId", user.$id)],
        });
        const projectIds: string[] = (pp.documents || []).map((d: any) => d.projectId);
        if (projectIds.length === 0) {
          setItems([]);
          return;
        }
        const projectsRes = await databases.listDocuments({
          databaseId: DATABASE_CONFIG.databaseId,
          collectionId: DATABASE_CONFIG.projectsCollectionId,
          queries: [Query.equal("$id", projectIds)],
        });
        setItems(projectsRes.documents || []);
      } catch (e) {
        setError((e as any)?.message ?? "読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [isAuthenticated, user]);

  const groups = useMemo(() => {
    const ongoing = items.filter((p) => p.status === "OPEN");
    const finished = items.filter((p) => p.status === "CLOSED" || p.status === "COMPLETED");
    return { ongoing, finished };
  }, [items]);

  if (isLoading) return <div className="m-6">読み込み中...</div>;
  if (!isAuthenticated) return <div className="m-6">ログインが必要です</div>;
  if (loading) return <div className="m-6">読み込み中...</div>;
  if (error) return <div className="m-6 text-red-600">{error}</div>;

  return (
    <div className="m-6 space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-3">参加中</h2>
        {groups.ongoing.length === 0 ? (
          <div className="text-gray-500">参加中の依頼はありません</div>
        ) : (
          <Table className="border">
            <TableBody>
              {groups.ongoing.map((p: any) => (
                <TableRow key={p.$id} className="border-b">
                  <TableCell className="font-medium">
                    <Link className="text-blue-600 hover:underline" href={`/requests/${p.$id}`}>{p.title}</Link>
                  </TableCell>
                  <TableCell>{p.participation_reward}</TableCell>
                  <TableCell>{p.deadline || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">終了</h2>
        {groups.finished.length === 0 ? (
          <div className="text-gray-500">終了した依頼はありません</div>
        ) : (
          <Table className="border">
            <TableBody>
              {groups.finished.map((p: any) => (
                <TableRow key={p.$id} className="border-b">
                  <TableCell className="font-medium">
                    <Link className="text-blue-600 hover:underline" href={`/requests/${p.$id}`}>{p.title}</Link>
                  </TableCell>
                  <TableCell>{p.participation_reward}</TableCell>
                  <TableCell>{p.deadline || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}


