"use client";

import { deleteEpisode } from "@/app/actions";

type Props = {
  episodeId: string;
  entrySlug: string;
};

export default function DeleteEpisodeButton({ episodeId, entrySlug }: Props) {
  return (
    <form
      action={deleteEpisode}
      onSubmit={(e) => {
        const ok = window.confirm("Are you sure you want to delete this episode?");
        if (!ok) e.preventDefault();
      }}
    >
      <input type="hidden" name="episodeId" value={episodeId} />
      <input type="hidden" name="entrySlug" value={entrySlug} />

      <button
        type="submit"
        className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
      >
        Delete Episode
      </button>
    </form>
  );
}