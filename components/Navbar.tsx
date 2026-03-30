"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Library", href: "/library" },
  { label: "Categories", href: "/categories" },
  { label: "Tags", href: "/tags" },
  { label: "New Entry", href: "/new" },
];

type Props = {
  isAdmin?: boolean;
  authSlot?: React.ReactNode;
};

export default function Navbar({ isAdmin = false, authSlot }: Props) {
  const pathname = usePathname();

  const visibleLinks = isAdmin
    ? navLinks
    : navLinks.filter((link) => link.href !== "/new");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-start justify-between px-6 py-4">
        {/* Brand */}
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-white transition-opacity hover:opacity-70"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          lucas<span className="text-neutral-500">.rest</span>
        </Link>

        {/* Nav links */}
        <ul className="flex items-center gap-1">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-md px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
  {authSlot}

  <Link
    href={isAdmin ? "/new" : "/library"}
    className="rounded-full bg-white px-5 py-2 text-xs font-medium tracking-wide text-black transition hover:bg-neutral-200"
  >
    {isAdmin ? "Create" : "Explore"}
  </Link>
</div>
      </nav>
    </header>
  );
}