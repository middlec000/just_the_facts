import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { getSession } from "../lib/session";
import { getUserById } from "../lib/store";
import { logOut } from "../lib/auth-actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Just the Facts",
  description: "Where statements are examined through arguments and evidence",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session ? await getUserById(session.userId) : null;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b border-neutral-200 bg-white">
          <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-neutral-900"
            >
              Just the Facts
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/about"
                  className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  About
                </Link>
                <span className="text-sm text-neutral-600">
                  {user.username}
                </span>
                <form action={logOut}>
                  <button
                    type="submit"
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    Log out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/about"
                  className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  Log in
                </Link>
              </div>
            )}
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
