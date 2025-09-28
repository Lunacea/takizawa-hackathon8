"use client";

import Nav from "@/components/layout/Nav";
import ThemeToggle from "@/components/layout/ThemeToggle";
import UserMenu from "@/components/layout/UserMenu";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
export default function Header() {

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(localStorage.getItem("theme") === "dark");
  }, [isDark]);
  return (
    <header>
      <div className="px-4 py-2 my-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src={isDark ? "/KoeTasu-dark.png" : "/KoeTasu-light.png"} alt="KOETASU" width={32} height={32} />
            <span className="text-2xl font-bold">KOETASU</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
      <Nav />
    </header>
  );
}
