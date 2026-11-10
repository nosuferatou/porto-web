"use client";

import React, { useState, useEffect } from "react";
import { PixelCard, PixelButton } from "@/components/ui";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminAlert, AdminAlertMessage } from "@/components/admin/AdminAlert";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  _count: { posts: number };
}

const inputCls =
  "w-full px-3 py-2 bg-[#0B0A10] border-2 border-[var(--color-border-subtle)] text-[var(--color-text-bone)] font-mono text-xs focus:border-[var(--color-accent-gold)] focus:outline-none";

const actionBtnCls =
  "px-2.5 py-1 font-pixel text-[10px] uppercase tracking-wider pixel-focus cursor-pointer border";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AdminAlertMessage | null>(null);

  // Add form
  const [addName, setAddName] = useState("");
  const [addDesc, setAddDesc] = useState("");
  const [adding, setAdding] = useState(false);

  // Inline edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const showAlert = (text: string, type: AdminAlertMessage["type"] = "error") => {
    setAlert({ text, type });
    if (type !== "error") setTimeout(() => setAlert(null), 5000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setAlert(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: addName, description: addDesc }),
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert(data.error || "Failed to create category.");
      } else {
        setAddName("");
        setAddDesc("");
        showAlert("Category created.", "success");
        await load();
      }
    } catch {
      showAlert("Failed to reach the server.");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (c: CategoryItem) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditDesc(c.description);
    setAlert(null);
  };

  const cancelEdit = () => setEditingId(null);

  const handleSaveEdit = async (id: string) => {
    setSaving(true);
    setAlert(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDesc }),
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert(data.error || "Failed to update category.");
      } else {
        setEditingId(null);
        showAlert("Category updated.", "success");
        await load();
      }
    } catch {
      showAlert("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showAlert(`"${deleteTarget.name}" deleted.`, "success");
        await load();
      } else {
        const data = await res.json();
        showAlert(data.error || "Failed to delete category.");
      }
    } catch {
      showAlert("Failed to delete category.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 font-pixel text-xs text-[var(--color-accent-gold)]">
        Cataloguing Disciplines...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-pixel text-xl sm:text-2xl text-[var(--color-text-bone)] uppercase tracking-wide">
          Portfolio Categories
        </h1>
        <p className="font-mono text-xs text-[var(--color-text-ash)] mt-1">
          Manage the categories used to classify portfolio manuscripts.
        </p>
      </div>

      <AdminAlert message={alert} />

      {/* Add form */}
      <PixelCard variant="elevated" cornerStuds className="p-6">
        <h2 className="font-pixel text-xs sm:text-sm text-[var(--color-accent-gold)] uppercase tracking-wider mb-4">
          + Add Category
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cat-name" className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1">
                Name
              </label>
              <input
                id="cat-name"
                type="text"
                required
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="e.g. Motion Design"
                maxLength={100}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="cat-desc" className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1">
                Description{" "}
                <span className="font-mono text-[10px] text-[var(--color-text-ash)] normal-case">(optional)</span>
              </label>
              <input
                id="cat-desc"
                type="text"
                value={addDesc}
                onChange={(e) => setAddDesc(e.target.value)}
                placeholder="Short description"
                maxLength={500}
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <PixelButton type="submit" variant="primary" size="sm" disabled={adding}>
              {adding ? "Creating..." : "Create Category"}
            </PixelButton>
          </div>
        </form>
      </PixelCard>

      {/* List */}
      <PixelCard variant="default" className="p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--color-border-gothic)]">
          <h2 className="font-pixel text-xs sm:text-sm text-[var(--color-text-bone)] uppercase tracking-wide">
            Categories ({categories.length})
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-mono text-xs text-[var(--color-text-ash)]">
              No categories yet. Add the first above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#120E18] border-b border-[var(--color-border-gothic)] text-[var(--color-text-ash)] uppercase text-[11px]">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3 hidden sm:table-cell">Slug</th>
                  <th className="p-3 hidden md:table-cell">Description</th>
                  <th className="p-3">Posts</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-gothic)]">
                {categories.map((c) =>
                  editingId === c.id ? (
                    <tr key={c.id} className="bg-[#1A1424]">
                      <td className="p-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          maxLength={100}
                          className="w-full min-w-[120px] px-2 py-1 bg-[#0B0A10] border border-[var(--color-accent-gold)] text-[var(--color-text-bone)] font-mono text-xs focus:outline-none"
                          aria-label="Edit name"
                        />
                      </td>
                      <td className="p-2 text-[var(--color-text-ash)] hidden sm:table-cell">
                        <span className="font-mono text-[10px]">auto-generated</span>
                      </td>
                      <td className="p-2 hidden md:table-cell">
                        <input
                          type="text"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          maxLength={500}
                          className="w-full min-w-[160px] px-2 py-1 bg-[#0B0A10] border border-[var(--color-accent-gold)] text-[var(--color-text-bone)] font-mono text-xs focus:outline-none"
                          aria-label="Edit description"
                        />
                      </td>
                      <td className="p-2 text-[var(--color-text-ash)]">{c._count.posts}</td>
                      <td className="p-2 text-right whitespace-nowrap space-x-1">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(c.id)}
                          disabled={saving}
                          className={`${actionBtnCls} bg-[#0E1F14] border-[#22C55E] text-[#4ADE80] hover:bg-[#132A1A] disabled:opacity-50`}
                        >
                          {saving ? "..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className={`${actionBtnCls} bg-transparent border-[var(--color-border-gothic)] text-[var(--color-text-ash)] hover:text-[var(--color-text-bone)]`}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={c.id} className="hover:bg-[#181324]">
                      <td className="p-3 font-medium text-[var(--color-text-bone)]">{c.name}</td>
                      <td className="p-3 text-[var(--color-text-ash)] hidden sm:table-cell">{c.slug}</td>
                      <td className="p-3 text-[var(--color-text-ash)] max-w-xs truncate hidden md:table-cell">
                        {c.description || <span className="italic text-[var(--color-border-subtle)]">—</span>}
                      </td>
                      <td className="p-3 text-[var(--color-accent-gold)] font-pixel text-xs">
                        {c._count.posts}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap space-x-1">
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className={`${actionBtnCls} bg-[#100D16] border-[var(--color-border-subtle)] text-[var(--color-accent-gold)] hover:border-[var(--color-accent-gold)]`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(c)}
                          className={`${actionBtnCls} bg-[#1A0A0E] border-[var(--color-accent-blood)] text-[#E05368] hover:bg-[var(--color-accent-blood)] hover:text-[var(--color-text-bone)]`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </PixelCard>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Category"
        message={`Delete "${deleteTarget?.name}"? Posts using this category will keep their category name but lose the category link. This cannot be undone.`}
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        cancelLabel="Keep"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
