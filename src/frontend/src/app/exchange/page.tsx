"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getUserPointsTotal, listUserPointHistory, redeemPoints, type RedemptionItem } from "@/lib/appwrite/points";

const CATALOG: RedemptionItem[] = [
  { id: "thanks", title: "お礼メッセージ", cost: 50, description: "運営からの感謝メッセージ" },
  { id: "coupon500", title: "地域クーポン500円分", cost: 500, description: "提携店舗で利用可能" },
  { id: "badge", title: "スペシャルバッジ", cost: 200, description: "プロフィールに表示" },
];

export default function ExchangePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isLoggedIn = useMemo(() => isAuthenticated && !!user, [isAuthenticated, user]);

  const refresh = async () => {
    setError(null);
    setMessage(null);
    if (!isLoggedIn || !user) return;
    try {
      const total = await getUserPointsTotal(user.$id);
      setBalance(total);
      const hist = await listUserPointHistory(user.$id);
      setHistory(hist);
    } catch (e: any) {
      setError(e?.message || "読み込みに失敗しました");
    }
  };

  useEffect(() => { refresh(); }, [isLoggedIn, user?.$id]);

  const onRedeem = async (item: RedemptionItem) => {
    if (!isLoggedIn || !user) return;
    if (balance < item.cost) { setMessage("ポイントが不足しています"); return; }
    setSubmitting(item.id);
    setError(null);
    setMessage(null);
    try {
      await redeemPoints({ userId: user.$id, item });
      setMessage(`${item.title} と交換しました`);
      await refresh();
    } catch (e: any) {
      setError(e?.message || "交換に失敗しました");
    } finally {
      setSubmitting(null);
    }
  };

  if (isLoading) return <div className="m-6">読み込み中...</div>;
  if (!isLoggedIn) return <div className="m-6">ログインが必要です</div>;

  return (
    <div className="m-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">交換カタログ</h2>
            <p className="text-sm text-gray-500">READMEの方針に沿い、シンプルな交換デモです</p>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            {CATALOG.map((item) => (
              <div key={item.id} className="border rounded p-3 flex flex-col gap-2">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
                <div className="text-sm">必要ポイント: <span className="font-semibold">{item.cost}</span> pt</div>
                <Button disabled={submitting === item.id || balance < item.cost} onClick={() => onRedeem(item)}>
                  {submitting === item.id ? "処理中..." : "交換する"}
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            {error && <div className="text-sm text-red-600">{error}</div>}
            {message && <div className="text-sm text-green-600">{message}</div>}
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">現在のポイント</h2>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{balance} pt</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={refresh}>更新</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">履歴</h2>
          </CardHeader>
          <CardContent className="space-y-2">
            {history.length === 0 ? (
              <div className="text-sm text-gray-500">履歴がありません</div>
            ) : (
              history.map((h) => (
                <div key={h.$id} className="text-sm flex justify-between">
                  <span>{new Date(h.$createdAt).toLocaleString()}</span>
                  <span>{h.description}</span>
                  <span className={h.amount >= 0 ? "text-green-600" : "text-red-600"}>{h.amount}pt</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}