import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function AuthNav() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:text-white"
      >
        Login
      </Link>
    );
  }

  return <LogoutButton />;
}