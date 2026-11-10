"use client";

import React, { useState, useEffect } from "react";
import { PixelCard, PixelButton, PixelFrame } from "@/components/ui";
import { AdminAlert, AdminAlertMessage } from "@/components/admin/AdminAlert";

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const near = len > max * 0.85;
  const over = len > max;
  return (
    <span
      className={`font-mono text-[10px] ${
        over ? "text-[#E05368]" : near ? "text-[var(--color-accent-gold)]" : "text-[var(--color-text-ash)]"
      }`}
    >
      {len}/{max}
    </span>
  );
}

const inputCls =
  "w-full px-3 py-2 bg-[#0B0A10] border-2 border-[var(--color-border-subtle)] text-[var(--color-text-bone)] font-mono text-xs focus:border-[var(--color-accent-gold)] focus:outline-none pixel-shadow-sm";

const labelCls =
  "block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1";

export default function AdminProfilePage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [timezone, setTimezone] = useState("Asia/Jakarta");
  const [timezones] = useState<string[]>(() => {
  try {
    return typeof Intl.supportedValuesOf === "function"
      ? (Intl.supportedValuesOf("timeZone") as string[])
      : [];
  } catch {
    return [];
  }
});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<AdminAlertMessage | null>(null);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setName(data.profile.name || "");
          setTitle(data.profile.title || "");
          setBio(data.profile.bio || "");
          setLocation(data.profile.location || "");
          setStatus(data.profile.status || "");
          setPhotoUrl(data.profile.photoUrl || "");
          setSpecialty(data.profile.specialty || "");
          setDiscipline(data.profile.discipline || "");
          setTimezone(data.profile.timezone || "Asia/Jakarta");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const showAlert = (text: string, type: AdminAlertMessage["type"] = "error") => {
    setAlert({ text, type });
    if (type !== "error") {
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        showAlert(data.error || "Upload failed.", "error");
      } else {
        setPhotoUrl(data.url);
        showAlert("Profile image uploaded.", "success");
      }
    } catch {
      showAlert("Failed to upload image.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, title, bio, location, status, photoUrl, specialty, discipline, timezone }),
      });

      const data = await res.json();
      if (!res.ok) {
        showAlert(data.error || "Update failed.", "error");
      } else {
        showAlert("Profile chronicle etched into stone.", "success");
      }
    } catch {
      showAlert("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 font-pixel text-xs text-[var(--color-accent-gold)]">
        Deciphering Profile Runes...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-pixel text-xl sm:text-2xl text-[var(--color-text-bone)] uppercase tracking-wide">
          Archivist Chronicle
        </h1>
        <p className="font-mono text-xs text-[var(--color-text-ash)] mt-1">
          Update the profile details displayed in the public Information section.
        </p>
      </div>

      <AdminAlert message={alert} />

      <PixelCard variant="default" cornerStuds className="p-6">
        <form onSubmit={handleSave} className="space-y-5">
          {/* ── Photo ── */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[var(--color-border-gothic)]">
            <PixelFrame variant="gold" aspectRatio="square" className="w-24 h-24 shrink-0">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt="Archivist avatar preview"
                  className="w-full h-full object-cover pixelated"
                />
              ) : (
                <div className="w-full h-full bg-[#181124] flex items-center justify-center font-pixel text-2xl text-[var(--color-accent-gold)]">
                  ⚔
                </div>
              )}
            </PixelFrame>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <label htmlFor="avatar-upload" className={labelCls}>
                Profile Portrait
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileUpload}
                disabled={uploading}
                className="text-xs font-mono text-[var(--color-text-ash)] file:mr-3 file:py-1.5 file:px-3 file:border-2 file:border-[var(--color-border-subtle)] file:bg-[#120E18] file:text-[var(--color-accent-gold)] file:font-pixel file:text-xs file:uppercase hover:file:border-[var(--color-accent-gold)] cursor-pointer disabled:opacity-50"
              />
              {uploading && (
                <p className="font-mono text-[11px] text-[var(--color-accent-gold)]">
                  Uploading...
                </p>
              )}
              <p className="font-mono text-[10px] text-[var(--color-text-ash)]">
                Max 5MB · PNG, JPEG, WEBP, GIF.
              </p>
              {photoUrl && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="flex-1 px-2 py-1 bg-[#0B0A10] border border-[var(--color-border-gothic)] text-[var(--color-text-ash)] font-mono text-[10px] focus:border-[var(--color-accent-gold)] focus:outline-none"
                    placeholder="Photo URL"
                    aria-label="Photo URL"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl("")}
                    className="font-pixel text-[10px] text-[#E05368] border border-[var(--color-accent-blood)] px-2 py-1 hover:bg-[var(--color-accent-blood)] hover:text-[var(--color-text-bone)] cursor-pointer"
                    aria-label="Clear photo"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Name & Title ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="profile-name" className={labelCls}>Name</label>
                <CharCount value={name} max={100} />
              </div>
              <input
                id="profile-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className={inputCls}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="profile-title" className={labelCls}>Title / Role</label>
                <CharCount value={title} max={150} />
              </div>
              <input
                id="profile-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={150}
                className={inputCls}
              />
            </div>
          </div>

          {/* ── Location & Status ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="profile-location" className={labelCls}>Location</label>
                <CharCount value={location} max={150} />
              </div>
              <input
                id="profile-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={150}
                className={inputCls}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="profile-status" className={labelCls}>Availability</label>
                <CharCount value={status} max={150} />
              </div>
              <input
                id="profile-status"
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="e.g. Available for new projects"
                maxLength={150}
                className={inputCls}
              />
            </div>
          </div>

          {/* ── Bio ── */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="profile-bio" className={labelCls}>Biography</label>
              <CharCount value={bio} max={2000} />
            </div>
            <textarea
              id="profile-bio"
              rows={5}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={2000}
              className={`${inputCls} leading-relaxed`}
            />
          </div>

          {/* ── Homepage Information Fields ── */}
          <div className="pt-4 border-t border-[var(--color-border-gothic)] space-y-4">
            <p className="font-pixel text-xs text-[var(--color-accent-gold)] uppercase tracking-wider">
              ◆ Homepage Information Fields
            </p>
            <p className="font-mono text-[11px] text-[var(--color-text-ash)] -mt-2">
              These values appear in the Specialty, Discipline, and Sanctuary cells on the homepage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="profile-specialty" className={labelCls}>Specialty</label>
                  <CharCount value={specialty} max={100} />
                </div>
                <input
                  id="profile-specialty"
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g. Web & Pixel Art"
                  maxLength={100}
                  className={inputCls}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="profile-discipline" className={labelCls}>Discipline</label>
                  <CharCount value={discipline} max={100} />
                </div>
                <input
                  id="profile-discipline"
                  type="text"
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  placeholder="e.g. Fullstack Craft"
                  maxLength={100}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label htmlFor="profile-timezone" className={`${labelCls} mb-1`}>
                Sanctuary Timezone{" "}
                <span className="font-mono text-[10px] text-[var(--color-text-ash)] normal-case">
                  (IANA identifier — displayed as a live clock)
                </span>
              </label>
              <input
                id="profile-timezone"
                type="text"
                list="tz-list"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="Asia/Jakarta"
                maxLength={80}
                className={inputCls}
                autoComplete="off"
                spellCheck={false}
              />
              <datalist id="tz-list">
                {timezones.map((tz) => (
                  <option key={tz} value={tz} />
                ))}
              </datalist>
              {timezone && (() => {
                try {
                  const offset = new Intl.DateTimeFormat("en-US", {
                    timeZone: timezone,
                    timeZoneName: "shortOffset",
                  }).format(new Date()).match(/(GMT[+-]\d+(?::\d+)?|GMT)/i)?.[1] ?? "";
                  return (
                    <p className="font-mono text-[10px] text-[var(--color-text-ash)] mt-1">
                      Current offset: {offset || "unknown"} ·{" "}
                      {new Intl.DateTimeFormat("en-GB", {
                        timeZone: timezone,
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }).format(new Date())}
                    </p>
                  );
                } catch {
                  return (
                    <p className="font-mono text-[10px] text-[#E05368] mt-1">
                      Not a valid IANA timezone identifier.
                    </p>
                  );
                }
              })()}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <PixelButton type="submit" variant="primary" size="md" disabled={saving}>
              {saving ? "Inscribing..." : "Save Profile"}
            </PixelButton>
          </div>
        </form>
      </PixelCard>
    </div>
  );
}
