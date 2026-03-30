import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CreateTagForm from "@/components/CreateTagForm";
import EditTagForm from "@/components/EditTagForm";
import DeleteTagButton from "@/components/DeleteTagButton";
import { requireAdmin } from "@/lib/require-admin";

export default async function ManageTagsPage() {
  await requireAdmin();
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          entries: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-neutral-600">
            Manage
          </p>
          <h1
            className="mb-4 text-4xl text-white md:text-5xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Tag Management
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-neutral-500">
            Create, edit, and delete tags from one place.
          </p>
        </div>

        <Link
          href="/tags"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:text-white"
        >
          Back to Tags
        </Link>
      </div>

      <div className="mb-12">
        <CreateTagForm />
      </div>

      <div className="space-y-4">
        {tags.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-neutral-400">
            No tags found yet.
          </div>
        ) : (
          tags.map((tag: any) => (
            <div
              key={tag.id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p
                    className="text-2xl text-white"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {tag.name}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    /tags/{tag.slug} · {tag._count.entries}{" "}
                    {tag._count.entries === 1 ? "entry" : "entries"}
                  </p>
                </div>

                <DeleteTagButton tagId={tag.id} slug={tag.slug} />
              </div>

              <EditTagForm
                tag={{
                  id: tag.id,
                  name: tag.name,
                  slug: tag.slug,
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}