import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditEntryForm from "@/components/EditEntryForm";
import { requireAdmin } from "@/lib/require-admin";

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  
  const { slug } = await params;

  const [entry, categories, tags] = await Promise.all([
    
    prisma.entry.findUnique({
      where: { slug },
      include: {
        tags: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!entry) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-12">
        <p className="mb-3 text-xs uppercase tracking-widest text-neutral-600">
          Edit
        </p>
        <h1
          className="mb-4 text-4xl text-white md:text-5xl"
        >
          Edit Entry
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-neutral-500">
          Update title, slug, description, category, and tags.
        </p>
      </div>

      <EditEntryForm entry={entry} categories={categories} tags={tags} />
    </div>
  );
}