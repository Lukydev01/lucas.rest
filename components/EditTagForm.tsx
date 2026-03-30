"use client";

import { useActionState, useMemo, useState } from "react";
import { updateTag, type TagFormState } from "@/app/actions";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";

type Tag = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  tag: Tag;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const initialState: TagFormState = {};

export default function EditTagForm({ tag }: Props) {
  const [state, formAction] = useActionState(updateTag, initialState);
  const [name, setName] = useState(tag.name);
  const [slug, setSlug] = useState(tag.slug);

  const slugPreview = useMemo(() => {
    return slug.trim() ? slugify(slug) : slugify(name);
  }, [name, slug]);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <input type="hidden" name="tagId" value={tag.id} />
      <input type="hidden" name="originalSlug" value={tag.slug} />

      {state?.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-200">Name</label>
        <Input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tag name"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-200">Slug</label>
        <Input
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Tag slug"
        />
        <p className="text-xs text-neutral-500">
          URL preview:{" "}
          <span className="text-neutral-300">
            /tags/{slugPreview || "your-tag-slug"}
          </span>
        </p>
      </div>

      <SubmitButton idleText="Save Tag" pendingText="Saving..." />
    </form>
  );
}