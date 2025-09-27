"use client";

import Link from "next/link";
import { useState } from "react";
import { HomeIcon, PlusIcon, XIcon, MenuIcon } from "lucide-react";

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
    label: "ホーム",
    icon: HomeIcon,
  },
  {
    href: "/post-request",
    label: "投稿リクエスト",
    icon: PlusIcon,
  },
  {
    href: "/error-request",
    label: "エラーリクエスト",
    icon: XIcon,
  },
];

// スタイル定数
const styles = {
  desktopLink: "flex items-center gap-2 hover:text-primary transition-colors",
  mobileLink: "flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
  hamburgerButton: "flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
  closeButton: "flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
  icon: "w-5 h-5",
  hamburgerIcon: "w-6 h-6",
} as const;

// ナビゲーションリンクコンポーネント
interface NavLinkProps {
  item: NavItem;
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
}

function NavLink({ item, onClick, className, iconClassName }: NavLinkProps) {
  const IconComponent = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={className}
    >
      <IconComponent className={iconClassName} />
      <span>{item.label}</span>
    </Link>
  );
}

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="relative">
      {/* デスクトップ用ナビゲーション */}
      <div className="hidden md:flex gap-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            className={styles.desktopLink}
            iconClassName={styles.icon}
          />
        ))}
      </div>

      {/* モバイル用ハンバーガーメニュー */}
      <div className="md:hidden">
        {/* ハンバーガーボタン */}
        <button
          onClick={toggleMenu}
          className={styles.hamburgerButton}
          aria-label="メニューを開く"
        >
          <MenuIcon className={styles.hamburgerIcon} />
        </button>

        {/* オーバーレイ */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeMenu}
          />
        )}

        {/* メニュー */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex flex-col h-full">
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold">メニュー</h2>
              <button
                onClick={closeMenu}
                className={styles.closeButton}
                aria-label="メニューを閉じる"
              >
                <XIcon className={styles.icon} />
              </button>
            </div>

            {/* ナビゲーションリンク */}
            <div className="flex-1 p-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    onClick={closeMenu}
                    className={styles.mobileLink}
                    iconClassName={styles.icon}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
