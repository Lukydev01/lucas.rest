"use client";

import { useActionState } from "react";
import { createMediaAsset, type MediaFormState } from "@/app/actions";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";

type Props = {
  entryId: string;
  entrySlug: string;
};

const initialState: MediaFormState = {};

export default function CreateMediaAssetForm({ entryId, entrySlug }: Props) {
  const [state, formAction] = useActionState(createMediaAsset, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <input type="hidden" name="entryId" value={entryId} />
      <input type="hidden" name="entrySlug" value={entrySlug} />

      <div>
        <h2
          className="mb-2 text-2xl text-white"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Add Media Asset
        </h2>
        <p className="text-sm text-neutral-500">
          Add a main video, PDF, or other media asset to this entry.
        </p>
      </div>

      {state?.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-200">Type</label>
        <select
          name="type"
          defaultValue="video"
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
        <Input name="title" placeholder="e.g. Main Film, Book PDF" />
      </div>

      <div className="space-y-2">
  <label className="text-sm font-medium text-neutral-200">
    Asset URL
  </label>
  <Input
    name="youtubeUrl"
    placeholder="https://www.site.com/link..."
    required
  />
</div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-200">MIME Type</label>
        <Input
  name="mimeType"
  placeholder="e.g. video/youtube, application/pdf"
/>
      </div>

      <SubmitButton idleText="Add Media" pendingText="Adding..." />
    </form>
  );
}