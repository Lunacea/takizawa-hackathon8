"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export default function UserMenu() {
  const { user, isLoading, logout } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  if (isLoading) {
    return (
      <Avatar className="size-8">
        <AvatarFallback>
          <UserIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-8" onClick={() => {
        console.log("UserMenu clicked", user);
      }}>
        <AvatarImage src={user?.avatar_url} />
        <AvatarFallback>
          {user?.username ? user.username.charAt(0).toUpperCase() : <UserIcon className="size-4" />}
        </AvatarFallback>
      </Avatar>
      {user && (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user.username}</span>
          <span className="text-xs text-muted-foreground">{user.role}</span>
        </div>
      )}
      <button
        onClick={handleLogout}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        ログアウト
      </button>
    </div>
  );
}
