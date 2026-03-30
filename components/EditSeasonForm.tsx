"use client";

import { useActionState } from "react";
import { updateSeason, type MediaFormState } from "@/app/actions";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";

type Season = {
  id: string;
  number: number;
  title: string | null;
};

type Props = {
  season: Season;
  entryId: string;
  entrySlug: string;
};

const initialState: MediaFormState = {};

export default function EditSeasonForm({ season, entryId, entrySlug }: Props) {
  const [state, formAction] = useActionState(updateSeason, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <input type="hidden" name="seasonId" value={season.id} />
      <input type="hidden" name="entryId" value={entryId} />
      <input type="hidden" name="entrySlug" value={entrySlug} />

      {state?.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-200">
            Season Number
          </label>
          <Input
            name="number"
            type="number"
            defaultValue={season.number}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-200">Title</label>
          <Input
            name="title"
            defaultValue={season.title ?? ""}
            placeholder="e.g. Season 1"
          />
        </div>
      </div>

      <SubmitButton idleText="Save Season" pendingText="Saving..." />
    </form>
  );
}