"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Upload } from "lucide-react";

interface Frontmatter {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  cover: string;
  pdf: string;
}

const EMPTY: Frontmatter = {
  title: "",
  slug: "",
  category: "",
  excerpt: "",
  date: new Date().toISOString().slice(0, 10),
  readTime: "5 min",
  cover: "",
  pdf: "",
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function GuideEditor({ slug }: { slug: string }) {
  const isNew = slug === "new";
  const router = useRouter();

  const [frontmatter, setFrontmatter] = useState<Frontmatter>(EMPTY);
  const [content, setContent] = useState("");
  const [sha, setSha] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"cover" | "pdf" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const res = await fetch(`/api/admin/guides/${slug}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to load guide.");
        setLoading(false);
        return;
      }
      setFrontmatter({ ...EMPTY, ...data.frontmatter, slug });
      setContent(data.content);
      setSha(data.sha);
      setLoading(false);
    })();
  }, [slug, isNew]);

  useEffect(() => {
    function warnOnLeave(e: BeforeUnloadEvent) {
      if (dirty) e.preventDefault();
    }
    window.addEventListener("beforeunload", warnOnLeave);
    return () => window.removeEventListener("beforeunload", warnOnLeave);
  }, [dirty]);

  const update = useCallback(<K extends keyof Frontmatter>(key: K, value: Frontmatter[K]) => {
    setDirty(true);
    setFrontmatter((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && isNew) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }, [isNew]);

  async function handleUpload(file: File, target: "cover" | "pdf") {
    setUploading(target);
    setError(null);
    const base64 = await fileToBase64(file);
    const res = await fetch("/api/admin/uploads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, base64, contentType: file.type }),
    });
    const data = await res.json();
    setUploading(null);
    if (!res.ok) {
      setError(data.error ?? "Upload failed.");
      return;
    }
    update(target, data.url);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const targetSlug = frontmatter.slug || slugify(frontmatter.title);
    const res = await fetch(`/api/admin/guides/${targetSlug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        frontmatter: { ...frontmatter, slug: targetSlug },
        content,
        sha,
        commitMessage: `content: ${isNew ? "add" : "update"} guide "${frontmatter.title}"`,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to save.");
      return;
    }

    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);

    if (isNew) {
      router.push(`/admin/guides/${targetSlug}`);
    } else {
      setSha(data.sha);
    }
  }

  if (loading) return <p className="text-sm text-ink-500">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-ink-900">{isNew ? "New guide" : frontmatter.title}</h1>
        <button
          type="button"
          disabled={saving || !frontmatter.title}
          onClick={handleSave}
          className="accent-gradient rounded-full px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {saved && (
        <p className="mb-4 rounded-xl bg-success-bg px-4 py-2.5 text-sm text-success">
          Saved ✓ — changes go live in about 2 minutes.
        </p>
      )}
      {error && <p className="mb-4 rounded-xl bg-danger-bg px-4 py-2.5 text-sm text-danger">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <FField label="Title">
          <input className="input" value={frontmatter.title} onChange={(e) => update("title", e.target.value)} />
        </FField>
        <FField label="Slug">
          <input className="input" value={frontmatter.slug} onChange={(e) => update("slug", e.target.value)} disabled={!isNew} />
        </FField>
        <FField label="Category">
          <input className="input" value={frontmatter.category} onChange={(e) => update("category", e.target.value)} />
        </FField>
        <FField label="Read time">
          <input className="input" value={frontmatter.readTime} onChange={(e) => update("readTime", e.target.value)} />
        </FField>
        <FField label="Date">
          <input type="date" className="input" value={frontmatter.date} onChange={(e) => update("date", e.target.value)} />
        </FField>
        <FField label="Excerpt">
          <input className="input" value={frontmatter.excerpt} onChange={(e) => update("excerpt", e.target.value)} />
        </FField>
        <FField label="Cover image">
          <UploadField
            value={frontmatter.cover}
            uploading={uploading === "cover"}
            accept="image/png,image/jpeg,image/webp"
            onUpload={(f) => handleUpload(f, "cover")}
          />
        </FField>
        <FField label="Attached PDF">
          <UploadField
            value={frontmatter.pdf}
            uploading={uploading === "pdf"}
            accept="application/pdf"
            onUpload={(f) => handleUpload(f, "pdf")}
          />
        </FField>
      </div>

      <p className="text-sm font-medium text-ink-800 mb-2">Body (Markdown)</p>
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setDirty(true);
          }}
          className="input min-h-[500px] font-mono text-xs leading-relaxed"
        />
        <div className="rounded-xl border border-ink-200 p-4 overflow-y-auto max-h-[500px] prose-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "*Nothing to preview yet.*"}</ReactMarkdown>
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
        .input:disabled {
          background: var(--color-sky-100);
          color: var(--color-ink-400);
        }
      `}</style>
    </div>
  );
}

function UploadField({
  value,
  uploading,
  accept,
  onUpload,
}: {
  value: string;
  uploading: boolean;
  accept: string;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 hover:border-accent-500">
        <Upload className="h-3.5 w-3.5" />
        {uploading ? "Uploading…" : "Choose file"}
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
          }}
        />
      </label>
      {value && (
        <a href={value} target="_blank" rel="noreferrer" className="truncate text-xs text-accent-600 underline">
          {value.split("/").pop()}
        </a>
      )}
    </div>
  );
}

function FField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-800">{label}</span>
      {children}
    </label>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
