import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CreateCategoryForm from "@/components/CreateCategoryForm";
import EditCategoryForm from "@/components/EditCategoryForm";
import DeleteCategoryButton from "@/components/DeleteCategoryButton";
import { requireAdmin } from "@/lib/require-admin";

export default async function ManageCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
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
            Category Management
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-neutral-500">
            Create, edit, and manage categories from one place.
          </p>
        </div>

        <Link
          href="/categories"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:text-white"
        >
          Back to Categories
        </Link>
      </div>

      <div className="mb-12">
        <CreateCategoryForm />
      </div>

      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-neutral-400">
            No categories found yet.
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p
                    className="text-2xl text-white"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {category.name}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    /categories/{category.slug} · {category._count.entries}{" "}
                    {category._count.entries === 1 ? "entry" : "entries"}
                  </p>
                </div>

                <DeleteCategoryButton
                  categoryId={category.id}
                  slug={category.slug}
                  entryCount={category._count.entries}
                />
              </div>

              <EditCategoryForm
                category={{
                  id: category.id,
                  name: category.name,
                  slug: category.slug,
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}