"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListIcon, PlusIcon, HandshakeIcon, GiftIcon } from "lucide-react";

// ナビゲーションアイテムの型定義
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// ナビゲーションアイテムのデータ
const navItems: NavItem[] = [
  {
    href: "/",
    label: "リクエスト一覧",
    icon: ListIcon,
  },
  {
    href: "/post-request",
    label: "依頼を投稿",
    icon: PlusIcon,
  },
  {
    href: "/requests/participating",
    label: "参加中の依頼",
    icon: HandshakeIcon,
  },
  {
    href: "/exchange",
    label: "ポイントと交換",
    icon: GiftIcon,
  },
];

// スタイル定数（タブバー用）
const styles = {
  container: "border-gray-200 dark:border-gray-800 border-b",
  tabBar: "flex items-center justify-between",
  tabLink: "flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors border-b-2 border-transparent select-none",
  icon: "w-5 h-5",
  active: "text-primary border-primary border-b-4 cursor-default pointer-events-none",
  inactive: "text-gray-600 dark:text-gray-300 hover:text-primary",
} as const;

// ナビゲーションリンクコンポーネント
interface NavLinkProps {
  item: NavItem;
  active: boolean;
}

function NavLink({ item, active }: NavLinkProps) {
  const IconComponent = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      aria-disabled={active || undefined}
      tabIndex={active ? -1 : 0}
      className={`${styles.tabLink} ${active ? styles.active : styles.inactive}`}
    >
      <IconComponent className={styles.icon} />
      <span>{item.label}</span>
    </Link>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="w-full bg-gray-100 dark:bg-gray-900" aria-label="メインタブ ナビゲーション">
      <div className={styles.container}>
        <div className={styles.tabBar}>
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </div>
      </div>
    </nav>
  );
}
