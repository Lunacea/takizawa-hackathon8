"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { databases, DATABASE_CONFIG } from "@/lib/appwrite/appwrite";

export default function EditProfilePage() {
  const { user, profile, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
      setBio(profile.bio ?? "");
    }
  }, [profile]);

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>プロフィール編集</CardTitle>
          </CardHeader>
          <CardContent>ログインが必要です。</CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      await databases.updateDocument({
        databaseId: DATABASE_CONFIG.databaseId,
        collectionId: DATABASE_CONFIG.profilesCollectionId,
        documentId: user.$id,
        data: {
          username,
          avatar_url: avatarUrl || undefined,
          bio: bio || undefined,
        },
      });
      setMessage("保存しました");
    } catch (err: any) {
      setMessage(err?.message ?? "エラーが発生しました");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>プロフィール編集</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSave}>
            <div>
              <Label htmlFor="username">ユーザー名</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="avatarUrl">アバターURL</Label>
              <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="bio">自己紹介</Label>
              <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            {message && <div className="text-sm text-muted-foreground">{message}</div>}
            <Button type="submit" disabled={isSaving}>{isSaving ? "保存中..." : "保存"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


