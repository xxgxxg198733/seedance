import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
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
  metadataBase: new URL("https://deepseekaiagent.com"),
  title: {
    default: "Seedance — AI Video & Image Generator | Create Pro Content",
    template: "%s | Seedance",
  },
  description:
    "Create stunning AI videos, images, avatars, and music with Seedance. Powered by advanced AI models including Seedance 2.0 and Seedream 5.0. No credit card required to start.",
  keywords: [
    "AI video generator",
    "AI image generator",
    "text to video",
    "AI avatar",
    "AI content creation",
    "video maker",
    "image creator",
    "AI creative suite",
    "Seedance",
  ],
  authors: [{ name: "Seedance" }],
  creator: "Seedance",
  publisher: "Seedance",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://deepseekaiagent.com",
    siteName: "Seedance",
    title: "Seedance — AI Video & Image Generator",
    description:
      "Create stunning AI videos, images, avatars, and music. All-in-one AI creative suite for content creators.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Seedance AI Creative Suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seedance — AI Video & Image Generator",
    description:
      "Create stunning AI videos, images, avatars, and music. All-in-one AI creative suite.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://deepseekaiagent.com",
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
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
