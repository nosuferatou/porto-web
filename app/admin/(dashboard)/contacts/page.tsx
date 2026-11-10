"use client";

import React, { useState, useEffect } from "react";
import { PixelCard, PixelButton } from "@/components/ui";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminAlert, AdminAlertMessage } from "@/components/admin/AdminAlert";
import { getContactIcon } from "@/lib/contact-icon-map";

interface ContactItem {
  id: string;
  platform: string;
  label: string;
  url: string;
  iconKey: string;
  order: number;
}

// Supported platform options with stable iconKey values.
// "Direct Channel" is intentionally excluded — it has its own section.
const PLATFORM_OPTIONS: Array<{ value: string; iconKey: string }> = [
  { value: "GitHub", iconKey: "github" },
  { value: "GitLab", iconKey: "gitlab" },
  { value: "LinkedIn", iconKey: "linkedin" },
  { value: "Instagram", iconKey: "instagram" },
  { value: "Threads", iconKey: "threads" },
  { value: "X", iconKey: "x" },
  { value: "Facebook", iconKey: "facebook" },
  { value: "TikTok", iconKey: "tiktok" },
  { value: "YouTube", iconKey: "youtube" },
  { value: "Discord", iconKey: "discord" },
  { value: "Behance", iconKey: "behance" },
  { value: "Dribbble", iconKey: "dribbble" },
  { value: "ArtStation", iconKey: "artstation" },
  { value: "Pinterest", iconKey: "pinterest" },
  { value: "Medium", iconKey: "medium" },
  { value: "Telegram", iconKey: "telegram" },
  { value: "WhatsApp", iconKey: "whatsapp" },
  { value: "Website", iconKey: "website" },
  { value: "Other", iconKey: "other" },
];

function getIconKeyForPlatform(platform: string): string {
  const match = PLATFORM_OPTIONS.find((p) => p.value === platform);
  return match ? match.iconKey : "other";
}

const inputCls =
  "w-full px-3 py-2 bg-[#0B0A10] border-2 border-[var(--color-border-subtle)] text-[var(--color-text-bone)] font-mono text-xs focus:border-[var(--color-accent-gold)] focus:outline-none";

const selectCls =
  "w-full px-3 py-2 bg-[#0B0A10] border-2 border-[var(--color-border-subtle)] text-[var(--color-text-bone)] font-mono text-xs focus:border-[var(--color-accent-gold)] focus:outline-none cursor-pointer";

const actionBtnCls =
  "px-2.5 py-1 font-pixel text-[10px] uppercase tracking-wider pixel-focus cursor-pointer border";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AdminAlertMessage | null>(null);

  // ── Direct Channel ───────────────────────────────────────────────────────
  const [directEmail, setDirectEmail] = useState("");
  const [directEmailInput, setDirectEmailInput] = useState("");
  const [savingDirect, setSavingDirect] = useState(false);
  const [loadingDirect, setLoadingDirect] = useState(true);

  // ── Add form ─────────────────────────────────────────────────────────────
  const [addPlatform, setAddPlatform] = useState("GitHub");
  const [addCustomPlatform, setAddCustomPlatform] = useState("");
  const [addLabel, setAddLabel] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const [addOrder, setAddOrder] = useState(0);
  const [adding, setAdding] = useState(false);

  // ── Edit state ───────────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPlatform, setEditPlatform] = useState("");
  const [editCustomPlatform, setEditCustomPlatform] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editIconKey, setEditIconKey] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  // ── Delete confirmation ──────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<ContactItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load conduits (excludes Direct Channel)
  const loadContacts = async () => {
    try {
      const res = await fetch("/api/admin/contacts");
      const data = await res.json();
      if (data.contacts) setContacts(data.contacts);
    } finally {
      setLoading(false);
    }
  };

  // Load Direct Channel email
  const loadDirectChannel = async () => {
    setLoadingDirect(true);
    try {
      const res = await fetch("/api/admin/direct-channel");
      const data = await res.json();
      const email = data.email || "";
      setDirectEmail(email);
      setDirectEmailInput(email);
    } finally {
      setLoadingDirect(false);
    }
  };

  useEffect(() => {
    loadContacts();
    loadDirectChannel();
  }, []);

  const showAlert = (text: string, type: AdminAlertMessage["type"] = "error") => {
    setAlert({ text, type });
    setTimeout(() => setAlert(null), 5000);
  };

  // ── Save Direct Channel ──────────────────────────────────────────────────
  const handleSaveDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDirect(true);
    setAlert(null);
    try {
      const res = await fetch("/api/admin/direct-channel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: directEmailInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert(data.error || "Failed to update direct channel.");
      } else {
        setDirectEmail(data.email);
        showAlert("Direct Channel updated.", "success");
      }
    } catch {
      showAlert("Failed to reach communication ward.");
    } finally {
      setSavingDirect(false);
    }
  };

  // ── Add conduit ──────────────────────────────────────────────────────────
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setAlert(null);

    const resolvedPlatform =
      addPlatform === "Other" ? addCustomPlatform.trim() : addPlatform;
    const resolvedIconKey = getIconKeyForPlatform(addPlatform);

    if (!resolvedPlatform) {
      showAlert("Please enter a platform name.");
      setAdding(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: resolvedPlatform,
          label: addLabel,
          url: addUrl,
          iconKey: resolvedIconKey,
          order: addOrder,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert(data.error || "Failed to establish conduit.");
      } else {
        setAddPlatform("GitHub");
        setAddCustomPlatform("");
        setAddLabel("");
        setAddUrl("");
        setAddOrder(contacts.length + 1);
        showAlert("Conduit forged successfully.", "success");
        await loadContacts();
      }
    } catch {
      showAlert("Failed to reach communication ward.");
    } finally {
      setAdding(false);
    }
  };

  // ── Inline edit ──────────────────────────────────────────────────────────
  const startEdit = (c: ContactItem) => {
    setEditingId(c.id);
    // Determine if platform is a known option or "Other"
    const knownOption = PLATFORM_OPTIONS.find((p) => p.value === c.platform);
    if (knownOption) {
      setEditPlatform(c.platform);
      setEditCustomPlatform("");
    } else {
      setEditPlatform("Other");
      setEditCustomPlatform(c.platform);
    }
    setEditLabel(c.label);
    setEditUrl(c.url);
    setEditIconKey(c.iconKey);
    setEditOrder(c.order);
    setAlert(null);
  };

  const cancelEdit = () => setEditingId(null);

  const handleSaveEdit = async (id: string) => {
    setSaving(true);
    setAlert(null);

    const resolvedPlatform =
      editPlatform === "Other" ? editCustomPlatform.trim() : editPlatform;
    const resolvedIconKey = getIconKeyForPlatform(editPlatform);

    if (!resolvedPlatform) {
      showAlert("Platform name cannot be empty.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: resolvedPlatform,
          label: editLabel,
          url: editUrl,
          iconKey: resolvedIconKey,
          order: editOrder,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert(data.error || "Failed to update conduit.");
      } else {
        setEditingId(null);
        showAlert("Conduit updated.", "success");
        await loadContacts();
      }
    } catch {
      showAlert("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/contacts/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showAlert(`"${deleteTarget.platform}" conduit severed.`, "success");
        await loadContacts();
      } else {
        showAlert("Failed to sever conduit.");
      }
    } catch {
      showAlert("Failed to sever conduit.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 font-pixel text-xs text-[var(--color-accent-gold)]">
        Scanning Raven Conduits...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-pixel text-xl sm:text-2xl text-[var(--color-text-bone)] uppercase tracking-wide">
          Communication Conduits
        </h1>
        <p className="font-mono text-xs text-[var(--color-text-ash)] mt-1">
          Manage direct contact and social channels displayed on the public site.
        </p>
      </div>

      <AdminAlert message={alert} />

      {/* ── Direct Channel Section ─────────────────────────────────────── */}
      <PixelCard variant="elevated" cornerStuds className="p-6">
        <h2 className="font-pixel text-xs sm:text-sm text-[var(--color-accent-gold)] uppercase tracking-wider mb-1">
          ✦ Direct Channel
        </h2>
        <p className="font-mono text-[11px] text-[var(--color-text-ash)] mb-4">
          The primary contact email displayed in the public contact section.
          Stored separately from social conduits.
        </p>

        {loadingDirect ? (
          <p className="font-mono text-xs text-[var(--color-text-ash)]">Loading...</p>
        ) : (
          <form onSubmit={handleSaveDirect} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label
                htmlFor="direct-email"
                className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1"
              >
                Email Address
              </label>
              <input
                id="direct-email"
                type="email"
                required
                value={directEmailInput}
                onChange={(e) => setDirectEmailInput(e.target.value)}
                placeholder="you@example.com"
                maxLength={254}
                className={inputCls}
                aria-describedby="direct-email-hint"
              />
              {directEmail && (
                <p id="direct-email-hint" className="font-mono text-[10px] text-[var(--color-text-ash)] mt-1">
                  Current: {directEmail}
                </p>
              )}
            </div>
            <PixelButton
              type="submit"
              variant="primary"
              size="sm"
              disabled={savingDirect}
              className="shrink-0"
            >
              {savingDirect ? "Saving..." : "Save Channel"}
            </PixelButton>
          </form>
        )}
      </PixelCard>

      {/* ── Forge New Conduit ──────────────────────────────────────────── */}
      <PixelCard variant="elevated" cornerStuds className="p-6">
        <h2 className="font-pixel text-xs sm:text-sm text-[var(--color-accent-gold)] uppercase tracking-wider mb-4">
          + Forge New Conduit
        </h2>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Platform dropdown with icon preview */}
            <div>
              <label
                htmlFor="contact-platform"
                className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1"
              >
                Platform
              </label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-[#120E18] border border-[var(--color-border-gothic)] text-[var(--color-text-bone)]">
                  {(() => { const Icon = getContactIcon(getIconKeyForPlatform(addPlatform)); return <Icon size={18} />; })()}
                </div>
                <select
                  id="contact-platform"
                  required
                  value={addPlatform}
                  onChange={(e) => setAddPlatform(e.target.value)}
                  className={`${selectCls} flex-1`}
                >
                  {PLATFORM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom platform name (only shown when "Other" is selected) */}
            {addPlatform === "Other" && (
              <div>
                <label
                  htmlFor="contact-platform-custom"
                  className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1"
                >
                  Platform Name
                </label>
                <input
                  id="contact-platform-custom"
                  type="text"
                  required
                  value={addCustomPlatform}
                  onChange={(e) => setAddCustomPlatform(e.target.value)}
                  placeholder="e.g. Bluesky"
                  maxLength={50}
                  className={inputCls}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="contact-label"
                className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1"
              >
                Display Label
              </label>
              <input
                id="contact-label"
                type="text"
                required
                value={addLabel}
                onChange={(e) => setAddLabel(e.target.value)}
                placeholder="e.g. github.com/username"
                maxLength={100}
                className={inputCls}
              />
            </div>

            <div>
              <label
                htmlFor="contact-url"
                className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1"
              >
                URL
              </label>
              <input
                id="contact-url"
                type="url"
                required
                value={addUrl}
                onChange={(e) => setAddUrl(e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
            </div>

            <div>
              <label
                htmlFor="contact-order"
                className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1"
              >
                Order
              </label>
              <input
                id="contact-order"
                type="number"
                min={0}
                value={addOrder}
                onChange={(e) => setAddOrder(Number(e.target.value))}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <PixelButton type="submit" variant="primary" size="sm" disabled={adding}>
              {adding ? "Forging..." : "Inscribe Conduit"}
            </PixelButton>
          </div>
        </form>
      </PixelCard>

      {/* ── Active Conduits Table ──────────────────────────────────────── */}
      <PixelCard variant="default" className="p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--color-border-gothic)]">
          <h2 className="font-pixel text-xs sm:text-sm text-[var(--color-text-bone)] uppercase tracking-wide">
            Active Conduits ({contacts.length})
          </h2>
        </div>

        {contacts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-mono text-xs text-[var(--color-text-ash)]">
              No social conduits established yet. Add the first above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#120E18] border-b border-[var(--color-border-gothic)] text-[var(--color-text-ash)] uppercase text-[11px]">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Platform</th>
                  <th className="p-3">Label</th>
                  <th className="p-3">URL</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-gothic)]">
                {contacts.map((c) =>
                  editingId === c.id ? (
                    /* Inline edit row */
                    <tr key={c.id} className="bg-[#1A1424]">
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
                      <td className="p-2 space-y-1">
                        <select
                          value={editPlatform}
                          onChange={(e) => setEditPlatform(e.target.value)}
                          className="w-full min-w-[110px] px-2 py-1 bg-[#0B0A10] border border-[var(--color-accent-gold)] text-[var(--color-text-bone)] font-mono text-xs focus:outline-none cursor-pointer"
                          aria-label="Edit platform"
                        >
                          {PLATFORM_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.value}
                            </option>
                          ))}
                        </select>
                        {editPlatform === "Other" && (
                          <input
                            type="text"
                            value={editCustomPlatform}
                            onChange={(e) => setEditCustomPlatform(e.target.value)}
                            placeholder="Platform name"
                            maxLength={50}
                            className="w-full min-w-[110px] px-2 py-1 bg-[#0B0A10] border border-[var(--color-accent-gold)] text-[var(--color-text-bone)] font-mono text-xs focus:outline-none"
                            aria-label="Custom platform name"
                          />
                        )}
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          maxLength={100}
                          className="w-full min-w-[120px] px-2 py-1 bg-[#0B0A10] border border-[var(--color-accent-gold)] text-[var(--color-text-bone)] font-mono text-xs focus:outline-none"
                          aria-label="Edit label"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="url"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          className="w-full min-w-[180px] px-2 py-1 bg-[#0B0A10] border border-[var(--color-accent-gold)] text-[var(--color-text-bone)] font-mono text-xs focus:outline-none"
                          aria-label="Edit URL"
                        />
                      </td>
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
                    /* Read row */
                    <tr key={c.id} className="hover:bg-[#181324]">
                      <td className="p-3 text-[var(--color-accent-gold)] font-pixel text-xs">
                        #{c.order}
                      </td>
                      <td className="p-3 font-medium text-[var(--color-text-bone)]">
                        <div className="flex items-center gap-2">
                          <div className="text-[var(--color-text-ash)] shrink-0">
                            {(() => { const Icon = getContactIcon(c.iconKey); return <Icon size={16} />; })()}
                          </div>
                          {c.platform}
                        </div>
                      </td>
                      <td className="p-3 text-[var(--color-text-ash)]">{c.label}</td>
                      <td className="p-3 text-[var(--color-text-ash)] max-w-[200px]">
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-accent-gold)] hover:underline truncate block"
                        >
                          {c.url} ↗
                        </a>
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
                          Sever
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Sever Conduit"
        message={`Permanently sever the "${deleteTarget?.platform}" communication conduit? This cannot be undone.`}
        confirmLabel={deleting ? "Severing..." : "Sever"}
        cancelLabel="Keep"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
