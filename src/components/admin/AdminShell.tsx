"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-sky-50">
      <header className="border-b border-ink-200/60 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-serif text-lg font-semibold text-ink-900">
            MyFinanz<span className="text-accent-500">Guru</span>{" "}
            <span className="text-sm font-sans font-normal text-ink-400">Admin</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-danger"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
