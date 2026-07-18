"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import type { Seminar } from "@/lib/content";

type DraftSeminar = Omit<Seminar, "id"> & { id: string };

const EMPTY_DRAFT: DraftSeminar = {
  id: "",
  title: "",
  description: "",
  date: "",
  durationMin: 60,
  host: "MyFinanzGuru Team",
  registrationUrl: "/book",
  isPast: false,
};

export default function SeminarsManager() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [sha, setSha] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState<DraftSeminar | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/seminars");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to load seminars.");
    } else {
      setSeminars(data.seminars);
      setSha(data.sha);
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching admin data on mount
    load();
  }, []);

  async function persist(next: Seminar[], message: string) {
    setSaving(true);
    setError(null);
    const previous = seminars;
    setSeminars(next); // optimistic

    const res = await fetch("/api/admin/seminars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seminars: next, sha, commitMessage: message }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setSeminars(previous); // rollback
      if (data.conflict) {
        setError("This file changed elsewhere — reloading the latest version.");
        await load();
      } else {
        setError(data.error ?? "Failed to save.");
      }
      return false;
    }

    setSha(data.sha);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
    return true;
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this seminar?")) return;
    const target = seminars.find((s) => s.id === id);
    await persist(
      seminars.filter((s) => s.id !== id),
      `content: delete seminar "${target?.title ?? id}"`
    );
  }

  async function handleSaveDraft(draftToSave: DraftSeminar) {
    const isNew = !seminars.some((s) => s.id === draftToSave.id);
    const next = isNew
      ? [...seminars, draftToSave]
      : seminars.map((s) => (s.id === draftToSave.id ? draftToSave : s));

    const ok = await persist(
      next,
      `content: ${isNew ? "add" : "update"} seminar "${draftToSave.title}"`
    );
    if (ok) setDraft(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-ink-900">Seminars</h1>
        <button
          type="button"
          onClick={() =>
            setDraft({ ...EMPTY_DRAFT, id: `sem-${Date.now()}` })
          }
          className="flex items-center gap-1.5 accent-gradient rounded-full px-4 py-2 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          Add new
        </button>
      </div>

      {saved && (
        <p className="mb-4 rounded-xl bg-success-bg px-4 py-2.5 text-sm text-success">
          Saved ✓ — changes go live in about 2 minutes.
        </p>
      )}
      {error && <p className="mb-4 rounded-xl bg-danger-bg px-4 py-2.5 text-sm text-danger">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink-500">Loading…</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-200/60 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-sky-100 text-left text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200/60">
              {seminars.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 text-ink-900">{s.title}</td>
                  <td className="px-4 py-3 text-ink-600">
                    {new Date(s.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs ${
                        s.isPast ? "bg-ink-200 text-ink-600" : "bg-success-bg text-success"
                      }`}
                    >
                      {s.isPast ? "Past" : "Upcoming"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setDraft(s)}
                      className="mr-2 text-ink-500 hover:text-accent-600"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4 inline" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      className="text-ink-500 hover:text-danger"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {seminars.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-ink-400">
                    No seminars yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {draft && (
        <SeminarDrawer
          draft={draft}
          saving={saving}
          onClose={() => setDraft(null)}
          onSave={handleSaveDraft}
        />
      )}
    </div>
  );
}

function SeminarDrawer({
  draft,
  saving,
  onClose,
  onSave,
}: {
  draft: DraftSeminar;
  saving: boolean;
  onClose: () => void;
  onSave: (draft: DraftSeminar) => void;
}) {
  const [form, setForm] = useState(draft);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink-900/40">
      <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <p className="font-serif text-xl text-ink-900">Seminar</p>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-ink-500" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Field label="Title">
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Description">
            <textarea
              className="input min-h-[100px]"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <Field label="Date & time">
            <input
              type="datetime-local"
              className="input"
              value={form.date ? form.date.slice(0, 16) : ""}
              onChange={(e) => setForm({ ...form, date: new Date(e.target.value).toISOString() })}
            />
          </Field>
          <Field label="Duration (minutes)">
            <input
              type="number"
              className="input"
              value={form.durationMin}
              onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })}
            />
          </Field>
          <Field label="Host">
            <input
              className="input"
              value={form.host}
              onChange={(e) => setForm({ ...form, host: e.target.value })}
            />
          </Field>
          <Field label="Registration URL">
            <input
              className="input"
              value={form.registrationUrl}
              onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })}
            />
          </Field>
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink-800">Mark as past</span>
            <input
              type="checkbox"
              checked={form.isPast}
              onChange={(e) => setForm({ ...form, isPast: e.target.checked })}
              className="h-4 w-4 accent-accent-500"
            />
          </label>

          <button
            type="button"
            disabled={saving || !form.title || !form.date}
            onClick={() => onSave(form)}
            className="mt-2 accent-gradient rounded-full px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid var(--color-ink-200);
          border-radius: 0.75rem;
          padding: 0.5rem 0.875rem;
          font-size: 0.875rem;
        }
        .input:focus-visible {
          outline: 2px solid var(--color-accent-500);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-800">{label}</span>
      {children}
    </label>
  );
}
