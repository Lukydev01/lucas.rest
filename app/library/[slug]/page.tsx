import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DeleteEntryButton from "@/components/DeleteEntryButton";
import { isAdmin } from "@/lib/admin";

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const admin = await isAdmin();

  const { slug } = await params;

  const entry = await prisma.entry.findUnique({
    where: {
      slug,
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      mediaAssets: true,
      seasons: {
        include: {
          episodes: {
            orderBy: {
              number: "asc",
            },
          },
        },
        orderBy: {
          number: "asc",
        },
      },
    },
  });

  if (!entry) return notFound();

  const mainVideo = entry.mediaAssets.find((asset) => asset.type === "video");
  const mainPdf = entry.mediaAssets.find((asset) => asset.type === "pdf");
  const isSeriesLike = entry.kind === "series" || entry.kind === "anime";

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="grid gap-10 md:grid-cols-[320px_1fr]">
        <div>
          {entry.imageUrl ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <Image
                src={entry.imageUrl}
                alt={entry.title}
                width={600}
                height={900}
                className="h-auto w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-sm text-neutral-500">
              No cover image
            </div>
          )}
        </div>

        <div>
          <Link
            href={`/categories/${entry.category.slug}`}
            className="mb-3 inline-block text-xs uppercase tracking-widest text-neutral-500 transition hover:text-white"
          >
            {entry.category.name}
          </Link>

          <h1
            className="mb-4 text-4xl text-white md:text-5xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {entry.title}
          </h1>

          <div className="mb-6 flex flex-wrap gap-3 text-sm text-neutral-400">
            <span className="rounded-full border border-white/10 px-3 py-1">
              {entry.kind}
            </span>

            {entry.creator && (
              <span className="rounded-full border border-white/10 px-3 py-1">
                {entry.creator}
              </span>
            )}

            {entry.year && (
              <span className="rounded-full border border-white/10 px-3 py-1">
                {entry.year}
              </span>
            )}
          </div>

          {entry.description && (
            <p className="mb-8 text-base leading-relaxed text-neutral-300">
              {entry.description}
            </p>
          )}

          {entry.personalNote && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="mb-2 text-xs uppercase tracking-widest text-neutral-500">
                Personal Note
              </p>
              <p className="leading-relaxed text-neutral-300">
                {entry.personalNote}
              </p>
            </div>
          )}

          <div className="mb-10 flex flex-wrap gap-2">
            {entry.tags.map((t) => (
              <Link
                key={t.tag.id}
                href={`/tags/${t.tag.slug}`}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-neutral-400 transition hover:border-white/20 hover:text-white"
              >
                {t.tag.name}
              </Link>
            ))}
          </div>

          <div className="mb-10 flex flex-wrap gap-3">
  {mainVideo && entry.kind === "movie" && (
    <Link
      href={`/library/${entry.slug}/watch`}
      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:bg-white/[0.08]"
    >
      Watch
    </Link>
  )}

  {mainPdf && entry.kind === "book" && (
    <Link
      href={`/library/${entry.slug}/read`}
      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:bg-white/[0.08]"
    >
      Read PDF
    </Link>
  )}

  {admin && (
    <>
      <Link
        href={`/library/${entry.slug}/media`}
        className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:bg-white/[0.08]"
      >
        Manage Media
      </Link>

      <Link
        href={`/library/${entry.slug}/edit`}
        className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:bg-white/[0.08]"
      >
        Edit
      </Link>

      <DeleteEntryButton entryId={entry.id} slug={entry.slug} />
    </>
  )}
</div>

          {isSeriesLike && entry.seasons.length > 0 && (
            <div className="space-y-6">
              {entry.seasons.map((season) => (
                <div
                  key={season.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <h2
                    className="mb-4 text-2xl text-white"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {season.title || `Season ${season.number}`}
                  </h2>

                  {season.episodes.length === 0 ? (
                    <p className="text-sm text-neutral-500">No episodes yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {season.episodes.map((episode) => (
                        <Link
                          key={episode.id}
                          href={`/library/${entry.slug}/episodes/${episode.id}`}
                          className="rounded-full border border-white/10 px-3 py-1 text-sm text-neutral-300 transition hover:border-white/20 hover:text-white"
                        >
                          Ep {episode.number}: {episode.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}