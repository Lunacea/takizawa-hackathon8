'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserMenu() {
  const { user, profile, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />;
  }

  if (!isAuthenticated || !user || !profile) {
    return (
      <div className="flex gap-2">
        <a href={`/login?mode=login&redirect=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/')}`}>
          <Button asChild variant="outline" size="sm">
            <span>ログイン</span>
          </Button>
        </a>
        <a href={`/login?mode=signup&redirect=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/')}`}>
          <Button asChild size="sm">
            <span>新規登録</span>
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar className="w-8 h-8">
        <AvatarImage src={profile.avatar_url || '/KoeTasu-light.png'} alt={profile.username || 'user'} />
        <AvatarFallback>{(profile.username?.charAt(0).toUpperCase()) ?? '?'}</AvatarFallback>
      </Avatar>
      <div className="hidden md:block">
        <p className="text-sm font-medium">{profile.username ?? 'ユーザー'}</p>
        <p className="text-xs text-muted-foreground">{profile.role}</p>
      </div>
      <Button variant="outline" size="sm" onClick={logout}>
        ログアウト
      </Button>
    </div>
  );
}
