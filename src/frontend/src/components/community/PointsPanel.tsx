"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getProjectPointsTotal, grantPoints, listProjectParticipants } from "@/lib/appwrite/points";
import { getUsernames } from "@/lib/appwrite/profiles";

interface Props { projectId: string }

export default function PointsPanel({ projectId }: Props) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [projectTotal, setProjectTotal] = useState<number>(0);
  const [participants, setParticipants] = useState<{ userId: string; name?: string }[]>([]);
  const [baseAmount, setBaseAmount] = useState<string>("0");
  const [bonusAmount, setBonusAmount] = useState<string>("0");
  const [bonusUserId, setBonusUserId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = useMemo(() => isAuthenticated && !!user, [isAuthenticated, user]);

  const refresh = async () => {
    if (!projectId || !isLoggedIn) return;
    setError(null);
    try {
      const total = await getProjectPointsTotal(projectId);
      setProjectTotal(total);
      const part = await listProjectParticipants(projectId);
      const idMap = await getUsernames(part.map((p) => p.userId));
      setParticipants(part.map((p) => ({ ...p, name: idMap[p.userId] || p.userId })));
    } catch (e: any) {
      setError(e?.message || '読み込みに失敗しました');
    }
  };

  useEffect(() => { refresh(); }, [projectId, isLoggedIn]);

  const awardBase = async () => {
    const amt = parseInt(baseAmount, 10) || 0;
    if (!isLoggedIn || amt === 0) return;
    setSubmitting(true);
    try {
      // 参加者全員に一律付与
      for (const p of participants) {
        await grantPoints({ projectId, userId: p.userId, amount: amt, description: "COMPLETION_REWARD" });
      }
      await refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const awardBonus = async () => {
    const amt = parseInt(bonusAmount, 10) || 0;
    if (!isLoggedIn || amt === 0 || !bonusUserId) return;
    setSubmitting(true);
    try {
      await grantPoints({ projectId, userId: bonusUserId, amount: amt, description: "BONUS_REWARD" });
      await refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">ポイント</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}
        <div className="text-sm">このプロジェクトで付与済み合計: <span className="font-semibold">{projectTotal}</span> pt</div>

        <div className="space-y-2">
          <div className="text-sm font-medium">完了報酬（全参加者に付与）</div>
          <div className="flex gap-2 items-center">
            <label htmlFor="baseAmount" className="text-sm text-gray-700">ポイント</label>
            <input id="baseAmount" className="border rounded p-2 text-sm w-28" type="number" value={baseAmount} onChange={(e) => setBaseAmount(e.target.value)} placeholder="0" />
            <Button disabled={!isLoggedIn || submitting || isLoading} onClick={awardBase}>一括付与</Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">ボーナス（参加者から選択して付与）</div>
          <div className="flex gap-2 items-center">
            <label htmlFor="bonusUser" className="text-sm text-gray-700">対象</label>
            <select id="bonusUser" className="border rounded p-2 text-sm flex-1" value={bonusUserId} onChange={(e) => setBonusUserId(e.target.value)} title="ボーナス付与対象">
              <option value="">参加者を選択</option>
              {participants.map((p) => (
                <option key={p.userId} value={p.userId}>{p.name}</option>
              ))}
            </select>
            <label htmlFor="bonusAmount" className="text-sm text-gray-700">ポイント</label>
            <input id="bonusAmount" className="border rounded p-2 text-sm w-28" type="number" value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)} placeholder="0" />
            <Button disabled={!isLoggedIn || submitting || isLoading || !bonusUserId} onClick={awardBonus}>付与</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-gray-500">権限に応じて実行可能。履歴の一覧・取消は今後追加可能。</div>
      </CardFooter>
    </Card>
  );
}


