"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

interface GuideListItem {
  slug: string;
  title: string;
  category: string;
  date: string;
  sha: string;
}

export default function GuidesManager() {
  const [guides, setGuides] = useState<GuideListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/guides");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to load guides.");
    } else {
      setGuides(data.guides);
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching admin data on mount
    load();
  }, []);

  async function handleDelete(guide: GuideListItem) {
    if (!confirm(`Delete "${guide.title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/guides/${guide.slug}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sha: guide.sha }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to delete.");
      return;
    }
    setGuides((prev) => prev.filter((g) => g.slug !== guide.slug));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-ink-900">Guides</h1>
        <Link
          href="/admin/guides/new"
          className="flex items-center gap-1.5 accent-gradient rounded-full px-4 py-2 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          Add new
        </Link>
      </div>

      {error && <p className="mb-4 rounded-xl bg-danger-bg px-4 py-2.5 text-sm text-danger">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink-500">Loading…</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-200/60 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-sky-100 text-left text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200/60">
              {guides.map((g) => (
                <tr key={g.slug}>
                  <td className="px-4 py-3 text-ink-900">{g.title}</td>
                  <td className="px-4 py-3 text-ink-600">{g.category}</td>
                  <td className="px-4 py-3 text-ink-600">{g.date}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/guides/${g.slug}`}
                      className="mr-2 inline-block text-ink-500 hover:text-accent-600"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(g)}
                      className="text-ink-500 hover:text-danger"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {guides.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-ink-400">
                    No guides yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
