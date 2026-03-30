"use client";

import { useActionState, useMemo, useState } from "react";
import { createTag, type TagFormState } from "@/app/actions";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const initialState: TagFormState = {};

export default function CreateTagForm() {
  const [state, formAction] = useActionState(createTag, initialState);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const slugPreview = useMemo(() => {
    return slug.trim() ? slugify(slug) : slugify(name);
  }, [name, slug]);

  return (
    <form action={formAction} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div>
        <h2
          className="mb-2 text-2xl text-white"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Create Tag
        </h2>
        <p className="text-sm text-neutral-500">
          Add a new tag to organize your repository.
        </p>
      </div>

      {state?.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-neutral-200">
          Name
        </label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Tragedy"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="slug" className="text-sm font-medium text-neutral-200">
          Slug
        </label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="optional - auto-generated from name"
        />
        <p className="text-xs text-neutral-500">
          URL preview:{" "}
          <span className="text-neutral-300">
            /tags/{slugPreview || "your-tag-slug"}
          </span>
        </p>
      </div>

      <SubmitButton idleText="Create Tag" pendingText="Creating..." />
    </form>
  );
}