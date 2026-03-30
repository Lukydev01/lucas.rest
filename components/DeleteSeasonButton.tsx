"use client";

import { deleteSeason } from "@/app/actions";

type Props = {
  seasonId: string;
  entrySlug: string;
};

export default function DeleteSeasonButton({ seasonId, entrySlug }: Props) {
  return (
    <form
      action={deleteSeason}
      onSubmit={(e) => {
        const ok = window.confirm(
          "Are you sure you want to delete this season? All episodes inside it will also be deleted."
        );
        if (!ok) e.preventDefault();
      }}
    >
      <input type="hidden" name="seasonId" value={seasonId} />
      <input type="hidden" name="entrySlug" value={entrySlug} />

      <button
        type="submit"
        className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
      >
        Delete Season
      </button>
    </form>
  );
}