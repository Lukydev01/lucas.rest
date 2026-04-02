import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LibraryPage() {
  const entries = await prisma.entry.findMany({
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-16">
        <p className="mb-3 text-xs uppercase tracking-widest text-neutral-600">
          Archive
        </p>
        <h1
          className="mb-4 text-4xl text-white md:text-5xl"
        >
          Library
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-neutral-500">
          Everything currently stored in the repository, now coming from the real
          database.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-neutral-400">
          No entries found yet.
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

                    {entry.tags.slice(0, 2).map((entryTag: any) => (
                      <span
                        key={entryTag.tagId}
                        className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-neutral-500"
                      >
                        {entryTag.tag.name}
                      </span>
                    ))}
                  </div>

                  <CardTitle
  className="text-base text-white"
  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
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

                  {entry.personalNote && (
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <p className="mb-1 text-[10px] uppercase tracking-widest text-neutral-600">
                        Personal Note
                      </p>
                      <p className="line-clamp-3 text-sm leading-relaxed text-neutral-400">
                        {entry.personalNote}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}