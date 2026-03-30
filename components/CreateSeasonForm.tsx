"use client";

import { useActionState } from "react";
import { createSeason, type MediaFormState } from "@/app/actions";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";

type Props = {
  entryId: string;
  entrySlug: string;
};

const initialState: MediaFormState = {};

export default function CreateSeasonForm({ entryId, entrySlug }: Props) {
  const [state, formAction] = useActionState(createSeason, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <input type="hidden" name="entryId" value={entryId} />
      <input type="hidden" name="entrySlug" value={entrySlug} />

      <div>
        <h2
          className="mb-2 text-2xl text-white"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Add Season
        </h2>
        <p className="text-sm text-neutral-500">
          Create a season for a series or anime entry.
        </p>
      </div>

      {state?.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-200">Season Number</label>
        <Input name="number" type="number" placeholder="e.g. 1" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-200">Title</label>
        <Input name="title" placeholder="e.g. Season 1" />
      </div>

      <SubmitButton idleText="Add Season" pendingText="Adding..." />
    </form>
  );
}