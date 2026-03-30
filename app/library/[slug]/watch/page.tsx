import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function WatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const entry = await prisma.entry.findUnique({
    where: { slug },
    include: {
      mediaAssets: true,
    },
  });

  if (!entry) return notFound();

  const mainVideo = entry.mediaAssets.find((asset: any) => asset.type === "video");

  if (!mainVideo) return notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-neutral-600">
            Watch
          </p>
          <h1
            className="text-3xl text-white md:text-4xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {entry.title}
          </h1>
        </div>

        <Link
          href={`/library/${entry.slug}`}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:text-white"
        >
          Back to Entry
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
        <video
          controls
          className="aspect-video w-full"
          src={mainVideo.url}
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <p className="mb-2 text-xs uppercase tracking-widest text-neutral-600">
          Media Info
        </p>
        <p className="text-sm text-neutral-400">
          {mainVideo.title || "Main Video"}
        </p>
        {mainVideo.mimeType && (
          <p className="mt-1 text-sm text-neutral-500">{mainVideo.mimeType}</p>
        )}
      </div>
    </div>
  );
}