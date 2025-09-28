"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { databases, DATABASE_CONFIG, ID } from "@/lib/appwrite/appwrite";
import { useRouter } from "next/navigation";
import { uploadProjectImage, getProjectImagePreviewUrl } from "@/lib/appwrite/storage";

export default function PostRequestForm() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [participationReward, setParticipationReward] = useState("");
  const [bonusReward, setBonusReward] = useState("");
  const [bonusCondition, setBonusCondition] = useState("");
  const [requirements, setRequirements] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [deadline, setDeadline] = useState("");
  const [headcount, setHeadcount] = useState<number | ''>("");
  const [status, setStatus] = useState<'DRAFT' | 'OPEN' | 'CLOSED' | 'COMPLETED'>("DRAFT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureAuth = () => {
    if (!isAuthenticated || !user) {
      router.push(`/login?mode=login&redirect=${encodeURIComponent('/post-request')}`);
      return false;
    }
    return true;
  };

  const createProject = async (publish: boolean) => {
    if (!ensureAuth()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const descriptionToSend = [
        description,
        requirements ? `\n\n【依頼したいこと】\n${requirements}` : '',
        detail ? `\n\n【詳細】\n${detail}` : '',
      ].join('');
      const docId = ID.unique();
      let imageToSave: string | undefined = imageUrl || undefined;
      if (imageFile) {
        const fileId = await uploadProjectImage(imageFile);
        imageToSave = fileId;
      }
      const doc = await databases.createDocument({
        databaseId: DATABASE_CONFIG.databaseId,
        collectionId: DATABASE_CONFIG.projectsCollectionId,
        documentId: docId,
        data: {
          requesterId: user!.$id,
          title,
          description: descriptionToSend,
          image_url: imageToSave,
          deadline: deadline || undefined,
          headcount: headcount === '' ? undefined : Number(headcount),
          status: publish ? 'OPEN' : 'DRAFT',
          participation_reward: participationReward,
          bonus_reward: bonusReward || undefined,
          bonus_condition: bonusCondition || undefined,
          category: category || undefined,
        },
      });
      router.push(`/requests/${doc.$id}`);
    } catch (e: any) {
      setError(e?.message ?? '保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>新しいプロジェクトを作成</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); createProject(true); }}>
          <div className="flex flex-col gap-4 py-4">
            <Label>プロジェクト名</Label>
            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>プロジェクトカテゴリ</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">デザイン</SelectItem>
                <SelectItem value="2">システム開発</SelectItem>
                <SelectItem value="3">アイデア募集</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>プロジェクト概要</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>プロジェクト詳細</Label>
            <Textarea value={detail} onChange={(e) => setDetail(e.target.value)} />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>依頼したいこと</Label>
            <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>達成条件（ボーナス条件）</Label>
            <Textarea value={bonusCondition} onChange={(e) => setBonusCondition(e.target.value)} />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>希望期限</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>希望人数</Label>
            <Input type="number" value={headcount} onChange={(e) => setHeadcount(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>サムネイル画像（jpg/png/webp）</Label>
            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
            <div className="text-xs text-muted-foreground">URL入力も可（上級者向け）</div>
            <Label>画像URL（任意）</Label>
            <Input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="storageのfileId または https://..." />
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageUrl.startsWith('http') ? imageUrl : getProjectImagePreviewUrl(imageUrl)}
                  alt="preview"
                  className="h-32 w-32 object-cover border rounded"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>参加報酬</Label>
            <Input type="text" value={participationReward} onChange={(e) => setParticipationReward(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>ボーナス報酬</Label>
            <Input type="text" value={bonusReward} onChange={(e) => setBonusReward(e.target.value)} />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>ボーナス報酬条件</Label>
            <Textarea value={bonusCondition} onChange={(e) => setBonusCondition(e.target.value)} />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => createProject(false)}>下書き保存</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? '作成中...' : 'プロジェクト作成'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
