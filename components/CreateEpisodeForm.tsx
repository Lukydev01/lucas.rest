"use client";

import { useActionState } from "react";
import { createEpisode, type MediaFormState } from "@/app/actions";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";

type Props = {
  seasonId: string;
  entrySlug: string;
  seasonLabel: string;
};

const initialState: MediaFormState = {};

export default function CreateEpisodeForm({
  seasonId,
  entrySlug,
  seasonLabel,
}: Props) {
  const [state, formAction] = useActionState(createEpisode, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <input type="hidden" name="seasonId" value={seasonId} />
      <input type="hidden" name="entrySlug" value={entrySlug} />

      <div>
        <h3
          className="mb-2 text-xl text-white"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Add Episode — {seasonLabel}
        </h3>
      </div>

      {state?.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-200">
            Episode Number
          </label>
          <Input name="number" type="number" placeholder="e.g. 1" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-200">Title</label>
          <Input name="title" placeholder="e.g. Pilot" required />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-200">
          Description
        </label>
        <textarea
          name="description"
          className="min-h-24 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-white/20"
          placeholder="Episode description..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-200">
          Video URL
        </label>
        <Input
          name="videoUrl"
          placeholder="https://example.com/video.mp4"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-200">
          Thumbnail URL
        </label>
        <Input
          name="thumbnailUrl"
          placeholder="https://example.com/thumb.jpg"
        />
      </div>

      <SubmitButton idleText="Add Episode" pendingText="Adding..." />
    </form>
  );
}