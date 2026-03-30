"use client";

import { useActionState, useMemo, useState } from "react";
import { updateEntry, type UpdateEntryState } from "@/app/actions";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";

type Category = {
  id: string;
  name: string;
};

type Tag = {
  id: string;
  name: string;
};

type EntryTag = {
  tagId: string;
};

type Entry = {
  id: string;
  title: string;
  slug: string;
  kind: "movie" | "series" | "book" | "anime" | "other";
  description: string | null;
  personalNote: string | null;
  imageUrl: string | null;
  year: number | null;
  creator: string | null;
  categoryId: string;
  tags: EntryTag[];
};

type Props = {
  entry: Entry;
  categories: Category[];
  tags: Tag[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const initialState: UpdateEntryState = {};

export default function EditEntryForm({ entry, categories, tags }: Props) {
  const [state, formAction] = useActionState(updateEntry, initialState);
  const [title, setTitle] = useState(entry.title);
  const [slug, setSlug] = useState(entry.slug);

  const selectedTagIds = new Set(entry.tags.map((tag) => tag.tagId));

  const slugPreview = useMemo(() => {
    return slug.trim() ? slugify(slug) : slugify(title);
  }, [title, slug]);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="entryId" value={entry.id} />
      <input type="hidden" name="originalSlug" value={entry.slug} />

      {state?.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-neutral-200">
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Perfect Blue"
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
            placeholder="optional - auto-generated from title"
          />
          <p className="text-xs text-neutral-500">
            URL preview:{" "}
            <span className="text-neutral-300">
              /library/{slugPreview || "your-entry-slug"}
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
  <label htmlFor="kind" className="text-sm font-medium text-neutral-200">
    Kind
  </label>
  <select
    id="kind"
    name="kind"
    defaultValue={entry.kind}
    className="w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-white/20"
  >
    <option value="movie">Movie</option>
    <option value="series">Series</option>
    <option value="book">Book</option>
    <option value="anime">Anime</option>
    <option value="other">Other</option>
  </select>
  <p className="text-xs text-neutral-500">
    Choose the content type so the site knows how to handle playback, episodes,
    or reading.
  </p>
</div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-neutral-200"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={entry.description ?? ""}
          className="min-h-32 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-white/20"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="personalNote"
          className="text-sm font-medium text-neutral-200"
        >
          Personal Note
        </label>
        <textarea
          id="personalNote"
          name="personalNote"
          defaultValue={entry.personalNote ?? ""}
          className="min-h-32 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-white/20"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="creator"
            className="text-sm font-medium text-neutral-200"
          >
            Creator
          </label>
          <Input
            id="creator"
            name="creator"
            defaultValue={entry.creator ?? ""}
            placeholder="e.g. Satoshi Kon, Dostoevsky, David Lynch"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="year" className="text-sm font-medium text-neutral-200">
            Year
          </label>
          <Input
            id="year"
            name="year"
            type="number"
            defaultValue={entry.year ?? ""}
            placeholder="e.g. 1997"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="imageUrl"
          className="text-sm font-medium text-neutral-200"
        >
          Cover / Image URL
        </label>
        <Input
          id="imageUrl"
          name="imageUrl"
          defaultValue={entry.imageUrl ?? ""}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="categoryId"
          className="text-sm font-medium text-neutral-200"
        >
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={entry.categoryId}
          required
          className="w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-white/20"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-neutral-200">Tags</label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {tags.map((tag) => (
            <label
              key={tag.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-neutral-300 transition hover:bg-white/[0.04]"
            >
              <input
                type="checkbox"
                name="tagIds"
                value={tag.id}
                defaultChecked={selectedTagIds.has(tag.id)}
                className="h-4 w-4 accent-white"
              />
              <span>{tag.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SubmitButton idleText="Save Changes" pendingText="Saving..." />
        <p className="text-xs text-neutral-500">
          Changes will be saved directly to the database.
        </p>
      </div>
    </form>
  );
}