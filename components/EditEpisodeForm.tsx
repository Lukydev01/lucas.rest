"use client";

import { useActionState } from "react";
import { updateEpisode, type MediaFormState } from "@/app/actions";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";

type Episode = {
  id: string;
  number: number;
  title: string;
  description: string | null;
  videoUrl: string | null;
  youtubeId?: string | null;
  thumbnailUrl: string | null;
};

type Props = {
  episode: Episode;
  seasonId: string;
  entrySlug: string;
};

const initialState: MediaFormState = {};

export default function EditEpisodeForm({
  episode,
  seasonId,
  entrySlug,
}: Props) {
  const [state, formAction] = useActionState(updateEpisode, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <input type="hidden" name="episodeId" value={episode.id} />
      <input type="hidden" name="seasonId" value={seasonId} />
      <input type="hidden" name="entrySlug" value={entrySlug} />

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
          <Input
            name="number"
            type="number"
            defaultValue={episode.number}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-200">Title</label>
          <Input
            name="title"
            defaultValue={episode.title}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-200">
          Description
        </label>
        <textarea
          name="description"
          defaultValue={episode.description ?? ""}
          className="min-h-24 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-white/20"
        />
      </div>

      <div className="space-y-2">
  <label className="text-sm font-medium text-neutral-200">
    YouTube URL
  </label>
  <Input
    name="youtubeUrl"
    defaultValue={
      episode.youtubeId
        ? `https://www.youtube.com/watch?v=${episode.youtubeId}`
        : ""
    }
    placeholder="https://www.youtube.com/watch?v=..."
    required
  />
</div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-200">
          Thumbnail URL
        </label>
        <Input
          name="thumbnailUrl"
          defaultValue={episode.thumbnailUrl ?? ""}
        />
      </div>

      <SubmitButton idleText="Save Episode" pendingText="Saving..." />
    </form>
  );
}