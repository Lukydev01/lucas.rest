"use client";

import { deleteEntry } from "@/app/actions";

type Props = {
  entryId: string;
  slug: string;
};

export default function DeleteEntryButton({ entryId, slug }: Props) {
  return (
    <form
      action={deleteEntry}
      onSubmit={(e) => {
        const ok = window.confirm(
          "Are you sure you want to delete this entry?"
        );

        if (!ok) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="entryId" value={entryId} />
      <input type="hidden" name="slug" value={slug} />

      <button
        type="submit"
        className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
      >
        Delete
      </button>
    </form>
  );
}