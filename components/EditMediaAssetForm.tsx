"use client";

import { useActionState } from "react";
import { updateMediaAsset, type MediaFormState } from "@/app/actions";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";

type MediaAsset = {
  id: string;
  type: "video" | "pdf" | "image" | "audio" | "other";
  title: string | null;
  url: string | null;
  youtubeId?: string | null;
  mimeType: string | null;
};

type Props = {
  asset: MediaAsset;
  entrySlug: string;
};

const initialState: MediaFormState = {};

export default function EditMediaAssetForm({ asset, entrySlug }: Props) {
  const [state, formAction] = useActionState(updateMediaAsset, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <input type="hidden" name="mediaAssetId" value={asset.id} />
      <input type="hidden" name="entrySlug" value={entrySlug} />

      {state?.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-200">Type</label>
          <select
            name="type"
            defaultValue={asset.type}
            className="w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-white/20"
          >
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
            <option value="audio">Audio</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-200">Title</label>
          <Input name="title" defaultValue={asset.title ?? ""} placeholder="Asset title" />
        </div>
      </div>

      <div className="space-y-2">
  <label className="text-sm font-medium text-neutral-200">
    YouTube URL / Asset URL
  </label>
  <Input
    name="youtubeUrl"
    defaultValue={
      asset.type === "video" && asset.youtubeId
        ? `https://www.youtube.com/watch?v=${asset.youtubeId}`
        : asset.url ?? ""
    }
    placeholder="https://www.youtube.com/watch?v=..."
    required
  />
</div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-200">MIME Type</label>
        <Input
  name="mimeType"
  defaultValue={asset.mimeType ?? ""}
  placeholder="e.g. video/youtube, application/pdf"
/>
      </div>

      <SubmitButton idleText="Save Asset" pendingText="Saving..." />
    </form>
  );
}