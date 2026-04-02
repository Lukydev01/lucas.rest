import Link from "next/link";
import FloatingTextBackground from "@/components/FloatingTextBackground";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Media Library",
    icon: "◈",
    description:
      "A growing collection of anime, films, series, books, and more — each entry carefully considered and catalogued.",
  },
  {
    title: "Categories & Tags",
    icon: "◇",
    description:
      "Navigate the archive by medium, genre, or mood. Find exactly what you're looking for, or discover something unexpected.",
  },
  {
    title: "Personal Curation",
    icon: "◉",
    description:
      "Every entry here was chosen deliberately. No algorithms, no trending content — just things that earned their place.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black">
      <FloatingTextBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <section className="flex min-h-[88vh] flex-col items-center justify-center text-center">
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
            MyRepository
          </span>

          <h1
            className="mb-6 max-w-3xl text-5xl leading-[1.1] tracking-tight text-white md:text-7xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            A curated archive
            <br />
            <span className="text-neutral-500">
              of things worth keeping.
            </span>
          </h1>

          <p className="mb-10 max-w-xl text-base leading-relaxed text-neutral-400">
            Films, anime, series, books, and other media — organised with
            intention. This is a personal library, not a recommendation engine.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-white px-8 text-sm font-medium text-black hover:bg-neutral-200">
              <Link href="/library">Browse Library</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-white/10 bg-transparent px-8 text-sm text-neutral-300 hover:bg-white/5 hover:text-white"
            >
              <Link href="/categories">Explore Categories</Link>
            </Button>
          </div>

          <div className="mt-24 h-px w-24 bg-white/10" />
        </section>

        <section className="pb-32">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-widest text-neutral-600">
              What's inside
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((f) => (
              <Card
                key={f.title}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:bg-white/[0.04]"
              >
                <CardHeader className="pb-3">
                  <span className="mb-4 block text-2xl text-neutral-500 transition-colors group-hover:text-neutral-300">
                    {f.icon}
                  </span>

                  <CardTitle
                    className="text-base text-white"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {f.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}