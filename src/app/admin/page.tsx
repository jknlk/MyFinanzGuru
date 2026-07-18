import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, BookOpen } from "lucide-react";
import { getSession } from "@/lib/session";
import LoginForm from "@/components/admin/LoginForm";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    return <LoginForm />;
  }

  return (
    <AdminShell>
      <h1 className="font-serif text-2xl text-ink-900 mb-1">Dashboard</h1>
      <p className="text-sm text-ink-500 mb-8">
        Every save here commits directly to the repository and triggers a Vercel redeploy
        (~1–2 minutes to go live).
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Link
          href="/admin/seminars"
          className="rounded-2xl border border-ink-200/60 bg-white p-6 hover:border-accent-400 hover:shadow-sm transition-all"
        >
          <CalendarDays className="h-6 w-6 text-accent-600" />
          <p className="mt-3 font-serif text-lg text-ink-900">Seminars</p>
          <p className="mt-1 text-sm text-ink-500">Manage upcoming and past webinars.</p>
        </Link>
        <Link
          href="/admin/guides"
          className="rounded-2xl border border-ink-200/60 bg-white p-6 hover:border-accent-400 hover:shadow-sm transition-all"
        >
          <BookOpen className="h-6 w-6 text-accent-600" />
          <p className="mt-3 font-serif text-lg text-ink-900">Guides</p>
          <p className="mt-1 text-sm text-ink-500">Write and edit guide articles.</p>
        </Link>
      </div>
    </AdminShell>
  );
}
