import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mergemind.vercel.app";

export const metadata: Metadata = {
  title: {
    template: "%s | MergeMind",
    default: "MergeMind - Real-Time AI Code Reviewer",
  },
  description: "Modern, production-grade AI code reviewer platform to streamline your development workflow with instant feedback and insights.",
  keywords: ["AI Code Review", "GitHub Integration", "Developer Tools", "Code Quality", "MergeMind"],
  authors: [{ name: "MergeMind Team" }],
  openGraph: {
    title: "MergeMind - Real-Time AI Code Reviewer",
    description: "Modern, production-grade AI code reviewer platform to streamline your development workflow with instant feedback and insights.",
    url: siteUrl,
    siteName: "MergeMind",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MergeMind - Real-Time AI Code Reviewer",
    description: "Modern, production-grade AI code reviewer platform.",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
