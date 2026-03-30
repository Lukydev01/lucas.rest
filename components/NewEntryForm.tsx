"use client";

import { useActionState, useMemo, useState } from "react";
import { createEntry, type CreateEntryState } from "@/app/actions";
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

type NewEntryFormProps = {
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

const initialState: CreateEntryState = {};

export default function NewEntryForm({
  categories,
  tags,
}: NewEntryFormProps) {
  const [state, formAction] = useActionState(createEntry, initialState);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const slugPreview = useMemo(() => {
    return slug.trim() ? slugify(slug) : slugify(title);
  }, [title, slug]);

  return (
    <form action={formAction} className="space-y-8">
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
          <p className="text-xs text-neutral-500">
            The main title of the entry.
          </p>
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
          defaultValue="other"
          className="w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-white/20"
        >
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="book">Book</option>
          <option value="anime">Anime</option>
          <option value="other">Other</option>
        </select>
        <p className="text-xs text-neutral-500">
          Choose the type of entry so the site knows whether it should behave like a
          film, series, book, anime, or something else.
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
          placeholder="Write a short description..."
          className="min-h-32 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-white/20"
        />
        <p className="text-xs text-neutral-500">
          A concise overview of the work.
        </p>
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
          placeholder="Why does this matter to you?"
          className="min-h-32 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-white/20"
        />
        <p className="text-xs text-neutral-500">
          Your own impression, attachment, or reason for including it.
        </p>
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
            placeholder="e.g. Satoshi Kon, Dostoevsky, David Lynch"
          />
          <p className="text-xs text-neutral-500">
            Author, director, creator, or main associated name.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="year" className="text-sm font-medium text-neutral-200">
            Year
          </label>
          <Input
            id="year"
            name="year"
            type="number"
            placeholder="e.g. 1997"
          />
          <p className="text-xs text-neutral-500">
            Release or publication year.
          </p>
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
          placeholder="https://example.com/image.jpg"
        />
        <p className="text-xs text-neutral-500">
          Paste an image URL for now. Real uploads come later.
        </p>
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
        <p className="text-xs text-neutral-500">
          Choose the main medium for this entry.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-neutral-200">Tags</label>
          <p className="mt-1 text-xs text-neutral-500">
            Pick themes, moods, or qualities that fit.
          </p>
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
                className="h-4 w-4 accent-white"
              />
              <span>{tag.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SubmitButton
          idleText="Create Entry"
          pendingText="Creating..."
        />
        <p className="text-xs text-neutral-500">
          Your entry will be saved directly to the database.
        </p>
      </div>
    </form>
  );
}