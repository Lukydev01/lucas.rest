import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      entries: {
        include: {
          entry: {
            include: {
              category: true,
              tags: {
                include: {
                  tag: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!tag) {
    return notFound();
  }

  const entries = tag.entries.map((entryTag: any) => entryTag.entry);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12">
        <p className="mb-3 text-xs uppercase tracking-widest text-neutral-600">
          Tag
        </p>

        <h1
          className="mb-4 text-4xl text-white md:text-5xl"
        >
          {tag.name}
        </h1>

        <p className="max-w-xl text-sm leading-relaxed text-neutral-500">
          {entries.length} {entries.length === 1 ? "entry" : "entries"} in this tag.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-neutral-400">
          No entries found for this tag.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {entries.map((entry: any) => (
            <Link key={entry.id} href={`/library/${entry.slug}`}>
              <Card className="h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:bg-white/[0.04]">
                {entry.imageUrl ? (
                  <div className="relative aspect-[16/8] w-full overflow-hidden border-b border-white/5">
                    <Image
                      src={entry.imageUrl}
                      alt={entry.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/8] items-center justify-center border-b border-white/5 bg-white/[0.02] text-sm text-neutral-600">
                    No cover image
                  </div>
                )}

                <CardHeader className="pb-2">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-neutral-300">
                      {entry.category.name}
                    </span>

                    {entry.year && (
                      <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-neutral-500">
                        {entry.year}
                      </span>
                    )}
                  </div>

                  <CardTitle
                    className="text-lg leading-snug text-white"
                  >
                    {entry.title}
                  </CardTitle>

                  {entry.creator && (
                    <p className="text-sm text-neutral-500">{entry.creator}</p>
                  )}
                </CardHeader>

                <CardContent>
                  <p className="mb-4 text-sm leading-relaxed text-neutral-500">
                    {entry.description ?? "No description yet."}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}