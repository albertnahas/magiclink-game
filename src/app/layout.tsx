import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MagicLink - AI Word Connection Game",
  description: "Connect two words using exactly 5 intermediate steps in this AI-powered word connection game. Challenge your creativity and logic!",
  keywords: "word game, AI game, word connection, puzzle, brain training, vocabulary",
  authors: [{ name: "MagicLink Team" }],
  creator: "MagicLink",
  openGraph: {
    title: "MagicLink - AI Word Connection Game",
    description: "Connect two words using exactly 5 intermediate steps in this AI-powered word connection game.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MagicLink - AI Word Connection Game",
    description: "Connect two words using exactly 5 intermediate steps in this AI-powered word connection game.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
