import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ReadPage({
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

  const mainPdf = entry.mediaAssets.find(
    (asset: any) => asset.type === "pdf" && asset.url
  );
  
  if (!mainPdf?.url) return notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-neutral-600">
            Read
          </p>
          <h1
            className="text-3xl text-white md:text-4xl"
          >
            {entry.title}
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
        <a
  href={mainPdf.url}
  target="_blank"
  rel="noreferrer"
>
            Open in New Tab
          </a>

          <Link
            href={`/library/${entry.slug}`}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:text-white"
          >
            Back to Entry
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
        <iframe
          src={mainPdf.url}
          title={entry.title}
          className="h-[80vh] w-full"
        />
      </div>
    </div>
  );
}