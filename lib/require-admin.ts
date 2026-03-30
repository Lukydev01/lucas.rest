import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";

export async function requireAdmin() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/login");
  }
}