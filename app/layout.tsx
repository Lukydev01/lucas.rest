import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthNav from "@/components/AuthNav";
import { isAdmin } from "@/lib/admin";

const libre = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

const soria = localFont({
  src: "../fonts/Soria-Regular.ttf",
  variable: "--font-heading",
  display: "swap",
});

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
    <html
      lang="en"
      className={`dark ${libre.variable} ${soria.variable}`}
    >
      <body className="min-h-screen bg-black text-neutral-100 antialiased">
        <Navbar isAdmin={admin} authSlot={<AuthNav />} />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}