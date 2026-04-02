import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthNav from "@/components/AuthNav";
import { isAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "lucas.rest — MyRepository",
  description:
    "A curated personal repository of films, anime, series, books, and other media.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-neutral-100 antialiased">
        <Navbar isAdmin={admin} authSlot={<AuthNav />} />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}