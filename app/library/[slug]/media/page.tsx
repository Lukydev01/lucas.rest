import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CreateMediaAssetForm from "@/components/CreateMediaAssetForm";
import CreateSeasonForm from "@/components/CreateSeasonForm";
import CreateEpisodeForm from "@/components/CreateEpisodeForm";
import EditMediaAssetForm from "@/components/EditMediaAssetForm";
import DeleteMediaAssetButton from "@/components/DeleteMediaAssetButton";
import EditSeasonForm from "@/components/EditSeasonForm";
import DeleteSeasonButton from "@/components/DeleteSeasonButton";
import EditEpisodeForm from "@/components/EditEpisodeForm";
import DeleteEpisodeButton from "@/components/DeleteEpisodeButton";
import { requireAdmin } from "@/lib/require-admin";

export default async function ManageMediaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();


  const { slug } = await params;

  const entry = await prisma.entry.findUnique({
    where: { slug },
    include: {
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

  const isSeriesLike = entry.kind === "series" || entry.kind === "anime";
  const isMovieLike = entry.kind === "movie";
  const isBookLike = entry.kind === "book";

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-neutral-600">
            Manage Media
          </p>
          <h1
            className="mb-4 text-4xl text-white md:text-5xl"
          >
            {entry.title}
          </h1>
          <p className="text-sm text-neutral-500">
            Type: <span className="text-neutral-300">{entry.kind}</span>
          </p>
        </div>

        <Link
          href={`/library/${entry.slug}`}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:text-white"
        >
          Back to Entry
        </Link>
      </div>

      {(isMovieLike || isBookLike || entry.kind === "other") && (
        <div className="mb-10">
          <CreateMediaAssetForm entryId={entry.id} entrySlug={entry.slug} />
        </div>
      )}

      {entry.mediaAssets.length > 0 && (
        <div className="mb-10 space-y-6">
          <h2
            className="text-2xl text-white"
          >
            Existing Media Assets
          </h2>

          {entry.mediaAssets.map((asset: any) => (
            <div
              key={asset.id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-white">
                    {asset.title || "Untitled Asset"}{" "}
                    <span className="text-neutral-500">({asset.type})</span>
                  </p>
                  <p className="mt-1 text-sm text-neutral-500 break-all">
                    {asset.url}
                  </p>
                </div>

                <DeleteMediaAssetButton
                  mediaAssetId={asset.id}
                  entrySlug={entry.slug}
                />
              </div>

              <EditMediaAssetForm asset={asset} entrySlug={entry.slug} />
            </div>
          ))}
        </div>
      )}

      {isSeriesLike && (
        <div className="mb-10">
          <CreateSeasonForm entryId={entry.id} entrySlug={entry.slug} />
        </div>
      )}

      {isSeriesLike && (
        <div className="space-y-8">
          {entry.seasons.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-neutral-400">
              No seasons yet.
            </div>
          ) : (
            entry.seasons.map((season: any) => (
              <div
                key={season.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2
                      className="text-2xl text-white"
                    >
                      {season.title || `Season ${season.number}`}
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Season {season.number}
                    </p>
                  </div>

                  <DeleteSeasonButton
                    seasonId={season.id}
                    entrySlug={entry.slug}
                  />
                </div>

                <div className="mb-6">
                  <EditSeasonForm
                    season={season}
                    entryId={entry.id}
                    entrySlug={entry.slug}
                  />
                </div>

                {season.episodes.length > 0 && (
                  <div className="mb-6 space-y-6">
                    {season.episodes.map((episode: any) => (
                      <div
                        key={episode.id}
                        className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                      >
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-white">
                              Episode {episode.number}: {episode.title}
                            </p>
                            {episode.description && (
                              <p className="mt-1 text-sm text-neutral-500">
                                {episode.description}
                              </p>
                            )}
                          </div>

                          <DeleteEpisodeButton
                            episodeId={episode.id}
                            entrySlug={entry.slug}
                          />
                        </div>

                        <EditEpisodeForm
                          episode={episode}
                          seasonId={season.id}
                          entrySlug={entry.slug}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <CreateEpisodeForm
                  seasonId={season.id}
                  entrySlug={entry.slug}
                  seasonLabel={season.title || `Season ${season.number}`}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}