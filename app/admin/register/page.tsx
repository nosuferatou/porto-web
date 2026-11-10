import { redirect } from "next/navigation";

// /admin/register is no longer used. The first-run setup lives at /admin/setup.
// Redirect so old links don't dead-end.
export default function RegisterRedirectPage() {
  redirect("/admin/setup");
}
