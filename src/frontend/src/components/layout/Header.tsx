import Nav from "@/components/layout/Nav";
import ThemeToggle from "@/components/layout/ThemeToggle";
import UserMenu from "@/components/layout/UserMenu";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border">
      <Link href="/">ボランティア募集アプリ（仮）</Link>
      <div className="flex items-center gap-4">
        <Nav />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
