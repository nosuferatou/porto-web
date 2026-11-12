"use client";

import React, { useState, useEffect, useRef } from "react";
import { PixelCard, PixelButton, PixelSpinner } from "@/components/ui";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminAlert, AdminAlertMessage } from "@/components/admin/AdminAlert";

// ─── Predefined tools ────────────────────────────────────────────────────────
// Add tools here to extend the dropdown without code changes elsewhere.
// iconKey must match a key in SkillGrid's iconMap for the pixel icon to render;
// otherwise the VS Code fallback is used (still correct for future additions).
const PREDEFINED_TOOLS: Array<{ label: string; iconKey: string; category: string }> = [
  { label: "Photoshop",      iconKey: "photoshop",   category: "Design & Art" },
  { label: "Illustrator",    iconKey: "illustrator", category: "Design & Art" },
  { label: "After Effects",  iconKey: "aftereffects",category: "Design & Art" },
  { label: "Premiere Pro",   iconKey: "premiere",    category: "Design & Art" },
  { label: "Figma",          iconKey: "figma",       category: "Design & Art" },
  { label: "Blender",        iconKey: "blender",     category: "Design & Art" },
  { label: "DaVinci Resolve",iconKey: "davinci",     category: "Design & Art" },
  { label: "VS Code",        iconKey: "vscode",      category: "Tools" },
  { label: "Git",            iconKey: "git",         category: "Tools" },
  { label: "GitHub",         iconKey: "github",      category: "Tools" },
  { label: "HTML",           iconKey: "html",        category: "Engineering" },
  { label: "CSS",            iconKey: "css",         category: "Engineering" },
  { label: "JavaScript",     iconKey: "javascript",  category: "Engineering" },
  { label: "React",          iconKey: "react",       category: "Engineering" },
  { label: "Next.js",        iconKey: "nextjs",      category: "Engineering" },
  { label: "Node.js",        iconKey: "nodejs",      category: "Engineering" },
  { label: "Kotlin",         iconKey: "kotlin",      category: "Engineering" },
  { label: "PHP",            iconKey: "php",         category: "Engineering" },
  { label: "MySQL",          iconKey: "mysql",       category: "Engineering" },
  { label: "Custom Tool",    iconKey: "custom",      category: "Tools" },
];

const CATEGORIES = ["Design & Art", "Engineering", "Tools"];

// ─── Types ───────────────────────────────────────────────────────────────────
interface SkillItem {
  id: string;
  name: string;
  category: string;
  iconKey: string;
  iconUrl: string | null;
  description: string;
  order: number;
  showOnHomepage: boolean;
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-2 bg-[#0B0A10] border-2 border-[var(--color-border-subtle)] text-[var(--color-text-bone)] font-mono text-xs focus:border-[var(--color-accent-gold)] focus:outline-none pixel-hover";

const selectCls =
  "w-full px-3 py-2 bg-[#0B0A10] border-2 border-[var(--color-border-subtle)] text-[var(--color-text-bone)] font-mono text-xs focus:border-[var(--color-accent-gold)] focus:outline-none cursor-pointer pixel-hover";

const actionBtnCls =
  "px-2.5 py-1 font-pixel text-[10px] uppercase tracking-wider pixel-focus pixel-hover cursor-pointer border";

const checkboxLabelCls =
  "flex items-center gap-2 font-mono text-xs text-[var(--color-text-bone)] cursor-pointer select-none";

// ─── Icon upload helper ───────────────────────────────────────────────────────
async function uploadIcon(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.url as string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AdminAlertMessage | null>(null);

  // ── Add form ─────────────────────────────────────────────────────────────
  const [addToolChoice, setAddToolChoice] = useState("Photoshop");
  const [addCustomName, setAddCustomName] = useState("");
  const [addCategory, setAddCategory] = useState("Design & Art");
  const [addDescription, setAddDescription] = useState("");
  const [addOrder, setAddOrder] = useState(0);
  const [addShowOnHomepage, setAddShowOnHomepage] = useState(true);
  const [addIconUrl, setAddIconUrl] = useState<string | null>(null);
  const [addUploading, setAddUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const addIconRef = useRef<HTMLInputElement>(null);

  // ── Edit state ───────────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editToolChoice, setEditToolChoice] = useState("");
  const [editCustomName, setEditCustomName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editIconKey, setEditIconKey] = useState("");
  const [editIconUrl, setEditIconUrl] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [editShowOnHomepage, setEditShowOnHomepage] = useState(true);
  const [editUploading, setEditUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const editIconRef = useRef<HTMLInputElement>(null);

  // ── Delete confirmation ──────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<SkillItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Load ─────────────────────────────────────────────────────────────────
  const loadSkills = async () => {
    try {
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      if (data.skills) setSkills(data.skills);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const showAlert = (text: string, type: AdminAlertMessage["type"] = "error") => {
    setAlert({ text, type });
    setTimeout(() => setAlert(null), 5000);
  };

  // When the tool dropdown changes, auto-fill category for predefined tools.
  const handleAddToolChange = (value: string) => {
    setAddToolChoice(value);
    const preset = PREDEFINED_TOOLS.find((t) => t.label === value);
    if (preset && value !== "Custom Tool") {
      setAddCategory(preset.category);
    }
    if (value !== "Custom Tool") {
      setAddCustomName("");
      setAddIconUrl(null);
    }
  };

  // ── Add icon upload ───────────────────────────────────────────────────────
  const handleAddIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAddUploading(true);
    try {
      const url = await uploadIcon(file);
      setAddIconUrl(url);
      showAlert("Icon uploaded.", "success");
    } catch (err) {
      showAlert((err as Error).message || "Icon upload failed.");
    } finally {
      setAddUploading(false);
      if (addIconRef.current) addIconRef.current.value = "";
    }
  };

  // ── Add submit ────────────────────────────────────────────────────────────
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adding) return;
    setAdding(true);
    setAlert(null);

    const isCustomTool = addToolChoice === "Custom Tool";
    const resolvedName = isCustomTool ? addCustomName.trim() : addToolChoice;
    const preset = PREDEFINED_TOOLS.find((t) => t.label === addToolChoice);
    const resolvedIconKey = preset?.iconKey ?? "custom";

    if (!resolvedName) {
      showAlert("Tool name is required.");
      setAdding(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resolvedName,
          category: addCategory,
          iconKey: resolvedIconKey,
          iconUrl: addIconUrl,
          description: addDescription,
          order: addOrder,
          showOnHomepage: addShowOnHomepage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert(data.error || "Failed to forge skill.");
      } else {
        // Reset form
        setAddToolChoice("Photoshop");
        setAddCustomName("");
        setAddCategory("Design & Art");
        setAddDescription("");
        setAddOrder(skills.length + 1);
        setAddShowOnHomepage(true);
        setAddIconUrl(null);
        showAlert("Skill inscribed into the Codex.", "success");
        await loadSkills();
      }
    } catch {
      showAlert("Communication failure with the forge.");
    } finally {
      setAdding(false);
    }
  };

  // ── Inline edit start ─────────────────────────────────────────────────────
  const startEdit = (skill: SkillItem) => {
    setEditingId(skill.id);
    // Determine dropdown value: if name matches a predefined label, use it; else Custom Tool
    const matchedPreset = PREDEFINED_TOOLS.find(
      (t) => t.label === skill.name && t.label !== "Custom Tool"
    );
    if (matchedPreset) {
      setEditToolChoice(matchedPreset.label);
      setEditCustomName("");
    } else {
      setEditToolChoice("Custom Tool");
      setEditCustomName(skill.name);
    }
    setEditCategory(skill.category);
    setEditIconKey(skill.iconKey);
    setEditIconUrl(skill.iconUrl);
    setEditDescription(skill.description);
    setEditOrder(skill.order);
    // Coerce to boolean: before migration the field may be undefined; default to true (visible)
    setEditShowOnHomepage(skill.showOnHomepage !== false);
    setAlert(null);
  };

  const cancelEdit = () => setEditingId(null);

  // ── Edit icon upload ──────────────────────────────────────────────────────
  const handleEditIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditUploading(true);
    try {
      const url = await uploadIcon(file);
      setEditIconUrl(url);
      showAlert("Icon uploaded.", "success");
    } catch (err) {
      showAlert((err as Error).message || "Icon upload failed.");
    } finally {
      setEditUploading(false);
      if (editIconRef.current) editIconRef.current.value = "";
    }
  };

  // ── Save edit ─────────────────────────────────────────────────────────────
  const handleSaveEdit = async (id: string) => {
    if (saving) return;
    setSaving(true);
    setAlert(null);

    const isCustomTool = editToolChoice === "Custom Tool";
    const resolvedName = isCustomTool ? editCustomName.trim() : editToolChoice;
    const preset = PREDEFINED_TOOLS.find((t) => t.label === editToolChoice);
    const resolvedIconKey = isCustomTool ? "custom" : (preset?.iconKey ?? editIconKey);

    if (!resolvedName) {
      showAlert("Tool name is required.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resolvedName,
          category: editCategory,
          iconKey: resolvedIconKey,
          iconUrl: editIconUrl,
          description: editDescription,
          order: editOrder,
          showOnHomepage: editShowOnHomepage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert(data.error || "Failed to update skill.");
      } else {
        setEditingId(null);
        showAlert("Skill updated.", "success");
        await loadSkills();
      }
    } catch {
      showAlert("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/skills/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showAlert(`"${deleteTarget.name}" has been banished.`, "success");
        await loadSkills();
      } else {
        showAlert("Failed to banish skill.");
      }
    } catch {
      showAlert("Failed to banish skill.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-6 w-56 bg-[var(--color-border-gothic)]" />
          <div className="h-3 w-72 bg-[var(--color-border-subtle)]" />
        </div>
        {/* Add form skeleton */}
        <div className="bg-[var(--color-surface-elevated)] border-2 border-[var(--color-border-subtle)] p-6 space-y-4">
          <div className="h-4 w-40 bg-[var(--color-border-gothic)]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 bg-[var(--color-border-gothic)]" />
            ))}
          </div>
          <div className="h-9 bg-[var(--color-border-gothic)]" />
        </div>
        {/* Table skeleton */}
        <div className="bg-[var(--color-surface-obsidian)] border-2 border-[var(--color-border-gothic)] p-0 overflow-hidden">
          <div className="bg-[#120E18] h-10 border-b border-[var(--color-border-gothic)]" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 border-b border-[var(--color-border-gothic)] last:border-b-0">
              <div className="h-3 w-6 bg-[var(--color-border-subtle)]" />
              <div className="h-3 w-24 bg-[var(--color-border-gothic)]" />
              <div className="h-3 w-20 bg-[var(--color-border-subtle)]" />
              <div className="h-5 w-5 bg-[var(--color-border-gothic)]" />
              <div className="h-3 flex-1 bg-[var(--color-border-subtle)]" />
              <div className="h-6 w-20 bg-[var(--color-border-gothic)] ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isAddCustom = addToolChoice === "Custom Tool";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-pixel text-xl sm:text-2xl text-[var(--color-text-bone)] uppercase tracking-wide">
          Discipline & Tool Forge
        </h1>
        <p className="font-mono text-xs text-[var(--color-text-ash)] mt-1">
          Add, edit, or remove the skills featured in the Mastered Disciplines section.
        </p>
      </div>

      <AdminAlert message={alert} />

      {/* ── Add New Skill ──────────────────────────────────────────────── */}
      <PixelCard variant="elevated" cornerStuds className="p-6">
        <h2 className="font-pixel text-xs sm:text-sm text-[var(--color-accent-gold)] uppercase tracking-wider mb-4">
          + Inscribe New Discipline
        </h2>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Tool selection dropdown */}
            <div>
              <label
                htmlFor="add-tool-choice"
                className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1"
              >
                Tool
              </label>
              <select
                id="add-tool-choice"
                value={addToolChoice}
                onChange={(e) => handleAddToolChange(e.target.value)}
                className={selectCls}
              >
                {PREDEFINED_TOOLS.map((t) => (
                  <option key={t.label} value={t.label}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom tool name — only shown for Custom Tool */}
            {isAddCustom && (
              <div>
                <label
                  htmlFor="add-custom-name"
                  className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1"
                >
                  Tool Name
                </label>
                <input
                  id="add-custom-name"
                  type="text"
                  required
                  value={addCustomName}
                  onChange={(e) => setAddCustomName(e.target.value)}
                  placeholder="e.g. After Effects"
                  maxLength={50}
                  className={inputCls}
                />
              </div>
            )}

            {/* Category */}
            <div>
              <label
                htmlFor="add-category"
                className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1"
              >
                Category
              </label>
              <select
                id="add-category"
                value={addCategory}
                onChange={(e) => setAddCategory(e.target.value)}
                className={selectCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Display order */}
            <div>
              <label
                htmlFor="add-order"
                className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1"
              >
                Display Order
              </label>
              <input
                id="add-order"
                type="number"
                min={0}
                value={addOrder}
                onChange={(e) => setAddOrder(Number(e.target.value))}
                className={inputCls}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="add-description"
              className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1"
            >
              Description
            </label>
            <input
              id="add-description"
              type="text"
              value={addDescription}
              onChange={(e) => setAddDescription(e.target.value)}
              placeholder="e.g. Motion graphics, compositing, and visual effects."
              maxLength={500}
              className={inputCls}
            />
          </div>

          {/* Custom icon upload — only for Custom Tool */}
          {isAddCustom && (
            <div>
              <label
                htmlFor="add-icon-upload"
                className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1"
              >
                Custom Icon <span className="font-mono text-[var(--color-text-ash)] normal-case">(PNG or WEBP, max 5MB)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="add-icon-upload"
                  ref={addIconRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAddIconUpload}
                  disabled={addUploading}
                  className="text-xs font-mono text-[var(--color-text-bone)] file:mr-3 file:px-3 file:py-1.5 file:border file:border-[var(--color-accent-gold)] file:bg-[#100D16] file:text-[var(--color-accent-gold)] file:font-pixel file:text-[10px] file:uppercase file:cursor-pointer cursor-pointer disabled:opacity-50"
                />
                {addUploading && (
                  <span className="font-mono text-xs text-[var(--color-text-ash)] inline-flex items-center gap-1.5">
                    <PixelSpinner />
                    Uploading...
                  </span>
                )}
                {addIconUrl && !addUploading && (
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={addIconUrl}
                      alt="Preview"
                      className="w-8 h-8 object-contain pixelated border border-[var(--color-border-gothic)]"
                    />
                    <button
                      type="button"
                      onClick={() => { setAddIconUrl(null); if (addIconRef.current) addIconRef.current.value = ""; }}
                      className="font-mono text-[10px] text-[#E05368] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Show on Homepage toggle */}
          <div className="flex items-center gap-6 pt-1">
            <label className={checkboxLabelCls}>
              <input
                type="checkbox"
                checked={addShowOnHomepage}
                onChange={(e) => setAddShowOnHomepage(e.target.checked)}
                className="accent-[var(--color-accent-gold)] w-4 h-4"
              />
              Show on Homepage
            </label>
          </div>

          <div className="flex justify-end">
            <PixelButton type="submit" variant="primary" size="sm" disabled={adding} loading={adding}>
              {adding ? "Forging..." : "Inscribe Discipline"}
            </PixelButton>
          </div>
        </form>
      </PixelCard>

      {/* ── Skills Table ───────────────────────────────────────────────── */}
      <PixelCard variant="default" className="p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--color-border-gothic)]">
          <h2 className="font-pixel text-xs sm:text-sm text-[var(--color-text-bone)] uppercase tracking-wide">
            Enshrined Skills ({skills.length})
          </h2>
        </div>

        {skills.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-mono text-xs text-[var(--color-text-ash)]">
              No disciplines inscribed yet. Add the first above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#120E18] border-b border-[var(--color-border-gothic)] text-[var(--color-text-ash)] uppercase text-[11px]">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Icon</th>
                  <th className="p-3">Homepage</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-gothic)]">
                {skills.map((s) => {
                  const isEditingThis = editingId === s.id;
                  const isEditCustom = editToolChoice === "Custom Tool";

                  if (isEditingThis) {
                    return (
                      /* Inline edit row */
                      <tr key={s.id} className="bg-[#1A1424] align-top">
                        {/* Order */}
                        <td className="p-2">
                          <input
                            type="number"
                            min={0}
                            value={editOrder}
                            onChange={(e) => setEditOrder(Number(e.target.value))}
                            className="w-16 px-2 py-1 bg-[#0B0A10] border border-[var(--color-accent-gold)] text-[var(--color-text-bone)] font-mono text-xs focus:outline-none"
                            aria-label="Edit order"
                          />
                        </td>

                        {/* Tool dropdown + optional custom name */}
                        <td className="p-2 space-y-1 min-w-[140px]">
                          <select
                            value={editToolChoice}
                            onChange={(e) => {
                              setEditToolChoice(e.target.value);
                              const p = PREDEFINED_TOOLS.find((t) => t.label === e.target.value);
                              if (p && e.target.value !== "Custom Tool") {
                                setEditCategory(p.category);
                                setEditIconKey(p.iconKey);
                                setEditCustomName("");
                              }
                            }}
                            className="w-full px-2 py-1 bg-[#0B0A10] border border-[var(--color-accent-gold)] text-[var(--color-text-bone)] font-mono text-xs focus:outline-none cursor-pointer"
                            aria-label="Edit tool"
                          >
                            {PREDEFINED_TOOLS.map((t) => (
                              <option key={t.label} value={t.label}>{t.label}</option>
                            ))}
                          </select>
                          {isEditCustom && (
                            <input
                              type="text"
                              value={editCustomName}
                              onChange={(e) => setEditCustomName(e.target.value)}
                              placeholder="Custom name"
                              maxLength={50}
                              className="w-full px-2 py-1 bg-[#0B0A10] border border-[var(--color-accent-gold)] text-[var(--color-text-bone)] font-mono text-xs focus:outline-none"
                              aria-label="Custom tool name"
                            />
                          )}
                        </td>

                        {/* Category */}
                        <td className="p-2">
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full min-w-[110px] px-2 py-1 bg-[#0B0A10] border border-[var(--color-accent-gold)] text-[var(--color-text-bone)] font-mono text-xs focus:outline-none"
                            aria-label="Edit category"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </td>

                        {/* Icon — custom upload for Custom Tool */}
                        <td className="p-2 min-w-[120px]">
                          {isEditCustom ? (
                            <div className="space-y-1">
                              {editIconUrl && (
                                <div className="flex items-center gap-1.5 mb-1">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={editIconUrl}
                                    alt="current"
                                    className="w-7 h-7 object-contain pixelated border border-[var(--color-border-gothic)]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => { setEditIconUrl(null); if (editIconRef.current) editIconRef.current.value = ""; }}
                                    className="font-mono text-[10px] text-[#E05368] hover:underline"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                              <input
                                ref={editIconRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleEditIconUpload}
                                disabled={editUploading}
                                className="text-[10px] font-mono text-[var(--color-text-ash)] file:mr-1.5 file:px-2 file:py-1 file:border file:border-[var(--color-border-subtle)] file:bg-[#100D16] file:text-[var(--color-accent-gold)] file:font-pixel file:text-[9px] file:uppercase file:cursor-pointer cursor-pointer disabled:opacity-50"
                                aria-label="Upload custom icon"
                              />
                              {editUploading && (
                                <span className="font-mono text-[10px] text-[var(--color-text-ash)] inline-flex items-center gap-1.5">
                                  <PixelSpinner />
                                  Uploading…
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[var(--color-text-ash)] font-mono text-[11px]">
                              {editIconKey}
                            </span>
                          )}
                        </td>

                        {/* Show on Homepage */}
                        <td className="p-2">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editShowOnHomepage}
                              onChange={(e) => setEditShowOnHomepage(e.target.checked)}
                              className="accent-[var(--color-accent-gold)] w-4 h-4"
                              aria-label="Show on homepage"
                            />
                            <span className="font-mono text-[10px] text-[var(--color-text-ash)]">
                              {editShowOnHomepage ? "Yes" : "No"}
                            </span>
                          </label>
                        </td>

                        {/* Description */}
                        <td className="p-2">
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            maxLength={500}
                            className="w-full min-w-[160px] px-2 py-1 bg-[#0B0A10] border border-[var(--color-accent-gold)] text-[var(--color-text-bone)] font-mono text-xs focus:outline-none"
                            aria-label="Edit description"
                          />
                        </td>

                        {/* Actions */}
                        <td className="p-2 text-right whitespace-nowrap space-x-1">
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(s.id)}
                            disabled={saving}
                            aria-busy={saving || undefined}
                            className={`${actionBtnCls} inline-flex items-center justify-center gap-1.5 min-w-[92px] bg-[#0E1F14] border-[#22C55E] text-[#4ADE80] hover:bg-[#132A1A] disabled:opacity-50`}
                          >
                            {saving && <PixelSpinner />}
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={saving}
                            className={`${actionBtnCls} bg-transparent border-[var(--color-border-gothic)] text-[var(--color-text-ash)] hover:text-[var(--color-text-bone)] disabled:opacity-50`}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  }

                  /* Read row */
                  return (
                    <tr key={s.id} className="hover:bg-[#181324]">
                      <td className="p-3 text-[var(--color-accent-gold)] font-pixel text-xs">
                        #{s.order}
                      </td>
                      <td className="p-3 font-medium text-[var(--color-text-bone)]">
                        {s.name}
                      </td>
                      <td className="p-3 text-[var(--color-text-ash)]">{s.category}</td>
                      <td className="p-3">
                        {s.iconUrl ? (
                          <div className="flex items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={s.iconUrl}
                              alt={s.name}
                              className="w-6 h-6 object-contain pixelated"
                            />
                            <span className="font-mono text-[10px] text-[var(--color-text-ash)] truncate max-w-[80px]">
                              custom
                            </span>
                          </div>
                        ) : (
                          <span className="text-[var(--color-text-ash)]">{s.iconKey}</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-pixel text-[10px] uppercase tracking-wider ${
                            s.showOnHomepage !== false
                              ? "text-[var(--color-accent-gold)]"
                              : "text-[var(--color-text-ash)]"
                          }`}
                        >
                          {s.showOnHomepage !== false ? "✦ Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-3 text-[var(--color-text-ash)] max-w-xs truncate">
                        {s.description || (
                          <span className="text-[var(--color-border-subtle)] italic">—</span>
                        )}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap space-x-1">
                        <button
                          type="button"
                          onClick={() => startEdit(s)}
                          className={`${actionBtnCls} bg-[#100D16] border-[var(--color-border-subtle)] text-[var(--color-accent-gold)] hover:border-[var(--color-accent-gold)]`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(s)}
                          className={`${actionBtnCls} bg-[#1A0A0E] border-[var(--color-accent-blood)] text-[#E05368] hover:bg-[var(--color-accent-blood)] hover:text-[var(--color-text-bone)]`}
                        >
                          Banish
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </PixelCard>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Banish Discipline"
        message={`Are you certain you wish to banish "${deleteTarget?.name}" from the Codex? This cannot be undone.`}
        confirmLabel={deleting ? "Banishing..." : "Banish"}
        cancelLabel="Keep"
        variant="danger"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
