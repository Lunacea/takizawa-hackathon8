"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { databases, DATABASE_CONFIG, ID, Query } from "@/lib/appwrite/appwrite";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { getProjectImagePreviewUrl } from "@/lib/appwrite/storage";
import CommentSection from "@/components/comment/CommentSection.jsx";

// --- アイコンのインポート（修正あり） ---
import {
  User,
  Gift,
  Calendar,
  Users,
  Award,
  CheckCircle,
  FileText,
  ListOrdered, // 修正: ListDetails -> ListOrdered
  Target,
} from "lucide-react";

export default function RequestDetail() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  useEffect(() => {
    // ... (データ取得ロジックは変更なし) ...
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
        } catch {
          setProfile(null);
        }

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
        }
      } catch (e: any) {
        setError(e?.message ?? "読み込みに失敗しました");
      }
    };
    if (slug) fetchData();
  }, [slug, isAuthenticated, user]);

  if (error) return <div className="m-8 text-red-600">{error}</div>;
  if (!data) return <div className="m-8">読み込み中...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* ヘッダーセクション (変更なし) */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-2xl shadow-md">
         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {data.title}
            </h1>
            <p className="mt-2 text-lg text-gray-600">{data.status}</p>
          </div>

          <div className="flex gap-3">
            <Button
              className="bg-red-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-400 disabled:opacity-60"
              disabled={isJoining || isLoading || alreadyJoined}
              onClick={async () => {
                setJoinMessage("");
                if (!isAuthenticated) {
                  if (typeof window !== "undefined") {
                    window.location.href = `/login?redirect=/requests/${slug}`;
                  }
                  return;
                }
                if (!slug || !user?.$id) {
                  setJoinMessage("ユーザー情報の取得に失敗しました。再度ログインしてください。");
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
                } catch (e: any) {
                  const msg = e?.message || "参加に失敗しました";
                  if (/unique|already|exists|duplicate/i.test(msg)) {
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
                className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-500"
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
      </div>

      {/* 説明セクション */}
      <StructuredDescription description={data.description} />

      {/* 画像 (変更なし) */}
      {data.image_url && (
         <div className="flex justify-center">
          <img
            className="w-full max-w-2xl rounded-lg shadow"
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

      {/* 詳細情報カード (変更なし) */}
      <section className="bg-white shadow rounded-2xl p-6">
         <h2 className="text-xl font-semibold mb-4 text-gray-800">
          プロジェクト情報
        </h2>
        <ul className="space-y-3">
          <InfoRow icon={<User size={18} />} label="依頼者" value={profile?.username || data.requesterId} />
          <InfoRow icon={<Gift size={18} />} label="参加報酬" value={data.participation_reward} />
          {data.category && (
            <InfoRow icon={<Award size={18} />} label="カテゴリ" value={data.category} />
          )}
          {data.deadline && (
            <InfoRow icon={<Calendar size={18} />} label="期限" value={data.deadline} />
          )}
          {typeof data.headcount !== "undefined" && (
            <InfoRow icon={<Users size={18} />} label="募集人数" value={String(data.headcount)} />
          )}
          {data.bonus_reward && (
            <InfoRow icon={<Gift size={18} />} label="ボーナス報酬" value={data.bonus_reward} />
          )}
          {data.bonus_condition && (
            <InfoRow icon={<CheckCircle size={18} />} label="ボーナス条件" value={data.bonus_condition} />
          )}
        </ul>
      </section>

      {/* Join Message & Comment Section (変更なし) */}
      {joinMessage && (
        <div className="p-4 text-sm text-blue-700 bg-blue-50 rounded">
          {joinMessage}
        </div>
      )}
      <CommentSection projectId={String(slug)} />
    </div>
  );
}

// --- 説明セクションのコンポーネント ---
function StructuredDescription({ description }: { description: string }) {
  if (!description) {
    return null;
  }

  const parts = description.split(/\n\s*\n/);
  const [overview, details, requestTasks] = parts;

  return (
    <section className="bg-white shadow rounded-2xl p-6 space-y-6">
      <DescriptionPart icon={<FileText />} title="概要" content={overview} />
      <DescriptionPart icon={<ListOrdered />} title="詳細" content={requestTasks.replace("【詳細】","").trimStart() } /> {/* 修正: ListDetails -> ListOrdered */}
      <DescriptionPart icon={<Target />} title="依頼したいこと" content={details.replace("【依頼したいこと】","").trimStart()} />
    </section>
  );
}

// 説明の各パートを表示するための小さなコンポーネント
function DescriptionPart({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content?: string;
}) {
  if (!content) {
    return null;
  }

  return (
    <div>
      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-2">
        <span className="text-blue-600">{icon}</span>
        {title}
      </h3>
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap pl-8">
        {content}
      </p>
    </div>
  );
}

/* 補助コンポーネント：情報行 (変更なし) */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
    return (
    <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <span className="text-gray-600">{icon}</span>
      <span className="font-medium text-gray-800 w-28">{label}</span>
      <span className="text-gray-700">{value}</span>
    </li>
  );
}