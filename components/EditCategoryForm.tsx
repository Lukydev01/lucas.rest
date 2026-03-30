"use client";

import { useActionState, useMemo, useState } from "react";
import { updateCategory, type CategoryFormState } from "@/app/actions";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  category: Category;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const initialState: CategoryFormState = {};

export default function EditCategoryForm({ category }: Props) {
  const [state, formAction] = useActionState(updateCategory, initialState);
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);

  const slugPreview = useMemo(() => {
    return slug.trim() ? slugify(slug) : slugify(name);
  }, [name, slug]);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <input type="hidden" name="categoryId" value={category.id} />
      <input type="hidden" name="originalSlug" value={category.slug} />

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
          placeholder="Category name"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-200">Slug</label>
        <Input
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Category slug"
        />
        <p className="text-xs text-neutral-500">
          URL preview:{" "}
          <span className="text-neutral-300">
            /categories/{slugPreview || "your-category-slug"}
          </span>
        </p>
      </div>

      <SubmitButton idleText="Save Category" pendingText="Saving..." />
    </form>
  );
}