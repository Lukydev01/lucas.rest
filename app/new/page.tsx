import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import NewEntryForm from "@/components/NewEntryForm";

export default async function NewEntryPage() {
  await requireAdmin();

  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-12">
        <p className="mb-3 text-xs uppercase tracking-widest text-neutral-600">
          Create
        </p>
        <h1
          className="mb-4 text-4xl text-white md:text-5xl"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          New Entry
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-neutral-500">
          Add a new item to your repository with proper structure, category, and
          tags.
        </p>
      </div>

      <NewEntryForm categories={categories} tags={tags} />
    </div>
  );
}