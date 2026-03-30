"use client";

import { deleteMediaAsset } from "@/app/actions";

type Props = {
  mediaAssetId: string;
  entrySlug: string;
};

export default function DeleteMediaAssetButton({
  mediaAssetId,
  entrySlug,
}: Props) {
  return (
    <form
      action={deleteMediaAsset}
      onSubmit={(e) => {
        const ok = window.confirm("Are you sure you want to delete this media asset?");
        if (!ok) e.preventDefault();
      }}
    >
      <input type="hidden" name="mediaAssetId" value={mediaAssetId} />
      <input type="hidden" name="entrySlug" value={entrySlug} />

      <button
        type="submit"
        className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
      >
        Delete
      </button>
    </form>
  );
}