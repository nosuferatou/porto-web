import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminSetupForm from "./AdminSetupForm";

// Server component: checks the DB before rendering anything to the client.
// If an admin already exists, redirect immediately — the form never reaches the browser.
export default async function AdminSetupPage() {
  // Setup is only available in local development. In production the admin
  // account must be seeded via `npx prisma db seed` before deployment.
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const count = await prisma.adminUser.count();
  if (count > 0) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[var(--color-bg-abyss)] selection:bg-[var(--color-accent-blood)] selection:text-[var(--color-text-bone)]">
      <div className="w-full max-w-md">
        <AdminSetupForm />
      </div>
    </div>
  );
}
