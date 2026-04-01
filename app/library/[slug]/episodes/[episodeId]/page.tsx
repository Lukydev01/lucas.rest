import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UniversalVideoPlayer from "@/components/UniversalVideoPlayer";
import EmbedPlayer from "@/components/EmbedPlayer";

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string; episodeId: string }>;
}) {
  const { slug, episodeId } = await params;

  const entry = await prisma.entry.findUnique({
    where: { slug },
    include: {
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

  const season = entry.seasons.find((s: any) =>
    s.episodes.some((ep: any) => ep.id === episodeId)
  );

  if (!season) return notFound();

  const episode = season.episodes.find(
    (ep: any) => ep.id === episodeId
  );

  if (!episode) return notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-neutral-600">
            Episode
          </p>

          <h1
            className="text-3xl text-white md:text-4xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {entry.title}
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            {season.title || `Season ${season.number}`} · Episode{" "}
            {episode.number}: {episode.title}
          </p>
        </div>

        <Link
          href={`/library/${entry.slug}`}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:text-white"
        >
          Back to Entry
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
      {episode.videoUrl?.includes("vidmoly") ||
 episode.videoUrl?.includes("short.icu") ||
 episode.videoUrl?.includes("abyss") ? (
  <EmbedPlayer embedUrl={episode.videoUrl} />
) : (
          <UniversalVideoPlayer
            videoId={episode.youtubeId}
            src={episode.videoUrl}
          />
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2
          className="mb-3 text-2xl text-white"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {episode.title}
        </h2>

        {episode.description ? (
          <p className="leading-relaxed text-neutral-400">
            {episode.description}
          </p>
        ) : (
          <p className="text-neutral-500">
            No episode description yet.
          </p>
        )}
      </div>
    </div>
  );
}