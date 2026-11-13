import React from "react";
import { redirect } from "next/navigation";
import { validateAdminSession } from "@/lib/auth-server";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await validateAdminSession();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div data-admin-root className="min-h-screen flex flex-col bg-[var(--color-bg-abyss)] text-[var(--color-text-bone)]">
      <AdminHeader userEmail={user.email} />
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 w-full py-8">
        {children}
      </main>
    </div>
  );
}
