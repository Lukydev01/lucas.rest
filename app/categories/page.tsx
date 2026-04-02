import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

type SortOption = "count-desc" | "count-asc" | "az" | "za";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const admin = await isAdmin();

  const { sort } = await searchParams;
  const currentSort: SortOption =
    sort === "count-asc" ||
    sort === "az" ||
    sort === "za" ||
    sort === "count-desc"
      ? sort
      : "count-desc";

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          entries: true,
        },
      },
    },
  });

  const sortedCategories = [...categories].sort((a, b) => {
    if (currentSort === "count-asc") {
      return a._count.entries - b._count.entries;
    }

    if (currentSort === "count-desc") {
      return b._count.entries - a._count.entries;
    }

    if (currentSort === "az") {
      return a.name.localeCompare(b.name);
    }

    return b.name.localeCompare(a.name);
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12">
        <p className="mb-3 text-xs uppercase tracking-widest text-neutral-600">
          Browse by medium
        </p>

        <h1
          className="mb-4 text-4xl text-white md:text-5xl"
        >
          Categories
        </h1>

        <p className="max-w-xl text-sm leading-relaxed text-neutral-500">
          Explore the repository by medium and structure.
        </p>

        {admin && (
  <div className="mt-6">
    <Link
      href="/categories/manage"
      className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-neutral-300 transition hover:bg-white/[0.06] hover:text-white"
    >
      Manage Categories
    </Link>
  </div>
)}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/categories?sort=count-desc"
          className={`rounded-full border px-4 py-2 text-sm transition ${
            currentSort === "count-desc"
              ? "border-white/20 bg-white/10 text-white"
              : "border-white/10 text-neutral-400 hover:text-white"
          }`}
        >
          Most used
        </Link>

        <Link
          href="/categories?sort=count-asc"
          className={`rounded-full border px-4 py-2 text-sm transition ${
            currentSort === "count-asc"
              ? "border-white/20 bg-white/10 text-white"
              : "border-white/10 text-neutral-400 hover:text-white"
          }`}
        >
          Least used
        </Link>

        <Link
          href="/categories?sort=az"
          className={`rounded-full border px-4 py-2 text-sm transition ${
            currentSort === "az"
              ? "border-white/20 bg-white/10 text-white"
              : "border-white/10 text-neutral-400 hover:text-white"
          }`}
        >
          A-Z
        </Link>

        <Link
          href="/categories?sort=za"
          className={`rounded-full border px-4 py-2 text-sm transition ${
            currentSort === "za"
              ? "border-white/20 bg-white/10 text-white"
              : "border-white/10 text-neutral-400 hover:text-white"
          }`}
        >
          Z-A
        </Link>
      </div>

      {sortedCategories.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-neutral-400">
          No categories found yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {sortedCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 transition hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p
                    className="text-lg text-white"
                  >
                    {category.name}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {category._count.entries}{" "}
                    {category._count.entries === 1 ? "entry" : "entries"}
                  </p>
                </div>

                <span className="text-sm text-neutral-600">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}