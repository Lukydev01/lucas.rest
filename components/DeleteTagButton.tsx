"use client";

import { deleteTag } from "@/app/actions";

type Props = {
  tagId: string;
  slug: string;
};

export default function DeleteTagButton({ tagId, slug }: Props) {
  return (
    <form
      action={deleteTag}
      onSubmit={(e) => {
        const ok = window.confirm(
          "Are you sure you want to delete this tag? It will be removed from all related entries."
        );

        if (!ok) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="tagId" value={tagId} />
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