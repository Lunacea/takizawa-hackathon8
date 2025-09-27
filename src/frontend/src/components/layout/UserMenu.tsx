"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";

export default function UserMenu() {
  return (
    <Avatar className="size-8" onClick={() => {
      console.log("UserMenu");
    }}>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>
        <UserIcon className="size-8" />
      </AvatarFallback>
    </Avatar>
  );
}
