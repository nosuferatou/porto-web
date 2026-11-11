"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PixelCard, PixelButton, PixelFrame } from "@/components/ui";
import { AdminAlert, AdminAlertMessage } from "@/components/admin/AdminAlert";

export interface PostFormData {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  thumbnailUrl: string;
  tags: string[];
  role: string;
  tools: string[];
  externalLink: string;
  githubLink: string;
  status: "published" | "draft";
  featured: boolean;
  glyph: string;
}

interface PostFormProps {
  initialData?: PostFormData;
  isEdit?: boolean;
}

const inputCls =
  "w-full px-3 py-2 bg-[#0B0A10] border-2 border-[var(--color-border-subtle)] text-[var(--color-text-bone)] font-mono text-xs focus:border-[var(--color-accent-gold)] focus:outline-none";

const labelCls =
  "block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1";

const GLYPH_OPTIONS = ["⚔️", "📖", "🛡️", "🏰", "⚡", "🃏", "✦", "🔮", "📜", "🏆"];

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const near = len > max * 0.85;
  const over = len > max;
  return (
    <span
      className={`font-mono text-[10px] ${
        over
          ? "text-[#E05368]"
          : near
          ? "text-[var(--color-accent-gold)]"
          : "text-[var(--color-text-ash)]"
      }`}
    >
      {len}/{max}
    </span>
  );
}

export const PostForm: React.FC<PostFormProps> = ({
  initialData,
  isEdit = false,
}) => {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(
    initialData?.category || "Web Engineering"
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData?.thumbnailUrl || ""
  );
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") || ""
  );
  const [role, setRole] = useState(initialData?.role || "");
  const [selectedTools, setSelectedTools] = useState<string[]>(
    initialData?.tools || []
  );
  const [availableTools, setAvailableTools] = useState<string[]>(() =>
  Array.from(
    new Set([
      "Photoshop",
      "Illustrator",
      "Figma",
      "Next.js",
      "TypeScript",
      "Kotlin",
      "Blender",
      ...(initialData?.tools ?? []),
    ])
  )
);
  const [externalLink, setExternalLink] = useState(
    initialData?.externalLink || ""
  );
  const [githubLink, setGithubLink] = useState(initialData?.githubLink || "");
  const [status, setStatus] = useState<"published" | "draft">(
    initialData?.status || "published"
  );
  const [featured, setFeatured] = useState<boolean>(
    initialData?.featured || false
  );
  const [glyph, setGlyph] = useState(initialData?.glyph || "⚔️");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<AdminAlertMessage | null>(null);

  // Dynamic categories fetched from the database
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.categories) && d.categories.length > 0) {
          setCategories(d.categories);
        }
      })
      .catch(() => {});
  }, []);

  // Dynamic tools fetched from the Skills CMS (extensible without code changes)
  useEffect(() => {
    fetch("/api/admin/skills")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.skills)) {
          const names = d.skills
            .map((s: { name?: string }) => s.name)
            .filter(Boolean) as string[];
          setAvailableTools((prev) =>
            Array.from(new Set([...prev, ...names]))
          );
        }
      })
      .catch(() => {});
  }, []);



  const handleTitleChange = (val: string) => {
    setTitle(val);
    // Auto-generate slug on create only, and only while user hasn't edited it
    if (!isEdit && !slug) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
      setSlug(generated);
    }
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setAlert(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ text: data.error || "Upload failed.", type: "error" });
      } else {
        setThumbnailUrl(data.url);
        setAlert({ text: "Thumbnail uploaded.", type: "success" });
      }
    } catch {
      setAlert({ text: "Failed to upload image relic.", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const buildPayload = (overrideStatus?: "published" | "draft") => {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const tools = Array.from(new Set(selectedTools.map((t) => t.trim()).filter(Boolean)));

    return {
      title,
      slug,
      summary,
      content,
      category,
      thumbnailUrl,
      tags,
      role,
      tools,
      externalLink,
      githubLink,
      status: overrideStatus ?? status,
      featured,
      glyph,
    };
  };

  const handleSubmit = async (
    e: React.FormEvent,
    overrideStatus?: "published" | "draft"
  ) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setAlert(null);

    if (!title.trim()) {
      setAlert({ text: "Manuscript title is required.", type: "error" });
      setSaving(false);
      return;
    }
    if (!summary.trim()) {
      setAlert({ text: "Summary excerpt is required.", type: "error" });
      setSaving(false);
      return;
    }

    const endpoint = isEdit
      ? `/api/admin/posts/${initialData?.id}`
      : "/api/admin/posts";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(overrideStatus)),
      });

      const data = await res.json();
      if (!res.ok) {
        setAlert({
          text: data.error || "Failed to commit manuscript.",
          type: "error",
        });
        setSaving(false);
        return;
      }

      router.push("/admin/posts");
      router.refresh();
    } catch {
      setAlert({ text: "Communication failed with the Sanctum.", type: "error" });
      setSaving(false);
    }
  };

  const handleSaveAsDraft = () => {
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    handleSubmit(syntheticEvent, "draft");
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
      <AdminAlert message={alert} />

      <PixelCard variant="default" cornerStuds className="p-6 space-y-4">
        {/* ── Title & Slug ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="post-title" className={labelCls}>
                Manuscript Title
              </label>
              <CharCount value={title} max={200} />
            </div>
            <input
              id="post-title"
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Grimoire of the Void"
              maxLength={200}
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="post-slug" className={labelCls}>
              Codex Slug
            </label>
            <input
              id="post-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="grimoire-of-the-void"
              maxLength={200}
              className={inputCls}
            />
            <p className="font-mono text-[10px] text-[var(--color-text-ash)] mt-1">
              Public URL: /posts/{slug || "your-slug"}
            </p>
          </div>
        </div>

        {/* ── Category, Glyph, Status ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="post-category" className={labelCls}>
              Category
            </label>
            {categories.length === 0 ? (
              <div className="space-y-1">
                <input
                  id="post-category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Web Engineering"
                  maxLength={100}
                  className={inputCls}
                />
                <p className="font-mono text-[10px] text-[var(--color-text-ash)]">
                  No categories yet.{" "}
                  <Link href="/admin/categories" className="text-[var(--color-accent-gold)] hover:underline">
                    Create one
                  </Link>{" "}
                  first, or type a name manually.
                </p>
              </div>
            ) : (
              <select
                id="post-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              >
                {/* Preserve the value if it doesn't match any DB category */}
                {!categories.some((c) => c.name === category) && category && (
                  <option value={category}>{category} (legacy)</option>
                )}
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="post-glyph" className={labelCls}>
              Emblem Glyph
            </label>
            <select
              id="post-glyph"
              value={glyph}
              onChange={(e) => setGlyph(e.target.value)}
              className={inputCls}
            >
              {!GLYPH_OPTIONS.includes(glyph) && glyph && (
                <option value={glyph}>{glyph} (current)</option>
              )}
              {GLYPH_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="post-status" className={labelCls}>
              Status
            </label>
            <select
              id="post-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "published" | "draft")}
              className={inputCls}
            >
              <option value="published">Published (Visible)</option>
              <option value="draft">Draft (Hidden)</option>
            </select>
          </div>
        </div>

        {/* ── Thumbnail Upload ── */}
        <div className="p-4 bg-[#100D16] border border-[var(--color-border-gothic)] space-y-3">
          <label htmlFor="thumbnail-file" className="block font-pixel text-xs text-[var(--color-accent-gold)] uppercase tracking-wider">
            Thumbnail Image
          </label>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {thumbnailUrl && (
              <PixelFrame variant="gold" aspectRatio="video" className="w-36 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover pixelated"
                />
              </PixelFrame>
            )}
            <div className="flex-1 space-y-2">
              <input
                id="thumbnail-file"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleThumbnailUpload}
                disabled={uploading}
                className="text-xs font-mono text-[var(--color-text-ash)] file:mr-3 file:py-1.5 file:px-3 file:border-2 file:border-[var(--color-border-subtle)] file:bg-[#120E18] file:text-[var(--color-accent-gold)] file:font-pixel file:text-xs file:uppercase cursor-pointer disabled:opacity-50"
              />
              {uploading && (
                <p className="font-mono text-[11px] text-[var(--color-accent-gold)]">
                  Uploading relic image...
                </p>
              )}
              <p className="font-mono text-[10px] text-[var(--color-text-ash)]">
                Max 5MB · PNG, JPEG, WEBP, GIF. Stored in /public/uploads/.
              </p>
              {thumbnailUrl && (
                <div className="flex items-center gap-2">
                  <input
                    id="thumbnail-url-manual"
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="Or paste https://... URL"
                    className="flex-1 px-2 py-1 bg-[#0B0A10] border border-[var(--color-border-gothic)] text-[var(--color-text-ash)] font-mono text-[10px] focus:border-[var(--color-accent-gold)] focus:outline-none"
                    aria-label="Thumbnail URL"
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnailUrl("")}
                    className="font-pixel text-[10px] text-[#E05368] border border-[var(--color-accent-blood)] px-2 py-1 hover:bg-[var(--color-accent-blood)] hover:text-[var(--color-text-bone)] cursor-pointer"
                    aria-label="Clear thumbnail"
                  >
                    Clear
                  </button>
                </div>
              )}
              {!thumbnailUrl && (
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="Or paste https://... URL directly"
                  className="w-full px-2 py-1.5 bg-[#0B0A10] border border-[var(--color-border-gothic)] text-[var(--color-text-ash)] font-mono text-xs focus:border-[var(--color-accent-gold)] focus:outline-none"
                  aria-label="Thumbnail URL"
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Summary ── */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="post-summary" className={labelCls}>
              Summary Excerpt
            </label>
            <CharCount value={summary} max={1000} />
          </div>
          <textarea
            id="post-summary"
            rows={2}
            required
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Concise overview displayed on cards and preview grids."
            maxLength={1000}
            className={inputCls}
          />
        </div>

        {/* ── Markdown Content ── */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="post-content" className={labelCls}>
              Full Content (Markdown)
            </label>
            <CharCount value={content} max={20000} />
          </div>
          <textarea
            id="post-content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Detailed case study, asset breakdown, or development narrative..."
            maxLength={20000}
            className={`${inputCls} leading-relaxed`}
          />
        </div>

        {/* ── Role & Tools ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="post-role" className={labelCls}>
              Role
            </label>
            <input
              id="post-role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Lead Architect & Designer"
              maxLength={100}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Tools</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-[#100D16] border border-[var(--color-border-gothic)] max-h-48 overflow-auto">
              {availableTools.map((tool) => (
                <label
                  key={tool}
                  className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-bone)] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTools.includes(tool)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTools((prev) =>
                          Array.from(new Set([...prev, tool]))
                        );
                      } else {
                        setSelectedTools((prev) =>
                          prev.filter((t) => t !== tool)
                        );
                      }
                    }}
                    className="accent-[var(--color-accent-gold)]"
                  />
                  {tool}
                </label>
              ))}
            </div>
            <p className="font-mono text-[10px] text-[var(--color-text-ash)] mt-1">
              Manage available tools via Admin → Skills.
            </p>
          </div>
        </div>

        {/* ── Tags & Links ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="post-tags" className={labelCls}>
              Tags (comma-separated)
            </label>
            <input
              id="post-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Next.js, TypeScript, Canvas"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="post-external" className={labelCls}>
              Demo URL
            </label>
            <input
              id="post-external"
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://..."
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="post-github" className={labelCls}>
              Repository URL
            </label>
            <input
              id="post-github"
              type="url"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              placeholder="https://github.com/..."
              className={inputCls}
            />
          </div>
        </div>

        {/* ── Featured ── */}
        <label className="flex items-center gap-3 pt-2 cursor-pointer group">
          <input
            id="post-featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 accent-[var(--color-accent-gold)] cursor-pointer"
          />
          <span className="font-pixel text-xs text-[var(--color-accent-gold)] uppercase tracking-wider select-none group-hover:text-[var(--color-accent-gold-bright)]">
            ★ Feature on Homepage
          </span>
          <span className="font-mono text-[10px] text-[var(--color-text-ash)]">
            (shows in the featured section of the public landing page)
          </span>
        </label>

        {/* ── Actions ── */}
        <div className="pt-4 border-t border-[var(--color-border-gothic)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <PixelButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/posts")}
          >
            ‹ Cancel
          </PixelButton>

          <div className="flex items-center gap-3">
            {/* Save as Draft — only shown for published posts or new posts */}
            {(status === "published" || !isEdit) && (
              <button
                type="button"
                onClick={handleSaveAsDraft}
                disabled={saving}
                className="px-3 py-1.5 bg-transparent text-[var(--color-text-ash)] border-2 border-[var(--color-border-gothic)] hover:border-[var(--color-border-subtle)] hover:text-[var(--color-text-bone)] font-pixel text-xs uppercase tracking-wide pixel-press pixel-focus disabled:opacity-50 cursor-pointer"
              >
                {saving ? "..." : "Save as Draft"}
              </button>
            )}

            <PixelButton
              type="submit"
              variant="primary"
              size="md"
              disabled={saving}
            >
              {saving
                ? "Inscribing..."
                : isEdit
                ? "Update Manuscript"
                : "Publish Manuscript"}
            </PixelButton>
          </div>
        </div>
      </PixelCard>
    </form>
  );
};
