"use client";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:text-white"
    >
      Logout
    </button>
  );
}