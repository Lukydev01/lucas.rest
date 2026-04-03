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

  const currentIndex = season.episodes.findIndex(
    (ep: any) => ep.id === episodeId
  );

  const previousEpisode =
    currentIndex > 0 ? season.episodes[currentIndex - 1] : null;

  const nextEpisode =
    currentIndex < season.episodes.length - 1
      ? season.episodes[currentIndex + 1]
      : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-neutral-600">
            Episode
          </p>

          <h1
            className="text-3xl text-white md:text-4xl"
          >
            {entry.title}
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            {season.title || `Season ${season.number}`} · Episode{" "}
            {episode.number}: {episode.title}
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/library/${entry.slug}`}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:border-white/20 hover:text-white"
          >
            Back to Entry
          </Link>

          {previousEpisode && (
            <Link
              href={`/library/${entry.slug}/episodes/${previousEpisode.id}`}
              className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-neutral-300 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
            >
              ← Previous
            </Link>
          )}

          {nextEpisode && (
            <Link
              href={`/library/${entry.slug}/episodes/${nextEpisode.id}`}
              className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-neutral-300 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
            >
              Next →
            </Link>
          )}
        </div>
      </div>

      {/* Video player */}
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

      {/* Episode info */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2
          className="mb-3 text-2xl text-white"
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