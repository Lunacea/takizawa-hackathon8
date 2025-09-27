import Link from "next/link";
import { HomeIcon, PlusIcon } from "lucide-react";
import { XIcon } from "lucide-react";

export default function Nav() {
  return (
    <nav className="flex gap-4 ">
      <Link href="/">
        <HomeIcon />
      </Link>
      <Link href="/post-request">
        <PlusIcon />
      </Link>
      <Link href="/error-request">
        <XIcon />
      </Link>
    </nav>
  );
}
