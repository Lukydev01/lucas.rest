"use client";

import { deleteCategory } from "@/app/actions";

type Props = {
  categoryId: string;
  slug: string;
  entryCount: number;
};

export default function DeleteCategoryButton({
  categoryId,
  slug,
  entryCount,
}: Props) {
  const disabled = entryCount > 0;

  return (
    <form
      action={deleteCategory}
      onSubmit={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }

        const ok = window.confirm(
          "Are you sure you want to delete this category?"
        );

        if (!ok) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="slug" value={slug} />

      <button
        type="submit"
        disabled={disabled}
        className={`rounded-full px-4 py-2 text-sm transition ${
          disabled
            ? "cursor-not-allowed border border-white/10 bg-white/[0.03] text-neutral-600"
            : "border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
        }`}
      >
        {disabled ? "Has entries" : "Delete"}
      </button>
    </form>
  );
}